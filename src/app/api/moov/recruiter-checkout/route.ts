import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createMoovPaymentLink, SITE_URL } from "@/lib/moov";
import { RECRUITER_PRICES, type RecruiterPackType } from "@/lib/recruiter-plans";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/moov/recruiter-checkout
 *
 * Body: { pack: "single" | "pack5" | "pack15" | "monthly_pro", countryCode?: string, promoCode?: string }
 * Creates a Moov Money payment link for Recruiter credits / subscriptions.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let pack: RecruiterPackType = "pack5";
  let countryCode = "GA";
  let promoCode = "";

  try {
    const body = await req.json();
    if (body.pack && body.pack in RECRUITER_PRICES) {
      pack = body.pack as RecruiterPackType;
    }
    if (body.countryCode) {
      countryCode = String(body.countryCode).toUpperCase();
    }
    if (body.promoCode) {
      promoCode = String(body.promoCode).trim().toUpperCase();
    }
  } catch {
    // default
  }

  const packConfig = RECRUITER_PRICES[pack];
  let finalAmount = packConfig.amount;
  let discountApplied = 0;
  let discountPercent = 0;

  if (promoCode) {
    const { data: promo } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", promoCode)
      .eq("is_active", true)
      .maybeSingle();

    discountPercent = promo?.discount_percent || 10;
    discountApplied = Math.round(finalAmount * (discountPercent / 100));
    finalAmount = finalAmount - discountApplied;
  }

  const intentNonce = crypto.randomUUID().slice(0, 8);
  const externalRef = `b2b:${user.id}:${pack}:${intentNonce}`;
  const targetType = `b2b_${pack}` as PaymentTargetType;

  try {
    // Pre-register B2B payment intent in Supabase
    await PaymentLedgerService.createPaymentIntent(supabase, {
      user_id: user.id,
      external_reference: externalRef,
      provider: "moov",
      target_type: targetType,
      amount_xaf: finalAmount,
      promo_code: promoCode || undefined,
      discount_percent: discountPercent,
      status: "pending",
      metadata: {
        pack,
        countryCode,
        credits: packConfig.credits,
        user_email: user.email,
      },
    });

    const result = await createMoovPaymentLink({
      amount: finalAmount,
      userId: externalRef,
      userEmail: user.email ?? "",
      countryCode,
      redirectUrl: `${SITE_URL}/recruiter/search?payment=success&gateway=moov&pack=${pack}${promoCode ? `&ref=${promoCode}` : ""}`,
      description: `AuthenticV Recruteur – ${packConfig.label}${discountApplied > 0 ? ` (-${discountApplied} F Réduction ${promoCode})` : ""}`,
    });

    return NextResponse.json({
      url: result.payment_url,
      transaction_id: result.transaction_id,
      finalAmount,
      discountApplied,
      externalReference: externalRef,
    });
  } catch (err) {
    console.error("[Moov Recruiter Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement recruteur Moov Money" },
      { status: 500 }
    );
  }
}

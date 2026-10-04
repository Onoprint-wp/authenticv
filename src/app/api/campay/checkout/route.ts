import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createPaymentLink, SITE_URL } from "@/lib/campay";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/campay/checkout
 *
 * Body: { tier?: "single" | "monthly" | "annual", promoCode?: string }
 * Creates a CamPay payment link for the chosen AuthenticV tier with deterministic intent registration.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tier: "single" | "monthly" | "annual" = "monthly";
  let promoCode = "";
  try {
    const body = await req.json();
    if (body.tier === "single" || body.tier === "annual" || body.tier === "monthly") {
      tier = body.tier;
    }
    if (body.promoCode) {
      promoCode = String(body.promoCode).trim().toUpperCase();
    }
  } catch {
    // default to monthly if no json body
  }

  // Check if already active Pro (only block if trying to buy monthly/annual again)
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (sub?.status === "active" && tier !== "single") {
    return NextResponse.json({ error: "Déjà abonné Pro illimité" }, { status: 400 });
  }

  let amount = PRICE_MONTHLY_XAF;
  let description = "AuthenticV Pro – Abonnement mensuel (5 000 FCFA)";

  if (tier === "single") {
    amount = PRICE_SINGLE_XAF;
    description = "AuthenticV – Déblocage 1 Candidature (1 000 FCFA)";
  } else if (tier === "annual") {
    amount = PRICE_ANNUAL_XAF;
    description = "AuthenticV Pro – Pass Annuel Carrière (18 000 FCFA)";
  }

  let discountPercent = 0;

  // Apply promo code discount if provided
  if (promoCode) {
    const PROMOS: Record<string, number> = {
      CAMPUS20: 20,
      STUDENT50: 50,
      UY1: 30,
      UDLA: 30,
      UBUEA: 30,
      UDSH: 30,
      AUTHVIP: 25,
      LAUNCH2026: 20,
    };
    const discount = PROMOS[promoCode];
    if (discount) {
      discountPercent = discount;
      amount = Math.max(100, Math.round(amount * (1 - discount / 100)));
      description = `${description} [Code: ${promoCode} -${discount}%]`;
    }
  }

  // Generate unique intent external reference: b2c:{userId}:{tier}:{randomId}
  const intentNonce = crypto.randomUUID().slice(0, 8);
  const externalRef = `b2c:${user.id}:${tier}:${intentNonce}`;
  const targetType = `b2c_${tier}` as PaymentTargetType;

  try {
    // Enregistrement préalable de l'intention pour réconciliation déterministe
    await PaymentLedgerService.createPaymentIntent(supabase, {
      user_id: user.id,
      external_reference: externalRef,
      provider: "campay",
      target_type: targetType,
      amount_xaf: amount,
      promo_code: promoCode || undefined,
      discount_percent: discountPercent,
      status: "pending",
      metadata: {
        tier,
        user_email: user.email,
        description,
      },
    });

    const result = await createPaymentLink({
      amount,
      userId: user.id,
      externalReference: externalRef,
      userEmail: user.email ?? "",
      redirectUrl: `${SITE_URL}/builder?upgraded=true&tier=${tier}${promoCode ? `&promo=${promoCode}` : ""}`,
      description,
    });

    return NextResponse.json({ url: result.link, externalReference: externalRef });
  } catch (err) {
    console.error("[CamPay Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 },
    );
  }
}

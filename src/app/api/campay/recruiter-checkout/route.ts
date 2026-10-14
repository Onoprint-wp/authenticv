import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { collectPayment, createPaymentLink, SITE_URL } from "@/lib/campay";
import { RECRUITER_PRICES, type RecruiterPackType } from "@/lib/recruiter-plans";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";
import { provisionGuestSession } from "@/lib/guest-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeCameroonPhone(rawPhone?: string): string {
  if (!rawPhone) return "";
  const cleaned = rawPhone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("237") && cleaned.length === 12) return cleaned;
  if (cleaned.length === 9 && (cleaned.startsWith("6") || cleaned.startsWith("2"))) return `237${cleaned}`;
  return cleaned;
}

function isValidCollectPhone(phone: string): boolean {
  return /^2376\d{8}$/.test(phone);
}

/**
 * POST /api/campay/recruiter-checkout
 * Body: { pack: "single" | "pack5" | "pack15" | "monthly_pro", companyName?: string, promoCode?: string, phoneNumber?: string, email?: string, mode?: "collect" | "link" }
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({}));
    const pack = (body.pack ?? "pack5") as RecruiterPackType;
    const promoCode = String(body.promoCode || "").trim().toUpperCase();
    const rawPhone = String(body.phoneNumber || body.phone || "").trim();
    const rawEmail = String(body.email || "").trim().toLowerCase();
    const mode: "link" | "collect" = body.mode === "collect" ? "collect" : "link";

    const packConfig = RECRUITER_PRICES[pack];
    if (!packConfig) {
      return NextResponse.json({ error: "Pack recruteur invalide" }, { status: 400 });
    }

    const cleanPhone = normalizeCameroonPhone(rawPhone);
    if (mode === "collect" && !isValidCollectPhone(cleanPhone)) {
      return NextResponse.json(
        { error: "Numéro Mobile Money invalide. Format attendu : 6XX XX XX XX (MTN ou Orange).", code: "INVALID_PHONE" },
        { status: 400 },
      );
    }

    let userId: string;
    let userEmail: string;

    if (user) {
      userId = user.id;
      userEmail = user.email ?? (cleanPhone ? `recruteur_${cleanPhone}@authenticv.app` : "recruteur@authenticv.app");
    } else {
      const guest = await provisionGuestSession({
        supabase,
        rawEmail,
        cleanPhone,
        createdVia: "guest_fast_track_recruiter",
        extraMetadata: {
          role: "recruiter",
          company_name: body.companyName || undefined,
        },
      });
      if (!guest.ok) {
        return NextResponse.json({ error: guest.error, code: guest.code }, { status: guest.status });
      }
      userId = guest.userId;
      userEmail = guest.userEmail;
    }

    const admin = createAdminClient();

    let finalAmount = packConfig.amount;
    let discountApplied = 0;
    let discountPercent = 0;

    // Validate promo code if provided
    if (promoCode) {
      const { data: promo } = await admin
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode)
        .eq("is_active", true)
        .maybeSingle();

      discountPercent = promo?.discount_percent || 10; // Default 10% for commercial affiliate codes
      discountApplied = Math.round(finalAmount * (discountPercent / 100));
      finalAmount = finalAmount - discountApplied;
    }

    // Ensure company record exists in companies table
    const companyName = body.companyName || user?.user_metadata?.company_name || userEmail.split("@")[0] || "Entreprise";

    await admin.from("companies").upsert(
      {
        user_id: userId,
        company_name: companyName,
        email: userEmail,
      },
      { onConflict: "user_id" },
    );

    // External reference formatted for deterministic webhook resolution:
    // "b2b:{userId}:{pack}:{intentNonce}"
    const intentNonce = crypto.randomUUID().slice(0, 8);
    const externalRef = `b2b:${userId}:${pack}:${intentNonce}`;
    const targetType = `b2b_${pack}` as PaymentTargetType;
    const description = `AuthenticV Recruteur – ${packConfig.label}${discountApplied > 0 ? ` (-${discountApplied} F Réduction ${promoCode})` : ""}`;

    // Pre-register B2B payment intent in Supabase using admin client
    await PaymentLedgerService.createPaymentIntent(admin, {
      user_id: userId,
      external_reference: externalRef,
      provider: "campay",
      target_type: targetType,
      amount_xaf: finalAmount,
      promo_code: promoCode || undefined,
      discount_percent: discountPercent,
      status: "pending",
      metadata: {
        pack,
        company_name: companyName,
        credits: packConfig.credits,
        user_email: userEmail,
        phone: cleanPhone || undefined,
        is_guest: !user,
      },
    });

    const redirectUrl = `${SITE_URL}/recruiter/search?payment=success&pack=${pack}&externalRef=${encodeURIComponent(externalRef)}${promoCode ? `&ref=${promoCode}` : ""}`;

    if (mode === "collect" && isValidCollectPhone(cleanPhone)) {
      try {
        const collect = await collectPayment({
          amount: finalAmount,
          phoneNumber: cleanPhone,
          userId,
          externalReference: externalRef,
          description,
        });

        const { data: intentRow } = await admin
          .from("payment_intents")
          .select("metadata")
          .eq("external_reference", externalRef)
          .maybeSingle();
        await admin
          .from("payment_intents")
          .update({
            metadata: {
              ...((intentRow?.metadata as Record<string, unknown>) ?? {}),
              campay_reference: collect.reference,
              mode: "collect",
            },
            updated_at: new Date().toISOString(),
          })
          .eq("external_reference", externalRef);

        return NextResponse.json({
          mode: "collect",
          externalReference: externalRef,
          reference: collect.reference,
          ussdCode: collect.ussd_code,
          operator: collect.operator,
          finalAmount,
          discountApplied,
          redirectUrl,
        });
      } catch (collectErr) {
        console.warn("[Recruiter CamPay Checkout] Collect failed, falling back to payment link:", collectErr);
      }
    }

    const result = await createPaymentLink({
      amount: finalAmount,
      userId,
      externalReference: externalRef,
      userEmail,
      redirectUrl,
      failureRedirectUrl: `${SITE_URL}/recruiter/search?payment=failed`,
      description,
    });

    return NextResponse.json({
      url: result.link,
      finalAmount,
      discountApplied,
      externalReference: externalRef,
      redirectUrl,
    });
  } catch (err) {
    console.error("[Recruiter CamPay Checkout Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement recruteur" },
      { status: 500 }
    );
  }
}

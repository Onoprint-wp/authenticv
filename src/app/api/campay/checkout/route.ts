import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { collectPayment, createPaymentLink, SITE_URL } from "@/lib/campay";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";
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

/** Cameroon mobile money numbers (MTN / Orange): 237 6XX XX XX XX */
function isValidCollectPhone(phone: string): boolean {
  return /^2376\d{8}$/.test(phone);
}

/**
 * POST /api/campay/checkout
 *
 * Body: { tier?: "single" | "monthly" | "annual", promoCode?: string, phoneNumber?: string, email?: string, cvData?: object }
 * Creates a CamPay payment link for the chosen AuthenticV tier with deterministic intent registration.
 * Supports zero-friction guest checkouts: account created, session opened and guest CV saved before redirect.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: "single" | "monthly" | "annual" = "single";
  let promoCode = "";
  let rawPhone = "";
  let rawEmail = "";
  let cvContent: unknown = undefined;
  let mode: "link" | "collect" = "link";

  try {
    const body = await req.json();
    if (body.tier === "single" || body.tier === "annual" || body.tier === "monthly") {
      tier = body.tier;
    }
    if (body.mode === "collect") {
      mode = "collect";
    }
    if (body.promoCode) {
      promoCode = String(body.promoCode).trim().toUpperCase();
    }
    if (body.phoneNumber || body.phone) {
      rawPhone = String(body.phoneNumber || body.phone).trim();
    }
    if (body.email) {
      rawEmail = String(body.email).trim().toLowerCase();
    }
    cvContent = body.cvData;
  } catch {
    // default to single if no json body
  }

  // Check if already active Pro (only block if trying to buy monthly/annual again)
  if (user) {
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (sub?.status === "active" && tier !== "single") {
      return NextResponse.json({ error: "Déjà abonné Pro illimité" }, { status: 400 });
    }
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
    userEmail = user.email ?? (cleanPhone ? `candidat_${cleanPhone}@authenticv.app` : "client@authenticv.app");
  } else {
    // Mode Fast-Track Invité (Zéro-Login) : compte créé à la volée + session ouverte sur ce navigateur
    // + CV invité sauvegardé, pour que le crédit et l'export PDF soient accessibles au retour de CamPay.
    const guest = await provisionGuestSession({
      supabase,
      rawEmail,
      cleanPhone,
      createdVia: "guest_fast_track",
      cvContent,
    });
    if (!guest.ok) {
      return NextResponse.json({ error: guest.error, code: guest.code }, { status: guest.status });
    }
    userId = guest.userId;
    userEmail = guest.userEmail;
  }

  // Generate unique intent external reference: b2c:{userId}:{tier}:{randomId}
  const intentNonce = crypto.randomUUID().slice(0, 8);
  const externalRef = `b2c:${userId}:${tier}:${intentNonce}`;
  const targetType = `b2c_${tier}` as PaymentTargetType;

  try {
    const admin = createAdminClient();
    // Enregistrement préalable de l'intention pour réconciliation déterministe via admin
    await PaymentLedgerService.createPaymentIntent(admin, {
      user_id: userId,
      external_reference: externalRef,
      provider: "campay",
      target_type: targetType,
      amount_xaf: amount,
      promo_code: promoCode || undefined,
      discount_percent: discountPercent,
      status: "pending",
      metadata: {
        tier,
        user_email: userEmail,
        phone: cleanPhone || undefined,
        description,
        is_guest: !user,
      },
    });

    const redirectUrl = `${SITE_URL}/builder?upgraded=true&tier=${tier}&ref=${encodeURIComponent(externalRef)}${promoCode ? `&promo=${promoCode}` : ""}`;

    // ── Mode "collect": USSD push straight to the customer's phone, they never leave the site ──
    if (mode === "collect" && isValidCollectPhone(cleanPhone)) {
      try {
        const collect = await collectPayment({
          amount,
          phoneNumber: cleanPhone,
          userId,
          externalReference: externalRef,
          description,
        });

        // Keep the CamPay reference on the intent so the status endpoint can reconcile it
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
          redirectUrl,
        });
      } catch (collectErr) {
        // Fall back to the hosted payment page below
        console.warn("[CamPay Checkout] Collect failed, falling back to payment link:", collectErr);
      }
    }

    const result = await createPaymentLink({
      amount,
      userId,
      externalReference: externalRef,
      userEmail,
      redirectUrl,
      description,
    });

    return NextResponse.json({ url: result.link, externalReference: externalRef, redirectUrl });
  } catch (err) {
    console.error("[CamPay Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 },
    );
  }
}

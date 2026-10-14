import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createMoovPaymentLink, MOOV_API_KEY, MOOV_SITE_ID, SITE_URL } from "@/lib/moov";
import { createPaymentLink } from "@/lib/campay";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";
import { provisionGuestSession } from "@/lib/guest-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/moov/checkout
 *
 * Body: { tier?: "single" | "monthly" | "annual", countryCode?: string, promoCode?: string, phoneNumber?: string, email?: string, cvData?: object }
 * Creates a Moov Money payment link for Gabon (GA), Tchad (TD), CI or CEMAC region with deterministic intent registration.
 * Falls back to CamPay hosted checkout link when Moov/CinetPay keys are not configured.
 * Supports zero-friction guest checkouts: account created, session opened and guest CV saved before redirect.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: "single" | "monthly" | "annual" = "single";
  let countryCode = "GA";
  let promoCode = "";
  let rawPhone = "";
  let rawEmail = "";
  let cvContent: unknown = undefined;

  try {
    const body = await req.json();
    if (body.tier === "single" || body.tier === "annual" || body.tier === "monthly") {
      tier = body.tier;
    }
    if (body.countryCode) {
      countryCode = String(body.countryCode).toUpperCase();
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
    // default options
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
  let description = `AuthenticV Pro – Abonnement mensuel (${countryCode})`;

  if (tier === "single") {
    amount = PRICE_SINGLE_XAF;
    description = `AuthenticV – Déblocage 1 Candidature (${countryCode})`;
  } else if (tier === "annual") {
    amount = PRICE_ANNUAL_XAF;
    description = `AuthenticV Pro – Pass Annuel (${countryCode})`;
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
      GABON2026: 25,
      TCHAD2026: 25,
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

  const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  let userId: string;
  let userEmail: string;

  if (user) {
    userId = user.id;
    userEmail = user.email ?? (cleanPhone ? `candidat_${cleanPhone}@authenticv.app` : "client@authenticv.app");
  } else {
    // Mode Fast-Track Invité (Zéro-Login) : compte + session sur ce navigateur + CV invité sauvegardé
    const guest = await provisionGuestSession({
      supabase,
      rawEmail,
      cleanPhone,
      createdVia: "guest_fast_track_moov",
      extraMetadata: { country: countryCode },
      cvContent,
    });
    if (!guest.ok) {
      return NextResponse.json({ error: guest.error, code: guest.code }, { status: guest.status });
    }
    userId = guest.userId;
    userEmail = guest.userEmail;
  }

  const intentNonce = crypto.randomUUID().slice(0, 8);
  const externalRef = `b2c:${userId}:${tier}:${intentNonce}`;
  const targetType = `b2c_${tier}` as PaymentTargetType;
  const hasMoovKeys = Boolean(MOOV_API_KEY && MOOV_SITE_ID);
  const provider = hasMoovKeys ? "moov" : "campay";

  try {
    const admin = createAdminClient();
    // Pre-register payment intent via admin client
    await PaymentLedgerService.createPaymentIntent(admin, {
      user_id: userId,
      external_reference: externalRef,
      provider,
      target_type: targetType,
      amount_xaf: amount,
      promo_code: promoCode || undefined,
      discount_percent: discountPercent,
      status: "pending",
      metadata: {
        tier,
        countryCode,
        user_email: userEmail,
        phone: cleanPhone || undefined,
        description,
      },
    });

    const redirectUrl = `${SITE_URL}/builder?upgraded=true&gateway=${provider}&tier=${tier}&ref=${encodeURIComponent(externalRef)}${promoCode ? `&promo=${promoCode}` : ""}`;

    if (!hasMoovKeys) {
      try {
        const campayLink = await createPaymentLink({
          amount,
          userId,
          externalReference: externalRef,
          userEmail,
          redirectUrl,
          description,
        });
        return NextResponse.json({
          url: campayLink.link,
          externalReference: externalRef,
          redirectUrl,
        });
      } catch (campayErr) {
        console.warn("[Moov Checkout] CamPay fallback failed, using Moov sandbox:", campayErr);
      }
    }

    const result = await createMoovPaymentLink({
      amount,
      userId: externalRef,
      userEmail,
      countryCode,
      redirectUrl,
      description,
    });

    return NextResponse.json({
      url: result.payment_url,
      transaction_id: result.transaction_id,
      externalReference: externalRef,
    });
  } catch (err) {
    console.error("[Moov Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement Moov Money" },
      { status: 500 }
    );
  }
}

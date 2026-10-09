import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createPaymentLink, SITE_URL } from "@/lib/campay";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeCameroonPhone(rawPhone?: string): string {
  if (!rawPhone) return "";
  const cleaned = rawPhone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("237") && cleaned.length === 12) return cleaned;
  if (cleaned.length === 9 && (cleaned.startsWith("6") || cleaned.startsWith("2"))) return `237${cleaned}`;
  return cleaned;
}

/**
 * POST /api/campay/checkout
 *
 * Body: { tier?: "single" | "monthly" | "annual", promoCode?: string, phoneNumber?: string, email?: string }
 * Creates a CamPay payment link for the chosen AuthenticV tier with deterministic intent registration.
 * Supports zero-friction guest checkouts with automatic JIT account provisioning.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tier: "single" | "monthly" | "annual" = "single";
  let promoCode = "";
  let rawPhone = "";
  let rawEmail = "";

  try {
    const body = await req.json();
    if (body.tier === "single" || body.tier === "annual" || body.tier === "monthly") {
      tier = body.tier;
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
  let userId: string;
  let userEmail: string;

  if (user) {
    userId = user.id;
    userEmail = user.email ?? (cleanPhone ? `candidat_${cleanPhone}@authenticv.app` : "client@authenticv.app");
  } else {
    // Mode Fast-Track Invité (Zéro-Login) : création de compte silencieuse / just-in-time
    userEmail = rawEmail && rawEmail.includes("@")
      ? rawEmail
      : (cleanPhone ? `candidat_${cleanPhone}@authenticv.app` : `guest_${crypto.randomUUID().slice(0, 8)}@authenticv.app`);

    try {
      const admin = createAdminClient();
      const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
        email: userEmail,
        password: crypto.randomUUID(),
        email_confirm: true,
        user_metadata: {
          created_via: "guest_fast_track",
          phone: cleanPhone || undefined,
        },
      });

      if (!createErr && newUser?.user) {
        userId = newUser.user.id;
      } else {
        const { data: usersList } = await admin.auth.admin.listUsers();
        const existing = usersList?.users?.find((u) => u.email === userEmail);
        userId = existing ? existing.id : crypto.randomUUID();
      }
    } catch {
      userId = crypto.randomUUID();
    }
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

    const result = await createPaymentLink({
      amount,
      userId,
      externalReference: externalRef,
      userEmail,
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

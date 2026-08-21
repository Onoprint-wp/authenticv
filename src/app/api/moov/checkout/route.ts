import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createMoovPaymentLink, SITE_URL } from "@/lib/moov";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/moov/checkout
 *
 * Body: { tier?: "single" | "monthly" | "annual", countryCode?: string, promoCode?: string }
 * Creates a Moov Money payment link for Gabon (GA), Tchad (TD), CI or CEMAC region.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tier: "single" | "monthly" | "annual" = "monthly";
  let countryCode = "GA";
  let promoCode = "";

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
  } catch {
    // default options
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
  let description = `AuthenticV Pro – Abonnement mensuel Moov Money (${countryCode})`;

  if (tier === "single") {
    amount = PRICE_SINGLE_XAF;
    description = `AuthenticV – Déblocage 1 Candidature Moov Money (${countryCode})`;
  } else if (tier === "annual") {
    amount = PRICE_ANNUAL_XAF;
    description = `AuthenticV Pro – Pass Annuel Moov Money (${countryCode})`;
  }

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
    };
    const discount = PROMOS[promoCode];
    if (discount) {
      amount = Math.max(100, Math.round(amount * (1 - discount / 100)));
      description = `${description} [Code: ${promoCode} -${discount}%]`;
    }
  }

  try {
    const result = await createMoovPaymentLink({
      amount,
      userId: user.id,
      userEmail: user.email ?? "",
      countryCode,
      redirectUrl: `${SITE_URL}/builder?upgraded=true&gateway=moov&tier=${tier}${promoCode ? `&promo=${promoCode}` : ""}`,
      description,
    });

    return NextResponse.json({ url: result.payment_url, transaction_id: result.transaction_id });
  } catch (err) {
    console.error("[Moov Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement Moov Money" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  createPaymentLink,
  PRO_PRICE_XAF,
  SITE_URL,
} from "@/lib/campay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/campay/checkout
 *
 * Creates a CamPay payment link for the AuthenticV Pro subscription.
 * The user is redirected to a CamPay-hosted checkout page where they
 * can pay via MTN MoMo or Orange Money.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if already subscribed
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (sub?.status === "active") {
    return NextResponse.json({ error: "Déjà abonné Pro" }, { status: 400 });
  }

  try {
    const result = await createPaymentLink({
      amount: PRO_PRICE_XAF,
      userId: user.id,
      userEmail: user.email ?? "",
      redirectUrl: `${SITE_URL}/builder?upgraded=true`,
      description: "AuthenticV Pro – Abonnement mensuel",
    });

    return NextResponse.json({ url: result.link });
  } catch (err) {
    console.error("[CamPay Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 },
    );
  }
}

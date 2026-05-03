import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getStripe, STRIPE_PRICE_ID, SITE_URL } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Récupérer ou créer le customer Stripe
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("stripe_customer_id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (sub?.status === "active") {
    return NextResponse.json({ error: "Déjà abonné Pro" }, { status: 400 });
  }

  let customerId = sub?.stripe_customer_id;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase.from("user_subscriptions").upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      status: "free",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  }

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${SITE_URL}/builder?upgraded=true`,
    cancel_url: `${SITE_URL}/pricing`,
    locale: "fr",
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  });

  return NextResponse.json({ url: session.url });
}

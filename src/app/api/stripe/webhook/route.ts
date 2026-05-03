import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const subscriptionId = session.subscription as string;
      if (!subscriptionId) break;

      const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata?.supabase_user_id
        ?? (session.metadata as Record<string, string> | null)?.supabase_user_id;

      if (!userId) break;

      await supabase.from("user_subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscriptionId,
        status: subscription.status === "active" ? "active" : "free",
        current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      await supabase.from("user_subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        status: subscription.status === "active" ? "active" : "free",
        current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      await supabase.from("user_subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

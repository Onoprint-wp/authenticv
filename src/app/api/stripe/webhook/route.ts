import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Safely extract current_period_end as ISO string from a Stripe subscription */
function safePeriodEnd(subscription: Stripe.Subscription): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (subscription as any).current_period_end;
    if (!raw) return null;
    const ts = typeof raw === "number" ? raw : Number(raw);
    if (isNaN(ts)) return null;
    return new Date(ts * 1000).toISOString();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const subscriptionId = session.subscription as string;
        if (!subscriptionId) break;

        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.supabase_user_id
          ?? (session.metadata as Record<string, string> | null)?.supabase_user_id;

        if (!userId) {
          console.error("[Stripe Webhook] No supabase_user_id found in metadata");
          break;
        }

        const periodEnd = safePeriodEnd(subscription);

        const { error } = await supabase.from("user_subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          status: subscription.status === "active" ? "active" : "free",
          ...(periodEnd && { current_period_end: periodEnd }),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        if (error) console.error("[Stripe Webhook] Supabase upsert error:", error);
        else console.log(`[Stripe Webhook] User ${userId} upgraded to ${subscription.status}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const periodEnd = safePeriodEnd(subscription);

        const { error } = await supabase.from("user_subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          status: subscription.status === "active" ? "active" : "free",
          ...(periodEnd && { current_period_end: periodEnd }),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        if (error) console.error("[Stripe Webhook] Supabase upsert error:", error);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) break;

        const { error } = await supabase.from("user_subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("user_id", userId);

        if (error) console.error("[Stripe Webhook] Supabase update error:", error);
        else console.log(`[Stripe Webhook] User ${userId} subscription canceled`);
        break;
      }
    }
  } catch (err) {
    console.error("[Stripe Webhook] Unhandled error:", err);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";
import { CAMPAY_WEBHOOK_SECRET } from "@/lib/campay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CamPay webhook payload (notification on payment status change).
 *
 * CamPay sends the following fields:
 * - status: "SUCCESSFUL" | "PENDING" | "FAILED"
 * - reference: the CamPay transaction reference
 * - external_reference: the value we passed (user_id)
 * - amount: the amount paid
 * - currency: "XAF"
 * - operator: "MTN" | "ORANGE"
 * - code: USSD code used
 * - operator_reference: the mobile money reference
 * - endpoint: the phone number
 * - signature: HMAC signature for verification
 * - reason: description string
 */
interface CamPayWebhookPayload {
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  reference: string;
  external_reference: string; // our user_id
  amount: string;
  currency: string;
  operator: string;
  code: string;
  operator_reference: string;
  endpoint: string;
  signature: string;
  reason: string;
  external_user?: string;
}

/**
 * Verify the CamPay webhook signature.
 *
 * CamPay signs webhooks using HMAC-SHA256 with the webhook secret.
 * The signature is included in the payload's `signature` field.
 */
function verifySignature(payload: CamPayWebhookPayload): boolean {
  if (!CAMPAY_WEBHOOK_SECRET) {
    console.warn("[CamPay Webhook] No CAMPAY_WEBHOOK_SECRET set — skipping verification");
    return true; // Allow in dev/sandbox without secret
  }

  // CamPay signature is computed over: reference + status
  const message = `${payload.reference}${payload.status}`;
  const hmac = crypto.createHmac("sha256", CAMPAY_WEBHOOK_SECRET);
  const computedSignature = hmac.update(message).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(payload.signature || ""),
      Buffer.from(computedSignature),
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let payload: CamPayWebhookPayload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  console.log(`[CamPay Webhook] Received: status=${payload.status} ref=${payload.reference} user=${payload.external_reference}`);

  // Verify signature (relaxed in sandbox mode)
  if (!verifySignature(payload)) {
    console.error("[CamPay Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const userId = payload.external_reference;

  if (!userId) {
    console.error("[CamPay Webhook] No external_reference (user_id) in payload");
    return NextResponse.json({ error: "Missing user reference" }, { status: 400 });
  }

  try {
    switch (payload.status) {
      case "SUCCESSFUL": {
        // Payment succeeded → activate Pro subscription
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        const { error } = await supabase.from("user_subscriptions").upsert(
          {
            user_id: userId,
            campay_reference: payload.reference,
            campay_payment_reference: payload.reference,
            campay_operator: payload.operator,
            campay_phone: payload.endpoint,
            campay_payment_status: payload.status,
            plan_name: "pro",
            status: "active",
            current_period_end: oneMonthFromNow.toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

        if (error) {
          console.error("[CamPay Webhook] Supabase upsert error:", error);
        } else {
          console.log(`[CamPay Webhook] User ${userId} → active (Pro) via ${payload.operator}`);
        }
        break;
      }

      case "FAILED": {
        // Payment failed → log it, optionally update status
        console.warn(`[CamPay Webhook] Payment FAILED for user ${userId}: ${payload.reason}`);

        // Only downgrade if they had a pending payment (not an existing active sub)
        const { data: existingSub } = await supabase
          .from("user_subscriptions")
          .select("status")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingSub?.status !== "active") {
          await supabase.from("user_subscriptions").upsert(
            {
              user_id: userId,
              status: "free",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
        }
        break;
      }

      case "PENDING": {
        // Payment is still pending — no action needed
        console.log(`[CamPay Webhook] Payment PENDING for user ${userId}`);
        break;
      }

      default:
        console.log(`[CamPay Webhook] Unhandled status: ${payload.status}`);
    }
  } catch (err) {
    console.error("[CamPay Webhook] Unhandled error:", err);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

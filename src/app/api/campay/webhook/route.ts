import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";
import { CAMPAY_WEBHOOK_SECRET, getTransactionStatus } from "@/lib/campay";
import { applyCampayTransaction } from "@/services/payment/campay-processor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CamPay webhook payload (notification on payment status change).
 */
interface CamPayWebhookPayload {
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  reference: string;
  external_reference: string; // our external_reference or user_id
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
 */
function verifySignature(payload: CamPayWebhookPayload): boolean {
  if (!CAMPAY_WEBHOOK_SECRET) {
    return false;
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

  console.log(`[CamPay Webhook] Received: status=${payload.status} ref=${payload.reference} ext_ref=${payload.external_reference}`);

  // Verify signature with API fallback if webhook secret is not yet set in production
  let isVerified = verifySignature(payload);
  if (!isVerified && payload.reference) {
    try {
      const liveTx = await getTransactionStatus(payload.reference);
      if (liveTx && liveTx.status === payload.status) {
        console.log(`[CamPay Webhook] Direct CamPay API verification succeeded for ref ${payload.reference}`);
        isVerified = true;
      }
    } catch (e) {
      console.warn(`[CamPay Webhook] Direct API verification check failed:`, e);
    }
  }

  if (!isVerified) {
    console.error("[CamPay Webhook] Invalid signature and API verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (!payload.external_reference) {
    console.error("[CamPay Webhook] No external_reference in payload");
    return NextResponse.json({ error: "Missing external_reference" }, { status: 400 });
  }

  try {
    const result = await applyCampayTransaction(supabase, payload);
    console.log(`[CamPay Webhook] ${payload.status} ref=${payload.reference} → ${result.outcome}`);
    return NextResponse.json({ received: true, outcome: result.outcome });
  } catch (err) {
    console.error("[CamPay Webhook] Unhandled error:", err);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { verifyMoovWebhookSignature, checkMoovTransactionStatus } from "@/lib/moov";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Moov Money / CinetPay Webhook handler.
 *
 * Payload format:
 * - cpay_transaction_id / transaction_id
 * - cpay_custom / customer_id (user_id or recruiter:id:pack)
 * - cpay_status / status ("ACCEPTED" | "REFUSED" | "PENDING")
 * - cpay_amount / amount
 * - cpay_currency / currency
 */
export async function POST(req: Request) {
  let rawBody = "";
  let payload: Record<string, unknown> = {};

  try {
    rawBody = await req.text();
    // Support form URL encoded or JSON webhooks
    if (rawBody.startsWith("{") || rawBody.startsWith("[")) {
      payload = JSON.parse(rawBody);
    } else {
      const params = new URLSearchParams(rawBody);
      payload = Object.fromEntries(params.entries());
    }
  } catch {
    return NextResponse.json({ error: "Invalid payload body" }, { status: 400 });
  }

  const transactionId = String(
    payload.cpay_transaction_id || payload.transaction_id || payload.tx_id || ""
  );
  const status = String(
    payload.cpay_status || payload.status || payload.code || ""
  ).toUpperCase();
  const customId = String(
    payload.cpay_custom || payload.customer_id || payload.metadata || ""
  );

  console.log(`[Moov Webhook] Received: tx=${transactionId} status=${status} custom=${customId}`);

  // Verify HMAC signature or token
  if (!verifyMoovWebhookSignature(req.headers, rawBody, String(payload.token || ""))) {
    console.error("[Moov Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Re-check transaction status directly with Moov/CinetPay API for double verification
  let isSuccessful = status === "ACCEPTED" || status === "SUCCEEDED" || status === "200" || status === "00";
  let paidAmount = Number(payload.cpay_amount || payload.amount || 0);
  let userId = customId;

  if (transactionId && (!isSuccessful || !userId)) {
    try {
      const verifiedTx = await checkMoovTransactionStatus(transactionId);
      if (verifiedTx.status === "ACCEPTED") {
        isSuccessful = true;
        paidAmount = verifiedTx.amount || paidAmount;
      }
    } catch (err) {
      console.warn("[Moov Webhook] Double-verification API call failed:", err);
    }
  }

  if (!userId && typeof payload.metadata === "string") {
    try {
      const parsedMeta = JSON.parse(payload.metadata);
      userId = parsedMeta.user_id || userId;
    } catch {
      // ignore
    }
  }

  if (!userId) {
    console.error("[Moov Webhook] Missing customer reference/user_id in webhook");
    return NextResponse.json({ error: "Missing user reference" }, { status: 400 });
  }

  try {
    if (isSuccessful) {
      // ── B2B Recruiter Purchases ──
      if (userId.startsWith("recruiter:")) {
        const parts = userId.split(":");
        const recruiterUserId = parts[1];
        const pack = parts[2] || "pack5";

        const { data: comp } = await supabase
          .from("companies")
          .select("credits_balance, plan")
          .eq("user_id", recruiterUserId)
          .maybeSingle();

        let additionalCredits = 5;
        let newPlan = comp?.plan ?? "pay_as_you_go";

        if (pack === "single" || paidAmount === 5000) {
          additionalCredits = 1;
        } else if (pack === "pack15" || paidAmount === 50000) {
          additionalCredits = 15;
        } else if (pack === "monthly_pro" || paidAmount === 75000) {
          additionalCredits = 999;
          newPlan = "monthly_pro";
        }

        const currentCredits = comp?.credits_balance ?? 0;
        const { error: compError } = await supabase.from("companies").upsert(
          {
            user_id: recruiterUserId,
            company_name: "Entreprise Recruteur (Moov Money)",
            email: "",
            credits_balance: currentCredits + additionalCredits,
            plan: newPlan,
          },
          { onConflict: "user_id" }
        );

        if (compError) {
          console.error("[Moov Webhook] B2B credits update error:", compError);
        } else {
          console.log(`[Moov Webhook] Recruiter ${recruiterUserId} credited with ${additionalCredits} credits via Moov`);
        }
      } else {
        // ── B2C Candidate Purchases ──
        if (paidAmount === 1000) {
          // Single credit (1 000 FCFA)
          const { data: currentSub } = await supabase
            .from("user_subscriptions")
            .select("single_credits")
            .eq("user_id", userId)
            .maybeSingle();

          const existingCredits = currentSub?.single_credits ?? 0;

          const { error } = await supabase.from("user_subscriptions").upsert(
            {
              user_id: userId,
              campay_reference: transactionId,
              campay_operator: "MOOV_MONEY",
              campay_payment_status: "SUCCESSFUL",
              single_credits: existingCredits + 1,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          if (error) {
            console.error("[Moov Webhook] Supabase single_credits error:", error);
          } else {
            console.log(`[Moov Webhook] User ${userId} +1 single credit via Moov Money`);
          }
        } else {
          // Pro subscription (5 000 FCFA monthly or 18 000 FCFA annual)
          const periodEnd = new Date();
          if (paidAmount === 18000) {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
          } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
          }

          const planName = paidAmount === 18000 ? "pro_annual" : "pro";

          const { error } = await supabase.from("user_subscriptions").upsert(
            {
              user_id: userId,
              campay_reference: transactionId,
              campay_operator: "MOOV_MONEY",
              campay_payment_status: "SUCCESSFUL",
              plan_name: planName,
              status: "active",
              current_period_end: periodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          if (error) {
            console.error("[Moov Webhook] Supabase subscription update error:", error);
          } else {
            console.log(`[Moov Webhook] User ${userId} → active (${planName}) via Moov Money`);
          }
        }
      }
    } else {
      console.warn(`[Moov Webhook] Payment unsuccessful for user ${userId}: status=${status}`);
    }
  } catch (err) {
    console.error("[Moov Webhook] Unhandled webhook error:", err);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }

  return NextResponse.json({ received: true, status: "OK" });
}

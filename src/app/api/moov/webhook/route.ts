import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { verifyMoovWebhookSignature, checkMoovTransactionStatus } from "@/lib/moov";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";
import { AdminAlertService } from "@/services/admin-alert.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Moov Money / CinetPay Webhook handler.
 *
 * Payload format:
 * - cpay_transaction_id / transaction_id
 * - cpay_custom / customer_id (user_id or b2c:... / b2b:...)
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
  const rawExtRef = String(
    payload.cpay_custom || payload.customer_id || payload.metadata || ""
  );

  console.log(`[Moov Webhook] Received: tx=${transactionId} status=${status} ext_ref=${rawExtRef}`);

  // Verify HMAC signature or token
  if (!verifyMoovWebhookSignature(req.headers, rawBody, String(payload.token || ""))) {
    console.error("[Moov Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Re-check transaction status directly with Moov/CinetPay API for double verification
  let isSuccessful = status === "ACCEPTED" || status === "SUCCEEDED" || status === "200" || status === "00";
  let paidAmount = Number(payload.cpay_amount || payload.amount || 0);
  let effectiveExtRef = rawExtRef;

  if (transactionId && (!isSuccessful || !effectiveExtRef)) {
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

  if (!effectiveExtRef && typeof payload.metadata === "string") {
    try {
      const parsedMeta = JSON.parse(payload.metadata);
      effectiveExtRef = parsedMeta.user_id || effectiveExtRef;
    } catch {
      // ignore
    }
  }

  if (!effectiveExtRef) {
    console.error("[Moov Webhook] Missing customer reference in webhook");
    return NextResponse.json({ error: "Missing customer reference" }, { status: 400 });
  }

  try {
    if (isSuccessful) {
      // ── Contrôle d'Idempotence stricte ──
      const isProcessed = await PaymentLedgerService.isTransactionProcessed(supabase, transactionId);
      if (isProcessed) {
        console.log(`[Moov Webhook] Transaction ${transactionId} already processed (idempotent skip)`);
        return NextResponse.json({ received: true, idempotent_skip: true });
      }

      // 1. Recherche de l'intention de paiement enregistrée
      const intent = await PaymentLedgerService.getPaymentIntent(supabase, effectiveExtRef);

      let resolvedUserId = intent?.user_id || "";
      let targetType: PaymentTargetType = intent?.target_type || "b2c_monthly";

      // 2. Fallback de décodage si l'intent n'a pas été trouvé directement
      if (!intent) {
        if (effectiveExtRef.startsWith("b2c:")) {
          const [, uid, tier] = effectiveExtRef.split(":");
          resolvedUserId = uid;
          targetType = `b2c_${tier}` as PaymentTargetType;
        } else if (effectiveExtRef.startsWith("b2b:") || effectiveExtRef.startsWith("recruiter:")) {
          const [, uid, pack] = effectiveExtRef.split(":");
          resolvedUserId = uid;
          targetType = `b2b_${pack}` as PaymentTargetType;
        } else {
          resolvedUserId = effectiveExtRef;
          if (paidAmount === 1000) {
            targetType = "b2c_single";
          } else if (paidAmount === 18000) {
            targetType = "b2c_annual";
          } else {
            targetType = "b2c_monthly";
          }
        }
      }

      const isB2B = targetType.startsWith("b2b_");

      // ── Exécution déterministe de la livraison selon targetType ──
      if (isB2B) {
        // B2B RECRUTEUR
        const { data: comp } = await supabase
          .from("companies")
          .select("credits_balance, plan")
          .eq("user_id", resolvedUserId)
          .maybeSingle();

        let additionalCredits = 5;
        let newPlan = comp?.plan ?? "pay_as_you_go";

        if (targetType === "b2b_single") {
          additionalCredits = 1;
        } else if (targetType === "b2b_pack5") {
          additionalCredits = 5;
        } else if (targetType === "b2b_pack15") {
          additionalCredits = 15;
        } else if (targetType === "b2b_monthly_pro") {
          additionalCredits = 999;
          newPlan = "monthly_pro";
        }

        const currentCredits = comp?.credits_balance ?? 0;
        await supabase.from("companies").upsert(
          {
            user_id: resolvedUserId,
            company_name: "Entreprise Recruteur (Moov Money)",
            email: "",
            credits_balance: currentCredits + additionalCredits,
            plan: newPlan,
          },
          { onConflict: "user_id" }
        );

        console.log(`[Moov Webhook] Recruiter ${resolvedUserId} credited with ${additionalCredits} credits via Moov`);
      } else if (targetType === "b2c_single") {
        // B2C CRÉDIT UNIQUE
        const { data: currentSub } = await supabase
          .from("user_subscriptions")
          .select("single_credits")
          .eq("user_id", resolvedUserId)
          .maybeSingle();

        const existingCredits = currentSub?.single_credits ?? 0;

        await supabase.from("user_subscriptions").upsert(
          {
            user_id: resolvedUserId,
            campay_reference: transactionId,
            campay_operator: "MOOV_MONEY",
            campay_payment_status: "SUCCESSFUL",
            single_credits: existingCredits + 1,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        console.log(`[Moov Webhook] User ${resolvedUserId} +1 single credit via Moov Money`);
      } else {
        // B2C ABONNEMENT PRO
        const isAnnual = targetType === "b2c_annual";
        const periodEnd = new Date();
        if (isAnnual) {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        const planName = isAnnual ? "pro_annual" : "pro";

        await supabase.from("user_subscriptions").upsert(
          {
            user_id: resolvedUserId,
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

        console.log(`[Moov Webhook] User ${resolvedUserId} → active (${planName}) via Moov Money`);
      }

      // 3. Mise à jour de l'intention de paiement
      await PaymentLedgerService.updatePaymentIntentStatus(supabase, effectiveExtRef, "successful");

      // 4. Enregistrement centralisé dans le grand livre des transactions
      await PaymentLedgerService.recordTransaction(supabase, {
        reference_id: transactionId,
        user_id: resolvedUserId,
        amount_xaf: paidAmount,
        currency: "XAF",
        country_code: "GA",
        operator: "MOOV",
        payment_type: targetType,
        status: "successful",
        metadata: {
          external_reference: effectiveExtRef,
          provider: "moov",
          promo_code: intent?.promo_code,
          discount_percent: intent?.discount_percent,
        },
      });

      // 5. Notification Admin SUCCESSFUL (fire-and-forget)
      AdminAlertService.notifyPayment({
        event: "SUCCESSFUL",
        provider: "moov",
        amount: paidAmount,
        operator: "MOOV_MONEY",
        userId: resolvedUserId,
        reference: transactionId,
        isB2B,
      });
    } else {
      console.warn(`[Moov Webhook] Payment unsuccessful for ext_ref ${effectiveExtRef}: status=${status}`);

      await PaymentLedgerService.updatePaymentIntentStatus(supabase, effectiveExtRef, "failed");

      const intent = await PaymentLedgerService.getPaymentIntent(supabase, effectiveExtRef);
      const resolvedUserId = intent?.user_id || effectiveExtRef;

      // Notification Admin FAILED (fire-and-forget)
      AdminAlertService.notifyPayment({
        event: "FAILED",
        provider: "moov",
        amount: paidAmount,
        operator: "MOOV_MONEY",
        userId: resolvedUserId,
        reference: transactionId,
        reason: `status=${status}`,
      });
    }
  } catch (err) {
    console.error("[Moov Webhook] Unhandled webhook error:", err);
    return NextResponse.json({ error: "Internal webhook error" }, { status: 500 });
  }

  return NextResponse.json({ received: true, status: "OK" });
}

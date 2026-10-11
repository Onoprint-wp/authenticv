import { type SupabaseClient } from "@supabase/supabase-js";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";
import { AdminAlertService } from "@/services/admin-alert.service";

/** A CamPay transaction, as received by the webhook or read from GET /transaction/{reference}/. */
export interface CampayTransaction {
  status: "SUCCESSFUL" | "PENDING" | "FAILED" | string;
  reference: string;
  external_reference: string;
  amount: string | number;
  currency?: string;
  operator?: string;
  endpoint?: string;
  external_user?: string;
  reason?: string;
}

export type ApplyResult =
  | { outcome: "credited"; userId: string; targetType: PaymentTargetType }
  | { outcome: "already_processed" }
  | { outcome: "failed_recorded" }
  | { outcome: "ignored" };

/**
 * Applies a VERIFIED CamPay transaction (webhook with valid signature / API check, or direct API read).
 * Shared by the webhook and by the status-polling reconciliation, so a payment is credited even if
 * the webhook is late or lost.
 *
 * Idempotency: the payment intent is atomically switched pending → successful; only the call that
 * performs that switch delivers the credit. Duplicate webhooks / concurrent polls are no-ops.
 */
export async function applyCampayTransaction(
  supabase: SupabaseClient,
  tx: CampayTransaction,
): Promise<ApplyResult> {
  const rawExtRef = tx.external_reference || "";
  if (!rawExtRef) return { outcome: "ignored" };

  if (tx.status === "FAILED") {
    // Never downgrade an intent that already succeeded.
    await supabase
      .from("payment_intents")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("external_reference", rawExtRef)
      .eq("status", "pending");

    const intent = await PaymentLedgerService.getPaymentIntent(supabase, rawExtRef);
    AdminAlertService.notifyPayment({
      event: "FAILED",
      provider: "campay",
      amount: Number(tx.amount || 0),
      operator: tx.operator ?? "",
      userId: intent?.user_id || rawExtRef,
      userPhone: tx.endpoint,
      reference: tx.reference,
      reason: tx.reason,
    });
    return { outcome: "failed_recorded" };
  }

  if (tx.status !== "SUCCESSFUL") return { outcome: "ignored" };

  const paidAmount = Number(tx.amount || 0);
  const intent = await PaymentLedgerService.getPaymentIntent(supabase, rawExtRef);

  let resolvedUserId = intent?.user_id || "";
  let targetType: PaymentTargetType = intent?.target_type || "b2c_monthly";

  if (intent) {
    // ── Atomic claim: only one caller can move the intent to "successful" ──
    const { data: claimed, error: claimError } = await supabase
      .from("payment_intents")
      .update({ status: "successful", updated_at: new Date().toISOString() })
      .eq("external_reference", rawExtRef)
      .neq("status", "successful")
      .select("id");
    if (claimError) throw claimError;
    if (!claimed || claimed.length === 0) return { outcome: "already_processed" };
  } else {
    // Legacy references without a registered intent
    if (await PaymentLedgerService.isTransactionProcessed(supabase, tx.reference)) {
      return { outcome: "already_processed" };
    }
    if (rawExtRef.startsWith("b2c:")) {
      const [, uid, tier] = rawExtRef.split(":");
      resolvedUserId = uid;
      targetType = `b2c_${tier}` as PaymentTargetType;
    } else if (rawExtRef.startsWith("b2b:") || rawExtRef.startsWith("recruiter:")) {
      const [, uid, pack] = rawExtRef.split(":");
      resolvedUserId = uid;
      targetType = `b2b_${pack}` as PaymentTargetType;
    } else {
      resolvedUserId = rawExtRef;
      targetType = paidAmount === 1000 ? "b2c_single" : paidAmount === 18000 ? "b2c_annual" : "b2c_monthly";
    }
  }

  const isB2B = targetType.startsWith("b2b_");

  try {
    await deliverCredit(supabase, tx, resolvedUserId, targetType);
  } catch (err) {
    // Release the claim so a later webhook retry / status poll can deliver the credit.
    if (intent) {
      await supabase
        .from("payment_intents")
        .update({ status: "pending", updated_at: new Date().toISOString() })
        .eq("external_reference", rawExtRef);
    }
    throw err;
  }

  await PaymentLedgerService.recordTransaction(supabase, {
    reference_id: tx.reference,
    user_id: resolvedUserId,
    amount_xaf: paidAmount,
    currency: tx.currency || "XAF",
    country_code: "CM",
    operator: (tx.operator?.toUpperCase() as "MTN" | "ORANGE") || "MTN",
    payment_type: targetType,
    status: "successful",
    phone_number: tx.endpoint || null,
    customer_email: null,
    customer_name: tx.external_user || null,
    metadata: {
      external_reference: rawExtRef,
      provider: "campay",
      promo_code: intent?.promo_code,
      discount_percent: intent?.discount_percent,
    },
  });

  AdminAlertService.notifyPayment({
    event: "SUCCESSFUL",
    provider: "campay",
    amount: paidAmount,
    operator: tx.operator ?? "",
    userId: resolvedUserId,
    userPhone: tx.endpoint,
    reference: tx.reference,
    isB2B,
  });

  return { outcome: "credited", userId: resolvedUserId, targetType };
}

/** Delivers the purchased product. Throws on any database error so the caller can release the claim. */
async function deliverCredit(
  supabase: SupabaseClient,
  tx: CampayTransaction,
  userId: string,
  targetType: PaymentTargetType,
): Promise<void> {
  if (!userId) throw new Error("Cannot deliver credit: unresolved user id");

  if (targetType.startsWith("b2b_")) {
    const { data: comp, error: readErr } = await supabase
      .from("companies")
      .select("credits_balance, plan")
      .eq("user_id", userId)
      .maybeSingle();
    if (readErr) throw readErr;

    let additionalCredits = 5;
    let newPlan = comp?.plan ?? "pay_as_you_go";
    if (targetType === "b2b_single") additionalCredits = 1;
    else if (targetType === "b2b_pack5") additionalCredits = 5;
    else if (targetType === "b2b_pack15") additionalCredits = 15;
    else if (targetType === "b2b_monthly_pro") {
      additionalCredits = 999;
      newPlan = "monthly_pro";
    }

    const { error } = await supabase.from("companies").upsert(
      {
        user_id: userId,
        company_name: tx.external_user || "Entreprise Recruteur",
        email: tx.endpoint || "",
        credits_balance: (comp?.credits_balance ?? 0) + additionalCredits,
        plan: newPlan,
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    console.log(`[CamPay] Recruiter ${userId} credited with ${additionalCredits} credits (Plan: ${newPlan})`);
    return;
  }

  const common = {
    user_id: userId,
    campay_reference: tx.reference,
    campay_payment_reference: tx.reference,
    campay_operator: tx.operator,
    campay_phone: tx.endpoint,
    campay_payment_status: "SUCCESSFUL",
    updated_at: new Date().toISOString(),
  };

  if (targetType === "b2c_single") {
    const { data: currentSub, error: readErr } = await supabase
      .from("user_subscriptions")
      .select("single_credits")
      .eq("user_id", userId)
      .maybeSingle();
    if (readErr) throw readErr;

    const { error } = await supabase
      .from("user_subscriptions")
      .upsert({ ...common, single_credits: (currentSub?.single_credits ?? 0) + 1 }, { onConflict: "user_id" });
    if (error) throw error;
    console.log(`[CamPay] User ${userId} +1 single credit via ${tx.operator}`);
    return;
  }

  const isAnnual = targetType === "b2c_annual";
  const periodEnd = new Date();
  if (isAnnual) periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  else periodEnd.setMonth(periodEnd.getMonth() + 1);
  const planName = isAnnual ? "pro_annual" : "pro";

  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      ...common,
      plan_name: planName,
      status: "active",
      current_period_end: periodEnd.toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
  console.log(`[CamPay] User ${userId} → active (${planName}) via ${tx.operator}`);
}

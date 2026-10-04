import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";
import { CAMPAY_WEBHOOK_SECRET } from "@/lib/campay";
import { PaymentLedgerService, type PaymentTargetType } from "@/services/payment/payment-ledger.service";
import { AdminAlertService } from "@/services/admin-alert.service";

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
    if (process.env.NODE_ENV === "production") {
      console.error("[CamPay Webhook] CRITICAL: CAMPAY_WEBHOOK_SECRET missing in production — rejecting");
      return false;
    }
    console.warn("[CamPay Webhook] No CAMPAY_WEBHOOK_SECRET set — skipping verification (dev only)");
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

  console.log(`[CamPay Webhook] Received: status=${payload.status} ref=${payload.reference} ext_ref=${payload.external_reference}`);

  // Verify signature (relaxed in dev mode)
  if (!verifySignature(payload)) {
    console.error("[CamPay Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const rawExtRef = payload.external_reference || "";

  if (!rawExtRef) {
    console.error("[CamPay Webhook] No external_reference in payload");
    return NextResponse.json({ error: "Missing external_reference" }, { status: 400 });
  }

  try {
    switch (payload.status) {
      case "SUCCESSFUL": {
        // ── Contrôle d'Idempotence stricte ──
        const isProcessed = await PaymentLedgerService.isTransactionProcessed(supabase, payload.reference);
        if (isProcessed) {
          console.log(`[CamPay Webhook] Transaction ${payload.reference} already processed (idempotent skip)`);
          return NextResponse.json({ received: true, idempotent_skip: true });
        }

        const paidAmount = Number(payload.amount || 0);

        // 1. Recherche de l'intention de paiement enregistrée
        const intent = await PaymentLedgerService.getPaymentIntent(supabase, rawExtRef);

        let resolvedUserId = intent?.user_id || "";
        let targetType: PaymentTargetType = intent?.target_type || "b2c_monthly";

        // 2. Fallback de décodage si l'intent n'a pas été trouvé directement
        if (!intent) {
          if (rawExtRef.startsWith("b2c:")) {
            const [, uid, tier] = rawExtRef.split(":");
            resolvedUserId = uid;
            targetType = `b2c_${tier}` as PaymentTargetType;
          } else if (rawExtRef.startsWith("b2b:") || rawExtRef.startsWith("recruiter:")) {
            const [, uid, pack] = rawExtRef.split(":");
            resolvedUserId = uid;
            targetType = `b2b_${pack}` as PaymentTargetType;
          } else {
            // Format historique (user_id brut)
            resolvedUserId = rawExtRef;
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
              company_name: payload.external_user || "Entreprise Recruteur",
              email: payload.endpoint || "",
              credits_balance: currentCredits + additionalCredits,
              plan: newPlan,
            },
            { onConflict: "user_id" }
          );

          console.log(`[CamPay Webhook] Recruiter ${resolvedUserId} credited with ${additionalCredits} credits (Plan: ${newPlan})`);
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
              campay_reference: payload.reference,
              campay_payment_reference: payload.reference,
              campay_operator: payload.operator,
              campay_phone: payload.endpoint,
              campay_payment_status: payload.status,
              single_credits: existingCredits + 1,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          console.log(`[CamPay Webhook] User ${resolvedUserId} +1 single credit via ${payload.operator}`);
        } else {
          // B2C ABONNEMENT PRO (Mensuel ou Annuel)
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
              campay_reference: payload.reference,
              campay_payment_reference: payload.reference,
              campay_operator: payload.operator,
              campay_phone: payload.endpoint,
              campay_payment_status: payload.status,
              plan_name: planName,
              status: "active",
              current_period_end: periodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

          console.log(`[CamPay Webhook] User ${resolvedUserId} → active (${planName}) via ${payload.operator}`);
        }

        // 3. Mise à jour de l'intention de paiement
        await PaymentLedgerService.updatePaymentIntentStatus(supabase, rawExtRef, "successful");

        // 4. Enregistrement centralisé dans le grand livre des transactions
        await PaymentLedgerService.recordTransaction(supabase, {
          reference_id: payload.reference,
          user_id: resolvedUserId,
          amount_xaf: paidAmount,
          currency: payload.currency || "XAF",
          country_code: "CM",
          operator: (payload.operator?.toUpperCase() as "MTN" | "ORANGE") || "MTN",
          payment_type: targetType,
          status: "successful",
          phone_number: payload.endpoint || null,
          customer_email: payload.endpoint || null,
          customer_name: payload.external_user || null,
          metadata: {
            external_reference: rawExtRef,
            provider: "campay",
            promo_code: intent?.promo_code,
            discount_percent: intent?.discount_percent,
          },
        });

        // 5. Notification Admin (fire-and-forget)
        AdminAlertService.notifyPayment({
          event: "SUCCESSFUL",
          provider: "campay",
          amount: paidAmount,
          operator: payload.operator,
          userId: resolvedUserId,
          userPhone: payload.endpoint,
          reference: payload.reference,
          isB2B,
        });

        break;
      }

      case "FAILED": {
        console.warn(`[CamPay Webhook] Payment FAILED for ext_ref ${rawExtRef}: ${payload.reason}`);

        await PaymentLedgerService.updatePaymentIntentStatus(supabase, rawExtRef, "failed");

        const intent = await PaymentLedgerService.getPaymentIntent(supabase, rawExtRef);
        const resolvedUserId = intent?.user_id || rawExtRef;

        // Notification Admin FAILED (fire-and-forget)
        AdminAlertService.notifyPayment({
          event: "FAILED",
          provider: "campay",
          amount: Number(payload.amount || 0),
          operator: payload.operator,
          userId: resolvedUserId,
          userPhone: payload.endpoint,
          reference: payload.reference,
          reason: payload.reason,
        });

        break;
      }

      case "PENDING": {
        console.log(`[CamPay Webhook] Payment PENDING for ext_ref ${rawExtRef}`);
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

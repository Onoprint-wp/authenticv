import crypto from "crypto";
import {
  type PaymentProvider,
  type CheckoutParams,
  type CheckoutResult,
  type WebhookValidationResult,
} from "./payment.adapter";
import { CAMPAY_WEBHOOK_SECRET, createPaymentLink } from "@/lib/campay";

export class CampayAdapter implements PaymentProvider {
  readonly providerName = "campay" as const;

  async initiateCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    try {
      const link = await createPaymentLink({
        amount: params.amount,
        userId: params.userId,
        userEmail: params.customerEmail || "client@authenticv.app",
        description: params.description,
        redirectUrl: params.returnUrl,
      });

      return {
        success: true,
        paymentUrl: link.link,
        reference: `CAMPAY_${Date.now()}`,
        operator: "CAMPAY_MOMO",
      };
    } catch (err) {
      console.error("[CampayAdapter.initiateCheckout] Error:", err);
      return {
        success: false,
        reference: "",
        error: err instanceof Error ? err.message : "Erreur initialisation CamPay",
      };
    }
  }

  async verifyWebhook(
    _req: Request,
    payload: unknown
  ): Promise<WebhookValidationResult> {
    const data = (payload as Record<string, unknown>) || {};
    const reference = String(data.reference || "");
    const rawStatus = String(data.status || "").toUpperCase();
    const userId = String(data.external_reference || "");
    const amount = Number(data.amount || 0);
    const operator = String(data.operator || "CAMPAY");
    const signature = String(data.signature || "");

    let isValid = true;
    if (CAMPAY_WEBHOOK_SECRET) {
      const message = `${reference}${rawStatus}`;
      const hmac = crypto.createHmac("sha256", CAMPAY_WEBHOOK_SECRET);
      const computedSignature = hmac.update(message).digest("hex");
      try {
        isValid = crypto.timingSafeEqual(
          Buffer.from(signature || ""),
          Buffer.from(computedSignature)
        );
      } catch {
        isValid = false;
      }
    }

    let status: WebhookValidationResult["status"] = "UNKNOWN";
    if (rawStatus === "SUCCESSFUL" || rawStatus === "SUCCESS") {
      status = "SUCCESSFUL";
    } else if (rawStatus === "FAILED") {
      status = "FAILED";
    } else if (rawStatus === "PENDING") {
      status = "PENDING";
    }

    return {
      isValid,
      status,
      reference,
      userId,
      amount,
      operator,
      rawPayload: data,
    };
  }
}

import {
  type PaymentProvider,
  type CheckoutParams,
  type CheckoutResult,
  type WebhookValidationResult,
} from "./payment.adapter";
import {
  createMoovPaymentLink,
  verifyMoovWebhookSignature,
  checkMoovTransactionStatus,
} from "@/lib/moov";

export class MoovAdapter implements PaymentProvider {
  readonly providerName = "moov" as const;

  async initiateCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    try {
      const res = await createMoovPaymentLink({
        amount: params.amount,
        currency: params.currency || "XAF",
        userId: params.userId,
        userEmail: params.customerEmail || "client@authenticv.app",
        description: params.description,
        redirectUrl: params.returnUrl,
      });

      return {
        success: true,
        paymentUrl: res.payment_url,
        reference: res.transaction_id,
        operator: "MOOV_MONEY",
      };
    } catch (err) {
      console.error("[MoovAdapter.initiateCheckout] Error:", err);
      return {
        success: false,
        reference: "",
        error: err instanceof Error ? err.message : "Erreur initialisation Moov Money",
      };
    }
  }

  async verifyWebhook(
    req: Request,
    payload: unknown
  ): Promise<WebhookValidationResult> {
    const data = (payload as Record<string, unknown>) || {};
    const transactionId = String(
      data.cpay_transaction_id || data.transaction_id || data.tx_id || ""
    );
    const rawStatus = String(
      data.cpay_status || data.status || data.code || ""
    ).toUpperCase();
    const userId = String(
      data.cpay_custom || data.customer_id || data.metadata || ""
    );
    const amount = Number(data.cpay_amount || data.amount || 0);

    const token = String(data.token || "");
    const isValid = verifyMoovWebhookSignature(req.headers, JSON.stringify(data), token);

    let isSuccess =
      rawStatus === "ACCEPTED" ||
      rawStatus === "SUCCEEDED" ||
      rawStatus === "200" ||
      rawStatus === "00";

    // Double vérification API si besoin
    if (transactionId && (!isSuccess || !userId)) {
      try {
        const verified = await checkMoovTransactionStatus(transactionId);
        if (verified.status === "ACCEPTED") {
          isSuccess = true;
        }
      } catch {
        // ignorer
      }
    }

    let status: WebhookValidationResult["status"] = "UNKNOWN";
    if (isSuccess) {
      status = "SUCCESSFUL";
    } else if (rawStatus === "REFUSED" || rawStatus === "FAILED") {
      status = "FAILED";
    } else if (rawStatus === "PENDING") {
      status = "PENDING";
    }

    return {
      isValid,
      status,
      reference: transactionId,
      userId,
      amount,
      operator: "MOOV_MONEY",
      rawPayload: data,
    };
  }
}

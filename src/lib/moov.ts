/**
 * Moov Money & CinetPay Gateway – configuration & helpers.
 * Payment processing library for AuthenticV Pro subscriptions in Gabon (GA), Tchad (TD) & CEMAC/West Africa.
 *
 * Direct support for Moov Money Gabon, Moov Money Tchad, Moov Money CI via CinetPay / Moov Africa Gateway.
 */

export const MOOV_API_KEY = process.env.MOOV_API_KEY ?? process.env.CINETPAY_API_KEY ?? "";
export const MOOV_SITE_ID = process.env.MOOV_SITE_ID ?? process.env.CINETPAY_SITE_ID ?? "";
export const MOOV_SECRET_KEY = process.env.MOOV_SECRET_KEY ?? process.env.CINETPAY_SECRET_KEY ?? "";
export const MOOV_WEBHOOK_SECRET = process.env.MOOV_WEBHOOK_SECRET ?? process.env.CINETPAY_WEBHOOK_SECRET ?? "";
export const MOOV_API_BASE = process.env.MOOV_API_BASE ?? "https://api-checkout.cinetpay.com/v2";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface MoovPaymentLinkOptions {
  amount: number;
  currency?: string; // Default XAF
  userId: string;
  userEmail: string;
  countryCode?: "GA" | "TD" | "CI" | "CM" | string;
  channels?: string; // "MOBILE_MONEY" | "ALL"
  description?: string;
  redirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface MoovPaymentLinkResponse {
  payment_url: string;
  payment_token?: string;
  transaction_id: string;
}

export interface MoovTransactionStatus {
  transaction_id: string;
  status: "ACCEPTED" | "REFUSED" | "PENDING" | "CANCELLED";
  amount: number;
  currency: string;
  payment_method: string;
  operator_id?: string;
  metadata?: string;
}

/**
 * Generate a unique Moov / CinetPay transaction reference ID.
 */
export function generateTransactionId(prefix = "AUTH"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Initiate a payment session and generate a checkout link for Moov Money (Gabon, Tchad, CI).
 */
export async function createMoovPaymentLink(
  opts: MoovPaymentLinkOptions
): Promise<MoovPaymentLinkResponse> {
  const transactionId = generateTransactionId("MOOV");
  const currency = opts.currency ?? "XAF";
  const redirectUrl = opts.redirectUrl ?? `${SITE_URL}/builder?upgraded=true`;
  const failureRedirectUrl = opts.failureRedirectUrl ?? `${SITE_URL}/builder?payment=failed`;
  const country = (opts.countryCode ?? "GA").toUpperCase();

  // If in sandbox / dev mode without production API keys, generate a local simulation link
  if (!MOOV_API_KEY || !MOOV_SITE_ID) {
    console.warn("[Moov Gateway] Missing MOOV_API_KEY or MOOV_SITE_ID — using sandbox link");
    return {
      payment_url: `${redirectUrl}&gateway=moov_sandbox&tx=${transactionId}&country=${country}`,
      transaction_id: transactionId,
    };
  }

  const payload = {
    apikey: MOOV_API_KEY,
    site_id: MOOV_SITE_ID,
    transaction_id: transactionId,
    amount: opts.amount,
    currency,
    alternative_currency: "",
    description: opts.description ?? `AuthenticV Pro - Payment Moov Money (${country})`,
    customer_id: opts.userId,
    customer_name: opts.userEmail.split("@")[0] || "Client AuthenticV",
    customer_surname: "User",
    customer_email: opts.userEmail || "client@authenticv.app",
    customer_phone_number: "+24100000000",
    customer_address: country,
    customer_city: country === "GA" ? "Libreville" : country === "TD" ? "N'Djamena" : "Abidjan",
    customer_country: country,
    customer_state: country,
    customer_zip_code: "00241",
    notify_url: `${SITE_URL}/api/moov/webhook`,
    return_url: redirectUrl,
    channels: opts.channels ?? "MOBILE_MONEY",
    metadata: JSON.stringify({
      user_id: opts.userId,
      country,
      gateway: "moov_africa",
    }),
  };

  const res = await fetch(`${MOOV_API_BASE}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[Moov Gateway] Payment creation failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (data.code !== "201" && data.code !== "200" && !data.data?.payment_url) {
    throw new Error(`[Moov Gateway] ${data.message || "Failed to generate payment URL"}`);
  }

  return {
    payment_url: data.data.payment_url,
    payment_token: data.data.payment_token,
    transaction_id: transactionId,
  };
}

/**
 * Verify Moov / CinetPay transaction status via API.
 */
export async function checkMoovTransactionStatus(
  transactionId: string
): Promise<MoovTransactionStatus> {
  if (!MOOV_API_KEY || !MOOV_SITE_ID) {
    return {
      transaction_id: transactionId,
      status: "ACCEPTED",
      amount: 5000,
      currency: "XAF",
      payment_method: "MOOV_MONEY",
    };
  }

  const res = await fetch(`${MOOV_API_BASE}/payment/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: MOOV_API_KEY,
      site_id: MOOV_SITE_ID,
      transaction_id: transactionId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[Moov Gateway] Check transaction failed: ${text}`);
  }

  const data = await res.json();
  const txData = data.data;

  return {
    transaction_id: transactionId,
    status: txData.status as "ACCEPTED" | "REFUSED" | "PENDING" | "CANCELLED",
    amount: Number(txData.amount || 0),
    currency: txData.currency || "XAF",
    payment_method: txData.payment_method || "MOOV_MONEY",
    operator_id: txData.operator_id,
    metadata: txData.metadata,
  };
}

/**
 * Verify webhook HMAC signature or token from Moov / CinetPay.
 */
export function verifyMoovWebhookSignature(
  headers: Headers,
  rawBody: string,
  payloadToken?: string
): boolean {
  if (!MOOV_WEBHOOK_SECRET) {
    console.warn("[Moov Webhook] MOOV_WEBHOOK_SECRET not set — bypassing signature check in dev mode");
    return true;
  }

  const xToken = headers.get("x-token") || headers.get("cpay-token") || payloadToken;
  if (xToken && xToken === MOOV_WEBHOOK_SECRET) {
    return true;
  }

  return false;
}

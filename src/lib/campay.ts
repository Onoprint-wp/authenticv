/**
 * CamPay Mobile Money – configuration & helpers.
 * Payment processing library for AuthenticV Pro subscriptions.
 *
 * API Documentation: https://documenter.getpostman.com/view/2391374/T1LV8PVA
 *
 * Auth flow:
 *   1. Get a short-lived access token via /token/  (username + password)
 *   2. Use the token (or the permanent token) for all subsequent calls
 *
 * Payment flow (Payment Link):
 *   1. POST /collect/  → returns { reference, ussd_code, operator }
 *   2. User confirms on their phone (USSD prompt)
 *   3. CamPay sends webhook → POST /api/campay/webhook
 *   4. Or poll GET /transaction/{reference}/ for status
 */

// ── Environment variables ──────────────────────────────────────────────────────

const CAMPAY_APP_USERNAME = process.env.CAMPAY_APP_USERNAME ?? "";
const CAMPAY_APP_PASSWORD = process.env.CAMPAY_APP_PASSWORD ?? "";
const CAMPAY_PERMANENT_TOKEN = process.env.CAMPAY_PERMANENT_TOKEN ?? "";
export const CAMPAY_WEBHOOK_SECRET = process.env.CAMPAY_WEBHOOK_SECRET ?? "";
const CAMPAY_API_BASE = process.env.CAMPAY_API_BASE ?? "https://campay.net/api";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** AuthenticV Pro price in XAF (FCFA). */
export const PRO_PRICE_XAF = 5000;

// ── Token management ────────────────────────────────────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Get an access token from CamPay.
 * Tokens are valid for ~1 hour; we cache with a 5-min safety margin.
 * Falls back to permanent token if username/password are not set.
 */
export async function getAccessToken(): Promise<string> {
  // Prefer permanent token if available (simpler for webhooks/server calls)
  if (CAMPAY_PERMANENT_TOKEN) {
    return CAMPAY_PERMANENT_TOKEN;
  }

  // Check cache
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  if (!CAMPAY_APP_USERNAME || !CAMPAY_APP_PASSWORD) {
    throw new Error("[CamPay] Missing CAMPAY_APP_USERNAME or CAMPAY_APP_PASSWORD");
  }

  const res = await fetch(`${CAMPAY_API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: CAMPAY_APP_USERNAME,
      password: CAMPAY_APP_PASSWORD,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[CamPay] Token request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const token = data.token as string;

  // Cache for 55 minutes (tokens are valid ~1 hour)
  cachedToken = {
    value: token,
    expiresAt: Date.now() + 55 * 60 * 1000,
  };

  return token;
}

// ── Generic fetch wrapper ───────────────────────────────────────────────────────

/**
 * Authenticated fetch wrapper for the CamPay API.
 * Automatically injects the Authorization header.
 */
export async function campayFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${CAMPAY_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[CamPay] ${res.status} ${res.statusText}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ── Payment operations ──────────────────────────────────────────────────────────

export interface CollectResponse {
  reference: string;
  ussd_code: string;
  operator: string;
}

export interface PaymentLinkResponse {
  link: string;
}

export interface TransactionStatus {
  reference: string;
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  amount: string;
  currency: string;
  operator: string;
  code: string;
  operator_reference: string;
  endpoint: string;
  signature: string;
  external_reference: string;
  external_user: string;
  reason: string;
}

/**
 * Initiate a direct collect (USSD push) on the user's phone.
 * The user receives a prompt to confirm the payment.
 *
 * @see POST /collect/
 */
export async function collectPayment(opts: {
  amount: number;
  phoneNumber: string;
  userId: string;
  description?: string;
}): Promise<CollectResponse> {
  return campayFetch<CollectResponse>("/collect/", {
    method: "POST",
    body: JSON.stringify({
      amount: String(opts.amount),
      currency: "XAF",
      from: opts.phoneNumber,
      description: opts.description ?? "AuthenticV Pro – Abonnement mensuel",
      external_reference: opts.userId,
    }),
  });
}

/**
 * Generate a CamPay payment link (hosted checkout page).
 * The user is redirected to a CamPay-hosted page to complete the payment.
 *
 * @see POST /get_payment_link/
 */
export async function createPaymentLink(opts: {
  amount: number;
  userId: string;
  userEmail: string;
  redirectUrl?: string;
  description?: string;
}): Promise<PaymentLinkResponse> {
  return campayFetch<PaymentLinkResponse>("/get_payment_link/", {
    method: "POST",
    body: JSON.stringify({
      amount: String(opts.amount),
      currency: "XAF",
      description: opts.description ?? "AuthenticV Pro – Abonnement mensuel",
      redirect_url: opts.redirectUrl ?? `${SITE_URL}/builder?upgraded=true`,
      external_reference: opts.userId,
      // CamPay uses these for the checkout page
      name: opts.userEmail,
      email: opts.userEmail,
    }),
  });
}

/**
 * Check the status of a transaction by reference.
 *
 * @see GET /transaction/{reference}/
 */
export async function getTransactionStatus(reference: string): Promise<TransactionStatus> {
  return campayFetch<TransactionStatus>(`/transaction/${reference}/`);
}

/**
 * Request a withdrawal (payout) — not used for subscriptions
 * but included for completeness.
 *
 * @see POST /withdraw/
 */
export async function withdraw(opts: {
  amount: number;
  phoneNumber: string;
  description?: string;
}): Promise<{ reference: string }> {
  return campayFetch("/withdraw/", {
    method: "POST",
    body: JSON.stringify({
      amount: String(opts.amount),
      currency: "XAF",
      to: opts.phoneNumber,
      description: opts.description ?? "AuthenticV – Remboursement",
    }),
  });
}

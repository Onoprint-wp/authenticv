export interface CheckoutParams {
  userId: string;
  amount: number;
  currency?: string;
  description: string;
  phoneNumber?: string;
  customerEmail?: string;
  returnUrl?: string;
}

export interface CheckoutResult {
  success: boolean;
  paymentUrl?: string;
  reference: string;
  operator?: string;
  error?: string;
}

export interface WebhookValidationResult {
  isValid: boolean;
  status: "SUCCESSFUL" | "PENDING" | "FAILED" | "UNKNOWN";
  reference: string;
  userId: string;
  amount: number;
  operator: string;
  rawPayload: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly providerName: "campay" | "moov" | "cinetpay" | "flutterwave";
  initiateCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  verifyWebhook(req: Request, payload: unknown): Promise<WebhookValidationResult>;
}

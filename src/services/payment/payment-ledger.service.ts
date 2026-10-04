import { type SupabaseClient } from "@supabase/supabase-js";

export type PaymentTargetType =
  | "b2c_single"
  | "b2c_monthly"
  | "b2c_annual"
  | "b2b_single"
  | "b2b_pack5"
  | "b2b_pack15"
  | "b2b_monthly_pro";

export interface PaymentIntentRecord {
  id?: string;
  user_id: string;
  external_reference: string;
  provider: "campay" | "moov" | "stripe" | "cinetpay" | "manual";
  target_type: PaymentTargetType;
  amount_xaf: number;
  promo_code?: string;
  discount_percent?: number;
  status?: "pending" | "successful" | "failed";
  metadata?: Record<string, unknown>;
}

export interface TransactionRecord {
  id?: string;
  reference_id: string;
  user_id?: string | null;
  amount_xaf: number;
  currency?: string;
  country_code?: "CM" | "GA" | "CG" | "TD" | "CF" | "GQ" | "INTL";
  operator?: "MTN" | "ORANGE" | "AIRTEL" | "MOOV" | "TELECEL" | "GETESA" | "CARD" | "OTHER";
  payment_type: PaymentTargetType | "b2b_corporate";
  status: "successful" | "pending" | "failed" | "refunded";
  phone_number?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  fees_operator?: number;
  cost_ai_estimated?: number;
  agent_id?: string | null;
  commission_amount_xaf?: number;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export class PaymentLedgerService {
  /**
   * Enregistre une intention de paiement avant redirection de l'utilisateur vers la passerelle.
   */
  static async createPaymentIntent(
    supabase: SupabaseClient,
    intent: PaymentIntentRecord
  ): Promise<string> {
    const { data, error } = await supabase
      .from("payment_intents")
      .upsert(
        {
          user_id: intent.user_id,
          external_reference: intent.external_reference,
          provider: intent.provider,
          target_type: intent.target_type,
          amount_xaf: intent.amount_xaf,
          promo_code: intent.promo_code || null,
          discount_percent: intent.discount_percent || 0,
          status: intent.status || "pending",
          metadata: intent.metadata || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "external_reference" }
      )
      .select("id")
      .single();

    if (error) {
      console.warn("[PaymentLedgerService.createPaymentIntent] Warning:", error.message);
      return intent.external_reference;
    }

    return data?.id || intent.external_reference;
  }

  /**
   * Recherche une intention de paiement existante par sa référence externe.
   */
  static async getPaymentIntent(
    supabase: SupabaseClient,
    externalReference: string
  ): Promise<PaymentIntentRecord | null> {
    if (!externalReference) return null;

    const { data, error } = await supabase
      .from("payment_intents")
      .select("*")
      .eq("external_reference", externalReference)
      .maybeSingle();

    if (error || !data) return null;
    return data as PaymentIntentRecord;
  }

  /**
   * Marque une intention de paiement comme complétée ou échouée.
   */
  static async updatePaymentIntentStatus(
    supabase: SupabaseClient,
    externalReference: string,
    status: "successful" | "failed"
  ): Promise<void> {
    if (!externalReference) return;

    await supabase
      .from("payment_intents")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("external_reference", externalReference);
  }

  /**
   * Vérifie si une référence de transaction a déjà été traitée avec succès pour garantir l'idempotence.
   */
  static async isTransactionProcessed(
    supabase: SupabaseClient,
    referenceId: string
  ): Promise<boolean> {
    if (!referenceId) return false;

    // 1. Vérification dans la table user_subscriptions (B2C)
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("campay_reference, campay_payment_status")
      .eq("campay_reference", referenceId)
      .eq("campay_payment_status", "SUCCESSFUL")
      .maybeSingle();

    if (sub) return true;

    // 2. Vérification dans la table unifiée transactions (grand livre)
    try {
      const { data: tx } = await supabase
        .from("transactions")
        .select("reference_id, status")
        .eq("reference_id", referenceId)
        .eq("status", "successful")
        .maybeSingle();

      if (tx) return true;
    } catch {
      // Ignore si non disponible
    }

    return false;
  }

  /**
   * Enregistre une transaction dans le grand livre pour audit, comptabilité et commissions.
   */
  static async recordTransaction(
    supabase: SupabaseClient,
    record: TransactionRecord
  ): Promise<void> {
    try {
      // Calcul des frais opérateur estimés (ex: ~3% standard CEMAC)
      const feesOperator = record.fees_operator ?? Math.round(record.amount_xaf * 0.03);

      await supabase.from("transactions").upsert(
        {
          reference_id: record.reference_id,
          user_id: record.user_id || null,
          amount_xaf: record.amount_xaf,
          currency: record.currency || "XAF",
          country_code: record.country_code || "CM",
          operator: record.operator || "MTN",
          payment_type: record.payment_type,
          status: record.status,
          phone_number: record.phone_number || null,
          customer_email: record.customer_email || null,
          customer_name: record.customer_name || null,
          fees_operator: feesOperator,
          cost_ai_estimated: record.cost_ai_estimated ?? 50,
          agent_id: record.agent_id || null,
          commission_amount_xaf: record.commission_amount_xaf || 0,
          metadata: record.metadata ?? {},
          created_at: record.created_at || new Date().toISOString(),
        },
        { onConflict: "reference_id" }
      );
    } catch (err) {
      console.warn("[PaymentLedgerService.recordTransaction] Warning:", err);
    }
  }
}

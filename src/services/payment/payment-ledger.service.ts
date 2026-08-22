import { type SupabaseClient } from "@supabase/supabase-js";

export interface TransactionRecord {
  id?: string;
  reference: string;
  user_id: string;
  amount: number;
  currency: string;
  operator: string;
  provider: "campay" | "moov" | "cinetpay" | "manual";
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  item_type: "single_credit" | "pro_monthly" | "pro_annual" | "recruiter_pack" | "recruiter_monthly";
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export class PaymentLedgerService {
  /**
   * Vérifie si une référence de transaction a déjà été traitée avec succès pour garantir l'idempotence.
   */
  static async isTransactionProcessed(
    supabase: SupabaseClient,
    reference: string
  ): Promise<boolean> {
    if (!reference) return false;

    // 1. Vérification dans la table user_subscriptions (pour les paiements enregistrés)
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("campay_reference, campay_payment_status")
      .eq("campay_reference", reference)
      .eq("campay_payment_status", "SUCCESSFUL")
      .maybeSingle();

    if (sub) return true;

    // 2. Vérification dans les logs de transactions / webhook history si la table existe
    try {
      const { data: tx } = await supabase
        .from("transactions")
        .select("reference, status")
        .eq("reference", reference)
        .eq("status", "SUCCESSFUL")
        .maybeSingle();

      if (tx) return true;
    } catch {
      // Ignorer si la table transactions n'a pas encore de vue publique
    }

    return false;
  }

  /**
   * Enregistre une transaction dans le grand livre pour audit et traçabilité.
   */
  static async recordTransaction(
    supabase: SupabaseClient,
    record: TransactionRecord
  ): Promise<void> {
    try {
      await supabase.from("transactions").upsert(
        {
          reference: record.reference,
          user_id: record.user_id,
          amount: record.amount,
          currency: record.currency || "XAF",
          operator: record.operator,
          provider: record.provider,
          status: record.status,
          metadata: record.metadata ?? {},
          created_at: record.created_at || new Date().toISOString(),
        },
        { onConflict: "reference" }
      );
    } catch (err) {
      console.warn("[PaymentLedgerService.recordTransaction] Warning:", err);
    }
  }
}

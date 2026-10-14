import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export type Plan = "free" | "pro";

export const FREE_MONTHLY_MESSAGES = 20;
export const WELCOME_FREE_SINGLE_CREDITS = 1;

/** Tarifs en FCFA (XAF) */
export const PRICE_SINGLE_XAF = 1000;
export const PRICE_MONTHLY_XAF = 5000;
export const PRICE_ANNUAL_XAF = 18000;

/** Retourne le plan actif de l'utilisateur. Vérifie le statut et la date d'expiration. */
export async function getUserPlan(userId: string): Promise<Plan> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.status !== "active") return "free";

  if (data.current_period_end) {
    const expiresAt = new Date(data.current_period_end).getTime();
    if (Date.now() > expiresAt) {
      return "free";
    }
  }

  return "pro";
}

/** Retourne le nombre de crédits de déblocage uniques de l'utilisateur (1er export PDF HD offert à l'inscription + achats 1 000 FCFA). */
export async function getUserSingleCredits(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_subscriptions")
    .select("single_credits, status, campay_operator")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    try {
      const admin = createAdminClient();
      await admin
        .from("user_subscriptions")
        .upsert(
          {
            user_id: userId,
            status: "free",
            single_credits: WELCOME_FREE_SINGLE_CREDITS,
            campay_operator: "WELCOME_GRANTED",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id", ignoreDuplicates: true }
        );
    } catch {
      // Fallback silencieux si la clé admin n'est pas disponible localement
    }
    return WELCOME_FREE_SINGLE_CREDITS;
  }

  // Utilisateur existant (créé avant l'offre 1er PDF offert) n'ayant jamais reçu son crédit de bienvenue
  if ((data.single_credits ?? 0) === 0 && data.status === "free" && !data.campay_operator) {
    try {
      const admin = createAdminClient();
      await admin
        .from("user_subscriptions")
        .update({
          single_credits: WELCOME_FREE_SINGLE_CREDITS,
          campay_operator: "WELCOME_GRANTED",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
      return WELCOME_FREE_SINGLE_CREDITS;
    } catch {
      return WELCOME_FREE_SINGLE_CREDITS;
    }
  }

  return data.single_credits ?? 0;
}

/** Consomme 1 crédit à l'acte en utilisant le client admin pour contourner la restriction RLS. */
export async function consumeSingleCredit(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const credits = await getUserSingleCredits(userId);
  if (credits <= 0) return false;

  const { data, error } = await admin
    .from("user_subscriptions")
    .update({
      single_credits: credits - 1,
      campay_operator: "WELCOME_GRANTED",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select("single_credits")
    .single();

  return !error && data !== null;
}

/** Retourne le nombre de messages envoyés ce mois-ci. */
export async function getMonthlyMessageCount(userId: string): Promise<number> {
  const month = new Date().toISOString().slice(0, 7);
  const supabase = await createClient();
  const { data } = await supabase
    .from("message_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("month", month)
    .maybeSingle();

  return data?.count ?? 0;
}

/** Incrémente le compteur de messages du mois courant. Non-bloquant : une erreur ne casse pas le chat. */
export async function incrementMessageCount(userId: string): Promise<void> {
  const month = new Date().toISOString().slice(0, 7);
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_message_usage", {
    p_user_id: userId,
    p_month: month,
  });
  if (error) {
    console.error("[quota] RPC increment_message_usage failed:", error.message);
  }
}

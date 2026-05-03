import { createClient } from "@/utils/supabase/server";

export type Plan = "free" | "pro";

export const FREE_MONTHLY_MESSAGES = 20;

/** Retourne le plan actif de l'utilisateur. */
export async function getUserPlan(userId: string): Promise<Plan> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.status === "active" ? "pro" : "free";
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

/** Incrémente le compteur de messages du mois courant. */
export async function incrementMessageCount(userId: string): Promise<void> {
  const month = new Date().toISOString().slice(0, 7);
  const supabase = await createClient();
  await supabase.rpc("increment_message_usage", {
    p_user_id: userId,
    p_month: month,
  });
}

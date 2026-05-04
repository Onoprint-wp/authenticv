"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Récupérer l'abonnement Stripe
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("stripe_subscription_id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  // 2. Résilier l'abonnement actif (ne bloque pas la suppression en cas d'erreur)
  if (sub?.stripe_subscription_id && sub.status === "active") {
    try {
      await getStripe().subscriptions.cancel(sub.stripe_subscription_id);
    } catch (err) {
      console.error("[deleteAccount] Stripe cancel error:", err);
    }
  }

  const adminClient = createAdminClient();

  // 3. Supprimer la photo (bucket avatars)
  try {
    const { data: files } = await adminClient.storage
      .from("avatars")
      .list(user.id);
    if (files && files.length > 0) {
      await adminClient.storage
        .from("avatars")
        .remove(files.map((f) => `${user.id}/${f.name}`));
    }
  } catch (err) {
    console.error("[deleteAccount] Storage delete error:", err);
  }

  // 4. Supprimer le CV (pas de CASCADE sur resumes)
  await adminClient.from("resumes").delete().eq("user_id", user.id);

  // 5. Supprimer le compte Auth → cascade sur user_subscriptions
  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteAccount] Auth delete error:", error);
    redirect(`/builder?error=${encodeURIComponent("Erreur lors de la suppression du compte.")}`);
  }

  // 6. Session invalide — rediriger vers login
  redirect(
    `/login?message=${encodeURIComponent("Votre compte a été supprimé. À bientôt.")}`
  );
}

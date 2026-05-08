"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Récupérer l'abonnement (CamPay n'a pas de cancel API — paiement unique)
  // Pas besoin d'appeler un cancel endpoint car CamPay fonctionne
  // par paiements unitaires, pas par abonnement récurrent automatique.

  const adminClient = createAdminClient();

  // 2. Supprimer la photo (bucket avatars)
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

  // 3. Supprimer le CV (pas de CASCADE sur resumes)
  await adminClient.from("resumes").delete().eq("user_id", user.id);

  // 4. Supprimer le compte Auth → cascade sur user_subscriptions
  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[deleteAccount] Auth delete error:", error);
    redirect(`/builder?error=${encodeURIComponent("Erreur lors de la suppression du compte.")}`);
  }

  // 5. Session invalide — rediriger vers login
  redirect(
    `/login?message=${encodeURIComponent("Votre compte a été supprimé. À bientôt.")}`
  );
}

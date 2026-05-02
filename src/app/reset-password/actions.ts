"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (password !== confirm) {
    redirect(
      `/reset-password?error=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`
    );
  }

  if (password.length < 8) {
    redirect(
      `/reset-password?error=${encodeURIComponent("Le mot de passe doit contenir au moins 8 caractères.")}`
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/builder");
}

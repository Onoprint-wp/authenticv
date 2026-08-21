"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/login?reset=true&error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?message=${encodeURIComponent("Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.")}`
  );
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "";
  const destination = next.startsWith("/") ? next : "/builder";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorUrl = next ? `/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(error.message)}` : `/login?error=${encodeURIComponent(error.message)}`;
    redirect(errorUrl);
  }

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "";
  const destination = next.startsWith("/") ? next : "/builder";

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const errorUrl = next ? `/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(error.message)}` : `/login?error=${encodeURIComponent(error.message)}`;
    redirect(errorUrl);
  }

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

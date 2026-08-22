"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

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

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "";
  let destination = next.startsWith("/") ? next : "";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const errorUrl = next ? `/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(error.message)}` : `/login?error=${encodeURIComponent(error.message)}`;
    redirect(errorUrl);
  }

  // Auto-routage intelligent si aucune destination explicite
  if (!destination && data?.user) {
    try {
      const adminEmails = [
        "onoprint25@gmail.com",
        "authenticv.playwright.test@gmail.com",
        process.env.ADMIN_EMAIL,
      ].filter(Boolean);

      // 0. Priorité Absolue Administrateur Central
      if (adminEmails.includes(data.user.email ?? "")) {
        destination = "/admin";
      } else {
        const admin = createAdminClient();

        // 1. Vérifier si l'utilisateur est un Agent Commercial
        const { data: agent } = await admin
          .from("commercial_agents")
          .select("id, status")
          .or(`user_id.eq.${data.user.id},email.eq.${data.user.email}`)
          .maybeSingle();

        if (agent && agent.status === "active") {
          destination = "/commercial";
        } else {
          // 2. Vérifier si l'utilisateur est un Recruteur B2B
          const { data: company } = await admin
            .from("companies")
            .select("id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (company) {
            destination = "/recruiter/search";
          } else {
            destination = "/builder";
          }
        }
      }
    } catch {
      destination = "/builder";
    }
  }

  if (!destination) destination = "/builder";

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

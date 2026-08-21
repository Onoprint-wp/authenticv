import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

export const metadata: Metadata = {
  title: "Backoffice Administrateur — AuthentiCV",
  description: "Tableau de bord de pilotage des transactions, utilisateurs et métriques de la plateforme AuthentiCV.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Admin emails whitelist
  const ADMIN_EMAILS = [
    "onoprint25@gmail.com",
    "authenticv.playwright.test@gmail.com",
    process.env.ADMIN_EMAIL,
  ].filter(Boolean);

  const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
  if (!isAdmin && process.env.NODE_ENV === "production") {
    redirect("/dashboard");
  }

  return <AdminDashboardView />;
}

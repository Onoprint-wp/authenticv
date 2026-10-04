import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { isAdminEmail } from "@/lib/admin-auth";

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

  // Admin emails whitelist — source unique dans src/lib/admin-auth.ts
  const isAdmin = isAdminEmail(user.email);
  if (!isAdmin && process.env.NODE_ENV === "production") {
    redirect("/dashboard");
  }

  return <AdminDashboardView />;
}

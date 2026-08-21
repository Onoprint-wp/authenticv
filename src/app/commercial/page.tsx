import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CommercialDashboardView } from "@/components/commercial/CommercialDashboardView";

export const metadata: Metadata = {
  title: "Portail Commercial & Commissions — AuthentiCV",
  description: "Espace réservé aux délégués commerciaux et apporteurs d'affaires AuthentiCV en zone CEMAC.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function CommercialPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && process.env.NODE_ENV === "production") {
    redirect("/login");
  }

  return <CommercialDashboardView />;
}

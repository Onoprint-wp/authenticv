import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ADMIN_EMAILS = [
      "onoprint25@gmail.com",
      process.env.ADMIN_EMAIL,
    ].filter(Boolean);

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
    if (!isAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const admin = createAdminClient();

    const { data: subs } = await admin
      .from("user_subscriptions")
      .select("user_id, status, plan_name, single_credits, created_at, updated_at");

    const { data: companies } = await admin
      .from("companies")
      .select("company_name, email, credits_balance, plan, created_at");

    let csvContent = "CATEGORIE,DETAILS,VALEUR_OU_REVENU_XAF,DATE\n";

    // Subscriptions CSV rows
    (subs || []).forEach((s) => {
      let val = 0;
      if (s.plan_name === "pro_annual") val = 18000;
      else if (s.plan_name === "pro") val = 5000;

      csvContent += `ABONNEMENT_B2C,"Plan: ${s.plan_name} | Statut: ${s.status}",${val},${s.updated_at || s.created_at}\n`;
    });

    // Companies CSV rows
    (companies || []).forEach((c) => {
      const val = (c.credits_balance || 0) * 4000;
      csvContent += `ENTREPRISE_B2B,"Nom: ${c.company_name} | Email: ${c.email}",${val},${c.created_at}\n`;
    });

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="authentiCV_chiffre_affaires_rapport_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("[Admin Export CSV Error]:", err);
    return NextResponse.json({ error: "Export Error" }, { status: 500 });
  }
}

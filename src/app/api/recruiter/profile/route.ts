import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // 1. Fetch company profile
    const { data: company } = await admin
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // 2. Fetch company transactions / invoices
    const { data: txs } = await admin
      .from("transactions")
      .select("*")
      .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      company: company || {
        user_id: user.id,
        company_name: "Mon Entreprise",
        email: user.email,
        credits_balance: 0,
        plan: "pay_as_you_go",
        country_code: "CM",
        rccm: "",
        niu_or_nif: "",
      },
      invoices: txs || [],
    });
  } catch (err) {
    console.error("[Recruiter Profile GET Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement du profil entreprise" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { company_name, email, rccm, niu_or_nif, country_code = "CM", city = "Douala", address } = body;

    const admin = createAdminClient();

    const { data: existingCompany } = await admin
      .from("companies")
      .select("credits_balance, plan")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: updatedCompany, error } = await admin
      .from("companies")
      .upsert(
        {
          user_id: user.id,
          company_name: company_name || "Mon Entreprise",
          email: email || user.email || "",
          credits_balance: existingCompany?.credits_balance ?? 0,
          plan: existingCompany?.plan ?? "pay_as_you_go",
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("[Recruiter Profile Update Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profil fiscal de l'entreprise mis à jour avec succès !",
      company: updatedCompany,
    });
  } catch (err) {
    console.error("[Recruiter Profile POST Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil fiscal" },
      { status: 500 }
    );
  }
}

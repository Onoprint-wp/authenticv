import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface CommercialAgentRecord {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  assigned_country: string;
  assigned_city: string;
  commission_rate: number;
  monthly_target_xaf: number;
  total_sales_xaf: number;
  total_commissions_earned_xaf: number;
  total_commissions_paid_xaf: number;
  promo_code?: string;
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
}

const SEED_COMMERCIALS: CommercialAgentRecord[] = [
  {
    id: "comm-1",
    full_name: "Christian Bekono",
    email: "commercial.douala@authenticv.app",
    phone: "+237 699 12 34 56",
    assigned_country: "CM",
    assigned_city: "Douala / Littoral",
    commission_rate: 10,
    monthly_target_xaf: 500000,
    total_sales_xaf: 320000,
    total_commissions_earned_xaf: 32000,
    total_commissions_paid_xaf: 20000,
    promo_code: "CHRISTIAN10",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "comm-2",
    full_name: "Aline Mba Ondo",
    email: "commercial.libreville@authenticv.app",
    phone: "+241 77 88 99 00",
    assigned_country: "GA",
    assigned_city: "Libreville",
    commission_rate: 10,
    monthly_target_xaf: 500000,
    total_sales_xaf: 185000,
    total_commissions_earned_xaf: 18500,
    total_commissions_paid_xaf: 0,
    promo_code: "ALINE10",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "comm-3",
    full_name: "Serge Ngoma",
    email: "commercial.brazzaville@authenticv.app",
    phone: "+242 06 12 34 56",
    assigned_country: "CG",
    assigned_city: "Brazzaville & Pointe-Noire",
    commission_rate: 10,
    monthly_target_xaf: 500000,
    total_sales_xaf: 95000,
    total_commissions_earned_xaf: 9500,
    total_commissions_paid_xaf: 0,
    promo_code: "SERGE10",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");

    const admin = createAdminClient();
    let query = admin.from("commercial_agents").select("*").order("total_sales_xaf", { ascending: false });

    if (country && country !== "ALL") {
      query = query.eq("assigned_country", country);
    }

    const { data: dbAgents, error } = await query;

    let agents: CommercialAgentRecord[] = SEED_COMMERCIALS;
    if (!error && dbAgents && dbAgents.length > 0) {
      agents = dbAgents;
    }

    const totalTeamSales = agents.reduce((acc, a) => acc + (a.total_sales_xaf || 0), 0);
    const totalCommissionsEarned = agents.reduce((acc, a) => acc + (a.total_commissions_earned_xaf || 0), 0);
    const totalCommissionsPaid = agents.reduce((acc, a) => acc + (a.total_commissions_paid_xaf || 0), 0);
    const pendingCommissions = totalCommissionsEarned - totalCommissionsPaid;

    return NextResponse.json({
      success: true,
      agents,
      summary: {
        totalAgents: agents.length,
        totalTeamSalesXaf: totalTeamSales,
        totalCommissionsEarnedXaf: totalCommissionsEarned,
        totalCommissionsPaidXaf: totalCommissionsPaid,
        pendingCommissionsXaf: pendingCommissions,
      },
    });
  } catch (err) {
    console.error("[Admin Commercials GET Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement des commerciaux" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      assigned_country = "CM",
      assigned_city = "Douala",
      commission_rate = 10,
      monthly_target_xaf = 500000,
      promo_code,
    } = body;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { error: "Nom, Email et Téléphone sont obligatoires" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const generatedPromo = (promo_code || `${full_name.split(" ")[0].toUpperCase()}10`).trim();

    const { data: newAgent, error } = await admin
      .from("commercial_agents")
      .upsert(
        {
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          assigned_country,
          assigned_city: assigned_city.trim(),
          commission_rate: Number(commission_rate) || 10,
          monthly_target_xaf: Number(monthly_target_xaf) || 500000,
          promo_code: generatedPromo,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      console.warn("[Admin Commercial Upsert Warning]:", error.message);
    }

    // Also register the promo code in promo_codes table
    await admin.from("promo_codes").upsert(
      {
        code: generatedPromo,
        discount_percent: Number(commission_rate) || 10,
        campaign_name: `Affiliation Commerciale - ${full_name}`,
        target_plan: "all",
        is_active: true,
      },
      { onConflict: "code" }
    );

    return NextResponse.json({
      success: true,
      agent: newAgent || {
        id: `comm-${Date.now()}`,
        full_name,
        email,
        phone,
        assigned_country,
        assigned_city,
        commission_rate,
        monthly_target_xaf,
        total_sales_xaf: 0,
        total_commissions_earned_xaf: 0,
        total_commissions_paid_xaf: 0,
        promo_code: generatedPromo,
        status: "active",
      },
    });
  } catch (err) {
    console.error("[Admin Commercials POST Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du commercial" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, mark_paid_amount_xaf } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const admin = createAdminClient();

    if (mark_paid_amount_xaf) {
      const { data: agent } = await admin
        .from("commercial_agents")
        .select("total_commissions_paid_xaf")
        .eq("id", id)
        .maybeSingle();

      const newPaid = (agent?.total_commissions_paid_xaf || 0) + Number(mark_paid_amount_xaf);

      await admin
        .from("commercial_agents")
        .update({ total_commissions_paid_xaf: newPaid, updated_at: new Date().toISOString() })
        .eq("id", id);
    } else if (status) {
      await admin
        .from("commercial_agents")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    return NextResponse.json({ success: true, message: "Mis à jour avec succès" });
  } catch (err) {
    console.error("[Admin Commercials PATCH Error]:", err);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}

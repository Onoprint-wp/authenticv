import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { CEMAC_COUNTRIES, type CemacCountryCode } from "@/lib/commercial-engine";

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
  role: "agent" | "country_director";
  director_id?: string | null;
  commission_rate: number;
  override_commission_rate?: number;
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
    assigned_city: "Douala & National",
    role: "country_director",
    director_id: null,
    commission_rate: 10,
    override_commission_rate: 2.5,
    monthly_target_xaf: 3500000,
    total_sales_xaf: 320000,
    total_commissions_earned_xaf: 38250,
    total_commissions_paid_xaf: 20000,
    promo_code: "DIRCM10",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "comm-team-1",
    full_name: "Arnaud Bopda",
    email: "commercial.yaounde@authenticv.app",
    phone: "+237 677 88 99 00",
    assigned_country: "CM",
    assigned_city: "Yaoundé & Centre",
    role: "agent",
    director_id: "comm-1",
    commission_rate: 10,
    monthly_target_xaf: 500000,
    total_sales_xaf: 150000,
    total_commissions_earned_xaf: 15000,
    total_commissions_paid_xaf: 0,
    promo_code: "ARNAUD10",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "comm-team-2",
    full_name: "Marcelle Tchuente",
    email: "commercial.bafoussam@authenticv.app",
    phone: "+237 655 44 33 22",
    assigned_country: "CM",
    assigned_city: "Bafoussam / Ouest",
    role: "agent",
    director_id: "comm-1",
    commission_rate: 10,
    monthly_target_xaf: 500000,
    total_sales_xaf: 100000,
    total_commissions_earned_xaf: 10000,
    total_commissions_paid_xaf: 0,
    promo_code: "MARCELLE10",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "comm-2",
    full_name: "Emmanuel Nguema",
    email: "directeur.gabon@authenticv.app",
    phone: "+241 77 11 22 33",
    assigned_country: "GA",
    assigned_city: "Libreville / Port-Gentil",
    role: "country_director",
    director_id: null,
    commission_rate: 10,
    override_commission_rate: 2.5,
    monthly_target_xaf: 2500000,
    total_sales_xaf: 450000,
    total_commissions_earned_xaf: 45000,
    total_commissions_paid_xaf: 0,
    promo_code: "DIRGA10",
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
    role: "country_director",
    director_id: null,
    commission_rate: 10,
    override_commission_rate: 2.5,
    monthly_target_xaf: 2500000,
    total_sales_xaf: 95000,
    total_commissions_earned_xaf: 9500,
    total_commissions_paid_xaf: 0,
    promo_code: "DIRCG10",
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

    if (country && country !== "ALL") {
      agents = agents.filter((a) => a.assigned_country === country);
    }

    // Build hierarchical country tree
    const countryHubs = Object.entries(CEMAC_COUNTRIES).map(([code, meta]) => {
      const countryAgents = agents.filter((a) => a.assigned_country === code);
      const director = countryAgents.find((a) => a.role === "country_director") || null;
      const subordinates = countryAgents.filter((a) => a.role !== "country_director");
      const totalCountrySales = countryAgents.reduce((sum, a) => sum + (a.total_sales_xaf || 0), 0);
      const aggregatedTarget =
        (director?.monthly_target_xaf || meta.defaultDirectorQuota) +
        subordinates.reduce((sum, a) => sum + (a.monthly_target_xaf || meta.defaultAgentQuota), 0);

      return {
        countryCode: code,
        countryName: meta.name,
        flag: meta.flag,
        director,
        agentsCount: countryAgents.length,
        subordinates,
        totalCountrySalesXaf: totalCountrySales,
        aggregatedTargetXaf: aggregatedTarget,
        progressPercent: aggregatedTarget > 0 ? Math.min(100, Math.round((totalCountrySales / aggregatedTarget) * 100)) : 0,
      };
    });

    const totalTeamSales = agents.reduce((acc, a) => acc + (a.total_sales_xaf || 0), 0);
    const totalCommissionsEarned = agents.reduce((acc, a) => acc + (a.total_commissions_earned_xaf || 0), 0);
    const totalCommissionsPaid = agents.reduce((acc, a) => acc + (a.total_commissions_paid_xaf || 0), 0);
    const pendingCommissions = totalCommissionsEarned - totalCommissionsPaid;

    return NextResponse.json({
      success: true,
      agents,
      countryHubs,
      summary: {
        totalAgents: agents.length,
        totalTeamSalesXaf: totalTeamSales,
        totalCommissionsEarnedXaf: totalCommissionsEarned,
        totalCommissionsPaidXaf: totalCommissionsPaid,
        pendingCommissionsXaf: pendingCommissions > 0 ? pendingCommissions : 0,
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
      role = "agent",
      director_id,
      commission_rate = 10,
      override_commission_rate = 2.5,
      monthly_target_xaf,
      promo_code,
    } = body;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { error: "Nom, Email et Téléphone sont obligatoires" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Smart auto-generation of promo code
    let generatedPromo = promo_code;
    if (!generatedPromo) {
      if (role === "country_director") {
        generatedPromo = `DIR${assigned_country}10`;
      } else {
        const firstName = full_name.split(" ")[0].toUpperCase();
        generatedPromo = `${firstName}10`;
      }
    }
    generatedPromo = generatedPromo.trim().toUpperCase();

    // Default target according to role and country
    const defaultTarget =
      monthly_target_xaf ||
      (role === "country_director"
        ? CEMAC_COUNTRIES[assigned_country as CemacCountryCode]?.defaultDirectorQuota || 3500000
        : 500000);

    const { data: newAgent, error } = await admin
      .from("commercial_agents")
      .upsert(
        {
          full_name: full_name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          assigned_country,
          assigned_city: assigned_city.trim(),
          role,
          director_id: director_id || null,
          commission_rate: Number(commission_rate) || 10,
          override_commission_rate: role === "country_director" ? Number(override_commission_rate) || 2.5 : 0,
          monthly_target_xaf: Number(defaultTarget),
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

    // Register promo code in promo_codes table
    await admin.from("promo_codes").upsert(
      {
        code: generatedPromo,
        discount_percent: 10,
        campaign_name: `Affiliation ${role === "country_director" ? "Directeur Pays" : "Commercial"} - ${full_name}`,
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
        role,
        director_id,
        commission_rate,
        override_commission_rate,
        monthly_target_xaf: defaultTarget,
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
    const { id, status, mark_paid_amount_xaf, monthly_target_xaf, role, director_id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const admin = createAdminClient();

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (mark_paid_amount_xaf) {
      const { data: agent } = await admin
        .from("commercial_agents")
        .select("total_commissions_paid_xaf")
        .eq("id", id)
        .maybeSingle();

      const newPaid = (agent?.total_commissions_paid_xaf || 0) + Number(mark_paid_amount_xaf);
      updatePayload.total_commissions_paid_xaf = newPaid;
    }

    if (monthly_target_xaf) {
      updatePayload.monthly_target_xaf = Number(monthly_target_xaf);
    }

    if (status) {
      updatePayload.status = status;
    }

    if (role) {
      updatePayload.role = role;
    }

    if (director_id !== undefined) {
      updatePayload.director_id = director_id || null;
    }

    await admin.from("commercial_agents").update(updatePayload).eq("id", id);

    return NextResponse.json({ success: true, message: "Mis à jour avec succès", updatePayload });
  } catch (err) {
    console.error("[Admin Commercials PATCH Error]:", err);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}

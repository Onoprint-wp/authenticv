import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  calculateGamificationStatus,
  generateReferralLinks,
  calculateAutomatedCommissions,
} from "@/lib/commercial-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface TeamMemberDto {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  assigned_city: string;
  total_sales_xaf: number;
  monthly_target_xaf: number;
  targetProgressPercent: number;
  promo_code: string;
  status: string;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();

    let agent = null;

    if (user) {
      const { data: dbAgent } = await admin
        .from("commercial_agents")
        .select("*")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      agent = dbAgent;
    }

    // Default agent structure if not found in commercial_agents table
    if (!agent) {
      agent = {
        id: user?.id || "guest",
        full_name: user?.user_metadata?.full_name || "Délégué Commercial",
        email: user?.email || "",
        phone: "",
        assigned_country: "CM",
        assigned_city: "Douala",
        role: "agent" as const,
        commission_rate: 10,
        override_commission_rate: 0,
        monthly_target_xaf: 500000,
        total_sales_xaf: 0,
        total_commissions_earned_xaf: 0,
        total_commissions_paid_xaf: 0,
        promo_code: "",
        status: "active",
      };
    }

    const countryCode = agent.assigned_country || "CM";
    const isDirector = agent.role === "country_director";

    // 1. Fetch Assigned Leads for this agent or country
    let leadsQuery = admin.from("crm_leads").select("*");
    if (isDirector) {
      leadsQuery = leadsQuery.eq("country_code", countryCode);
    } else {
      leadsQuery = leadsQuery.or(`assigned_agent_id.eq.${agent.id},country_code.eq.${countryCode}`);
    }

    const { data: leads } = await leadsQuery.order("updated_at", { ascending: false });

    // 2. Fetch Regional Abandoned Carts for WhatsApp Outreach
    const { data: abandoned } = await admin
      .from("resumes")
      .select("id, user_id, title, updated_at, contact_info")
      .order("updated_at", { ascending: false })
      .limit(10);

    // 3. If Country Director, fetch Team Members and compute automated aggregations
    let teamMembers: TeamMemberDto[] = [];
    let countryTeamSalesXaf = agent.total_sales_xaf || 0;
    let countryDirectorOverrideXaf = 0;

    if (isDirector) {
      const { data: dbTeam } = await admin
        .from("commercial_agents")
        .select("*")
        .eq("assigned_country", countryCode)
        .neq("id", agent.id);

      if (dbTeam && dbTeam.length > 0) {
        teamMembers = dbTeam.map((m) => {
          const progress = m.monthly_target_xaf
            ? Math.min(100, Math.round(((m.total_sales_xaf || 0) / m.monthly_target_xaf) * 100))
            : 0;
          countryTeamSalesXaf += m.total_sales_xaf || 0;
          return {
            id: m.id,
            full_name: m.full_name,
            email: m.email,
            phone: m.phone,
            assigned_city: m.assigned_city,
            total_sales_xaf: m.total_sales_xaf || 0,
            monthly_target_xaf: m.monthly_target_xaf || 500000,
            targetProgressPercent: progress,
            promo_code: m.promo_code || "",
            status: m.status || "active",
          };
        });
      }

      // Calculate automated 2.5% override on team sales
      const teamOnlySales = countryTeamSalesXaf - (agent.total_sales_xaf || 0);
      const commissionCalculations = calculateAutomatedCommissions(teamOnlySales, true);
      countryDirectorOverrideXaf = commissionCalculations.directorOverrideXaf;
    }

    const pendingCommission =
      (agent.total_commissions_earned_xaf || 0) +
      countryDirectorOverrideXaf -
      (agent.total_commissions_paid_xaf || 0);

    const targetProgressPercent = agent.monthly_target_xaf
      ? Math.min(
          100,
          Math.round(
            ((isDirector ? countryTeamSalesXaf : agent.total_sales_xaf || 0) / agent.monthly_target_xaf) * 100
          )
        )
      : 0;

    const gamification = calculateGamificationStatus(
      isDirector ? countryTeamSalesXaf : agent.total_sales_xaf || 0,
      agent.monthly_target_xaf || 500000
    );

    const referralLinks = generateReferralLinks(agent.promo_code || "");

    return NextResponse.json({
      success: true,
      agent,
      isDirector,
      metrics: {
        totalSalesXaf: agent.total_sales_xaf || 0,
        countryTeamSalesXaf,
        monthlyTargetXaf: agent.monthly_target_xaf || (isDirector ? 3500000 : 500000),
        targetProgressPercent,
        totalCommissionsEarnedXaf: (agent.total_commissions_earned_xaf || 0) + countryDirectorOverrideXaf,
        directCommissionsEarnedXaf: agent.total_commissions_earned_xaf || 0,
        directorOverrideEarnedXaf: countryDirectorOverrideXaf,
        totalCommissionsPaidXaf: agent.total_commissions_paid_xaf || 0,
        pendingCommissionXaf: pendingCommission > 0 ? pendingCommission : 0,
        promoCode: agent.promo_code || "",
      },
      gamification,
      referralLinks,
      teamMembers,
      leads: leads && leads.length > 0 ? leads : [],
      abandonedCarts: abandoned || [],
    });
  } catch (err) {
    console.error("[Commercial Dashboard GET Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors du chargement du cockpit commercial" },
      { status: 500 }
    );
  }
}

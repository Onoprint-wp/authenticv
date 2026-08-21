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

    // Default fallback agent for presentation / demo if not logged in or during initial setup
    if (!agent) {
      agent = {
        id: "comm-1",
        full_name: user?.user_metadata?.full_name || "Christian Bekono",
        email: user?.email || "commercial.douala@authenticv.app",
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
      };
    }

    const countryCode = agent.assigned_country || "CM";

    // 1. Fetch Assigned Leads for this agent
    const { data: leads } = await admin
      .from("crm_leads")
      .select("*")
      .or(`assigned_agent_id.eq.${agent.id},country_code.eq.${countryCode}`)
      .order("updated_at", { ascending: false });

    // 2. Fetch Regional Abandoned Carts for WhatsApp Outreach
    const { data: abandoned } = await admin
      .from("resumes")
      .select("id, user_id, title, updated_at, contact_info")
      .order("updated_at", { ascending: false })
      .limit(10);

    const pendingCommission = (agent.total_commissions_earned_xaf || 0) - (agent.total_commissions_paid_xaf || 0);
    const targetProgressPercent = agent.monthly_target_xaf
      ? Math.min(100, Math.round(((agent.total_sales_xaf || 0) / agent.monthly_target_xaf) * 100))
      : 64;

    return NextResponse.json({
      success: true,
      agent,
      metrics: {
        totalSalesXaf: agent.total_sales_xaf || 320000,
        monthlyTargetXaf: agent.monthly_target_xaf || 500000,
        targetProgressPercent,
        totalCommissionsEarnedXaf: agent.total_commissions_earned_xaf || 32000,
        totalCommissionsPaidXaf: agent.total_commissions_paid_xaf || 20000,
        pendingCommissionXaf: pendingCommission > 0 ? pendingCommission : 12000,
        promoCode: agent.promo_code || "CHRISTIAN10",
      },
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

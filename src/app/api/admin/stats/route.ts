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

    // Use admin client for aggregated analytics
    const admin = createAdminClient();

    // 1. Resumes stats
    const { count: totalResumes } = await admin
      .from("resumes")
      .select("*", { count: "exact", head: true });

    // 2. Subscriptions stats
    const { data: subs } = await admin
      .from("user_subscriptions")
      .select("status, plan_name, single_credits, created_at, updated_at");

    const totalSubs = subs?.length ?? 0;
    const activeProSubs = subs?.filter((s) => s.status === "active").length ?? 0;
    const totalSingleCredits = subs?.reduce((acc, s) => acc + (s.single_credits ?? 0), 0) ?? 0;

    // 3. Estimate Revenue
    // Single payments (1 000 F), Monthly (5 000 F), Annual (18 000 F)
    let estimatedRevenueXaf = 0;
    let b2cSingleRevenue = 0;
    let b2cMonthlyRevenue = 0;
    let b2cAnnualRevenue = 0;

    subs?.forEach((s) => {
      if (s.plan_name === "pro_annual") {
        estimatedRevenueXaf += 18000;
        b2cAnnualRevenue += 18000;
      } else if (s.plan_name === "pro" || (s.status === "active" && s.plan_name !== "pro_referral")) {
        estimatedRevenueXaf += 5000;
        b2cMonthlyRevenue += 5000;
      }
      if (s.single_credits && s.single_credits > 0) {
        estimatedRevenueXaf += s.single_credits * 1000;
        b2cSingleRevenue += s.single_credits * 1000;
      }
    });

    // 4. Companies & B2B
    const { data: companies } = await admin
      .from("companies")
      .select("id, company_name, credits_balance, plan, created_at");

    const totalCompanies = companies?.length ?? 0;
    let b2bRevenue = 0;
    companies?.forEach((c) => {
      if (c.plan === "monthly_pro") {
        b2bRevenue += 75000;
      } else if (c.credits_balance && c.credits_balance > 0) {
        b2bRevenue += c.credits_balance * 4000;
      }
    });
    estimatedRevenueXaf += b2bRevenue;

    // 5. Unlocked contacts
    const { count: totalUnlockedContacts } = await admin
      .from("unlocked_contacts")
      .select("*", { count: "exact", head: true });

    // 6. Referrals
    const { data: referrals } = await admin
      .from("referrals")
      .select("status, created_at");

    const totalReferrals = referrals?.length ?? 0;
    const rewardedReferrals = referrals?.filter((r) => r.status === "rewarded").length ?? 0;

    // 7. Campus Partners
    const { count: totalCampusPartners } = await admin
      .from("campus_partners")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      success: true,
      metrics: {
        financial: {
          totalRevenueXaf: estimatedRevenueXaf,
          breakdown: {
            b2cSingle: b2cSingleRevenue,
            b2cMonthly: b2cMonthlyRevenue,
            b2cAnnual: b2cAnnualRevenue,
            b2bRecruiter: b2bRevenue,
          },
        },
        usage: {
          totalResumes: totalResumes ?? 0,
          totalUsers: totalSubs,
          activeProUsers: activeProSubs,
          totalSingleCredits,
        },
        b2b: {
          totalCompanies,
          totalUnlockedContacts: totalUnlockedContacts ?? 0,
        },
        growth: {
          totalReferrals,
          rewardedReferrals,
          totalCampusPartners: totalCampusPartners ?? 0,
        },
      },
    });
  } catch (err) {
    console.error("[Admin Stats API Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques admin" },
      { status: 500 }
    );
  }
}

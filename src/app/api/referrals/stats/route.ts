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
      return NextResponse.json({ totalReferrals: 0, rewardedCount: 0 });
    }

    const admin = createAdminClient();
    const { data: referrals } = await admin
      .from("referrals")
      .select("id, status")
      .eq("referrer_id", user.id);

    const totalReferrals = referrals?.length ?? 0;
    const rewardedCount = referrals?.filter((r) => r.status === "rewarded").length ?? 0;

    return NextResponse.json({
      totalReferrals,
      rewardedCount,
    });
  } catch (err) {
    console.error("[Referrals Stats API Error]:", err);
    return NextResponse.json({ totalReferrals: 0, rewardedCount: 0 });
  }
}

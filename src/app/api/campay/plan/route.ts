import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan, getMonthlyMessageCount, FREE_MONTHLY_MESSAGES } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/campay/plan
 * Returns the user's current plan info (plan type, message count, limits).
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [plan, messageCount] = await Promise.all([
    getUserPlan(user.id),
    getMonthlyMessageCount(user.id),
  ]);

  return NextResponse.json({
    plan,
    messageCount,
    messageLimit: FREE_MONTHLY_MESSAGES,
    messagesRemaining: plan === "pro" ? null : Math.max(0, FREE_MONTHLY_MESSAGES - messageCount),
  });
}

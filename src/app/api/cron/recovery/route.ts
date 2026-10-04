import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { EmailService } from "@/services/email.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // Allow dev or direct calls if no secret set
  return auth === `Bearer ${cronSecret}`;
}

/**
 * GET /api/cron/recovery
 * Automated daily cron job:
 * Detects candidates whose CV was created > 24 hours ago without a paid export,
 * and sends an automated recovery email with discount code BOOST20.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 3600_000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600_000).toISOString();

    // 1. Fetch resumes created or updated > 24h ago
    const { data: resumes, error: resumeErr } = await admin
      .from("resumes")
      .select("id, user_id, title, content, created_at, updated_at")
      .lt("updated_at", oneDayAgo)
      .order("updated_at", { ascending: false })
      .limit(50);

    if (resumeErr) throw resumeErr;

    // 2. Fetch active subscriptions to exclude paying users
    const { data: activeSubs } = await admin
      .from("user_subscriptions")
      .select("user_id, status, single_credits");

    const payingUserIds = new Set(
      (activeSubs || [])
        .filter((s) => s.status === "active" || (s.single_credits && s.single_credits > 0))
        .map((s) => s.user_id)
    );

    let sentCount = 0;
    const errors: string[] = [];

    for (const r of resumes || []) {
      if (payingUserIds.has(r.user_id)) continue;

      const content = (r.content as Record<string, unknown>) || {};
      const personalInfo = (content.personalInfo as Record<string, string>) || {};
      const email = personalInfo.email;
      if (!email || email.includes("authenticv.playwright.test") || email.includes("example.com")) {
        continue;
      }

      const candidateName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || "Candidat";
      const jobTitle = personalInfo.title || r.title || "Mon CV Professionnel";

      const res = await EmailService.sendRecoveryEmail({
        to: email,
        candidateName,
        jobTitle,
        discountCode: "BOOST20",
        discountPercent: 20,
      });

      if (res.success) {
        sentCount++;
      } else if (res.error) {
        errors.push(`${email}: ${res.error}`);
      }
    }

    return NextResponse.json({
      success: true,
      sentRecoveryEmails: sentCount,
      totalEvaluated: resumes?.length || 0,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cron Recovery Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la relance automatique" },
      { status: 500 }
    );
  }
}

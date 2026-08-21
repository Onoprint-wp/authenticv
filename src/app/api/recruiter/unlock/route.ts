import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/recruiter/unlock
 * Body: { resumeId: string }
 *
 * Checks recruiter's credit balance or plan, unlocks candidate contact details,
 * and records transaction in unlocked_contacts table.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await req.json().catch(() => ({}));

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
    }

    // 1. Get or create recruiter company record
    let { data: company } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!company) {
      const { data: newCompany, error: createError } = await supabase
        .from("companies")
        .insert({
          user_id: user.id,
          company_name: user.user_metadata?.company_name || user.email?.split("@")[0] || "Entreprise",
          email: user.email ?? "",
          credits_balance: 0,
          plan: "pay_as_you_go",
        })
        .select()
        .single();

      if (createError) throw createError;
      company = newCompany;
    }

    // 2. Check if this candidate is already unlocked by this company
    const { data: existingUnlock } = await supabase
      .from("unlocked_contacts")
      .select("*")
      .eq("company_id", company.id)
      .eq("resume_id", resumeId)
      .maybeSingle();

    const isAlreadyUnlocked = !!existingUnlock;

    // 3. If not already unlocked, verify credits or Pro plan
    if (!isAlreadyUnlocked) {
      const hasProPlan = company.plan === "monthly_pro" || company.plan === "corporate";
      const credits = company.credits_balance ?? 0;

      if (!hasProPlan && credits <= 0) {
        return NextResponse.json(
          {
            error: "insufficient_credits",
            message: "Solde de crédits insuffisant. Veuillez recharger votre compte recruteur pour débloquer ce contact.",
            credits_balance: credits,
          },
          { status: 402 }
        );
      }

      // Deduct credit if not on monthly pro
      if (!hasProPlan) {
        await supabase
          .from("companies")
          .update({ credits_balance: credits - 1 })
          .eq("id", company.id);
      }

      // Record unlock in unlocked_contacts
      await supabase.from("unlocked_contacts").insert({
        company_id: company.id,
        resume_id: resumeId,
      });
    }

    // 4. Fetch candidate resume personal info
    const { data: resume } = await supabase
      .from("resumes")
      .select("content")
      .eq("id", resumeId)
      .maybeSingle();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const personalInfo = (resume?.content as any)?.personalInfo ?? {};

    const contact = {
      name: `${personalInfo.firstName ?? "Jean-Paul"} ${personalInfo.lastName ?? "MBOUMI"}`.trim(),
      phone: personalInfo.phone || "+237 699 00 11 22",
      email: personalInfo.email || "candidat@authenticv.app",
      photoUrl: personalInfo.photoUrl || undefined,
    };

    // Remaining credits
    const { data: updatedCompany } = await supabase
      .from("companies")
      .select("credits_balance, plan")
      .eq("id", company.id)
      .single();

    return NextResponse.json({
      success: true,
      contact,
      credits_balance: updatedCompany?.credits_balance ?? 0,
      plan: updatedCompany?.plan ?? "pay_as_you_go",
    });
  } catch (err) {
    console.error("[Recruiter Unlock Error]:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

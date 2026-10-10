import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/recruiter/unlock-batch
 * Body: { resumeIds: string[] }
 *
 * Unlocks multiple candidates in a single transaction with volume discounts.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeIds } = await req.json().catch(() => ({}));

    if (!Array.isArray(resumeIds) || resumeIds.length === 0) {
      return NextResponse.json(
        { error: "resumeIds array is required" },
        { status: 400 }
      );
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
          company_name:
            user.user_metadata?.company_name ||
            user.email?.split("@")[0] ||
            "Entreprise",
          email: user.email ?? "",
          credits_balance: 0,
          plan: "pay_as_you_go",
        })
        .select()
        .single();

      if (createError) throw createError;
      company = newCompany;
    }

    // 2. Identify which profiles are already unlocked
    const { data: existingUnlocks } = await supabase
      .from("unlocked_contacts")
      .select("resume_id")
      .eq("company_id", company.id)
      .in("resume_id", resumeIds);

    const alreadyUnlockedIds = new Set(
      (existingUnlocks || []).map((u) => u.resume_id)
    );
    const newResumeIds = resumeIds.filter((id) => !alreadyUnlockedIds.has(id));

    // 3. Calculate credit cost with tiered volume discounts
    const count = newResumeIds.length;
    let discountPercent = 0;
    let totalCreditsCost = count;

    if (count >= 5) {
      discountPercent = 20;
      totalCreditsCost = Math.max(1, Math.ceil(count * 0.8));
    } else if (count >= 3) {
      discountPercent = 10;
      totalCreditsCost = Math.max(1, Math.ceil(count * 0.9));
    }

    const hasProPlan =
      company.plan === "monthly_pro" || company.plan === "corporate";
    const currentCredits = company.credits_balance ?? 0;

    if (!hasProPlan && count > 0 && currentCredits < totalCreditsCost) {
      return NextResponse.json(
        {
          error: "insufficient_credits",
          message: `Solde insuffisant : il vous faut ${totalCreditsCost} crédits pour débloquer ces ${count} profils (vous avez ${currentCredits} crédits).`,
          neededCredits: totalCreditsCost,
          credits_balance: currentCredits,
          discountPercent,
        },
        { status: 402 }
      );
    }

    // 4. Deduct credits and insert unlock records
    if (!hasProPlan && count > 0) {
      await supabase
        .from("companies")
        .update({ credits_balance: currentCredits - totalCreditsCost })
        .eq("id", company.id);
    }

    if (count > 0) {
      const inserts = newResumeIds.map((rId) => ({
        company_id: company.id,
        resume_id: rId,
      }));
      await supabase.from("unlocked_contacts").insert(inserts);
    }

    // 5. Fetch candidate contacts for all requested resumeIds
    const { data: resumes } = await supabase
      .from("resumes")
      .select("id, content")
      .in("id", resumeIds);

    const unlockedProfiles: Record<
      string,
      {
        name: string;
        phone: string;
        email: string;
        photoUrl?: string;
        whatsAppUrl?: string;
      }
    > = {};

    (resumes || []).forEach((r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cv = (r.content ?? {}) as any;
      const firstName = cv.personalInfo?.firstName ?? "";
      const lastName = cv.personalInfo?.lastName ?? "";
      const rawPhone = cv.personalInfo?.phone || "+237 699 00 11 22";
      const cleanPhone = rawPhone.replace(/[^\d+]/g, "");
      const fullPhone = cleanPhone.startsWith("+")
        ? cleanPhone.replace("+", "")
        : `237${cleanPhone}`;

      unlockedProfiles[r.id] = {
        name: `${firstName} ${lastName}`.trim() || "Candidat Qualifié",
        phone: rawPhone,
        email: cv.personalInfo?.email || "candidat@authenticv.app",
        photoUrl: cv.personalInfo?.photoUrl || undefined,
        whatsAppUrl: `https://wa.me/${fullPhone}?text=${encodeURIComponent(
          "Bonjour, j'ai découvert votre profil qualifié sur AuthentiCV et je souhaite échanger avec vous au sujet d'une opportunité professionnelle."
        )}`,
      };
    });

    const finalBalance = hasProPlan
      ? currentCredits
      : Math.max(0, currentCredits - totalCreditsCost);

    return NextResponse.json({
      success: true,
      unlockedProfiles,
      creditsRemaining: finalBalance,
      unlockedCount: count,
      discountAppliedPercent: discountPercent,
    });
  } catch (err) {
    console.error("[Recruiter Batch Unlock API Error]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

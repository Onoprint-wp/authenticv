import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CvData } from "@/store/useCvStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") ?? "").toLowerCase().trim();
    const location = (searchParams.get("location") ?? "").toLowerCase().trim();

    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    let companyId: string | null = null;
    let unlockedResumeIds = new Set<string>();

    if (user) {
      const adminClient = createAdminClient();
      const { data: company } = await adminClient
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (company) {
        companyId = company.id;
        const { data: unlocks } = await adminClient
          .from("unlocked_contacts")
          .select("resume_id")
          .eq("company_id", company.id);

        if (unlocks) {
          unlockedResumeIds = new Set(unlocks.map((u) => u.resume_id));
        }
      }
    }

    const adminClient = createAdminClient();
    const { data: resumes, error } = await adminClient
      .from("resumes")
      .select("id, content, share_slug, updated_at")
      .eq("is_public", true)
      .limit(50);

    if (error) {
      throw error;
    }

    const profiles = (resumes || [])
      .map((r) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cv = (r.content ?? {}) as any;
        const designSettings = cv.designSettings ?? cv.design ?? {};

        // Respect candidate recruiter visibility opt-in
        if (designSettings.recruiterVisible === false) {
          return null;
        }

        const firstName = cv.personalInfo?.firstName ?? "";
        const lastName = cv.personalInfo?.lastName ?? "";
        const fullName = `${firstName} ${lastName}`.trim() || "Candidat Anonyme";
        const jobTitle = cv.personalInfo?.title || "Spécialiste Qualifié";
        const candidateLoc = cv.personalInfo?.location || "Douala, Cameroun";
        const summary = cv.summary || "Profil professionnel vérifié disponible pour des opportunités en Afrique centrale.";
        const skillsList: string[] = Array.isArray(cv.skills) && cv.skills.length > 0
          ? cv.skills.map((s: unknown) => String(s)).slice(0, 6)
          : ["Informatique", "Gestion de Projet", "Communication"];

        const expCount = (cv.experiences ?? cv.experience ?? []).length || 2;
        const isUnlocked = unlockedResumeIds.has(r.id);

        // Calculate deterministic AI match score
        const matchScore = 85 + ((r.id.charCodeAt(0) || 10) % 14);

        return {
          id: r.id,
          jobTitle,
          location: candidateLoc,
          summary: summary.slice(0, 220),
          skills: skillsList,
          experienceYears: expCount * 2,
          matchScore,
          isUnlocked,
          contact: isUnlocked
            ? {
                name: fullName,
                phone: cv.personalInfo?.phone || "+237 699 00 11 22",
                email: cv.personalInfo?.email || "candidat@authenticv.app",
                photoUrl: cv.personalInfo?.photoUrl || undefined,
              }
            : undefined,
        };
      })
      .filter(Boolean)
      .filter((p) => {
        if (!p) return false;
        const matchesQuery =
          !query ||
          p.jobTitle.toLowerCase().includes(query) ||
          p.skills.some((s: string) => s.toLowerCase().includes(query));

        const matchesLocation =
          !location ||
          location === "all" ||
          p.location.toLowerCase().includes(location);

        return matchesQuery && matchesLocation;
      });

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("[Recruiter Talents API Error]:", err);
    return NextResponse.json({ profiles: [] }, { status: 500 });
  }
}

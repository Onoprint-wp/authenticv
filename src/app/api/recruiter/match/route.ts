import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { RecruiterMatchingService } from "@/services/recruiter.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { jobTitle, requiredSkills, location, minYearsExperience, limit } = body;

    if (!jobTitle && (!requiredSkills || requiredSkills.length === 0)) {
      return NextResponse.json(
        { error: "Veuillez fournir au moins un titre de poste ou des compétences requises" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const candidates = await RecruiterMatchingService.matchCandidates(
      admin,
      {
        jobTitle: String(jobTitle || ""),
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
        location: location ? String(location) : undefined,
        minYearsExperience: minYearsExperience ? Number(minYearsExperience) : undefined,
      },
      limit ? Number(limit) : 10
    );

    return NextResponse.json({
      success: true,
      count: candidates.length,
      candidates,
    });
  } catch (err) {
    console.error("[API recruiter/match Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur interne de matching" },
      { status: 500 }
    );
  }
}

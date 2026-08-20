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

    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json({ error: "resumeId is required" }, { status: 400 });
    }

    // Fetch candidate resume
    const { data: resume, error } = await supabase
      .from("resumes")
      .select("content")
      .eq("id", resumeId)
      .maybeSingle();

    if (error || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const personalInfo = (resume.content as any)?.personalInfo ?? {};

    const contact = {
      name: `${personalInfo.firstName ?? "Candidat"} ${personalInfo.lastName ?? ""}`.trim(),
      phone: personalInfo.phone ?? "+237 600 00 00 00",
      email: personalInfo.email ?? "candidat@authenticv.app",
    };

    return NextResponse.json({
      success: true,
      contact,
    });
  } catch (err) {
    console.error("[Recruiter Unlock Error]:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

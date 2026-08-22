import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ResumeService } from "@/services/resume.service";
import { EmailService } from "@/services/email.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { pdfBase64, shareUrl } = body;

    const resume = await ResumeService.getLatestResume(supabase, user.id);
    if (!resume) {
      return NextResponse.json({ error: "Aucun CV trouvé pour cet utilisateur" }, { status: 404 });
    }

    const candidateName = `${resume.content.personalInfo.firstName} ${resume.content.personalInfo.lastName}`.trim() || "Candidat";
    const cvTitle = resume.content.documentTitle || resume.title || "Mon CV Professionnel";

    const result = await EmailService.sendCandidateCvEmail({
      to: user.email,
      candidateName,
      cvTitle,
      pdfBase64,
      shareUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Erreur lors de l'envoi de l'email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Votre CV a été envoyé avec succès à ${user.email} !`,
    });
  } catch (err) {
    console.error("[API send-email error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur interne" },
      { status: 500 }
    );
  }
}

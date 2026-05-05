import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Récupérer le résumé pour avoir l'ID et le score actuel
  const { data: resume } = await supabase
    .from("resumes")
    .select("id")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [atsHistory, totalViews, lettersGenerated, lastScore] = await Promise.all([
    // 30 derniers points du score ATS
    supabase
      .from("ats_score_history")
      .select("score, recorded_at")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: true })
      .limit(30)
      .then(({ data }) => data ?? []),

    // Nombre total de vues du CV partagé
    resume
      ? supabase
          .from("cv_views")
          .select("*", { count: "exact", head: true })
          .eq("resume_id", resume.id)
          .then(({ count }) => count ?? 0)
      : Promise.resolve(0),

    // Nombre de lettres générées
    supabase
      .from("cover_letters")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => count ?? 0),

    // Score actuel (dernier enregistrement)
    supabase
      .from("ats_score_history")
      .select("score")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => data?.score ?? 0),
  ]);

  return NextResponse.json({
    atsHistory,
    totalViews,
    lettersGenerated,
    currentScore: lastScore,
  });
}

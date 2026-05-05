import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (plan !== "pro") {
    return NextResponse.json({ available: false });
  }

  // Lire le secteur et score actuels de l'utilisateur
  const { data: resume } = await supabase
    .from("resumes")
    .select("sector, ats_score")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!resume?.sector || resume.ats_score == null) {
    return NextResponse.json({ available: false });
  }

  // Lire les stats agrégées pour ce secteur
  const { data: bench } = await supabase
    .from("sector_benchmarks")
    .select("total, median_score, p75_score")
    .eq("sector", resume.sector)
    .maybeSingle();

  if (!bench || (bench.total as number) < 5) {
    return NextResponse.json({ available: false });
  }

  // Calculer le percentile : % d'utilisateurs avec un score <= au score courant
  const { count } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("sector", resume.sector)
    .lte("ats_score", resume.ats_score);

  const percentile = Math.round(((count ?? 0) / (bench.total as number)) * 100);

  return NextResponse.json({
    available: true,
    sector: resume.sector,
    userScore: resume.ats_score,
    medianScore: bench.median_score,
    p75Score: bench.p75_score,
    totalInSector: bench.total,
    percentile,
  });
}

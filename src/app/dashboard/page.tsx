import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, FileText, Eye, TrendingUp, Users } from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";

export const dynamic = "force-dynamic";

interface DashboardData {
  atsHistory: Array<{ score: number; recorded_at: string }>;
  totalViews: number;
  lettersGenerated: number;
  currentScore: number;
}

interface BenchmarkData {
  available: boolean;
  sector?: string;
  userScore?: number;
  medianScore?: number;
  p75Score?: number;
  totalInSector?: number;
  percentile?: number;
}

const SECTOR_LABELS: Record<string, string> = {
  tech: "Tech", design: "Design", marketing: "Marketing",
  finance: "Finance", rh: "RH", sante: "Santé",
  commercial: "Commercial", juridique: "Juridique",
  education: "Éducation", autre: "Votre secteur",
};

async function getDashboardData(userId: string): Promise<DashboardData> {
  // Appel interne direct via Supabase (évite un aller-retour HTTP)
  const supabase = await createClient();

  const { data: resume } = await supabase
    .from("resumes")
    .select("id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const [atsHistory, totalViews, lettersGenerated, lastScore] = await Promise.all([
    supabase
      .from("ats_score_history")
      .select("score, recorded_at")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: true })
      .limit(30)
      .then(({ data }) => data ?? []),

    resume
      ? supabase
          .from("cv_views")
          .select("*", { count: "exact", head: true })
          .eq("resume_id", resume.id)
          .then(({ count }) => count ?? 0)
      : Promise.resolve(0),

    supabase
      .from("cover_letters")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .then(({ count }) => count ?? 0),

    supabase
      .from("ats_score_history")
      .select("score")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => data?.score ?? 0),
  ]);

  return { atsHistory, totalViews: totalViews as number, lettersGenerated: lettersGenerated as number, currentScore: lastScore };
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function getNextAction(score: number, lettersGenerated: number) {
  if (score === 0) return "Commencez à remplir votre CV pour obtenir votre premier score ATS.";
  if (score < 40) return "Votre résumé professionnel et vos expériences sont incomplets — complétez-les pour progresser.";
  if (score < 70) return "Ajoutez des compétences techniques et des langues pour améliorer votre score.";
  if (lettersGenerated === 0) return "Votre CV est bien structuré ! Générez votre première lettre de motivation.";
  return "Votre CV est en excellente forme. Partagez votre lien et postulez !";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [data, benchmarkRaw] = await Promise.all([
    getDashboardData(user.id),
    supabase
      .from("resumes")
      .select("sector, ats_score")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(async ({ data: r }) => {
        if (!r?.sector || r.ats_score == null) return { available: false } as BenchmarkData;
        const { data: bench } = await supabase
          .from("sector_benchmarks")
          .select("total, median_score, p75_score")
          .eq("sector", r.sector)
          .maybeSingle();
        if (!bench || (bench.total as number) < 5) return { available: false } as BenchmarkData;
        const { count } = await supabase
          .from("resumes")
          .select("*", { count: "exact", head: true })
          .eq("sector", r.sector)
          .lte("ats_score", r.ats_score);
        return {
          available: true,
          sector: r.sector,
          userScore: r.ats_score,
          medianScore: bench.median_score as number,
          p75Score: bench.p75_score as number,
          totalInSector: bench.total as number,
          percentile: Math.round(((count ?? 0) / (bench.total as number)) * 100),
        } as BenchmarkData;
      }),
  ]);
  const benchmark = benchmarkRaw;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/builder"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au builder
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-sm text-slate-500 mt-1">Suivez la progression de votre CV et de vos candidatures.</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <TrendingUp className="w-3.5 h-3.5" />
              Score ATS
            </div>
            <p className={`text-3xl font-bold ${getScoreColor(data.currentScore)}`}>
              {data.currentScore > 0 ? `${data.currentScore}` : "—"}
              {data.currentScore > 0 && <span className="text-sm font-normal text-slate-500">/100</span>}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Eye className="w-3.5 h-3.5" />
              Vues du CV
            </div>
            <p className="text-3xl font-bold text-slate-200">
              {data.totalViews}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FileText className="w-3.5 h-3.5" />
              Lettres générées
            </div>
            <p className="text-3xl font-bold text-slate-200">
              {data.lettersGenerated}
            </p>
          </div>
        </div>

        {/* Graphe ATS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-300">Évolution du score ATS</h2>
          {data.atsHistory.length < 2 ? (
            <p className="text-xs text-slate-600 text-center py-8">
              Mettez à jour votre CV pour voir l&apos;évolution de votre score ici.
            </p>
          ) : (
            <DashboardCharts history={data.atsHistory} />
          )}
        </div>

        {/* Benchmark sectoriel */}
        {benchmark.available && benchmark.percentile !== undefined && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-300">
                Benchmark — {SECTOR_LABELS[benchmark.sector ?? "autre"]}
              </h2>
              <span className="text-xs text-slate-600">({benchmark.totalInSector} profils)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${benchmark.percentile}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-indigo-300 shrink-0">
                Top {100 - benchmark.percentile}%
              </span>
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Médiane : <strong className="text-slate-400">{benchmark.medianScore}/100</strong></span>
              <span>Top 25% : <strong className="text-slate-400">{benchmark.p75Score}/100</strong></span>
              <span>Votre score : <strong className="text-indigo-400">{benchmark.userScore}/100</strong></span>
            </div>
          </div>
        )}

        {/* Prochaine action */}
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 flex items-start gap-3">
          <span className="text-indigo-400 text-lg mt-0.5">💡</span>
          <div>
            <p className="text-xs font-semibold text-indigo-300 mb-1">Prochaine action recommandée</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {getNextAction(data.currentScore, data.lettersGenerated)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

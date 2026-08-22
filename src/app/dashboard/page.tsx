import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, FileText, Eye, TrendingUp, Users } from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";
import { ReferralBanner } from "@/components/ReferralBanner";

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
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#081426] text-[#111827] dark:text-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-[#D1D5DB] dark:border-slate-800 bg-white/90 dark:bg-[#0F223D]/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/builder"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#3667F0] hover:underline transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Studio CV
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-base text-[#0F223D] dark:text-white">Authenti<span className="text-[#3667F0]">CV</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#0F223D] dark:text-white">Tableau de bord</h1>
          <p className="text-sm font-sans text-[#6B7280] dark:text-[#AAB8CB] mt-1">Suivez la progression de votre CV, votre score ATS et vos candidatures.</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-5 flex flex-col gap-2 elevation-1 hover:elevation-2 transition-all">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] dark:text-[#AAB8CB] font-sans">
              <TrendingUp className="w-4 h-4 text-[#3667F0]" />
              Score ATS
            </div>
            <div>
              <p className={`text-3xl font-heading font-bold ${getScoreColor(data.currentScore)}`}>
                {data.currentScore > 0 ? `${data.currentScore}%` : "—"}
              </p>
              {data.currentScore > 0 && (
                <span className="text-xs font-semibold text-[#25C78A] bg-[#25C78A]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  {data.currentScore >= 80 ? "Excellent match" : data.currentScore >= 70 ? "Bon match" : "À optimiser"}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-5 flex flex-col gap-2 elevation-1 hover:elevation-2 transition-all">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] dark:text-[#AAB8CB] font-sans">
              <Eye className="w-4 h-4 text-[#32D3E1]" />
              Vues du CV
            </div>
            <p className="text-3xl font-heading font-bold text-[#111827] dark:text-white">
              {data.totalViews}
            </p>
            <span className="text-xs text-[#6B7280] dark:text-slate-400 font-sans">Consultations recruteurs</span>
          </div>

          <div className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-5 flex flex-col gap-2 elevation-1 hover:elevation-2 transition-all">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280] dark:text-[#AAB8CB] font-sans">
              <FileText className="w-4 h-4 text-[#7C5CFC]" />
              Lettres générées
            </div>
            <p className="text-3xl font-heading font-bold text-[#111827] dark:text-white">
              {data.lettersGenerated}
            </p>
            <span className="text-xs text-[#6B7280] dark:text-slate-400 font-sans">Assistées par Alex IA</span>
          </div>
        </div>

        {/* Graphe ATS */}
        <div className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-6 flex flex-col gap-4 elevation-1">
          <h2 className="text-lg font-heading font-semibold text-[#0F223D] dark:text-white">Évolution du score ATS</h2>
          {data.atsHistory.length < 2 ? (
            <p className="text-xs font-sans text-[#6B7280] dark:text-slate-400 text-center py-8">
              Mettez à jour votre CV pour voir l&apos;évolution de votre score ici.
            </p>
          ) : (
            <DashboardCharts history={data.atsHistory} />
          )}
        </div>

        {/* Benchmark sectoriel */}
        {benchmark.available && benchmark.percentile !== undefined && (
          <div className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-6 flex flex-col gap-3 elevation-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#3667F0]" />
              <h2 className="text-lg font-heading font-semibold text-[#0F223D] dark:text-white">
                Benchmark — {SECTOR_LABELS[benchmark.sector ?? "autre"]}
              </h2>
              <span className="text-xs text-[#6B7280] dark:text-slate-400 font-sans">({benchmark.totalInSector} profils)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-neutral-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-[#3667F0] rounded-full transition-all"
                  style={{ width: `${benchmark.percentile}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#3667F0] dark:text-[#5D82FF] shrink-0 font-sans">
                Top {100 - benchmark.percentile}%
              </span>
            </div>
            <div className="flex gap-4 text-xs text-[#6B7280] dark:text-slate-400 font-sans">
              <span>Médiane : <strong className="text-[#374151] dark:text-slate-200">{benchmark.medianScore}/100</strong></span>
              <span>Top 25% : <strong className="text-[#374151] dark:text-slate-200">{benchmark.p75Score}/100</strong></span>
              <span>Votre score : <strong className="text-[#3667F0] dark:text-[#5D82FF] font-bold">{benchmark.userScore}/100</strong></span>
            </div>
          </div>
        )}

        {/* Prochaine action */}
        <div className="bg-[#3667F0]/5 dark:bg-[#3667F0]/15 border border-[#3667F0]/30 rounded-[16px] p-5 flex items-start gap-3">
          <span className="text-[#3667F0] text-xl mt-0.5">💡</span>
          <div>
            <p className="text-xs font-semibold text-[#3667F0] dark:text-[#5D82FF] mb-1 font-sans">Prochaine action recommandée</p>
            <p className="text-sm text-[#374151] dark:text-slate-200 leading-relaxed font-sans">
              {getNextAction(data.currentScore, data.lettersGenerated)}
            </p>
          </div>
        </div>

        {/* Parrainage & Récompense Pro */}
        <ReferralBanner userId={user.id} />
      </main>
    </div>
  );
}

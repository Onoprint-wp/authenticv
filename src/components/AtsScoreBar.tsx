"use client";

import { useEffect, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import { computeAtsScore } from "@/lib/ats-score";

interface BenchmarkData {
  available: boolean;
  sector?: string;
  percentile?: number;
  totalInSector?: number;
}

const SECTOR_LABELS: Record<string, string> = {
  tech: "tech", design: "design", marketing: "marketing",
  finance: "finance", rh: "RH", sante: "santé",
  commercial: "commercial", juridique: "juridique",
  education: "éducation", autre: "votre secteur",
};

export function AtsScoreBar() {
  const cvData = useCvStore((s) => s.cvData);
  const [open, setOpen] = useState(false);
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null);
  const { score, suggestions } = computeAtsScore(cvData);
  const topSuggestion = suggestions[0]?.text ?? null;

  useEffect(() => {
    fetch("/api/benchmark")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setBenchmark(d))
      .catch(() => {});
  }, []);

  const getStatusLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Bon score";
    if (score >= 50) return "Moyen";
    return "À optimiser";
  };

  const statusText = getStatusLabel(score);

  const colorClass =
    score >= 70
      ? "text-[#1e9d6d] bg-[#25C78A]/10 border-[#25C78A]/40 dark:text-[#25C78A] dark:bg-[#25C78A]/20 dark:border-[#25C78A]/50"
      : score >= 40
        ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
        : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800";

  const barColor =
    score >= 70 ? "bg-[#25C78A]" : score >= 40 ? "bg-amber-500" : "bg-red-500";

  const benchmarkLabel = benchmark?.available && benchmark.percentile !== undefined
    ? `Top ${100 - benchmark.percentile}% ${SECTOR_LABELS[benchmark.sector ?? "autre"] ?? "votre secteur"}`
    : null;

  return (
    <div
      className="relative hidden lg:flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] border text-xs font-semibold cursor-default select-none transition-all ${colorClass}`}
      >
        <span className="font-sans">Analyse ATS</span>
        <div className="w-14 h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="font-bold">{score}%</span>
        <span className="font-medium text-xs opacity-90">({statusText})</span>
        {benchmarkLabel && (
          <span className="text-neutral-500 font-normal hidden xl:inline">· {benchmarkLabel}</span>
        )}
      </div>

      {open && (topSuggestion || benchmarkLabel) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 bg-white dark:bg-[#0F223D] border border-[#D1D5DB] dark:border-slate-700 rounded-[12px] p-3.5 shadow-lg pointer-events-none">
          {benchmarkLabel && (
            <p className="text-xs text-[#3667F0] dark:text-[#5D82FF] font-semibold mb-2">{benchmarkLabel}</p>
          )}
          {topSuggestion && (
            <>
              <p className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-slate-400 font-medium mb-1">
                Amélioration prioritaire
              </p>
              <p className="text-xs text-neutral-700 dark:text-slate-200 leading-relaxed font-sans">{topSuggestion}</p>
            </>
          )}
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-[#0F223D] border-r border-b border-[#D1D5DB] dark:border-slate-700 rotate-45" />
        </div>
      )}
    </div>
  );
}

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

  const colorClass =
    score >= 70
      ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
      : score >= 40
        ? "text-amber-400 bg-amber-950/40 border-amber-800/50"
        : "text-red-400 bg-red-950/40 border-red-800/50";

  const barColor =
    score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";

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
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium cursor-default select-none ${colorClass}`}
      >
        <span>ATS</span>
        <div className="w-14 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span>{score}</span>
        {benchmarkLabel && (
          <span className="text-slate-500 font-normal hidden xl:inline">· {benchmarkLabel}</span>
        )}
      </div>

      {open && (topSuggestion || benchmarkLabel) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl pointer-events-none">
          {benchmarkLabel && (
            <p className="text-xs text-indigo-300 font-medium mb-2">{benchmarkLabel}</p>
          )}
          {topSuggestion && (
            <>
              <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">
                Amélioration prioritaire
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">{topSuggestion}</p>
            </>
          )}
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 border-r border-b border-slate-700 rotate-45" />
        </div>
      )}
    </div>
  );
}

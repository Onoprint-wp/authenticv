"use client";

import { useEffect, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import { computeAtsScore, generateAtsXrayReport } from "@/lib/ats-score";
import { ScanLine, X, CheckCircle2, AlertTriangle, XCircle, Terminal } from "lucide-react";

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
  const [xrayOpen, setXrayOpen] = useState(false);
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null);
  const { score, suggestions } = computeAtsScore(cvData);
  const topSuggestion = suggestions[0]?.text ?? null;

  useEffect(() => {
    fetch("/api/benchmark")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setBenchmark(d))
      .catch(() => {});
  }, []);

  const getStatusLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 70) return "Bon score";
    if (s >= 50) return "Moyen";
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

  const benchmarkLabel =
    benchmark?.available && benchmark.percentile !== undefined
      ? `Top ${100 - benchmark.percentile}% ${SECTOR_LABELS[benchmark.sector ?? "autre"] ?? "votre secteur"}`
      : null;

  const xray = xrayOpen ? generateAtsXrayReport(cvData) : null;

  return (
    <>
      <div
        className="relative hidden lg:flex items-center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setXrayOpen(true);
          }}
          title="Cliquer pour ouvrir la Radiographie ATS (vue robot recruteur)"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] border text-xs font-semibold cursor-pointer select-none transition-all hover:scale-[1.02] ${colorClass}`}
        >
          <ScanLine className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-sans">Radiographie ATS</span>
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
        </button>

        {open && !xrayOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-72 bg-white dark:bg-[#0F223D] border border-[#D1D5DB] dark:border-slate-700 rounded-[12px] p-3.5 shadow-xl pointer-events-none">
            {benchmarkLabel && (
              <p className="text-xs text-[#3667F0] dark:text-[#5D82FF] font-semibold mb-2">{benchmarkLabel}</p>
            )}
            {topSuggestion ? (
              <>
                <p className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-slate-400 font-medium mb-1">
                  Amélioration prioritaire
                </p>
                <p className="text-xs text-neutral-700 dark:text-slate-200 leading-relaxed font-sans mb-2">
                  {topSuggestion}
                </p>
              </>
            ) : (
              <p className="text-xs text-[#25C78A] font-semibold mb-2">
                Votre CV respecte tous les critères d&apos;extraction ATS.
              </p>
            )}
            <p className="text-[10px] font-bold text-[#3667F0] dark:text-[#32D3E1]">
              Cliquez pour voir le flux brut lu par les robots RH →
            </p>
          </div>
        )}
      </div>

      {/* Modal Radiographie ATS (ATS X-Ray) */}
      {xrayOpen && xray && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setXrayOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[88vh] overflow-hidden rounded-2xl bg-[#0F223D] border border-slate-700 text-slate-100 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#081426]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3667F0]/15 border border-[#3667F0]/40 flex items-center justify-center text-[#32D3E1]">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold font-heading text-white">
                      Radiographie ATS — Ce que lit le robot recruteur
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#25C78A]/15 text-[#25C78A] border border-[#25C78A]/30">
                      Score {xray.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulation d&apos;indexation temps réel (Workday, Taleo, Greenhouse, SAP SuccessFactors)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setXrayOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="grid md:grid-cols-12 gap-6 p-6 overflow-y-auto">
              {/* Left Column: 7 ATS Checks */}
              <div className="md:col-span-5 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Points de contrôle d&apos;indexation (7)
                </h3>
                {xray.checks.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#162B46] border border-slate-700/70 flex items-start gap-2.5"
                  >
                    {item.status === "pass" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#25C78A] flex-shrink-0 mt-0.5" />
                    ) : item.status === "warn" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white leading-snug">{item.label}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Raw Parser Stream */}
              <div className="md:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#32D3E1] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Flux texte extrait par le parseur RH
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {xray.keywordCount} mot(s)-clé(s) indexé(s)
                  </span>
                </div>
                <pre className="flex-1 bg-[#081426] border border-slate-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-emerald-300 overflow-x-auto whitespace-pre-wrap select-all max-h-[420px] overflow-y-auto">
                  {xray.rawStream}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


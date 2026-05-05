"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import {
  Sparkles, Download, RotateCcw, FileText, Loader2,
  AlertTriangle, History, Trash2, ChevronRight,
} from "lucide-react";

interface SavedLetter {
  id: string;
  job_offer: string;
  created_at: string;
}

interface Props {
  onUpgradeRequired: () => void;
}

export function CoverLetterPanel({ onUpgradeRequired }: Props) {
  const cvData = useCvStore((s) => s.cvData);
  const coverLetterText = useCvStore((s) => s.coverLetterText);
  const setCoverLetterText = useCvStore((s) => s.setCoverLetterText);

  const [jobOffer, setJobOffer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mismatchWarning, setMismatchWarning] = useState<{ score: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<SavedLetter[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/cover-letters");
      if (res.ok) setHistory(await res.json());
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (showHistory) fetchHistory();
  }, [showHistory, fetchHistory]);

  const handleGenerate = async (confirmed = false) => {
    if (!jobOffer.trim()) return;
    setIsGenerating(true);
    setError(null);
    setMismatchWarning(null);
    setCoverLetterText("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobOffer, confirmed }),
        signal: abortRef.current.signal,
      });

      if (res.status === 402) { onUpgradeRequired(); return; }

      const contentType = res.headers.get("Content-Type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.action === "mismatch_warning") {
          setMismatchWarning({ score: data.score });
          return;
        }
        throw new Error(data.error ?? "Erreur de génération");
      }

      if (!res.ok || !res.body) throw new Error("Erreur de génération");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setCoverLetterText(accumulated);
      }

      // Sauvegarder en DB après réception complète (fire-and-forget)
      if (accumulated.trim()) {
        void fetch("/api/cover-letters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobOffer, letterText: accumulated }),
        }).catch(() => {});
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Une erreur est survenue. Réessayez.");
        console.error(err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteLetter = async (id: string) => {
    await fetch(`/api/cover-letters?id=${id}`, { method: "DELETE" });
    setHistory((prev) => prev.filter((l) => l.id !== id));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("/api/export-letter-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterText: coverLetterText }),
      });
      if (res.status === 402) { onUpgradeRequired(); return; }
      if (!res.ok) throw new Error("Erreur export");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const firstName = cvData.personalInfo.firstName || "Lettre";
      const lastName = cvData.personalInfo.lastName || "";
      a.href = url;
      a.download = `Lettre_${firstName}_${lastName}.pdf`.replace(/\s+/g, "_");
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4 p-4 custom-scrollbar">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-slate-300">Lettre de motivation</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Alex génère une lettre personnalisée à partir de votre CV et de l&apos;offre ciblée.
          </p>
        </div>
        <button
          onClick={() => setShowHistory((v) => !v)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
            showHistory
              ? "border-indigo-600/50 text-indigo-300 bg-indigo-950/40"
              : "border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600"
          }`}
          title="Historique des lettres"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Historique</span>
        </button>
      </div>

      {/* Historique */}
      {showHistory && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Lettres générées</span>
            {loadingHistory && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
          </div>
          {history.length === 0 && !loadingHistory ? (
            <p className="text-xs text-slate-600 text-center py-4">Aucune lettre sauvegardée</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {history.map((letter) => (
                <li key={letter.id} className="flex items-center gap-2 px-3 py-2.5 hover:bg-slate-800/50 group">
                  <button
                    className="flex-1 text-left min-w-0"
                    onClick={() => {
                      setCoverLetterText(letter.job_offer);
                      setShowHistory(false);
                    }}
                  >
                    <p className="text-xs text-slate-300 truncate">
                      {letter.job_offer.slice(0, 60)}…
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(letter.created_at)}</p>
                  </button>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  <button
                    onClick={() => handleDeleteLetter(letter.id)}
                    className="text-slate-700 hover:text-red-400 transition-colors shrink-0 p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-400">Offre d&apos;emploi ciblée</label>
        <textarea
          value={jobOffer}
          onChange={(e) => setJobOffer(e.target.value)}
          placeholder="Collez ici le texte de l'offre d'emploi (titre, missions, profil recherché…)"
          rows={7}
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
        />
      </div>

      <button
        onClick={() => handleGenerate(false)}
        disabled={isGenerating || !jobOffer.trim()}
        className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all active:scale-95"
      >
        {isGenerating
          ? <><Loader2 className="w-4 h-4 animate-spin" />Génération en cours…</>
          : <><Sparkles className="w-4 h-4" />Générer la lettre</>}
      </button>

      {/* Avertissement de compatibilité */}
      {mismatchWarning && (
        <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-amber-300">Profil éloigné de cette offre</p>
              <p className="text-xs text-amber-400/80 leading-relaxed">
                Votre CV et cette offre semblent peu compatibles (score&nbsp;: {mismatchWarning.score}/100).
                La lettre générée devra s&apos;appuyer sur des compétences transférables et risque
                d&apos;être peu convaincante pour ce recruteur.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate(true)}
              className="flex-1 py-2 text-xs font-medium bg-amber-700/30 hover:bg-amber-700/50 text-amber-300 rounded-lg transition-colors"
            >
              Générer quand même
            </button>
            <button
              onClick={() => setMismatchWarning(null)}
              className="flex-1 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-400 text-center">{error}</p>}

      {coverLetterText && (
        <>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                Lettre générée
              </div>
              <button
                onClick={() => handleGenerate(!!coverLetterText)}
                disabled={isGenerating}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3 h-3" />
                Régénérer
              </button>
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {coverLetterText}
              {isGenerating && <span className="animate-pulse text-indigo-400">▊</span>}
            </pre>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading || isGenerating}
            className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all active:scale-95"
          >
            {isDownloading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Téléchargement…</>
              : <><Download className="w-4 h-4" />Télécharger PDF</>}
          </button>
        </>
      )}
    </div>
  );
}

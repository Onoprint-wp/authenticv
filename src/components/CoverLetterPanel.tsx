"use client";

import { useRef, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import { Sparkles, Download, RotateCcw, FileText, Loader2 } from "lucide-react";

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
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!jobOffer.trim()) return;
    setIsGenerating(true);
    setError(null);
    setCoverLetterText("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobOffer }),
        signal: abortRef.current.signal,
      });

      if (res.status === 402) { onUpgradeRequired(); return; }
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
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Une erreur est survenue. Réessayez.");
        console.error(err);
      }
    } finally {
      setIsGenerating(false);
    }
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

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4 p-4 custom-scrollbar">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium text-slate-300">Lettre de motivation</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Alex génère une lettre personnalisée à partir de votre CV et de l&apos;offre ciblée.
        </p>
      </div>

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
        onClick={handleGenerate}
        disabled={isGenerating || !jobOffer.trim()}
        className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all active:scale-95"
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Génération en cours…</>
        ) : (
          <><Sparkles className="w-4 h-4" />Générer la lettre</>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      {coverLetterText && (
        <>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                Lettre générée
              </div>
              <button
                onClick={handleGenerate}
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
            {isDownloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Téléchargement…</>
            ) : (
              <><Download className="w-4 h-4" />Télécharger PDF</>
            )}
          </button>
        </>
      )}
    </div>
  );
}

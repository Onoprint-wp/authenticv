"use client";

import { useState } from "react";
import {
  Briefcase,
  X,
  ChevronRight,
  Loader2,
  Zap,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  section: string;
  type: "add" | "rewrite" | "highlight";
  suggestion: string;
  impact: "high" | "medium" | "low";
  chatPrompt: string;
}

interface JobMatchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (chatPrompt: string) => void;
}

// ─── Helpers visuels ──────────────────────────────────────────────────────────

const impactConfig = {
  high: {
    label: "Impact élevé",
    badgeClass: "bg-red-950/60 text-red-300 border-red-800/40",
    dotClass: "bg-red-400",
    borderClass: "border-l-red-500",
  },
  medium: {
    label: "Impact moyen",
    badgeClass: "bg-orange-950/60 text-orange-300 border-orange-800/40",
    dotClass: "bg-orange-400",
    borderClass: "border-l-orange-500",
  },
  low: {
    label: "Impact faible",
    badgeClass: "bg-yellow-950/60 text-yellow-300 border-yellow-800/40",
    dotClass: "bg-yellow-400",
    borderClass: "border-l-yellow-500",
  },
};

const typeConfig = {
  add: { label: "À ajouter", icon: "+" },
  rewrite: { label: "À reformuler", icon: "✏️" },
  highlight: { label: "À valoriser", icon: "⭐" },
};

// ─── Composant principal ──────────────────────────────────────────────────────

export function JobMatchPanel({
  isOpen,
  onClose,
  onApplySuggestion,
}: JobMatchPanelProps) {
  const [jobText, setJobText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");
  const [appliedIndexes, setAppliedIndexes] = useState<Set<number>>(new Set());

  const handleAnalyze = async () => {
    if (!jobText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setError("");
    setSuggestions([]);

    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'analyse");
      setSuggestions(data.suggestions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = (suggestion: Suggestion, index: number) => {
    onApplySuggestion(suggestion.chatPrompt);
    setAppliedIndexes((prev) => new Set(prev).add(index));
    onClose();
  };

  const handleReset = () => {
    setJobText("");
    setSuggestions([]);
    setError("");
    setAppliedIndexes(new Set());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel slide-in depuis la droite */}
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-md z-50
          bg-slate-950 border-l border-slate-800 flex flex-col
          shadow-2xl shadow-black/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center border border-violet-500/30">
              <Briefcase className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Match Offre d&apos;Emploi
              </h2>
              <p className="text-xs text-slate-500">
                Optimise ton CV pour ce poste
              </p>
            </div>
          </div>
          <button
            id="close-job-match-btn"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Zone de saisie */}
          <div className="p-5 space-y-3">
            <label className="text-xs font-medium text-slate-400 block">
              Colle le texte de l&apos;offre d&apos;emploi
            </label>
            <textarea
              id="job-description-textarea"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Nous recherchons un développeur Frontend React avec 3 ans d'expérience..."
              rows={8}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3
                text-sm text-slate-300 placeholder-slate-600
                focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
                resize-none transition-all"
            />

            <div className="flex items-center gap-2">
              <button
                id="analyze-job-btn"
                onClick={handleAnalyze}
                disabled={!jobText.trim() || isAnalyzing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                  bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600
                  text-white text-sm font-medium rounded-xl transition-all duration-200
                  disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyser la compatibilité
                  </>
                )}
              </button>

              {(suggestions.length > 0 || error) && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-300
                    border border-slate-700 rounded-xl transition-colors hover:bg-slate-800"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mx-5 mb-4 p-3 bg-red-950/40 border border-red-800/40 rounded-xl">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Résultats */}
          {suggestions.length > 0 && (
            <div className="px-5 pb-6 space-y-3">
              <div className="flex items-center gap-2 py-2">
                <Lightbulb className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-300">
                  {suggestions.length} suggestion
                  {suggestions.length > 1 ? "s" : ""} prioritisée
                  {suggestions.length > 1 ? "s" : ""}
                </span>
              </div>

              {suggestions.map((s, i) => {
                const impact = impactConfig[s.impact];
                const type = typeConfig[s.type];
                const isApplied = appliedIndexes.has(i);

                return (
                  <div
                    key={i}
                    className={`
                      bg-slate-900 border border-slate-800 border-l-2 ${impact.borderClass}
                      rounded-xl p-4 space-y-3 transition-opacity
                      ${isApplied ? "opacity-50" : ""}
                    `}
                  >
                    {/* Meta badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-500 font-medium">
                        {s.section}
                      </span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">
                        {type.icon} {type.label}
                      </span>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded-full border font-medium ${impact.badgeClass}`}
                      >
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${impact.dotClass}`}
                        />
                        {impact.label}
                      </span>
                    </div>

                    {/* Suggestion */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {s.suggestion}
                    </p>

                    {/* Bouton Appliquer */}
                    <button
                      id={`apply-suggestion-${i}-btn`}
                      onClick={() => handleApply(s, i)}
                      disabled={isApplied}
                      className={`
                        w-full flex items-center justify-between gap-2 px-3 py-2
                        text-xs font-medium rounded-lg transition-all
                        ${
                          isApplied
                            ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                            : "bg-violet-950/50 hover:bg-violet-900/60 text-violet-300 border border-violet-800/40 hover:border-violet-600/60"
                        }
                      `}
                    >
                      <span className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                        {isApplied ? "Appliqué ✓" : "Envoyer à Alex"}
                      </span>
                      {!isApplied && (
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

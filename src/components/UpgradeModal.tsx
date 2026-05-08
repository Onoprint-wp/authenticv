"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, Zap, MessageSquare, Download, Briefcase, Mail } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "pdf" | "jobmatch" | "quota" | "letter" | "multi-cv";
}

const REASONS: Record<"pdf" | "jobmatch" | "quota" | "letter" | "multi-cv", string> = {
  pdf: "Pour télécharger votre CV en PDF, passez à AuthenticV Pro.",
  jobmatch: "Pour optimiser votre CV pour une offre d\u2019emploi, passez à AuthenticV Pro.",
  quota: "Vous avez atteint la limite de 20 messages gratuits ce mois-ci.",
  letter: "Pour générer une lettre de motivation personnalisée, passez à AuthenticV Pro.",
  "multi-cv": "Pour créer plusieurs CVs et les adapter à chaque candidature, passez à AuthenticV Pro.",
};

const PRO_FEATURES = [
  { icon: MessageSquare, label: "Messages Alex illimités" },
  { icon: Download, label: "Export PDF en un clic" },
  { icon: Briefcase, label: "Job Match — Optimisation pour offre" },
  { icon: Mail, label: "Lettre de motivation personnalisée par IA" },
  { icon: Sparkles, label: "Priorité sur les nouvelles fonctionnalités" },
];

export function UpgradeModal({ isOpen, onClose, reason = "pdf" }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campay/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-950/80 to-violet-950/60 border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/40">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">AuthenticV Pro</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{REASONS[reason]}</p>
          </div>

          {/* Features */}
          <div className="px-6 py-4 space-y-2.5">
            {PRO_FEATURES.map(({ icon: FeatureIcon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <FeatureIcon className="w-3 h-3 text-indigo-400" />
                </div>
                <span className="text-sm text-slate-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="px-6 pb-6 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">5 000 FCFA</span>
              <span className="text-sm text-slate-500">/mois · sans engagement</span>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold
                rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redirection…</>
              ) : (
                <><Zap className="w-4 h-4" /> Passer à Pro</>
              )}
            </button>
            <p className="text-center text-xs text-slate-600">
              Paiement sécurisé par Mobile Money (MTN / Orange) · Résiliable à tout moment
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

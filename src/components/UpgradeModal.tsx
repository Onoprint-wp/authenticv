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
  const [promoInput, setPromoInput] = useState("");
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    partnerName: string;
    discountPercent: number;
    discountedPrice: number;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setValidatingPromo(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: promoInput.trim(), tier: "monthly" }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedPromo(data);
        setPromoError(null);
      } else {
        setPromoError(data.error || "Code promo invalide");
        setAppliedPromo(null);
      }
    } catch {
      setPromoError("Erreur lors de la validation");
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "monthly",
          promoCode: appliedPromo?.code || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentPrice = appliedPromo ? appliedPromo.discountedPrice : 5000;

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

          {/* Promo Code Input */}
          <div className="px-6 py-2 border-t border-slate-800/80">
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-700/50 rounded-xl px-3 py-2 text-xs text-emerald-300">
                <span>✓ {appliedPromo.partnerName}</span>
                <button
                  onClick={() => {
                    setAppliedPromo(null);
                    setPromoInput("");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Code Promo / Université (ex: UY1)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={validatingPromo || !promoInput.trim()}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    {validatingPromo ? "..." : "Appliquer"}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-400">{promoError}</p>
                )}
              </div>
            )}
          </div>

          {/* Price + CTA */}
          <div className="px-6 pb-6 pt-2 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {currentPrice.toLocaleString("fr-FR")} FCFA
              </span>
              {appliedPromo && (
                <span className="text-sm line-through text-slate-500">5 000 FCFA</span>
              )}
              <span className="text-xs text-slate-500">/mois</span>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500
                disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold
                rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redirection…</>
              ) : (
                <><Zap className="w-4 h-4" /> Passer à Pro</>
              )}
            </button>
            <p className="text-center text-xs text-slate-600">
              Paiement sécurisé par Campay (MTN MoMo, Orange Money, Cartes) · Résiliable en 1 clic
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

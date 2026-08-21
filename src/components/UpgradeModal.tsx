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
  const [selectedTier, setSelectedTier] = useState<"single" | "monthly" | "annual">("monthly");
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

  const TIER_BASE_PRICES = {
    single: 1000,
    monthly: 5000,
    annual: 18000,
  };

  const getCalculatedPrice = (tier: "single" | "monthly" | "annual") => {
    const base = TIER_BASE_PRICES[tier];
    if (!appliedPromo) return base;
    return Math.max(100, Math.round(base * (1 - appliedPromo.discountPercent / 100)));
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setValidatingPromo(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode: promoInput.trim(), tier: selectedTier }),
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
          tier: selectedTier,
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

  const currentPrice = getCalculatedPrice(selectedTier);
  const originalPrice = TIER_BASE_PRICES[selectedTier];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-5 pb-4 bg-gradient-to-br from-indigo-950/80 to-violet-950/60 border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/40">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AuthenticV — Choisissez votre offre</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{REASONS[reason]}</p>
          </div>

          {/* Tier Selection Grid */}
          <div className="px-5 pt-4 pb-2 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sélectionnez une formule :</p>
            <div className="grid grid-cols-3 gap-2">

              {/* Pass 24h */}
              <button
                type="button"
                onClick={() => setSelectedTier("single")}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  selectedTier === "single"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-md shadow-indigo-950"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                <span className="text-[10px] font-semibold text-indigo-400 uppercase">Pass 24h</span>
                <span className="text-sm font-bold text-white mt-0.5">1 000 FCFA</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight">PDF sans filigrane illimité 24h</span>
              </button>

              {/* Pro Mensuel (Best value) */}
              <button
                type="button"
                onClick={() => setSelectedTier("monthly")}
                className={`relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  selectedTier === "monthly"
                    ? "bg-indigo-900/40 border-indigo-500 ring-2 ring-indigo-500 text-white shadow-lg shadow-indigo-950"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                <span className="absolute -top-2 right-2 bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                  Recommandé
                </span>
                <span className="text-[10px] font-semibold text-indigo-300 uppercase">Pro Mensuel</span>
                <span className="text-sm font-bold text-white mt-0.5">5 000 FCFA</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight">Messages IA + PDF + JobMatch</span>
              </button>

              {/* Pass Annuel */}
              <button
                type="button"
                onClick={() => setSelectedTier("annual")}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  selectedTier === "annual"
                    ? "bg-violet-950/60 border-violet-500 ring-1 ring-violet-500 text-white shadow-md shadow-violet-950"
                    : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                <span className="text-[10px] font-semibold text-violet-400 uppercase">Pass 1 An</span>
                <span className="text-sm font-bold text-white mt-0.5">18 000 FCFA</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight">Illimité toute l&apos;année (-70%)</span>
              </button>

            </div>
          </div>

          {/* Features Checklist */}
          <div className="px-5 py-3 space-y-2 border-t border-slate-800/60 mt-2">
            {PRO_FEATURES.map(({ icon: FeatureIcon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <FeatureIcon className="w-2.5 h-2.5 text-indigo-400" />
                </div>
                <span className="text-xs text-slate-300">{label}</span>
              </div>
            ))}
          </div>

          {/* Promo Code Input */}
          <div className="px-5 py-2 border-t border-slate-800/80">
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-700/50 rounded-xl px-3 py-1.5 text-xs text-emerald-300">
                <span>✓ Code {appliedPromo.code} (-{appliedPromo.discountPercent}%)</span>
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
              <div className="space-y-1">
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
          <div className="px-5 pb-5 pt-2 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {currentPrice.toLocaleString("fr-FR")} FCFA
              </span>
              {appliedPromo && (
                <span className="text-xs line-through text-slate-500">
                  {originalPrice.toLocaleString("fr-FR")} FCFA
                </span>
              )}
              <span className="text-xs text-slate-500">
                {selectedTier === "single" ? " / 24 heures" : selectedTier === "monthly" ? " / mois" : " / an"}
              </span>
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
                <><Zap className="w-4 h-4" /> {selectedTier === "single" ? "Débloquer le Pass 24h" : selectedTier === "monthly" ? "Souscrire au Pass Mensuel" : "Activer le Pass Annuel"}</>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Paiement sécurisé Campay (MoMo / OM / Cartes)</span>
              <a href="/recruiter" className="text-indigo-400 hover:underline">Espace Recruteurs</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

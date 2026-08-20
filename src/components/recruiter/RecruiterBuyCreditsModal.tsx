"use client";

import { useState } from "react";
import { X, Zap, CheckCircle, Loader2, CreditCard, Sparkles, Building2 } from "lucide-react";
import { RECRUITER_PRICES, type RecruiterPackType } from "@/lib/recruiter-plans";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isEn?: boolean;
}

export function RecruiterBuyCreditsModal({ isOpen, onClose, isEn = false }: Props) {
  const [selectedPack, setSelectedPack] = useState<RecruiterPackType>("pack5");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/campay/recruiter-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack: selectedPack,
          companyName: companyName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Impossible d'initialiser le paiement");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de paiement");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-amber-950/40 border-b border-slate-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-base font-bold text-white">
                {isEn ? "Recruiter Credits & Pass RH" : "Recharge Crédits & Pass RH Recruteur"}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {isEn
                ? "Unlock direct contact info (Phone, Email, Full Name) of verified candidates in CEMAC."
                : "Débloquez les coordonnées directes (téléphone, email, nom complet) des candidats vérifiés en zone CEMAC."}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isEn ? "Company Name (optional)" : "Nom de votre entreprise (optionnel)"}</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={isEn ? "e.g. SABC, MTN, TotalEnergies, Startup SARL" : "ex: SABC, MTN, TotalEnergies, Startup SARL"}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Pack Options */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {/* Single */}
              <div
                onClick={() => setSelectedPack("single")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPack === "single"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-950"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">1 Déblocage</span>
                  <span className="text-xs text-amber-400 font-bold">5 000 F</span>
                </div>
                <p className="text-[11px] text-slate-400">Idéal pour un besoin de recrutement ponctuel.</p>
              </div>

              {/* Pack 5 */}
              <div
                onClick={() => setSelectedPack("pack5")}
                className={`relative p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPack === "pack5"
                    ? "bg-indigo-950/60 border-amber-500 ring-1 ring-amber-500 shadow-md shadow-amber-950"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  -20% Économie
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">Pack 5 Contacts</span>
                  <span className="text-xs text-amber-400 font-bold">20 000 F</span>
                </div>
                <p className="text-[11px] text-slate-400">4 000 F / contact au lieu de 5 000 F.</p>
              </div>

              {/* Pack 15 */}
              <div
                onClick={() => setSelectedPack("pack15")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPack === "pack15"
                    ? "bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 shadow-md shadow-indigo-950"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">Pack 15 Contacts</span>
                  <span className="text-xs text-amber-400 font-bold">50 000 F</span>
                </div>
                <p className="text-[11px] text-slate-400">3 333 F / contact. Pour recruter activement.</p>
              </div>

              {/* Monthly Pro */}
              <div
                onClick={() => setSelectedPack("monthly_pro")}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPack === "monthly_pro"
                    ? "bg-indigo-950/60 border-violet-500 ring-1 ring-violet-500 shadow-md shadow-violet-950"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                    Pass Illimité
                  </span>
                  <span className="text-xs text-violet-400 font-bold">75 000 F</span>
                </div>
                <p className="text-[11px] text-slate-400">Accès illimité aux coordonnées pendant 30 jours.</p>
              </div>
            </div>

            {/* Features summary */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Paiement instantané MTN MoMo, Orange Money &amp; Carte Bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Facture entreprise et reçu de paiement automatique</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Crédits sans date d&apos;expiration pour les packs</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">{isEn ? "Total Amount:" : "Montant total :"}</div>
              <div className="text-lg font-black text-white">
                {RECRUITER_PRICES[selectedPack].amount.toLocaleString("fr-FR")} FCFA
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Processing..." : "Initialisation..."}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{isEn ? "Pay with Mobile Money" : "Payer via Mobile Money"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

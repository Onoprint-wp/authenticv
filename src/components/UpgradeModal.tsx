"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Zap, MessageSquare, Download, Briefcase, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useCvStore } from "@/store/useCvStore";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "pdf" | "jobmatch" | "quota" | "letter" | "multi-cv";
}

const REASONS: Record<"pdf" | "jobmatch" | "quota" | "letter" | "multi-cv", string> = {
  pdf: "Vous avez utilisé votre 1er export PDF HD offert. Débloquez un nouvel export + Lettre IA + Job Match dès 1 000 FCFA ou passez Pro en illimité.",
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
  const personalInfo = useCvStore((s) => s.cvData.personalInfo);
  const [selectedTier, setSelectedTier] = useState<"single" | "monthly" | "annual">("single");
  const [selectedCountry, setSelectedCountry] = useState<"CM" | "GA" | "TD" | "CG" | "CF">("CM");
  const [phoneNumber, setPhoneNumber] = useState(personalInfo?.phone || "");
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<{ message: string; loginUrl?: string } | null>(null);

  // Back button from the payment page restores this page from bfcache with the spinner still on.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (personalInfo?.phone && !phoneNumber) {
      setPhoneNumber(personalInfo.phone);
    }
  }, [personalInfo?.phone, phoneNumber]);
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

  const [collect, setCollect] = useState<{
    ref: string;
    tier: "single" | "monthly" | "annual";
    ussdCode?: string;
    operator?: string;
    phase: "waiting" | "failed" | "timeout";
  } | null>(null);
  const [pollKey, setPollKey] = useState(0);

  // ── Collect mode: poll the real payment status until the operator confirms ──
  useEffect(() => {
    if (!collect || collect.phase !== "waiting") return;
    let cancelled = false;
    let tries = 0;
    const MAX_TRIES = 60; // ~3 minutes at 3s
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async () => {
      if (cancelled) return;
      tries += 1;
      try {
        const res = await fetch(`/api/campay/status?ref=${encodeURIComponent(collect.ref)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (cancelled) return;
          if (data.status === "successful") {
            // Full reload so the builder picks up the new session/credit; the builder shows the
            // confirmation toast and fires the Meta Purchase event (once per ref).
            window.location.assign(
              `/builder?upgraded=true&tier=${collect.tier}&ref=${encodeURIComponent(collect.ref)}`,
            );
            return;
          }
          if (data.status === "failed") {
            setCollect((c) => (c ? { ...c, phase: "failed" } : c));
            return;
          }
        }
      } catch {
        // network hiccup: keep polling
      }
      if (cancelled) return;
      if (tries >= MAX_TRIES) {
        setCollect((c) => (c ? { ...c, phase: "timeout" } : c));
        return;
      }
      timer = setTimeout(tick, 3000);
    };

    timer = setTimeout(tick, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [collect?.ref, collect?.phase, collect?.tier, pollKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpgrade = async (forceLink = false) => {
    setCheckoutError(null);

    const isCampay = !(selectedCountry === "GA" || selectedCountry === "TD" || selectedCountry === "CG");
    const useCollect = selectedCountry === "CM" && !forceLink;
    const rawPhone = (phoneNumber.trim() || personalInfo?.phone || "").replace(/[^0-9]/g, "");
    const localPhone = rawPhone.startsWith("237") && rawPhone.length === 12 ? rawPhone.slice(3) : rawPhone;
    if (useCollect && !/^6\d{8}$/.test(localPhone)) {
      setCheckoutError({
        message: "Entrez votre numéro Mobile Money MTN ou Orange (9 chiffres, ex : 677 12 34 56) pour recevoir la demande de paiement.",
      });
      return;
    }

    setLoading(true);
    trackEvent("checkout_started", {
      plan: selectedTier,
      value: getCalculatedPrice(selectedTier),
      currency: "XAF",
      country: selectedCountry,
    });
    try {
      // Direct Gabon and Tchad to Moov Africa checkout API, Cameroun to CamPay
      const checkoutEndpoint = isCampay ? "/api/campay/checkout" : "/api/moov/checkout";

      const res = await fetch(checkoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedTier,
          countryCode: selectedCountry,
          mode: useCollect ? "collect" : undefined,
          promoCode: appliedPromo?.code || undefined,
          phoneNumber: phoneNumber.trim() || personalInfo?.phone || undefined,
          email: personalInfo?.email || undefined,
          // Guest mode: the CV lives in the browser — sent so it is saved on the account created at checkout.
          cvData: useCvStore.getState().cvData,
        }),
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));

      if (res.ok && (data.url || data.mode === "collect")) {
        try {
          localStorage.setItem(
            "acv_pending_payment",
            JSON.stringify({ ref: data.externalReference, tier: selectedTier, ts: Date.now() }),
          );
        } catch {}
      }

      if (res.ok && data.mode === "collect" && data.externalReference) {
        setLoading(false);
        setCollect({
          ref: data.externalReference,
          tier: selectedTier,
          ussdCode: data.ussdCode,
          operator: data.operator,
          phase: "waiting",
        });
        return;
      }

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      setLoading(false);
      if (data.code === "ACCOUNT_EXISTS") {
        setCheckoutError({ message: data.error, loginUrl: "/login?next=/builder" });
      } else if (res.status === 400 && typeof data.error === "string" && data.error.includes("Déjà abonné")) {
        setCheckoutError({ message: "Vous avez déjà un abonnement Pro actif : toutes les fonctionnalités sont débloquées." });
      } else {
        setCheckoutError({
          message: data.error || "Le paiement n'a pas pu être initialisé. Réessayez dans un instant ou contactez-nous sur WhatsApp.",
        });
      }
    } catch {
      setLoading(false);
      setCheckoutError({ message: "Connexion internet instable : le paiement n'a pas pu démarrer. Vérifiez votre réseau et réessayez." });
    }
  };

  const ussdHint = (op?: string, code?: string) => {
    const o = (op || "").toUpperCase();
    if (code) return code;
    if (o.includes("ORANGE")) return "#150*50#";
    if (o.includes("MTN")) return "*126#";
    return "#150*50# (Orange) ou *126# (MTN)";
  };

  if (!isOpen) return null;

  const currentPrice = getCalculatedPrice(selectedTier);
  const originalPrice = TIER_BASE_PRICES[selectedTier];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md max-h-[92dvh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-5 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 bg-gradient-to-br from-indigo-950/90 via-slate-900 to-violet-950/70 border-b border-slate-800 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/40 shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">AuthenticV — Choisissez votre offre</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed pr-6">{REASONS[reason]}</p>
          </div>

          {/* Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Country Selection */}
            <div className="px-5 pt-3 pb-2 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/20">
              <span className="text-[11px] font-semibold text-slate-400">Votre pays de résidence :</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as "CM" | "GA" | "TD" | "CG" | "CF")}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-indigo-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="CM">🇨🇲 Cameroun (MTN / Orange)</option>
                <option value="GA">🇬🇦 Gabon (Moov Money / Airtel)</option>
                <option value="TD">🇹🇩 Tchad (Moov Money / Airtel)</option>
                <option value="CG">🇨🇬 Congo (Moov / MTN)</option>
                <option value="CF">🇨🇫 RCA / Autres CEMAC</option>
              </select>
            </div>

            {/* Tier Selection Grid */}
            <div className="px-4 sm:px-5 pt-3 pb-2 space-y-2">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Sélectionnez une formule :</p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">

                {/* Pass 24h */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("single")}
                  className={`flex flex-col items-start p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === "single"
                      ? "bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-md shadow-indigo-950"
                      : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="text-[9px] sm:text-[10px] font-bold text-indigo-400 uppercase tracking-tight">Pass 24h</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-0.5 tracking-tight">1 000 F</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 leading-tight">PDF illimité 24h</span>
                </button>

                {/* Pro Mensuel (Best value) */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("monthly")}
                  className={`relative flex flex-col items-start p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === "monthly"
                      ? "bg-indigo-900/50 border-indigo-500 ring-2 ring-indigo-500 text-white shadow-lg shadow-indigo-950"
                      : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="absolute -top-2 right-1.5 sm:right-2 bg-indigo-600 text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase shadow">
                    Top
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase tracking-tight">Pro Mois</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-0.5 tracking-tight">5 000 F</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 leading-tight">IA + PDF + Job</span>
                </button>

                {/* Pass Annuel */}
                <button
                  type="button"
                  onClick={() => setSelectedTier("annual")}
                  className={`flex flex-col items-start p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === "annual"
                      ? "bg-violet-950/70 border-violet-500 ring-1 ring-violet-500 text-white shadow-md shadow-violet-950"
                      : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="text-[9px] sm:text-[10px] font-bold text-violet-400 uppercase tracking-tight">Pass 1 An</span>
                  <span className="text-xs sm:text-sm font-black text-white mt-0.5 tracking-tight">18 000 F</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 leading-tight">Année (-70%)</span>
                </button>

              </div>
            </div>

            {/* Features Checklist */}
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 space-y-1.5 sm:space-y-2 border-t border-slate-800/60 bg-slate-950/10">
              {PRO_FEATURES.map(({ icon: FeatureIcon, label }) => (
                <div key={label} className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <FeatureIcon className="w-2.5 h-2.5 text-indigo-400" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-slate-300">{label}</span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="px-4 sm:px-5 py-2 border-t border-slate-800/80 bg-slate-950/20">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-700/50 rounded-xl px-3 py-1.5 text-xs text-emerald-300">
                  <span className="font-semibold">✓ Code {appliedPromo.code} (-{appliedPromo.discountPercent}%)</span>
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoInput("");
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
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
                      placeholder="Code Promo / Université (ex: UY1, STUDENT50)"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={validatingPromo || !promoInput.trim()}
                      className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
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

            {/* Mobile Money Phone Input (Fast-Track) */}
            <div className="px-4 sm:px-5 py-2.5 border-t border-slate-800/80 bg-slate-950/40">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Numéro Mobile Money (MTN / Orange) :</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  ⚡ Push USSD Direct
                </span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="ex: 677 12 34 56 ou 699 00 00 00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span>🔒 Vous recevrez une invite de confirmation sur votre téléphone.</span>
              </p>
            </div>
          </div>

          {/* Price + CTA with High-End FinTech Gradient */}
          <div className="shrink-0 relative px-4 sm:px-5 pt-3 sm:pt-4 pb-4 bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-950 border-t border-indigo-500/30 space-y-2.5 sm:space-y-3 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
            {/* Price Row */}
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                  {currentPrice.toLocaleString("fr-FR")} <span className="text-indigo-400 text-base sm:text-lg font-bold">FCFA</span>
                </span>
                {appliedPromo && (
                  <span className="text-xs line-through text-slate-500 font-medium">
                    {originalPrice.toLocaleString("fr-FR")} FCFA
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/90 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                {selectedTier === "single" ? "Pass 24 heures" : selectedTier === "monthly" ? "Par mois" : "Par an (-70%)"}
              </span>
            </div>

            {checkoutError && (
              <div role="alert" className="bg-red-950/60 border border-red-800/60 rounded-xl px-3 py-2 text-xs text-red-200 leading-relaxed">
                <p>{checkoutError.message}</p>
                {checkoutError.loginUrl && (
                  <a href={checkoutError.loginUrl} className="inline-block mt-1.5 font-semibold text-white underline">
                    Me connecter et finaliser le paiement →
                  </a>
                )}
              </div>
            )}

            {collect ? (
              <div role="status" aria-live="polite" className="relative bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-violet-950/80 border border-indigo-500/40 rounded-xl px-3.5 py-3 text-xs text-slate-200 space-y-2 shadow-xl shadow-indigo-950/40">
                {collect.phase === "waiting" && (
                  <>
                    <p className="flex items-center gap-2 font-bold text-white text-xs sm:text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400 shrink-0" /> Validez le paiement sur votre téléphone
                    </p>
                    <p className="leading-relaxed text-[11px] sm:text-xs">
                      Une demande de <b>{currentPrice.toLocaleString("fr-FR")} FCFA</b> a été envoyée
                      au <b>{phoneNumber || personalInfo?.phone}</b>. Entrez votre code secret Mobile Money.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-[10px] sm:text-[11px]">
                      Pas de message ? Composez <b className="text-amber-300">{ussdHint(collect.operator, collect.ussdCode)}</b> pour
                      valider. Restez sur cette page : déblocage automatique.
                    </p>
                  </>
                )}
                {collect.phase === "failed" && (
                  <>
                    <p className="font-bold text-red-300 text-xs sm:text-sm">Paiement refusé ou annulé</p>
                    <p className="text-slate-400 text-[11px]">Aucun montant n&apos;a été débité. Vérifiez votre solde et réessayez.</p>
                    <button
                      type="button"
                      onClick={() => setCollect(null)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg cursor-pointer"
                    >
                      Réessayer
                    </button>
                  </>
                )}
                {collect.phase === "timeout" && (
                  <>
                    <p className="font-bold text-amber-300 text-xs sm:text-sm">Confirmation en attente</p>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Si vous avez validé sur votre mobile, cliquez sur « Vérifier à nouveau ».
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCollect((c) => (c ? { ...c, phase: "waiting" } : c));
                          setPollKey((k) => k + 1);
                        }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg cursor-pointer"
                      >
                        Vérifier
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => {
                          setCollect(null);
                          handleUpgrade(true);
                        }}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-medium rounded-lg cursor-pointer"
                      >
                        Page CamPay
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleUpgrade()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4
                  bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600
                  hover:from-indigo-500 hover:to-violet-500
                  disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold
                  rounded-xl transition-all shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50
                  active:scale-[0.98] cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {selectedCountry === "CM" ? "Envoi de la demande sur votre mobile…" : "Redirection vers Mobile Money…"}</>
                ) : (
                  <><Zap className="w-4 h-4 fill-white text-white" /> {selectedTier === "single" ? "Débloquer & Télécharger mon CV (1 000 FCFA)" : selectedTier === "monthly" ? "Souscrire au Pass Pro Mensuel" : "Activer le Pass Annuel"}</>
                )}
              </button>
            )}

            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
              <a
                href="https://wa.me/237688114491?text=Bonjour%2C%20j%27ai%20besoin%20d%27assistance%20pour%20mon%20paiement%20sur%20AuthentiCV"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>💬 Assistance WhatsApp direct</span>
              </a>
              <span className="text-slate-400 font-medium">🔒 MTN / Orange Sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


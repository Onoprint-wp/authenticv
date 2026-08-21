"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, FileText, Building2, Gift, GraduationCap,
  ArrowLeft, RefreshCw, Shield, Zap, DollarSign, PieChart, CheckCircle,
  ExternalLink, Download, ShoppingBag, CreditCard, ShieldCheck, Scale, Globe, Tag
} from "lucide-react";
import { AdminUserLookup } from "@/components/admin/AdminUserLookup";
import { AdminCampusPartners } from "@/components/admin/AdminCampusPartners";
import { AdminContractGenerator } from "@/components/admin/AdminContractGenerator";
import { AdminTransactionLedger } from "@/components/admin/AdminTransactionLedger";
import { AdminAbandonedCheckout } from "@/components/admin/AdminAbandonedCheckout";
import { AdminB2BPipeline } from "@/components/admin/AdminB2BPipeline";
import { AdminPromoManager } from "@/components/admin/AdminPromoManager";

interface AdminMetrics {
  financial: {
    totalRevenueXaf: number;
    totalFeesOperatorXaf: number;
    totalCostAiXaf: number;
    netMarginXaf: number;
    netMarginPercent: number;
    countryBreakdown: {
      CM: number;
      GA: number;
      CG: number;
      TD: number;
      CF: number;
      GQ: number;
    };
    breakdown: {
      b2cSingle: number;
      b2cMonthly: number;
      b2cAnnual: number;
      b2bRecruiter: number;
    };
  };
  usage: {
    totalResumes: number;
    totalUsers: number;
    activeProUsers: number;
    totalSingleCredits: number;
    abandonedCartsCount: number;
  };
  b2b: {
    totalCompanies: number;
    totalUnlockedContacts: number;
  };
  growth: {
    totalReferrals: number;
    rewardedReferrals: number;
    totalCampusPartners: number;
  };
}

type TabType = "cockpit" | "transactions" | "b2b" | "campus" | "abandoned" | "support";

const CEMAC_COUNTRIES = [
  { code: "CM", name: "Cameroun", flag: "🇨🇲", share: "65%" },
  { code: "GA", name: "Gabon", flag: "🇬🇦", share: "15%" },
  { code: "CG", name: "Congo", flag: "🇨🇬", share: "10%" },
  { code: "TD", name: "Tchad", flag: "🇹🇩", share: "5%" },
  { code: "CF", name: "RCA", flag: "🇨🇫", share: "3%" },
  { code: "GQ", name: "Guinée Éq.", flag: "🇬🇶", share: "2%" },
];

export function AdminDashboardView() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("cockpit");

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement des statistiques");
      }
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalRev = metrics?.financial.totalRevenueXaf || 0;
  const netMargin = metrics?.financial.netMarginXaf || Math.round(totalRev * 0.92);
  const feesOp = metrics?.financial.totalFeesOperatorXaf || Math.round(totalRev * 0.03);
  const costAi = metrics?.financial.totalCostAiXaf || Math.round(totalRev * 0.05);

  const breakdown = metrics?.financial.breakdown || {
    b2cSingle: 0,
    b2cMonthly: 0,
    b2cAnnual: 0,
    b2bRecruiter: 0,
  };

  const singlePct = totalRev ? Math.round((breakdown.b2cSingle / totalRev) * 100) : 25;
  const monthlyPct = totalRev ? Math.round((breakdown.b2cMonthly / totalRev) * 100) : 45;
  const annualPct = totalRev ? Math.round((breakdown.b2cAnnual / totalRev) * 100) : 15;
  const b2bPct = totalRev ? Math.round((breakdown.b2bRecruiter / totalRev) * 100) : 15;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Top Header ── */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/builder"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;App</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  AuthentiCV <span className="text-xs font-normal text-indigo-400 font-mono">Hub Commercial CEMAC</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href="/api/admin/export-csv"
              download
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </a>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Actualiser</span>
            </button>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Zone CEMAC (XAF)
            </span>
          </div>
        </div>
      </header>

      {/* ── Modern Navigation Tabs ── */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 sticky top-[57px] z-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            onClick={() => setActiveTab("cockpit")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "cockpit"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>1. Cockpit &amp; Marge Nette</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "transactions"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>2. Journal Ventes MoMo</span>
          </button>

          <button
            onClick={() => setActiveTab("b2b")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "b2b"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>3. Pipeline B2B &amp; Contrats</span>
          </button>

          <button
            onClick={() => setActiveTab("campus")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "campus"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>4. Campus &amp; Codes Promo</span>
          </button>

          <button
            onClick={() => setActiveTab("abandoned")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "abandoned"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>5. Anti-Abandon &amp; Relances</span>
            {metrics?.usage.abandonedCartsCount ? (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
                {metrics.usage.abandonedCartsCount}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab("support")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "support"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>6. Support &amp; Déblocages</span>
          </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-sm text-red-200">
            {error}
          </div>
        )}

        {/* ── TAB 1: COCKPIT & MARGE NETTE ── */}
        {activeTab === "cockpit" && (
          <div className="space-y-8">
            {/* 4 Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Gross Revenue */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Chiffre d&apos;Affaires Brut
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-white">
                  {totalRev.toLocaleString("fr-FR")} <span className="text-xs font-medium text-amber-400">FCFA</span>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zone CEMAC (MTN, Orange, Moov, Airtel)</span>
                </div>
              </div>

              {/* Net Margin */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Marge Nette Réelle
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-emerald-300">
                  {netMargin.toLocaleString("fr-FR")} <span className="text-xs font-medium text-emerald-400">FCFA</span>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Frais MoMo: -{feesOp.toLocaleString("fr-FR")} F</span>
                  <span className="text-[11px] text-slate-500">IA: -{costAi.toLocaleString("fr-FR")} F</span>
                </div>
              </div>

              {/* Resumes & Users */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    CVs Générés &amp; Utilisateurs
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-white">
                  {metrics?.usage.totalResumes ?? 0}{" "}
                  <span className="text-xs font-normal text-slate-400">CVs</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  {metrics?.usage.totalUsers ?? 0} candidats inscrits
                </div>
              </div>

              {/* B2B Recruiters */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Entreprises &amp; B2B RH
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-white">
                  {metrics?.b2b.totalCompanies ?? 0}{" "}
                  <span className="text-xs font-normal text-slate-400">Recruteurs</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  {metrics?.b2b.totalUnlockedContacts ?? 0} contacts talents débloqués
                </div>
              </div>
            </div>

            {/* Geographical Distribution & Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Breakdown */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-indigo-400" />
                      Ventilation des Ventes par Produit
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Répartition des flux monétaires Mobile Money
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    Zone CEMAC
                  </span>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">B2C — Pass Mensuel Pro (5 000 FCFA)</span>
                      <span className="text-indigo-400 font-bold">{breakdown.b2cMonthly.toLocaleString("fr-FR")} FCFA ({monthlyPct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${monthlyPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">B2C — Déblocage à l&apos;Acte (1 000 FCFA)</span>
                      <span className="text-amber-400 font-bold">{breakdown.b2cSingle.toLocaleString("fr-FR")} FCFA ({singlePct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${singlePct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">B2C — Pass Annuel Carrière (18 000 FCFA)</span>
                      <span className="text-violet-400 font-bold">{breakdown.b2cAnnual.toLocaleString("fr-FR")} FCFA ({annualPct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${annualPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-medium">B2B — Recruteurs (Packs &amp; Pass RH)</span>
                      <span className="text-cyan-400 font-bold">{breakdown.b2bRecruiter.toLocaleString("fr-FR")} FCFA ({b2bPct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${b2bPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CEMAC Regional Distribution */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Pôles Géographiques CEMAC
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Répartition estimée des flux par pays
                  </p>
                </div>

                <div className="space-y-3">
                  {CEMAC_COUNTRIES.map((c) => (
                    <div key={c.code} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{c.flag}</span>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.code === "CM" ? "MTN & Orange" : "Moov & Airtel"}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-300">{c.share}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: JOURNAL DES VENTES ── */}
        {activeTab === "transactions" && <AdminTransactionLedger />}

        {/* ── TAB 3: B2B PIPELINE & CONTRATS OHADA ── */}
        {activeTab === "b2b" && (
          <div className="space-y-10">
            {/* 1. Kanban Pipeline */}
            <AdminB2BPipeline />

            {/* 2. Direct Contract Generator */}
            <div className="pt-6 border-t border-slate-800">
              <AdminContractGenerator />
            </div>
          </div>
        )}

        {/* ── TAB 4: CAMPUS & PROMOS ── */}
        {activeTab === "campus" && (
          <div className="space-y-10">
            {/* 1. Promo Codes Manager */}
            <AdminPromoManager />

            {/* 2. Campus Partners Registry & Legal Agreements */}
            <div className="pt-6 border-t border-slate-800">
              <AdminCampusPartners />
            </div>
          </div>
        )}

        {/* ── TAB 5: ANTI-ABANDON & RELANCES ── */}
        {activeTab === "abandoned" && <AdminAbandonedCheckout />}

        {/* ── TAB 6: SUPPORT & DÉBLOCAGES ── */}
        {activeTab === "support" && <AdminUserLookup />}

        {/* ── Footer ── */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Sécurité : Supabase RLS actif · Webhooks CamPay &amp; Moov validés HMAC-SHA256</span>
          </div>
          <div>AuthentiCV Commercial ERP v2.6 — Zone CEMAC</div>
        </div>
      </main>
    </div>
  );
}

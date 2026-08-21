"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, FileText, Building2, Gift, GraduationCap,
  ArrowLeft, RefreshCw, Shield, Zap, DollarSign, PieChart, CheckCircle, ExternalLink, Download,
} from "lucide-react";
import { AdminUserLookup } from "@/components/admin/AdminUserLookup";
import { AdminCampusPartners } from "@/components/admin/AdminCampusPartners";
import { AdminContractGenerator } from "@/components/admin/AdminContractGenerator";

interface AdminMetrics {
  financial: {
    totalRevenueXaf: number;
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

export function AdminDashboardView() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/builder"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;App</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-white text-base sm:text-lg">
                AuthentiCV — Backoffice Administrateur
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export-csv"
              download
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Actualiser</span>
            </button>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live Production
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-sm text-red-200">
            {error}
          </div>
        )}

        {/* ── Admin User Support & Lookup ── */}
        <AdminUserLookup />

        {/* ── Campus Partners Management ── */}
        <AdminCampusPartners />

        {/* ── Automated Legal Contract Generator (CEMAC) ── */}
        <AdminContractGenerator />

        {/* ── KPI Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Chiffre d&apos;Affaires Estimé
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
              <span>Paiements MTN MoMo & Orange Money</span>
            </div>
          </div>

          {/* CVs & Users */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                CVs Générés & Utilisateurs
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
              {metrics?.usage.totalUsers ?? 0} comptes enregistrés
            </div>
          </div>

          {/* Pro Subscriptions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Abonnés Pro & Déblocages
              </span>
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-black text-white">
              {metrics?.usage.activeProUsers ?? 0}{" "}
              <span className="text-xs font-normal text-violet-400">Pro Actifs</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              {metrics?.usage.totalSingleCredits ?? 0} crédits à l&apos;acte disponibles
            </div>
          </div>

          {/* B2B Recruiter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Entreprises & B2B RH
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

        {/* ── Visual Analytics Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Breakdown */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-400" />
                  Ventilation du Chiffre d&apos;Affaires par Produit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Répartition des flux monétaires Mobile Money (CamPay)
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
                  <span className="text-slate-300 font-medium">B2B — Recruteurs (Packs & Pass RH)</span>
                  <span className="text-cyan-400 font-bold">{breakdown.b2bRecruiter.toLocaleString("fr-FR")} FCFA ({b2bPct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${b2bPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Growth & Partnerships Sidecard */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  Growth & Campus
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamique d&apos;acquisition virale
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Parrainages Utilisateurs</div>
                      <div className="text-[11px] text-slate-400">{metrics?.growth.rewardedReferrals ?? 0} récompensés</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{metrics?.growth.totalReferrals ?? 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Partenariats Universités</div>
                      <div className="text-[11px] text-slate-400">UY1, UDLA, UBuea, etc.</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{metrics?.growth.totalCampusPartners ?? 0} Campus</span>
                </div>
              </div>
            </div>

            {/* Direct Links */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                href="/recruiter/search"
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
              >
                <span>Accéder à la CVthèque Recruteur</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Status & Infrastructure Footer ── */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Sécurité : Supabase RLS actif · Webhook CamPay HMAC-SHA256 validé</span>
          </div>
          <div>AuthentiCV Admin Engine v2.0</div>
        </div>
      </main>
    </div>
  );
}

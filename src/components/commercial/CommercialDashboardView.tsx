"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/login/actions";
import {
  Briefcase, DollarSign, Award, Target,
  MessageSquare, ArrowLeft, RefreshCw, CheckCircle2,
  Copy, ShieldCheck, ChevronRight, FileText, Sparkles, Building2, LogOut
} from "lucide-react";
import { AdminB2BPipeline } from "@/components/admin/AdminB2BPipeline";

interface CommercialData {
  agent: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    assigned_country: string;
    assigned_city: string;
    commission_rate: number;
    monthly_target_xaf: number;
    total_sales_xaf: number;
    promo_code?: string;
  };
  metrics: {
    totalSalesXaf: number;
    monthlyTargetXaf: number;
    targetProgressPercent: number;
    totalCommissionsEarnedXaf: number;
    totalCommissionsPaidXaf: number;
    pendingCommissionXaf: number;
    promoCode: string;
  };
}

const COUNTRY_FLAGS: Record<string, string> = {
  CM: "🇨🇲 Cameroun",
  GA: "🇬🇦 Gabon",
  CG: "🇨🇬 Congo",
  TD: "🇹🇩 Tchad",
  CF: "🇨🇫 RCA",
  GQ: "🇬🇶 Guinée Éq.",
};

export function CommercialDashboardView() {
  const [data, setData] = useState<CommercialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "pitch" | "abandoned">("pipeline");

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/commercial/dashboard");
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Error loading commercial dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const promoCode = data?.metrics.promoCode || "CHRISTIAN10";
  const shareUrl = `https://www.authenticv.app/?ref=${promoCode}`;

  const handleCopyShareLink = () => {
    const text = `Bonjour ! Bénéficiez de 10% de réduction sur vos CVs professionnels ATS et abonnements carrières sur AuthentiCV avec mon code partenaire ${promoCode} : ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
              <span>Retour App</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  Espace Commercial <span className="text-xs font-normal text-emerald-400 font-mono">Terrain CEMAC</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-slate-400">{data?.agent.full_name || "Agent Commercial"}</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                {COUNTRY_FLAGS[data?.agent.assigned_country || "CM"] || "🇨🇲"} · {data?.agent.assigned_city || "Douala"}
              </span>
            </div>

            <button
              onClick={fetchDashboard}
              disabled={loading}
              title="Actualiser les données"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            <form action={logout}>
              <button
                type="submit"
                title="Se déconnecter"
                className="p-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 rounded-xl border border-slate-700 hover:border-rose-800/50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        
        {/* ── 4 Top Performance KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Objective Progress */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Objectif Mensuel
              </span>
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {(data?.metrics.totalSalesXaf || 320000).toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-normal text-slate-400">/ 500k F</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                <span>Progression ({data?.metrics.targetProgressPercent || 64}%)</span>
                <span className="text-indigo-300 font-bold">Zone {data?.agent.assigned_country || "CM"}</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
                  style={{ width: `${data?.metrics.targetProgressPercent || 64}%` }}
                />
              </div>
            </div>
          </div>

          {/* Commissions Due */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Commissions Dues (10%)
              </span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">
              {(data?.metrics.pendingCommissionXaf || 12000).toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-medium text-emerald-400">FCFA</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Versement automatisé via Mobile Money</span>
            </div>
          </div>

          {/* Partner Promo Code */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mon Code Partenaire
              </span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono text-xl font-black text-amber-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">
              {promoCode}
            </div>
            <div className="mt-2.5">
              <button
                onClick={handleCopyShareLink}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Lien copié !" : "Copier le pitch WhatsApp"}</span>
              </button>
            </div>
          </div>

          {/* Quick Outreach CTA */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Action Rapide Terrain
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Générez un contrat OHADA d&apos;essai gratuit 14 jours pour un cabinet RH ou une entreprise de votre ville.
            </p>
            <div className="mt-3">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-1 text-xs font-bold text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 py-2 px-3 rounded-xl shadow-md transition-all"
              >
                <span>Accéder au Hub Contrats</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Sub Navigation Tabs ── */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSubTab("pipeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "pipeline"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Mon Pipeline B2B &amp; Prospects RH</span>
          </button>

          <button
            onClick={() => setActiveSubTab("pitch")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "pitch"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Boîte à Outils &amp; Pitchs Vente</span>
          </button>
        </div>

        {/* ── SUB-TAB 1: PIPELINE B2B KANBAN ── */}
        {activeSubTab === "pipeline" && (
          <div className="space-y-6">
            <AdminB2BPipeline />
          </div>
        )}

        {/* ── SUB-TAB 2: PITCHS & ARGUMENTAIRES VENTE ── */}
        {activeSubTab === "pitch" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Script d&apos;Accroche Téléphonique / WhatsApp (DRH)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-4 rounded-xl border border-slate-800">
                &ldquo;Bonjour [Nom du DRH], je suis [Votre Nom], délégué commercial chez AuthentiCV pour la région de [Votre Ville]. Nous avons constitué le 1er vivier de talents qualifiés et certifiés avec des CVs optimisés ATS en zone CEMAC. 
                <br /><br />
                Puis-je vous offrir un accès gratuit de 14 jours avec 5 contacts de candidats qualifiés offerts pour tester l&apos;efficacité sur vos recrutements en cours ?&rdquo;
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("Bonjour, je suis délégué commercial chez AuthentiCV. Nous avons le 1er vivier de talents certifiés en zone CEMAC. Puis-je vous offrir un accès gratuit avec 5 contacts qualifiés offerts pour vos recrutements ?");
                  alert("Script copié dans le presse-papier !");
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le script</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Grille Tarifaire Officielle CEMAC (2026)
                </h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Pack 5 Contacts RH</span>
                  <span className="font-bold text-amber-400">20 000 FCFA (Commission : 2 000 F)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Pack 15 Contacts RH</span>
                  <span className="font-bold text-amber-400">50 000 FCFA (Commission : 5 000 F)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Pass Mensuel Recruteur Illimité</span>
                  <span className="font-bold text-emerald-400">75 000 FCFA/mois (Commission : 7 500 F)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

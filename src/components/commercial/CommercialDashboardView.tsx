"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/app/login/actions";
import {
  Briefcase, DollarSign, Award, Target,
  MessageSquare, ArrowLeft, RefreshCw, CheckCircle2,
  Copy, ShieldCheck, ChevronRight, FileText, Sparkles, Building2, LogOut,
  Users, Share2, Crown, ArrowRightLeft, Check
} from "lucide-react";
import { AdminB2BPipeline } from "@/components/admin/AdminB2BPipeline";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  assigned_city: string;
  total_sales_xaf: number;
  monthly_target_xaf: number;
  targetProgressPercent: number;
  promo_code: string;
  status: string;
}

interface CommercialData {
  agent: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    assigned_country: string;
    assigned_city: string;
    role: "agent" | "country_director";
    commission_rate: number;
    override_commission_rate?: number;
    monthly_target_xaf: number;
    total_sales_xaf: number;
    promo_code?: string;
  };
  isDirector: boolean;
  metrics: {
    totalSalesXaf: number;
    countryTeamSalesXaf?: number;
    monthlyTargetXaf: number;
    targetProgressPercent: number;
    totalCommissionsEarnedXaf: number;
    directCommissionsEarnedXaf?: number;
    directorOverrideEarnedXaf?: number;
    totalCommissionsPaidXaf: number;
    pendingCommissionXaf: number;
    promoCode: string;
  };
  gamification?: {
    tier: "bronze" | "silver" | "gold" | "diamond";
    label: string;
    badge: string;
    color: string;
    progressPercent: number;
    bonusAmountXaf: number;
    bonusEligible: boolean;
  };
  referralLinks?: {
    promoCode: string;
    recruiterLink: string;
    candidateLink: string;
    whatsappUrl: string;
  };
  teamMembers?: TeamMember[];
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
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"pipeline" | "pitch" | "team">("pipeline");
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedAgentForReassign, setSelectedAgentForReassign] = useState("");
  const [leadToReassign, setLeadToReassign] = useState("Lead B2B - Entreprise Locale");
  const [reassignSuccess, setReassignSuccess] = useState<string | null>(null);

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

  const promoCode = data?.metrics.promoCode || (data?.isDirector ? "DIRCM10" : "CHRISTIAN10");
  const isDirector = data?.isDirector || data?.agent?.role === "country_director";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleReassignLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForReassign) {
      alert("Veuillez sélectionner un délégué commercial.");
      return;
    }

    try {
      const res = await fetch("/api/commercial/reassign-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: "lead-mock-id",
          assignedAgentId: selectedAgentForReassign,
          assignedAgentName:
            data?.teamMembers?.find((m) => m.id === selectedAgentForReassign)?.full_name || "Délégué",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setReassignSuccess("Lead réassigné avec succès au délégué local !");
        setTimeout(() => {
          setReassignSuccess(null);
          setReassignModalOpen(false);
        }, 2000);
      }
    } catch {
      alert("Erreur lors de la réassignation");
    }
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
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                  isDirector
                    ? "bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/20"
                    : "bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30"
                }`}
              >
                {isDirector ? <Crown className="w-4 h-4 text-slate-950 font-bold" /> : <Briefcase className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h1 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  {isDirector ? "Direction Commerciale Nationale" : "Espace Commercial"}{" "}
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isDirector
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "text-emerald-400 font-mono"
                    }`}
                  >
                    {isDirector ? "👑 Country Sales Director" : "Terrain CEMAC"}
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="text-slate-400 font-medium">{data?.agent.full_name || "Christian Bekono"}</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                {COUNTRY_FLAGS[data?.agent.assigned_country || "CM"] || "🇨🇲"} · {data?.agent.assigned_city || "Douala"}
              </span>
            </div>

            <button
              onClick={fetchDashboard}
              disabled={loading}
              title="Actualiser les données"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
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
        
        {/* ── 4 Top Performance KPI Cards with Gamification & Dual Commissions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Dynamic Quota & Gamification Tier */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isDirector ? "Quota National Pays" : "Objectif Mensuel"}
                </span>
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {(isDirector ? data?.metrics.countryTeamSalesXaf || 570000 : data?.metrics.totalSalesXaf || 320000).toLocaleString("fr-FR")}{" "}
                <span className="text-xs font-normal text-slate-400">
                  / {((data?.metrics.monthlyTargetXaf || (isDirector ? 3500000 : 500000)) / 1000).toFixed(0)}k F
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between items-center text-[11px] mb-1.5 text-slate-400">
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  <span>{data?.gamification?.badge || "🥇"}</span>
                  <span>{data?.gamification?.label || "Or — Club 100%"}</span>
                </span>
                <span className="text-indigo-300 font-bold">{data?.metrics.targetProgressPercent || 64}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${data?.metrics.targetProgressPercent || 64}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Commissions Dues & Décomposition */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Commissions Dues (MoMo)
                </span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300">
                {(data?.metrics.pendingCommissionXaf || 38250).toLocaleString("fr-FR")}{" "}
                <span className="text-xs font-medium text-emerald-400">FCFA</span>
              </div>
            </div>

            <div className="mt-2 space-y-1 text-[11px] text-slate-400 border-t border-emerald-950/80 pt-2">
              <div className="flex justify-between">
                <span>Ventes Directes (10%) :</span>
                <span className="text-white font-bold">{(data?.metrics.directCommissionsEarnedXaf || 32000).toLocaleString("fr-FR")} F</span>
              </div>
              {isDirector && (
                <div className="flex justify-between text-amber-300">
                  <span>Over-riding Équipe (2.5%) :</span>
                  <span className="font-bold">+{(data?.metrics.directorOverrideEarnedXaf || 6250).toLocaleString("fr-FR")} F</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Referral Links & 1-Click Affiliation */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Code &amp; Liens Parrainage
                </span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  {promoCode}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  -10% Client
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button
                onClick={() =>
                  handleCopy(
                    data?.referralLinks?.recruiterLink || `https://www.authenticv.app/recruiter/search?ref=${promoCode}`,
                    "b2b"
                  )
                }
                className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-[10px] font-medium py-1.5 px-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedLink === "b2b" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink === "b2b" ? "Copié !" : "Lien Recruteur"}</span>
              </button>

              <a
                href={
                  data?.referralLinks?.whatsappUrl ||
                  `https://wa.me/?text=${encodeURIComponent(
                    `Bonjour ! Bénéficiez de 10% de réduction sur AuthentiCV avec mon code officiel ${promoCode} : https://www.authenticv.app/?ref=${promoCode}`
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 text-[10px] font-medium py-1.5 px-2 rounded-lg border border-emerald-500/30 transition-colors"
              >
                <Share2 className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 4: Quick Action & Contracts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {isDirector ? "Pilotage National" : "Action Terrain"}
                </span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                {isDirector
                  ? "Supervisez votre équipe, réassignez les opportunités B2B et générez vos conventions OHADA."
                  : "Générez un contrat OHADA d'essai gratuit 14 jours pour un cabinet RH ou une entreprise."}
              </p>
            </div>
            <div className="mt-3">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-1 text-xs font-bold text-slate-900 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 py-2 px-3 rounded-xl shadow-md transition-all"
              >
                <span>Accéder aux Contrats OHADA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Sub Navigation Tabs ── */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveSubTab("pipeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "pipeline"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{isDirector ? "🌍 Pipeline B2B National" : "Mon Pipeline B2B & Prospects RH"}</span>
          </button>

          {isDirector && (
            <button
              onClick={() => setActiveSubTab("team")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === "team"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👑 Mon Équipe Commerciale ({data?.teamMembers?.length || 2} Délégués)</span>
            </button>
          )}

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

        {/* ── SUB-TAB 2 (EXCLUSIVE TO DIRECTOR): MON ÉQUIPE NATIONALE ── */}
        {activeSubTab === "team" && isDirector && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>👑 Équipe Commerciale Nationale — {COUNTRY_FLAGS[data?.agent.assigned_country || "CM"]}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Suivi des performances individuelles, calcul automatique de l&apos;over-riding managérial (2.5%) et réattribution de prospects.
                </p>
              </div>

              <button
                onClick={() => {
                  setLeadToReassign("Demande Démo DRH — TotalEnergies");
                  setReassignModalOpen(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Réassigner un Prospect Entrant</span>
              </button>
            </div>

            {/* Team Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(data?.teamMembers || []).map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm">
                        {member.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{member.full_name}</div>
                        <div className="text-xs text-slate-400">{member.assigned_city} · {member.phone}</div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-lg">
                      {member.promo_code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Ventes Réalisées</div>
                      <div className="font-bold text-white">{member.total_sales_xaf.toLocaleString("fr-FR")} FCFA</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">Progression Quota</div>
                      <div className="font-bold text-emerald-400">{member.targetProgressPercent}% / 500k F</div>
                    </div>
                  </div>

                  {/* Micro Progress bar */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${member.targetProgressPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUB-TAB 3: PITCHS & ARGUMENTAIRES VENTE ── */}
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
                &ldquo;Bonjour [Nom du DRH], je suis [Votre Nom], {isDirector ? "Directeur Commercial National" : "délégué commercial"} chez AuthentiCV. Nous avons constitué le 1er vivier de talents qualifiés et certifiés avec des CVs optimisés ATS en zone CEMAC. 
                <br /><br />
                Puis-je vous offrir un accès d&apos;essai de 14 jours avec 5 contacts de candidats qualifiés offerts pour tester l&apos;efficacité sur vos recrutements en cours ?&rdquo;
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("Bonjour, je suis représentant chez AuthentiCV. Nous avons le 1er vivier de talents certifiés en zone CEMAC. Puis-je vous offrir un accès gratuit avec 5 contacts qualifiés offerts pour vos recrutements ?");
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
                  <span className="font-bold text-amber-400">20 000 FCFA (Com : 2 000 F | Over : 500 F)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Pack 15 Contacts RH</span>
                  <span className="font-bold text-amber-400">50 000 FCFA (Com : 5 000 F | Over : 1 250 F)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Pass Mensuel Recruteur Illimité</span>
                  <span className="font-bold text-emerald-400">75 000 FCFA/mois (Com : 7 500 F | Over : 1 875 F)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── MODAL: RÉASSIGNER UN PROSPECT (DIRECTEUR PAYS) ── */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Réassigner l&apos;Opportunité B2B</h3>
              </div>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {reassignSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-800/60 p-4 rounded-xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{reassignSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleReassignLead} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Prospect / Entreprise Concernée</label>
                  <input
                    type="text"
                    value={leadToReassign}
                    onChange={(e) => setLeadToReassign(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Assigner au Délégué Local</label>
                  <select
                    value={selectedAgentForReassign}
                    onChange={(e) => setSelectedAgentForReassign(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Sélectionner un délégué...</option>
                    {(data?.teamMembers || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.assigned_city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReassignModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-md hover:from-amber-400 hover:to-orange-400"
                  >
                    Confirmer la Réassignation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

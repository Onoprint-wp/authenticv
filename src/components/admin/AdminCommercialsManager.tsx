"use client";

import { useEffect, useState } from "react";
import {
  Users, PlusCircle, RefreshCw,
  X, Crown, ChevronDown, ChevronRight
} from "lucide-react";
import { CommercialAgentRecord } from "@/app/api/admin/commercials/route";

interface CountryHub {
  countryCode: string;
  countryName: string;
  flag: string;
  director: CommercialAgentRecord | null;
  agentsCount: number;
  subordinates: CommercialAgentRecord[];
  totalCountrySalesXaf: number;
  aggregatedTargetXaf: number;
  progressPercent: number;
}

const COUNTRY_FLAGS: Record<string, string> = {
  CM: "🇨🇲 Cameroun",
  GA: "🇬🇦 Gabon",
  CG: "🇨🇬 Congo",
  TD: "🇹🇩 Tchad",
  CF: "🇨🇫 RCA",
  GQ: "🇬🇶 Guinée Éq.",
};

const DEFAULT_COUNTRY_HUBS: CountryHub[] = [
  {
    countryCode: "CM",
    countryName: "Cameroun",
    flag: "🇨🇲",
    director: {
      id: "comm-1",
      full_name: "Christian Bekono",
      email: "commercial.douala@authenticv.app",
      phone: "+237 699 12 34 56",
      assigned_country: "CM",
      assigned_city: "Douala & National",
      role: "country_director",
      director_id: null,
      commission_rate: 10,
      override_commission_rate: 2.5,
      monthly_target_xaf: 3500000,
      total_sales_xaf: 320000,
      total_commissions_earned_xaf: 38250,
      total_commissions_paid_xaf: 20000,
      promo_code: "DIRCM10",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    agentsCount: 3,
    subordinates: [
      {
        id: "comm-team-1",
        full_name: "Arnaud Bopda",
        email: "commercial.yaounde@authenticv.app",
        phone: "+237 677 88 99 00",
        assigned_country: "CM",
        assigned_city: "Yaoundé & Centre",
        role: "agent",
        director_id: "comm-1",
        commission_rate: 10,
        monthly_target_xaf: 500000,
        total_sales_xaf: 150000,
        total_commissions_earned_xaf: 15000,
        total_commissions_paid_xaf: 0,
        promo_code: "ARNAUD10",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "comm-team-2",
        full_name: "Marcelle Tchuente",
        email: "commercial.bafoussam@authenticv.app",
        phone: "+237 655 44 33 22",
        assigned_country: "CM",
        assigned_city: "Bafoussam / Ouest",
        role: "agent",
        director_id: "comm-1",
        commission_rate: 10,
        monthly_target_xaf: 500000,
        total_sales_xaf: 100000,
        total_commissions_earned_xaf: 10000,
        total_commissions_paid_xaf: 0,
        promo_code: "MARCELLE10",
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    totalCountrySalesXaf: 570000,
    aggregatedTargetXaf: 4500000,
    progressPercent: 13,
  },
  {
    countryCode: "GA",
    countryName: "Gabon",
    flag: "🇬🇦",
    director: {
      id: "comm-2",
      full_name: "Emmanuel Nguema",
      email: "directeur.gabon@authenticv.app",
      phone: "+241 77 11 22 33",
      assigned_country: "GA",
      assigned_city: "Libreville / Port-Gentil",
      role: "country_director",
      director_id: null,
      commission_rate: 10,
      override_commission_rate: 2.5,
      monthly_target_xaf: 2500000,
      total_sales_xaf: 450000,
      total_commissions_earned_xaf: 45000,
      total_commissions_paid_xaf: 0,
      promo_code: "DIRGA10",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    agentsCount: 1,
    subordinates: [],
    totalCountrySalesXaf: 450000,
    aggregatedTargetXaf: 2500000,
    progressPercent: 18,
  },
  {
    countryCode: "CG",
    countryName: "Congo",
    flag: "🇨🇬",
    director: {
      id: "comm-3",
      full_name: "Serge Ngoma",
      email: "commercial.brazzaville@authenticv.app",
      phone: "+242 06 12 34 56",
      assigned_country: "CG",
      assigned_city: "Brazzaville & Pointe-Noire",
      role: "country_director",
      director_id: null,
      commission_rate: 10,
      override_commission_rate: 2.5,
      monthly_target_xaf: 2500000,
      total_sales_xaf: 95000,
      total_commissions_earned_xaf: 9500,
      total_commissions_paid_xaf: 0,
      promo_code: "DIRCG10",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    agentsCount: 1,
    subordinates: [],
    totalCountrySalesXaf: 95000,
    aggregatedTargetXaf: 2500000,
    progressPercent: 4,
  },
];

export function AdminCommercialsManager() {
  const [countryHubs, setCountryHubs] = useState<CountryHub[]>(DEFAULT_COUNTRY_HUBS);
  const [summary, setSummary] = useState({
    totalAgents: 5,
    totalTeamSalesXaf: 1115000,
    totalCommissionsEarnedXaf: 102750,
    totalCommissionsPaidXaf: 20000,
    pendingCommissionsXaf: 82750,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({
    CM: true,
    GA: true,
    CG: true,
  });

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [assignedCountry, setAssignedCountry] = useState("CM");
  const [assignedCity, setAssignedCity] = useState("Douala / Littoral");
  const [role, setRole] = useState<"agent" | "country_director">("agent");
  const [monthlyTarget, setMonthlyTarget] = useState("500000");
  const [promoCode, setPromoCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Quota Edit State
  const [editingTargetAgent, setEditingTargetAgent] = useState<CommercialAgentRecord | null>(null);
  const [newTargetValue, setNewTargetValue] = useState("");

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/commercials");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement");
      }
      if (data.countryHubs) setCountryHubs(data.countryHubs);
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const toggleCountry = (code: string) => {
    setExpandedCountries((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert("Veuillez renseigner le nom, l'email et le téléphone.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/commercials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          assigned_country: assignedCountry,
          assigned_city: assignedCity.trim(),
          role,
          monthly_target_xaf: Number(monthlyTarget) || (role === "country_director" ? 3500000 : 500000),
          commission_rate: 10,
          override_commission_rate: role === "country_director" ? 2.5 : 0,
          promo_code: promoCode.trim().toUpperCase() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setIsModalOpen(false);
      setFullName("");
      setEmail("");
      setPhone("");
      setPromoCode("");
      fetchAgents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDynamicQuota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTargetAgent || !newTargetValue) return;

    try {
      const res = await fetch("/api/admin/commercials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTargetAgent.id,
          monthly_target_xaf: Number(newTargetValue),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      alert("Quota mensuel ajusté avec succès !");
      setEditingTargetAgent(null);
      fetchAgents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handlePayCommission = async (agent: CommercialAgentRecord) => {
    const pending = (agent.total_commissions_earned_xaf || 0) - (agent.total_commissions_paid_xaf || 0);
    if (pending <= 0) {
      alert("Toutes les commissions de cet agent ont déjà été versées.");
      return;
    }

    const confirm = window.confirm(
      `Confirmez-vous le versement de ${pending.toLocaleString("fr-FR")} FCFA par Mobile Money à ${agent.full_name} (${agent.phone}) ?`
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/admin/commercials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agent.id, mark_paid_amount_xaf: pending }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      alert(`Versement de ${pending.toLocaleString("fr-FR")} FCFA enregistré avec succès !`);
      fetchAgents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
          {error}
        </div>
      )}
      {/* ── Top Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Équipe Commerciale CEMAC
          </div>
          <div className="text-2xl font-black text-white">
            {summary.totalAgents}{" "}
            <span className="text-xs font-normal text-slate-400">Commerciaux &amp; Directeurs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">6 Hubs Nationaux Actifs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Ventes Générées (Équipe)
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {summary.totalTeamSalesXaf.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-emerald-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Transactions B2B / B2C certifiées</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Commissions Dues (En Attente)
          </div>
          <div className="text-2xl font-black text-amber-400">
            {summary.pendingCommissionsXaf.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-amber-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">À verser par Mobile Money</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Commissions Déjà Versées
          </div>
          <div className="text-2xl font-black text-indigo-300">
            {summary.totalCommissionsPaidXaf.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-indigo-400">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Historique validé MoMo</div>
        </div>
      </div>

      {/* ── Actions Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">
            Architecture Hiérarchique &amp; Pôles Nationaux CEMAC
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchAgents}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setRole("agent");
              setMonthlyTarget("500000");
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter un Commercial / Directeur</span>
          </button>
        </div>
      </div>

      {/* ── Hierarchical Country Hubs Accordions ── */}
      <div className="space-y-4">
        {countryHubs.map((hub) => {
          const isExpanded = !!expandedCountries[hub.countryCode];
          return (
            <div
              key={hub.countryCode}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              {/* Hub Country Header */}
              <div
                onClick={() => toggleCountry(hub.countryCode)}
                className="px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{hub.flag}</span>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>Pôle National — {hub.countryName}</span>
                      <span className="text-xs bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                        {hub.agentsCount} membre(s)
                      </span>
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Directeur :{" "}
                      <span className="text-amber-300 font-semibold">
                        {hub.director ? hub.director.full_name : "Poste à pourvoir"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <div className="font-bold text-white">
                      {hub.totalCountrySalesXaf.toLocaleString("fr-FR")}{" "}
                      <span className="text-slate-500 font-normal">/ {hub.aggregatedTargetXaf.toLocaleString("fr-FR")} FCFA</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold">{hub.progressPercent}% du Quota National</div>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Hub Expanded Content */}
              {isExpanded && (
                <div className="p-5 space-y-4">
                  {/* Country Director Card (If exists) */}
                  {hub.director && (
                    <div className="bg-gradient-to-r from-amber-950/30 to-slate-950 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{hub.director.full_name}</span>
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                              👑 Directeur Commercial National
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">{hub.director.email} · {hub.director.phone}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-amber-400">
                          Code : {hub.director.promo_code || `DIR${hub.countryCode}10`}
                        </div>

                        <button
                          onClick={() => {
                            if (hub.director) {
                              setEditingTargetAgent(hub.director);
                              setNewTargetValue(String(hub.director.monthly_target_xaf || 3500000));
                            }
                          }}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                        >
                          Ajuster Quota ({(((hub.director?.monthly_target_xaf || 3500000)) / 1000).toFixed(0)}k F)
                        </button>

                        <button
                          onClick={() => handlePayCommission(hub.director!)}
                          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow cursor-pointer"
                        >
                          Payer MoMo ({((hub.director.total_commissions_earned_xaf || 0) - (hub.director.total_commissions_paid_xaf || 0)).toLocaleString("fr-FR")} F)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subordinate Local Agents Table */}
                  {hub.subordinates.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                          <tr>
                            <th className="p-3">Délégué Commercial</th>
                            <th className="p-3">Ville / Secteur</th>
                            <th className="p-3">Code Promo</th>
                            <th className="p-3">Quota Mensuel</th>
                            <th className="p-3">Ventes</th>
                            <th className="p-3">Commissions Dues</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {hub.subordinates.map((agent) => {
                            const pending = (agent.total_commissions_earned_xaf || 0) - (agent.total_commissions_paid_xaf || 0);
                            return (
                              <tr key={agent.id} className="hover:bg-slate-800/40">
                                <td className="p-3 font-medium text-white">{agent.full_name}</td>
                                <td className="p-3">{agent.assigned_city}</td>
                                <td className="p-3 font-mono text-amber-400">{agent.promo_code}</td>
                                <td className="p-3 font-bold text-slate-200">
                                  {agent.monthly_target_xaf.toLocaleString("fr-FR")} F
                                </td>
                                <td className="p-3 font-bold text-emerald-400">
                                  {agent.total_sales_xaf.toLocaleString("fr-FR")} F
                                </td>
                                <td className="p-3 font-bold text-amber-300">
                                  {pending > 0 ? `${pending.toLocaleString("fr-FR")} F` : "Réglé"}
                                </td>
                                <td className="p-3 text-right space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingTargetAgent(agent);
                                      setNewTargetValue(String(agent.monthly_target_xaf));
                                    }}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[11px]"
                                  >
                                    Quota
                                  </button>
                                  <button
                                    onClick={() => handlePayCommission(agent)}
                                    disabled={pending <= 0}
                                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-2.5 py-1 rounded text-[11px]"
                                  >
                                    Payer MoMo
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-slate-500 py-3">
                      Aucun délégué commercial pour l&apos;instant dans ce pays. Cliquez sur &ldquo;Ajouter un Commercial&rdquo; pour recruter.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── MODAL: CRÉER UN COMMERCIAL / DIRECTEUR ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">
                  {role === "country_director" ? "Nommer un Directeur Commercial Pays" : "Ajouter un Délégué Commercial"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Rôle dans la Structure</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      const newRole = e.target.value as "agent" | "country_director";
                      setRole(newRole);
                      if (newRole === "country_director") {
                        setMonthlyTarget("3500000");
                      } else {
                        setMonthlyTarget("500000");
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-medium"
                  >
                    <option value="agent">💼 Délégué Commercial Terrain</option>
                    <option value="country_director">👑 Directeur Commercial National</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pays d&apos;Assignation CEMAC</label>
                  <select
                    value={assignedCountry}
                    onChange={(e) => setAssignedCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {Object.entries(COUNTRY_FLAGS).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nom et Prénom</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Christian Bekono"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Professionnel</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@authenticv.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">N° Téléphone WhatsApp / MoMo</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ville / Circonscription</label>
                  <input
                    type="text"
                    required
                    value={assignedCity}
                    onChange={(e) => setAssignedCity(e.target.value)}
                    placeholder="Douala, Libreville, etc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Quota Mensuel (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={monthlyTarget}
                    onChange={(e) => setMonthlyTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Code Promo Souhaité (Optionnel - Auto si vide)</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={role === "country_director" ? `DIR${assignedCountry}10` : "CHRISTIAN10"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg"
                >
                  {submitting ? "Création..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: AJUSTER LE QUOTA DYNAMIQUE ── */}
      {editingTargetAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm">Ajuster l&apos;Objectif Mensuel</h3>
              <button onClick={() => setEditingTargetAgent(null)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleSaveDynamicQuota} className="space-y-4 text-xs">
              <div>
                <div className="text-slate-400 mb-1 font-medium">{editingTargetAgent.full_name}</div>
                <input
                  type="number"
                  required
                  value={newTargetValue}
                  onChange={(e) => setNewTargetValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base font-bold text-emerald-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTargetAgent(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

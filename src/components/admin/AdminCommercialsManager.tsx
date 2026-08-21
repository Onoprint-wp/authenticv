"use client";

import { useEffect, useState } from "react";
import {
  Users, PlusCircle, RefreshCw, CheckCircle2,
  DollarSign, Phone, Mail, Award, Target, AlertCircle, X, ShieldCheck
} from "lucide-react";
import { CommercialAgentRecord } from "@/app/api/admin/commercials/route";

const COUNTRY_FLAGS: Record<string, string> = {
  CM: "🇨🇲 Cameroun",
  GA: "🇬🇦 Gabon",
  CG: "🇨🇬 Congo",
  TD: "🇹🇩 Tchad",
  CF: "🇨🇫 RCA",
  GQ: "🇬🇶 Guinée Éq.",
};

export function AdminCommercialsManager() {
  const [agents, setAgents] = useState<CommercialAgentRecord[]>([]);
  const [summary, setSummary] = useState({
    totalAgents: 0,
    totalTeamSalesXaf: 0,
    totalCommissionsEarnedXaf: 0,
    totalCommissionsPaidXaf: 0,
    pendingCommissionsXaf: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [assignedCountry, setAssignedCountry] = useState("CM");
  const [assignedCity, setAssignedCity] = useState("Douala / Littoral");
  const [monthlyTarget, setMonthlyTarget] = useState("500000");
  const [commissionRate, setCommissionRate] = useState("10");
  const [promoCode, setPromoCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/commercials");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement");
      }
      setAgents(data.agents || []);
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
          monthly_target_xaf: Number(monthlyTarget) || 500000,
          commission_rate: Number(commissionRate) || 10,
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
      {/* ── Top Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Équipe Commerciale CEMAC
          </div>
          <div className="text-2xl font-black text-white">
            {summary.totalAgents}{" "}
            <span className="text-xs font-normal text-slate-400">Agents Actifs</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Douala, Libreville, Bzv, N&apos;Djamena</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Ventes Générées (Équipe)
          </div>
          <div className="text-2xl font-black text-indigo-400">
            {summary.totalTeamSalesXaf.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-slate-400">FCFA</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">Closing B2B &amp; Campus</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Commissions Versées
          </div>
          <div className="text-2xl font-black text-slate-300">
            {summary.totalCommissionsPaidXaf.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Payées par MTN / Orange MoMo</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-slate-900 to-emerald-950/20">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Commissions en Attente
          </div>
          <div className="text-2xl font-black text-amber-400">
            {summary.pendingCommissionsXaf.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-slate-400">FCFA</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">À verser aux commerciaux</div>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Gestion de l&apos;Équipe Commerciale &amp; Attribution des Secteurs
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Suivez les performances individuelles, les objectifs de vente et les commissions dues à chaque délégué commercial en zone CEMAC.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchAgents}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Commercial</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Table of Sales Agents ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Agent Commercial</th>
                <th className="px-4 py-3.5 font-semibold">Secteur / Ville</th>
                <th className="px-4 py-3.5 font-semibold">Objectif &amp; Ventes</th>
                <th className="px-4 py-3.5 font-semibold">Commissions Dues</th>
                <th className="px-4 py-3.5 font-semibold">Code Promo</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Chargement de l&apos;équipe commerciale...
                  </td>
                </tr>
              ) : (
                agents.map((a) => {
                  const targetPct = a.monthly_target_xaf
                    ? Math.min(100, Math.round(((a.total_sales_xaf || 0) / a.monthly_target_xaf) * 100))
                    : 0;
                  const pending = (a.total_commissions_earned_xaf || 0) - (a.total_commissions_paid_xaf || 0);

                  return (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-xs">{a.full_name}</div>
                        <div className="text-[11px] text-slate-400">{a.email}</div>
                        <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{a.phone}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200">
                          {COUNTRY_FLAGS[a.assigned_country] || "🇨🇲"}
                        </div>
                        <div className="text-[11px] text-slate-400">{a.assigned_city}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-bold text-indigo-300">
                            {(a.total_sales_xaf || 0).toLocaleString("fr-FR")} F
                          </span>
                          <span className="text-slate-500">/ {(a.monthly_target_xaf || 500000).toLocaleString("fr-FR")} F ({targetPct}%)</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${targetPct >= 80 ? "bg-emerald-500" : "bg-indigo-500"}`}
                            style={{ width: `${targetPct}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-extrabold text-amber-400 text-xs">
                          {pending.toLocaleString("fr-FR")} FCFA
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Taux : {a.commission_rate}% sur ventes
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 text-indigo-300 font-bold">
                          {a.promo_code || `${a.full_name.split(" ")[0].toUpperCase()}10`}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handlePayCommission(a)}
                          disabled={pending <= 0}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-800/40 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          Payer MoMo
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Nouveau Commercial ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Ajouter un Agent Commercial</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Christian Bekono"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Professionnel *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commercial@authenticv.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Téléphone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Code Promo Affilié</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Ex: CHRISTIAN10"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pays CEMAC</label>
                  <select
                    value={assignedCountry}
                    onChange={(e) => setAssignedCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CM">🇨🇲 Cameroun</option>
                    <option value="GA">🇬🇦 Gabon</option>
                    <option value="CG">🇨🇬 Congo</option>
                    <option value="TD">🇹🇩 Tchad</option>
                    <option value="CF">🇨🇫 RCA</option>
                    <option value="GQ">🇬🇶 Guinée Éq.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ville / Région</label>
                  <input
                    type="text"
                    value={assignedCity}
                    onChange={(e) => setAssignedCity(e.target.value)}
                    placeholder="Douala, Libreville..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Objectif Mensuel (FCFA)</label>
                  <input
                    type="number"
                    value={monthlyTarget}
                    onChange={(e) => setMonthlyTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Taux de Commission (%)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                >
                  {submitting ? "Création..." : "Créer le Commercial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

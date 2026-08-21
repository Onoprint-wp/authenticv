"use client";

import { useEffect, useState } from "react";
import {
  Tag, PlusCircle, RefreshCw, CheckCircle2,
  Copy, AlertCircle, X
} from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  target_plan: string;
  max_uses: number;
  current_uses: number;
  total_revenue_generated_xaf: number;
  campaign_name?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

export function AdminPromoManager() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("20");
  const [targetPlan, setTargetPlan] = useState("all");
  const [maxUses, setMaxUses] = useState("100");
  const [campaignName, setCampaignName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPromos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/promo");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement");
      }
      setPromos(data.promos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCopy = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (p: PromoCode) => {
    try {
      const res = await fetch("/api/admin/promo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_active: !p.is_active }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setPromos((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, is_active: !item.is_active } : item))
      );
    } catch {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("Le code est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          discount_percent: Number(discountPercent) || 20,
          target_plan: targetPlan,
          max_uses: Number(maxUses) || 100,
          campaign_name: campaignName.trim(),
          expires_at: expiresAt || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setIsModalOpen(false);
      setCode("");
      setCampaignName("");
      fetchPromos();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const totalGeneratedRev = promos.reduce((acc, p) => acc + (p.total_revenue_generated_xaf || 0), 0);
  const totalUses = promos.reduce((acc, p) => acc + (p.current_uses || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Codes Actifs &amp; Campagnes
          </div>
          <div className="text-2xl font-black text-white">
            {promos.filter((p) => p.is_active).length}{" "}
            <span className="text-xs font-normal text-slate-400">/ {promos.length} codes</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Attribution marketing trackée</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Utilisations par les Candidats
          </div>
          <div className="text-2xl font-black text-indigo-400">
            {totalUses}{" "}
            <span className="text-xs font-normal text-slate-400">conversions</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Codes saisis au checkout</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-slate-900 to-indigo-950/20">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
            Chiffre d&apos;Affaires Attribué
          </div>
          <div className="text-2xl font-black text-amber-400">
            {totalGeneratedRev.toLocaleString("fr-FR")}{" "}
            <span className="text-xs font-medium text-slate-400">FCFA</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            Ventes catalysées par promotions
          </div>
        </div>
      </div>

      {/* ── Header & Action Bar ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Gestionnaire des Codes Promotionnels &amp; Partenaires
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Créez des codes promo éphémères pour vos campagnes sur les réseaux sociaux, influenceurs et salons de recrutement.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchPromos}
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
            <span>Créer un Code Promo</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Promo Codes Table ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Code Promo</th>
                <th className="px-4 py-3.5 font-semibold">Campagne &amp; Cible</th>
                <th className="px-4 py-3.5 font-semibold">Réduction</th>
                <th className="px-4 py-3.5 font-semibold">Utilisations</th>
                <th className="px-4 py-3.5 font-semibold">Revenus Générés</th>
                <th className="px-4 py-3.5 font-semibold">Statut</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && promos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-500" />
                    Chargement des codes promotionnels...
                  </td>
                </tr>
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    Aucun code promotionnel configuré.
                  </td>
                </tr>
              ) : (
                promos.map((p) => {
                  const usagePct = p.max_uses ? Math.min(100, Math.round((p.current_uses / p.max_uses) * 100)) : 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            {p.code}
                          </span>
                          <button
                            onClick={() => handleCopy(p.code)}
                            className="text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                            title="Copier le code"
                          >
                            {copiedCode === p.code ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-200">{p.campaign_name || "Promotion Générale"}</div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          Offre : {p.target_plan === "all" ? "Toutes offres" : p.target_plan}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                          -{p.discount_percent}%
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-300 font-semibold">{p.current_uses}</span>
                          <span className="text-slate-500">/ {p.max_uses} max</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${usagePct > 80 ? "bg-amber-500" : "bg-indigo-500"}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-bold text-amber-400 text-xs">
                        {(p.total_revenue_generated_xaf || 0).toLocaleString("fr-FR")} FCFA
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {p.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            Inactif
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors border border-slate-700 cursor-pointer"
                        >
                          {p.is_active ? "Désactiver" : "Activer"}
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

      {/* ── Modal Création Code Promo ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Nouveau Code Promotionnel</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Code Promo (Majuscules) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: TIKTOK2026, INFLUENCEUR50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Réduction (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Limite d&apos;Usages</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Offre Cible</label>
                  <select
                    value={targetPlan}
                    onChange={(e) => setTargetPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">Toutes les offres</option>
                    <option value="single">Acte 1 000 FCFA</option>
                    <option value="monthly">Abonnement Pro 5 000 FCFA</option>
                    <option value="recruiter">Packs Recruteur B2B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Expiration</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nom de Campagne / Partenaire</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Campagne Rentrée Scolaire, Influenceur X..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
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
                  {submitting ? "Création..." : "Créer le Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { GraduationCap, PlusCircle, Check, Loader2, AlertCircle, Download } from "lucide-react";

interface CampusPartner {
  id: string;
  name: string;
  domain?: string;
  promo_code: string;
  discount_percent: number;
  created_at: string;
}

export function AdminCampusPartners() {
  const [partners, setPartners] = useState<CampusPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("20");

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/campus");
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDownloadContract = async (p: CampusPartner) => {
    try {
      const res = await fetch("/api/admin/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractType: "campus",
          countryCode: "CM",
          universityName: p.name,
          promoCode: p.promo_code,
          discountPercent: p.discount_percent,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la génération");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Convention_Campus_${p.name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du téléchargement de la convention PDF.");
    }
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !promoCode.trim()) {
      setError("Le nom de l'université et le code promo sont requis.");
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/campus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          domain: domain.trim(),
          promo_code: promoCode.trim(),
          discount_percent: Number(discountPercent) || 20,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la création du partenaire");
      }

      setSuccess(data.message || "Partenaire campus ajouté avec succès !");
      setName("");
      setDomain("");
      setPromoCode("");
      setDiscountPercent("20");
      fetchPartners();
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Partenariats Universitaires & Écoles Partenaires</h2>
        </div>
        <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full">
          {partners.length} Partenaire(s) Actif(s)
        </span>
      </div>

      {/* Formulaire d'ajout 1-clic */}
      <form onSubmit={handleAddPartner} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Nouveau Partenariat Campus</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Établissement / Université</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Université de Douala"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Domaine Email (Optionnel)</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="ex: univ-douala.cm"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Code Promo Campus</label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="ex: UDLA20, UY1"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Réduction (%)</label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="20"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={creating}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
          <span>Ajouter le Partenaire Campus</span>
        </button>
      </form>

      {/* Tableau des établissements partenaires */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Chargement des partenaires campus…</span>
          </div>
        ) : partners.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            Aucun partenaire universitaire enregistré dans Supabase pour le moment.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Établissement</th>
                <th className="py-2.5 px-3">Domaine Email</th>
                <th className="py-2.5 px-3">Code Promo</th>
                <th className="py-2.5 px-3">Réduction</th>
                <th className="py-2.5 px-3 text-right">Convention PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-white">{p.name}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{p.domain || "—"}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded text-[11px]">
                      {p.promo_code}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 font-bold px-2 py-0.5 rounded text-[11px]">
                      -{p.discount_percent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleDownloadContract(p)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Convention PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

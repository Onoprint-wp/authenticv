"use client";

import { useEffect, useState } from "react";
import {
  FileText, Building2, Save, Download, CheckCircle2,
  AlertCircle, ArrowUpRight, DollarSign, ShieldCheck, Loader2
} from "lucide-react";

interface CompanyProfile {
  id?: string;
  company_name: string;
  email: string;
  credits_balance: number;
  plan: string;
  country_code?: string;
  city?: string;
  rccm?: string;
  niu_or_nif?: string;
}

interface Invoice {
  id: string;
  reference_id: string;
  amount_xaf: number;
  payment_type: string;
  status: string;
  operator: string;
  created_at: string;
}

export function RecruiterInvoicesView() {
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: "",
    email: "",
    credits_balance: 0,
    plan: "pay_as_you_go",
    country_code: "CM",
    city: "Douala",
    rccm: "",
    niu_or_nif: "",
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/profile");
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.company) setProfile(data.company);
        if (data.invoices) setInvoices(data.invoices);
      }
    } catch (err) {
      setError("Impossible de charger les informations de facturation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/recruiter/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Erreur de sauvegarde");

      setSuccessMessage("Profil fiscal et coordonnées enregistrés avec succès !");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* ── Header ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Espace Facturation &amp; Justificatifs Fiscaux Entreprise (Zone CEMAC)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Renseignez votre N° RCCM et identifiant fiscal (NIU/NIF) pour que vos factures soient directement conformes et déductibles selon le droit OHADA.
          </p>
        </div>

        <div className="text-right bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">Solde de Crédits</div>
          <div className="text-base font-extrabold text-amber-400">
            {profile.credits_balance} <span className="text-xs">contacts</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Fiscal Form ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Informations Légales &amp; Fiscales de l&apos;Entreprise
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Raison Sociale / Nom Entreprise *</label>
              <input
                type="text"
                required
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Ex: Orange Cameroun, Cabinet RH Sarl..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email pour l&apos;envoi des factures *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="comptabilite@entreprise.cm"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pays du Siège (CEMAC)</label>
              <select
                value={profile.country_code || "CM"}
                onChange={(e) => setProfile({ ...profile, country_code: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CM">🇨🇲 Cameroun</option>
                <option value="GA">🇬🇦 Gabon</option>
                <option value="CG">🇨🇬 Congo-Brazzaville</option>
                <option value="TD">🇹🇩 Tchad</option>
                <option value="CF">🇨🇫 République Centrafricaine</option>
                <option value="GQ">🇬🇶 Guinée Équatoriale</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">N° RCCM (Registre de Commerce)</label>
              <input
                type="text"
                value={profile.rccm || ""}
                onChange={(e) => setProfile({ ...profile, rccm: e.target.value })}
                placeholder="RC/DLA/2026/B/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">NIU / NIF (Identifiant Fiscal)</label>
              <input
                type="text"
                value={profile.niu_or_nif || ""}
                onChange={(e) => setProfile({ ...profile, niu_or_nif: e.target.value })}
                placeholder="M0123456789A"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Enregistrer le Profil Fiscal</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Invoices History Table ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Historique de vos Factures &amp; Paiements Reçus
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">TVA non applicable (Régime EdTech CEMAC)</span>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Aucune facture disponible pour le moment. Vos prochains achats de packs de crédits apparaîtront automatiquement ici.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Réf. Facture</th>
                  <th className="px-4 py-3 font-semibold">Désignation</th>
                  <th className="px-4 py-3 font-semibold">Montant (XAF)</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold text-right">Télécharger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(inv.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-indigo-400 font-semibold">
                      {inv.reference_id}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-200">
                      {inv.payment_type.includes("15")
                        ? "Pack 15 Déblocages RH"
                        : inv.payment_type.includes("5")
                        ? "Pack 5 Déblocages RH"
                        : "Pass Recruteur Illimité"}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                      {Number(inv.amount_xaf).toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                        <CheckCircle2 className="w-3 h-3" />
                        Payé
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <a
                        href={`/api/export-invoice-pdf?ref=${inv.reference_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-[11px] font-medium transition-colors border border-slate-700"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

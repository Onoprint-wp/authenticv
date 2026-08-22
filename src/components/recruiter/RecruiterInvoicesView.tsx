"use client";

import { useEffect, useState } from "react";
import {
  FileText, Building2, Save, Download, CheckCircle2,
  AlertCircle, ShieldCheck, Loader2
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
    } catch {
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
    <div className="space-y-8 max-w-4xl mx-auto py-4 font-sans text-foreground">
      {/* ── Header ── */}
      <div className="bg-card border border-border rounded-2xl p-6 elevation-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-bold font-heading text-card-foreground">
              Espace Facturation &amp; Justificatifs Fiscaux Entreprise (Zone CEMAC)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-1">
            Renseignez votre N° RCCM et identifiant fiscal (NIU/NIF) pour que vos factures soient directement conformes et déductibles selon le droit OHADA.
          </p>
        </div>

        <div className="text-right bg-muted/40 px-4 py-2 rounded-xl border border-border">
          <div className="text-[10px] text-muted-foreground uppercase font-sans font-bold">Solde de Crédits</div>
          <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-heading">
            {profile.credits_balance} <span className="text-xs font-sans text-muted-foreground">contacts</span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-sans font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-800 dark:text-red-300 flex items-center gap-2 font-sans font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Fiscal Form ── */}
      <div className="bg-card border border-border rounded-2xl p-6 elevation-1 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <ShieldCheck className="w-4 h-4 text-brand-blue" />
          <h3 className="text-xs font-bold font-heading text-card-foreground uppercase tracking-wider">
            Informations Légales &amp; Fiscales de l&apos;Entreprise
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 font-sans">Raison Sociale / Nom Entreprise *</label>
              <input
                type="text"
                required
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Ex: Orange Cameroun, Cabinet RH Sarl..."
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 font-sans">Email pour l&apos;envoi des factures *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="comptabilite@entreprise.cm"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 font-sans">Pays du Siège (CEMAC)</label>
              <select
                value={profile.country_code || "CM"}
                onChange={(e) => setProfile({ ...profile, country_code: e.target.value })}
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-blue font-sans"
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
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 font-sans">N° RCCM (Registre de Commerce)</label>
              <input
                type="text"
                value={profile.rccm || ""}
                onChange={(e) => setProfile({ ...profile, rccm: e.target.value })}
                placeholder="RC/DLA/2026/B/..."
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-blue font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1 font-sans">NIU / NIF (Identifiant Fiscal)</label>
              <input
                type="text"
                value={profile.niu_or_nif || ""}
                onChange={(e) => setProfile({ ...profile, niu_or_nif: e.target.value })}
                placeholder="M0123456789A"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-brand-blue font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Enregistrer le Profil Fiscal</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── Invoices History Table ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden elevation-1 space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-blue" />
            <h3 className="text-xs font-bold font-heading text-card-foreground uppercase tracking-wider">
              Historique de vos Factures &amp; Paiements Reçus
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-sans">TVA non applicable (Régime EdTech CEMAC)</span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-xs flex items-center justify-center gap-2 font-sans">
            <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
            <span>Chargement des factures...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs font-sans">
            Aucune facture disponible pour le moment. Vos prochains achats de packs de crédits apparaîtront automatiquement ici.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Opérateur</th>
                  <th className="py-2.5 px-3 text-right">Montant (FCFA)</th>
                  <th className="py-2.5 px-3 text-right">Facture PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/50 transition-colors text-foreground">
                    <td className="py-3 px-3 font-mono text-xs">{inv.reference_id}</td>
                    <td className="py-3 px-3">{new Date(inv.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="py-3 px-3 capitalize">{inv.payment_type}</td>
                    <td className="py-3 px-3 uppercase text-brand-blue font-semibold">{inv.operator}</td>
                    <td className="py-3 px-3 text-right font-bold">{inv.amount_xaf.toLocaleString("fr-FR")} FCFA</td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`/api/export-invoice-pdf?id=${inv.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-brand-blue hover:underline font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
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

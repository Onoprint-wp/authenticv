"use client";

import { useEffect, useState } from "react";
import {
  Building2, PlusCircle, RefreshCw, CheckCircle2,
  DollarSign, ArrowRight, ArrowLeft, Phone, Mail, FileText,
  AlertCircle, X
} from "lucide-react";

export interface Lead {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  country_code: string;
  city?: string;
  stage: "prospect" | "demo" | "negociation" | "client_actif" | "perdu";
  pack_interet: "single" | "pack5" | "pack15" | "monthly_pro" | "corporate";
  estimated_value_xaf: number;
  rccm?: string;
  niu_or_nif?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const STAGES: { id: Lead["stage"]; label: string; color: string; border: string }[] = [
  { id: "prospect", label: "1. Prospection", color: "bg-slate-800/80 text-slate-300", border: "border-slate-700" },
  { id: "demo", label: "2. Démo Réalisée", color: "bg-blue-950/60 text-blue-300", border: "border-blue-800/50" },
  { id: "negociation", label: "3. Devis / Négociation", color: "bg-amber-950/60 text-amber-300", border: "border-amber-800/50" },
  { id: "client_actif", label: "4. Signé & Actif", color: "bg-emerald-950/60 text-emerald-300", border: "border-emerald-800/50" },
  { id: "perdu", label: "5. En pause / Perdu", color: "bg-red-950/60 text-red-300", border: "border-red-800/50" },
];

const PACK_LABELS: Record<string, string> = {
  single: "1 Crédit (5 000 F)",
  pack5: "Pack 5 (20 000 F)",
  pack15: "Pack 15 (50 000 F)",
  monthly_pro: "Pass Mensuel (75 000 F)",
  corporate: "Sur-Mesure Grand Compte",
};

const COUNTRY_FLAGS: Record<string, string> = {
  CM: "🇨🇲",
  GA: "🇬🇦",
  CG: "🇨🇬",
  TD: "🇹🇩",
  CF: "🇨🇫",
  GQ: "🇬🇶",
  INTL: "🌍",
};

export function AdminB2BPipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for new lead
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [countryCode, setCountryCode] = useState("CM");
  const [city, setCity] = useState("Douala");
  const [packInteret, setPackInteret] = useState<Lead["pack_interet"]>("pack15");
  const [estimatedValue, setEstimatedValue] = useState("50000");
  const [rccm, setRccm] = useState("");
  const [niu, setNiu] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads?country=${countryFilter}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement des leads");
      }
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [countryFilter]);

  const handleMoveStage = async (lead: Lead, direction: "next" | "prev") => {
    const stageOrder: Lead["stage"][] = ["prospect", "demo", "negociation", "client_actif", "perdu"];
    const currentIndex = stageOrder.indexOf(lead.stage);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex < 0 || newIndex >= stageOrder.length) return;
    const newStage = stageOrder[newIndex];

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, stage: newStage }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, stage: newStage } : l))
      );
    } catch {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("Le nom de l'entreprise est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          contact_name: contactName.trim(),
          contact_email: contactEmail.trim(),
          contact_phone: contactPhone.trim(),
          country_code: countryCode,
          city: city.trim(),
          stage: "prospect",
          pack_interet: packInteret,
          estimated_value_xaf: Number(estimatedValue) || 50000,
          rccm: rccm.trim(),
          niu_or_nif: niu.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setIsModalOpen(false);
      // Reset form
      setCompanyName("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setNotes("");
      fetchLeads();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur de création");
    } finally {
      setSubmitting(false);
    }
  };

  const totalPipeline = leads.reduce((acc, l) => acc + (l.stage !== "perdu" ? l.estimated_value_xaf : 0), 0);
  const wonPipeline = leads.filter((l) => l.stage === "client_actif").reduce((acc, l) => acc + l.estimated_value_xaf, 0);

  return (
    <div className="space-y-6">
      {/* ── Summary & Control Bar ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Pipeline de Prospection B2B &amp; Ventes Entreprises CEMAC
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Suivez le cycle de vente auprès des DRH et cabinets de recrutement de Douala, Libreville, Brazzaville et N&apos;Djamena.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Pipeline Actif</div>
              <div className="text-xs font-black text-indigo-300">
                {totalPipeline.toLocaleString("fr-FR")} <span className="text-[10px]">FCFA</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Contrats Gagnés</div>
              <div className="text-xs font-black text-emerald-400">
                {wonPipeline.toLocaleString("fr-FR")} <span className="text-[10px]">FCFA</span>
              </div>
            </div>
          </div>

          {/* Country Selector */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">🌍 Tous les pays</option>
            <option value="CM">🇨🇲 Cameroun</option>
            <option value="GA">🇬🇦 Gabon</option>
            <option value="CG">🇨🇬 Congo</option>
            <option value="TD">🇹🇩 Tchad</option>
            <option value="CF">🇨🇫 RCA</option>
            <option value="GQ">🇬🇶 Guinée Éq.</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Prospect B2B</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Kanban Grid (5 Columns) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const stageTotal = stageLeads.reduce((acc, l) => acc + l.estimated_value_xaf, 0);

          return (
            <div
              key={stage.id}
              className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3 flex flex-col min-h-[500px] shadow-lg"
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-slate-800 mb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">{stage.label}</div>
                  <div className="text-[10px] text-slate-500">
                    {stageTotal.toLocaleString("fr-FR")} FCFA ({stageLeads.length})
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stage.color} ${stage.border}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {loading && leads.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 text-xs">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-slate-500" />
                    Chargement...
                  </div>
                ) : stageLeads.length === 0 ? (
                  <div className="text-center py-10 text-slate-600 text-[11px] italic">
                    Aucun prospect à cette étape.
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const flag = COUNTRY_FLAGS[lead.country_code] || "🇨🇲";

                    return (
                      <div
                        key={lead.id}
                        className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 shadow-md space-y-2.5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-1">
                              <span>{flag}</span>
                              <span className="line-clamp-1">{lead.company_name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {lead.city || "Zone CEMAC"} · {lead.contact_name || "Contact RH"}
                            </div>
                          </div>
                          <span className="text-[11px] font-extrabold text-amber-400 shrink-0">
                            {lead.estimated_value_xaf.toLocaleString("fr-FR")} F
                          </span>
                        </div>

                        {/* Pack Badge */}
                        <div className="text-[10px] text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-md inline-block font-medium">
                          {PACK_LABELS[lead.pack_interet] || lead.pack_interet}
                        </div>

                        {/* Notes snippet */}
                        {lead.notes && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/60 italic">
                            &ldquo;{lead.notes}&rdquo;
                          </p>
                        )}

                        {/* Contact info */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
                          {lead.contact_phone ? (
                            <a
                              href={`tel:${lead.contact_phone}`}
                              className="hover:text-indigo-400 flex items-center gap-1"
                              title={lead.contact_phone}
                            >
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px]">{lead.contact_phone}</span>
                            </a>
                          ) : <span />}

                          {lead.contact_email && (
                            <a
                              href={`mailto:${lead.contact_email}`}
                              className="hover:text-indigo-400"
                              title={lead.contact_email}
                            >
                              <Mail className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Card Movement Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => handleMoveStage(lead, "prev")}
                            disabled={stage.id === "prospect"}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Reculer d'étape"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleMoveStage(lead, "next")}
                            disabled={stage.id === "perdu"}
                            className="p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-20 flex items-center gap-1 text-[10px] font-semibold cursor-pointer"
                            title="Avancer d'étape"
                          >
                            <span>Avancer</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Nouveau Prospect B2B ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Ajouter un Prospect Entreprise</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Entreprise *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: TotalEnergies, MTN..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nom du Contact RH</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: M. Jean Mba (DRH)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="drh@entreprise.cm"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Téléphone / WhatsApp</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+237 6..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pays CEMAC</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
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
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ville</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Douala, Libreville..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pack Convoité</label>
                  <select
                    value={packInteret}
                    onChange={(e) => setPackInteret(e.target.value as Lead["pack_interet"])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pack5">Pack 5 Contacts (20 000 F)</option>
                    <option value="pack15">Pack 15 Contacts (50 000 F)</option>
                    <option value="monthly_pro">Pass Mensuel Illimité (75 000 F)</option>
                    <option value="single">1 Contact (5 000 F)</option>
                    <option value="corporate">Grand Compte Sur-Mesure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Valeur Estimée (FCFA)</label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">N° RCCM (Registre)</label>
                  <input
                    type="text"
                    value={rccm}
                    onChange={(e) => setRccm(e.target.value)}
                    placeholder="RC/DLA/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">NIU / NIF Fiscal</label>
                  <input
                    type="text"
                    value={niu}
                    onChange={(e) => setNiu(e.target.value)}
                    placeholder="M0..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Notes de Compte-Rendu</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Compte-rendu d'appel ou besoins spécifiques..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  {submitting ? "Enregistrement..." : "Enregistrer le Prospect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

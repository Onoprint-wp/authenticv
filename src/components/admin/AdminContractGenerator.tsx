"use client";

import { useState } from "react";
import { Download, Loader2, Scale, Globe } from "lucide-react";
import { CEMAC_COUNTRIES } from "@/lib/cemac-regulatory";

export function AdminContractGenerator() {
  const [contractType, setContractType] = useState<"campus" | "recruiter">("campus");
  const [countryCode, setCountryCode] = useState("CM");
  const [loading, setLoading] = useState(false);

  // Champs Campus
  const [universityName, setUniversityName] = useState("Université de Douala");
  const [representativeName, setRepresentativeName] = useState("Le Recteur / Directeur Général");
  const [promoCode, setPromoCode] = useState("UDLA20");
  const [discountPercent, setDiscountPercent] = useState("20");
  const [commissionPercent, setCommissionPercent] = useState("0");

  // Champs Recruteur B2B
  const [companyName, setCompanyName] = useState("MTN Cameroun S.A.");
  const [rccm, setRccm] = useState("RC/DLA/2026/B/1234");
  const [niu, setNiu] = useState("M0123456789A");
  const [creditsPurchased] = useState("10");
  const [totalPriceFcfa, setTotalPriceFcfa] = useState("50 000 FCFA");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        contractType,
        countryCode,
        universityName,
        representativeName,
        promoCode,
        discountPercent,
        commissionPercent,
        companyName,
        rccm,
        niu,
        creditsPurchased,
        totalPriceFcfa,
      };

      const res = await fetch("/api/admin/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la génération du contrat.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = contractType === "campus"
        ? `Convention_Campus_${universityName.replace(/\s+/g, "_")}.pdf`
        : `Contrat_B2B_${companyName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de la génération du contrat PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Générateur Automatique de Contrats Juridiques (Zone CEMAC)</h2>
        </div>
        <span className="text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/50 px-2.5 py-0.5 rounded-full">
          Droit OHADA &amp; Réglementations BEAC / MINESUP
        </span>
      </div>

      <form onSubmit={handleGenerate} className="p-6 space-y-6">
        {/* Sélecteurs de Type de Contrat & Pays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Type de Document Juridique</label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value as "campus" | "recruiter")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="campus">🎓 Convention Cadre Campus (Partenariat Universitaire)</option>
              <option value="recruiter">🏢 Contrat Commercial B2B (CVthèque &amp; Crédits RH)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pays d&apos;Implantation (Juridiction CEMAC)</span>
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {Object.values(CEMAC_COUNTRIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.currency})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Champs Formulaire Campus */}
        {contractType === "campus" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Nom Université / Établissement</label>
                <input
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Représentant Légal</label>
                <input
                  type="text"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Code Promo Campus</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Remise Étudiant %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Cashback BDE % (Si Hybride)</label>
                <input
                  type="number"
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                  placeholder="0 (Si 100% étudiant)"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              💡 <strong>Règle Contractuelle :</strong> Si la commission Cashback est réglée à 0%, la convention stipulera une offre sociale pure (100% remise étudiant sans flux financier). Si &gt; 0%, l&apos;Article 2 intégrera automatiquement la clause de rétrocession de commission pour l&apos;association/BDE.
            </div>
          </div>
        )}

        {/* Champs Formulaire Recruteur B2B */}
        {contractType === "recruiter" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Nom de la Société B2B</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">N° RCCM (Registre Commerce)</label>
              <input
                type="text"
                value={rccm}
                onChange={(e) => setRccm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">N° NIU / IFU (Fiscal)</label>
              <input
                type="text"
                value={niu}
                onChange={(e) => setNiu(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Montant Réglement</label>
              <input
                type="text"
                value={totalPriceFcfa}
                onChange={(e) => setTotalPriceFcfa(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération du Contrat PDF en cours...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Générer &amp; Télécharger le Contrat PDF Certifié</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

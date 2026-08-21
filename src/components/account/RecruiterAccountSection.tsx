"use client";

import { useState } from "react";
import { Building2, Zap, Search, PlusCircle, Check, Loader2, Save, Download } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { RecruiterBuyCreditsModal } from "@/components/recruiter/RecruiterBuyCreditsModal";
import { RecruiterTeamSection } from "@/components/account/RecruiterTeamSection";

interface Props {
  company?: {
    id: string;
    company_name: string;
    credits_balance: number;
    plan: string;
  } | null;
  userEmail: string;
}

export function RecruiterAccountSection({ company, userEmail }: Props) {
  const [companyName, setCompanyName] = useState(company?.company_name || "");
  const [creditsBalance, setCreditsBalance] = useState(company?.credits_balance ?? 0);
  const [hasCompany, setHasCompany] = useState(!!company);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const handleDownloadB2bContract = async () => {
    try {
      const res = await fetch("/api/admin/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractType: "recruiter",
          countryCode: "CM",
          companyName: companyName || userEmail.split("@")[0] || "Entreprise Cliente",
          representativeName: userEmail,
          creditsPurchased: creditsBalance,
          totalPriceFcfa: "Offre B2B Recruteur",
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la génération");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contrat_Recruteur_B2B_${(companyName || "Entreprise").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du téléchargement de votre contrat B2B.");
    }
  };

  // Initialize company profile for recruiter
  const handleCreateCompany = async () => {
    setCreating(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const defaultName = companyName.trim() || userEmail.split("@")[0] || "Entreprise";

      const { data: newCompany, error: createError } = await supabase
        .from("companies")
        .insert({
          user_id: user.id,
          company_name: defaultName,
          email: userEmail,
          credits_balance: 5, // Welcome credits
          plan: "pay_as_you_go",
        })
        .select()
        .single();

      if (createError) throw createError;

      if (newCompany) {
        setCompanyName(newCompany.company_name);
        setCreditsBalance(newCompany.credits_balance ?? 5);
        setHasCompany(true);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du profil entreprise");
    } finally {
      setCreating(false);
    }
  };

  // Update company name
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCompany) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error: updateError } = await supabase
        .from("companies")
        .update({ company_name: companyName.trim() })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de mettre à jour la société");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <RecruiterBuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />

      <section className="bg-slate-900 border border-amber-500/20 rounded-2xl overflow-hidden shadow-lg shadow-amber-950/10">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Espace Recruteur & Entreprise</h2>
          </div>
          {hasCompany && (
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-700/40 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{creditsBalance} Crédits RH</span>
            </span>
          )}
        </div>

        <div className="p-6 space-y-4">
          {!hasCompany ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs text-slate-300">
                Vous recrutez en zone CEMAC ? Activez votre profil Entreprise pour accéder au moteur de recherche de talents qualifiés.
              </p>
              <button
                onClick={handleCreateCompany}
                disabled={creating}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Building2 className="w-4 h-4" />
                )}
                <span>Activer mon Profil Recruteur (5 Crédits Offerts)</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nom de votre entreprise / Cabinet RH</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ex: SABC, MTN, TotalEnergies, Startup SARL"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {error && (
                <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2.5 rounded-xl">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Informations entreprise enregistrées !</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Enregistrer le nom d&apos;entreprise</span>
                </button>

                <div className="w-full sm:w-auto flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDownloadB2bContract}
                    className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs px-3.5 py-2 rounded-xl border border-indigo-700/50 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Contrat B2B PDF</span>
                  </button>

                  <Link
                    href="/recruiter/search"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Moteur de Recherche</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsBuyModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Recharger</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Recruiter Team & Multi-Collaborators Section */}
      {hasCompany && <RecruiterTeamSection />}
    </>
  );
}

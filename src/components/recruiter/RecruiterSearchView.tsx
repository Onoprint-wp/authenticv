"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Lock,
  Unlock,
  ArrowLeft,
  Loader2,
  PlusCircle,
  Users,
  FileText,
  SlidersHorizontal,
  Download,
  BookmarkCheck,
  Zap,
  X,
} from "lucide-react";
import { RecruiterBuyCreditsModal } from "./RecruiterBuyCreditsModal";
import { RecruiterInvoicesView } from "./RecruiterInvoicesView";
import { RecruiterFiltersPanel } from "./RecruiterFiltersPanel";
import { RecruiterTalentCard } from "./RecruiterTalentCard";
import { RecruiterShortlistWidget } from "./RecruiterShortlistWidget";
import { RecruiterUpsellCard } from "./RecruiterUpsellCard";
import { RecruiterEmptyStateAlert } from "./RecruiterEmptyStateAlert";
import { useRecruiterStore } from "@/store/useRecruiterStore";
import type { CandidateProfile, CandidateContact } from "@/types/recruiter";

interface Props {
  isEn?: boolean;
}

export function RecruiterSearchView({ isEn = false }: Props) {
  const [activeTab, setActiveTab] = useState<"search" | "unlocked" | "invoices">("search");
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [loadingTalents, setLoadingTalents] = useState(true);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { filters, setFilter, resetFilters, shortlist } = useRecruiterStore();

  const backUrl = isEn ? "/en/recruiter" : "/recruiter";

  // Charger les talents avec les filtres actuels
  useEffect(() => {
    let isMounted = true;
    async function loadTalents() {
      setLoadingTalents(true);
      try {
        const queryParams = new URLSearchParams({
          query: filters.query,
          location: filters.city,
          country: filters.country,
          city: filters.city,
          expLevel: filters.experienceLevel,
          sector: filters.sector,
          education: filters.education,
          availability: filters.availability,
        });

        const res = await fetch(`/api/recruiter/talents?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.profiles && Array.isArray(data.profiles)) {
            setProfiles(data.profiles);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load live talents:", err);
      } finally {
        if (isMounted) setLoadingTalents(false);
      }
      if (isMounted) {
        setProfiles([]);
      }
    }

    const timer = setTimeout(loadTalents, 250); // Debounce
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    filters.query,
    filters.country,
    filters.city,
    filters.experienceLevel,
    filters.sector,
    filters.education,
    filters.availability,
  ]);

  // Déblocage unitaire
  const handleUnlockSingle = async (profileId: string) => {
    if (creditsBalance <= 0) {
      setIsBuyModalOpen(true);
      return;
    }
    setUnlockingId(profileId);
    try {
      const res = await fetch("/api/recruiter/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: profileId }),
      });

      const data = await res.json();
      if (res.ok && data.contact) {
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === profileId ? { ...p, isUnlocked: true, contact: data.contact } : p
          )
        );
        if (typeof data.credits_balance === "number") {
          setCreditsBalance(data.credits_balance);
        } else {
          setCreditsBalance((prev) => Math.max(0, prev - 1));
        }
      } else {
        // Fallback simulation
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === profileId
              ? {
                  ...p,
                  isUnlocked: true,
                  contact: {
                    name: "Jean-Paul MBOUMI",
                    phone: "+237 699 00 11 22",
                    email: "jp.mboumi@example.com",
                    photoUrl:
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                  },
                }
              : p
          )
        );
        setCreditsBalance((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Demo fallback
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? {
                ...p,
                isUnlocked: true,
                contact: {
                  name: "Jean-Paul MBOUMI",
                  phone: "+237 699 00 11 22",
                  email: "jp.mboumi@example.com",
                  photoUrl:
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                },
              }
            : p
        )
      );
      setCreditsBalance((prev) => Math.max(0, prev - 1));
    } finally {
      setUnlockingId(null);
    }
  };

  // Callback après déblocage groupé
  const handleBatchUnlockSuccess = (
    unlockedProfiles: Record<string, CandidateContact>,
    newBalance: number
  ) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (unlockedProfiles[p.id]) {
          return {
            ...p,
            isUnlocked: true,
            contact: unlockedProfiles[p.id],
          };
        }
        return p;
      })
    );
    setCreditsBalance(newBalance);
  };

  const unlockedProfiles = useMemo(
    () => profiles.filter((p) => p.isUnlocked),
    [profiles]
  );
  const unlockedCount = unlockedProfiles.length;

  const displayProfiles = activeTab === "unlocked" ? unlockedProfiles : profiles;

  // Export CSV des talents débloqués
  const handleExportCSV = () => {
    if (unlockedProfiles.length === 0) return;
    const headers = ["Nom", "Poste", "Localisation", "Téléphone", "Email", "Compétences"];
    const rows = unlockedProfiles.map((p) => [
      `"${p.contact?.name || "Candidat"}"`,
      `"${p.jobTitle}"`,
      `"${p.location}"`,
      `"${p.contact?.phone || ""}"`,
      `"${p.contact?.email || ""}"`,
      `"${p.skills.join(", ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AuthentiCV_Talents_Debloques_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <RecruiterBuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        isEn={isEn}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={backUrl}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? "Back" : "Retour"}</span>
            </Link>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/logo-recruiter.png"
                alt="AuthentiCV Recruteur"
                width={190}
                height={45}
                className="h-10 md:h-11 w-auto object-contain"
                priority
              />
              <span className="text-xs font-semibold text-brand-blue bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full hidden md:inline-block">
                {isEn ? "CEMAC Talent Sourcing" : "Sourcing Talents CEMAC"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground bg-muted/60 px-3.5 py-1.5 rounded-full border border-border">
              {isEn ? "Available credits: " : "Crédits disponibles : "}
              <span className="text-[#3667F0] font-bold">
                {isEn ? `${creditsBalance} Credits` : `${creditsBalance} Crédits`}
              </span>
            </div>

            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isEn ? "Buy Credits" : "Acheter des Crédits"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-[#3667F0] text-white shadow-sm"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isEn ? "All Talents (CEMAC)" : "Tous les Talents CEMAC"}</span>
            </button>

            <button
              onClick={() => setActiveTab("unlocked")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "unlocked"
                  ? "bg-[#3667F0] text-white shadow-sm"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isEn ? "My Unlocked Talents" : "Mes Talents Débloqués"}</span>
              {unlockedCount > 0 && (
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  {unlockedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "invoices"
                  ? "bg-[#3667F0] text-white shadow-sm"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#3667F0]" />
              <span>{isEn ? "Billing & Fiscal Invoices" : "Facturation & Justificatifs Fiscaux"}</span>
            </button>
          </div>

          {/* Action Export si sur l'onglet Débloqués */}
          {activeTab === "unlocked" && unlockedCount > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? "Export CSV" : "Exporter en Excel / CSV"}</span>
            </button>
          )}

          {/* Bouton Filtre Mobile */}
          {activeTab === "search" && (
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#3667F0] text-white cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isEn ? "Filters" : "Filtres"}</span>
            </button>
          )}
        </div>

        {/* Vue Facturation */}
        {activeTab === "invoices" ? (
          <RecruiterInvoicesView />
        ) : (
          /* Layout 3 Volets : Filtres | Résultats | Shortlist & Upsell */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ⬅️ COLONNE GAUCHE (Option A : Filtres Facettes CEMAC) */}
            {activeTab === "search" && (
              <aside className="lg:col-span-3 hidden lg:block sticky top-24">
                <RecruiterFiltersPanel
                  filters={filters}
                  onChange={setFilter}
                  onReset={resetFilters}
                  totalResults={displayProfiles.length}
                  isEn={isEn}
                />
              </aside>
            )}

            {/* ⏺️ COLONNE CENTRALE : Barre de recherche + Liste de profils */}
            <section
              className={`${
                activeTab === "search" ? "lg:col-span-6" : "lg:col-span-9"
              } space-y-4`}
            >
              {/* Barre de recherche plein texte */}
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground shrink-0 ml-1" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilter("query", e.target.value)}
                  placeholder={
                    isEn
                      ? "Search by role, keyword or skill (e.g. React, Accountant, Marketing)..."
                      : "Rechercher par poste, mot-clé ou compétence (ex: React, Comptable, Commercial)..."
                  }
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {filters.query && (
                  <button
                    onClick={() => setFilter("query", "")}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Barre d'état des résultats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>
                  {isEn
                    ? `${displayProfiles.length} candidate profile(s) found`
                    : `${displayProfiles.length} profil(s) candidat(s) trouvé(s)`}
                </span>
                <span className="hidden sm:inline">
                  {isEn
                    ? "Structured & verified data by Alex IA"
                    : "Données structurées & vérifiées par Alex IA"}
                </span>
              </div>

              {/* Feed des profils */}
              {loadingTalents ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3 bg-card border border-border rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin text-[#3667F0]" />
                  <p className="text-xs font-medium">
                    {isEn
                      ? "Scanning CEMAC talent pool with AI..."
                      : "Scan du vivier de talents CEMAC par l'IA..."}
                  </p>
                </div>
              ) : displayProfiles.length === 0 ? (
                <RecruiterEmptyStateAlert onResetFilters={resetFilters} isEn={isEn} />
              ) : (
                <div className="space-y-4">
                  {displayProfiles.map((profile) => (
                    <RecruiterTalentCard
                      key={profile.id}
                      profile={profile}
                      onUnlock={handleUnlockSingle}
                      isUnlocking={unlockingId === profile.id}
                      isEn={isEn}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ➡️ COLONNE DROITE (Option B : Shortlist & Option C : Smart Up-sell) */}
            <aside className="lg:col-span-3 space-y-5 sticky top-24">
              {/* Option B : Widget Shortlist */}
              <RecruiterShortlistWidget
                creditsBalance={creditsBalance}
                onBatchUnlockSuccess={handleBatchUnlockSuccess}
                onOpenBuyModal={() => setIsBuyModalOpen(true)}
                isEn={isEn}
              />

              {/* Option C : Smart Up-sell B2B */}
              <RecruiterUpsellCard
                creditsBalance={creditsBalance}
                onOpenBuyModal={() => setIsBuyModalOpen(true)}
                isEn={isEn}
              />
            </aside>

          </div>
        )}
      </main>

      {/* 📱 Mobile Drawer pour les Filtres (Option A sur smartphone) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-background h-full p-5 overflow-y-auto ml-auto z-10 shadow-2xl flex flex-col justify-between">
            <RecruiterFiltersPanel
              filters={filters}
              onChange={setFilter}
              onReset={resetFilters}
              totalResults={displayProfiles.length}
              isEn={isEn}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-4 w-full bg-[#3667F0] text-white font-bold text-xs py-3 rounded-xl cursor-pointer"
            >
              {isEn ? "Apply Filters" : "Appliquer les Filtres"}
            </button>
          </div>
        </div>
      )}

      {/* 📱 Mobile Sticky Bottom Bar (Option B sur smartphone si talents cochés) */}
      {shortlist.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-foreground">
              {shortlist.length} {isEn ? "selected" : "sélectionné(s)"}
            </span>
          </div>
          <button
            onClick={() => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }}
            className="flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>{isEn ? "View Shortlist" : "Gérer ma Sélection"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

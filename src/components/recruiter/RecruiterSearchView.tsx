"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Briefcase, Lock, Unlock, ArrowLeft, Loader2, PlusCircle, Users, FileText } from "lucide-react";
import { RecruiterBuyCreditsModal } from "./RecruiterBuyCreditsModal";
import { RecruiterInvoicesView } from "./RecruiterInvoicesView";

interface CandidateProfile {
  id: string;
  jobTitle: string;
  location: string;
  summary: string;
  skills: string[];
  experienceYears: number;
  matchScore: number;
  isUnlocked: boolean;
  contact?: {
    name: string;
    phone: string;
    email: string;
    photoUrl?: string;
  };
}

const MOCK_TALENTS: CandidateProfile[] = [
  {
    id: "tal-1",
    jobTitle: "Développeur Full Stack Senior (React / Node.js)",
    location: "Douala, Cameroun",
    summary: "Ingénieur logiciel avec 5 ans d'expérience dans la conception d'applications web scalables et le paiement Mobile Money.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
    experienceYears: 5,
    matchScore: 96,
    isUnlocked: false,
  },
  {
    id: "tal-2",
    jobTitle: "Comptable & Gestionnaire Financier",
    location: "Yaoundé, Cameroun",
    summary: "Spécialiste en audit financier, gestion de trésorerie et fiscalité OHADA avec maîtrise complète de SAP et Sage Saari.",
    skills: ["Sage Saari", "SAP", "Fiscalité OHADA", "Audit Financier", "Excel Avancé"],
    experienceYears: 4,
    matchScore: 92,
    isUnlocked: false,
  },
  {
    id: "tal-3",
    jobTitle: "Responsable Marketing Digital & Growth",
    location: "Libreville, Gabon",
    summary: "Expert en acquisition de trafic, gestion de campagnes Meta/Google Ads et stratégie de contenu en Afrique centrale.",
    skills: ["Meta Ads", "Google Ads", "SEO", "Copywriting", "Analytics", "CRM"],
    experienceYears: 3,
    matchScore: 88,
    isUnlocked: false,
  },
];

interface Props {
  isEn?: boolean;
}

export function RecruiterSearchView({ isEn = false }: Props) {
  const [activeTab, setActiveTab] = useState<"search" | "unlocked" | "invoices">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [profiles, setProfiles] = useState<CandidateProfile[]>(MOCK_TALENTS);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(5);

  const backUrl = isEn ? "/en/recruiter" : "/recruiter";

  useEffect(() => {
    let isMounted = true;
    async function loadTalents() {
      try {
        const res = await fetch(`/api/recruiter/talents?query=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(selectedLocation)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
            setProfiles(data.profiles);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load live talents:", err);
      }
      if (isMounted) {
        setProfiles(MOCK_TALENTS);
      }
    }

    loadTalents();
    return () => { isMounted = false; };
  }, [searchTerm, selectedLocation]);

  const handleUnlock = async (profileId: string) => {
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
        // Fallback simulation for demo
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
                    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
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
                  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
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

  const unlockedCount = profiles.filter((p) => p.isUnlocked).length;

  const filteredProfiles = profiles.filter((p) => {
    if (activeTab === "unlocked" && !p.isUnlocked) return false;

    const matchesSearch =
      p.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      selectedLocation === "all" || p.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <RecruiterBuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        isEn={isEn}
      />

      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                width={170}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
              <span className="text-xs font-semibold text-brand-blue bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full hidden md:inline-block">
                {isEn ? "CEMAC Talent Sourcing" : "Sourcing Talents CEMAC"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-[#374151] dark:text-[#AAB8CB] bg-[#F3F4F6] dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-[#D1D5DB] dark:border-slate-700 font-sans">
              {isEn ? "Available credits: " : "Crédits disponibles : "}<span className="text-[#3667F0] dark:text-[#5D82FF] font-bold">{isEn ? `${creditsBalance} Credits` : `${creditsBalance} Crédits`}</span>
            </div>

            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-semibold text-xs px-4 py-2 rounded-[12px] transition-all shadow-sm active:scale-95 cursor-pointer font-sans"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isEn ? "Buy Credits" : "Acheter des Crédits"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#D1D5DB] dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-semibold transition-all font-sans ${
              activeTab === "search"
                ? "bg-[#3667F0] text-white shadow-sm"
                : "bg-white dark:bg-[#0F223D] text-[#374151] dark:text-slate-200 hover:text-[#111827] border border-[#D1D5DB] dark:border-slate-700"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isEn ? "All Talents (CEMAC)" : "Tous les Talents CEMAC"}</span>
          </button>

          <button
            onClick={() => setActiveTab("unlocked")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-semibold transition-all font-sans ${
              activeTab === "unlocked"
                ? "bg-[#3667F0] text-white shadow-sm"
                : "bg-white dark:bg-[#0F223D] text-[#374151] dark:text-slate-200 hover:text-[#111827] border border-[#D1D5DB] dark:border-slate-700"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#25C78A]" />
            <span>{isEn ? "My Unlocked Talents" : "Mes Talents Débloqués"}</span>
            {unlockedCount > 0 && (
              <span className="bg-[#25C78A]/10 text-[#1e9d6d] dark:text-[#25C78A] text-[10px] px-2 py-0.5 rounded-full font-bold border border-[#25C78A]/30">
                {unlockedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-xs font-semibold transition-all font-sans ${
              activeTab === "invoices"
                ? "bg-[#3667F0] text-white shadow-sm"
                : "bg-white dark:bg-[#0F223D] text-[#374151] dark:text-slate-200 hover:text-[#111827] border border-[#D1D5DB] dark:border-slate-700"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#3667F0]" />
            <span>{isEn ? "Billing & Fiscal Info" : "Facturation & Justificatifs Fiscaux"}</span>
          </button>
        </div>

        {/* Invoices View */}
        {activeTab === "invoices" ? (
          <RecruiterInvoicesView />
        ) : (
          <>
            {/* Search Bar & Filters */}
        <div className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-4 md:p-6 mb-8 elevation-1 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isEn ? "Search by role or skill (e.g. React, Accountant, Marketing)..." : "Rechercher par poste ou compétence (ex: React, Comptable, Marketing)..."}
              className="w-full bg-[#FAFAFC] dark:bg-slate-900 border border-[#D1D5DB] dark:border-slate-700 rounded-[10px] pl-11 pr-4 py-3 text-sm text-[#111827] dark:text-slate-100 placeholder:text-[#6B7280] focus:outline-none focus:border-[#3667F0] focus:ring-3 focus:ring-[#3667F0]/15 transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#6B7280]" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#FAFAFC] dark:bg-slate-900 border border-[#D1D5DB] dark:border-slate-700 rounded-[10px] px-4 py-3 text-sm text-[#111827] dark:text-slate-100 focus:outline-none focus:border-[#3667F0] focus:ring-3 focus:ring-[#3667F0]/15 transition-all font-sans"
            >
              <option value="all">{isEn ? "All cities" : "Toutes les villes"}</option>
              <option value="douala">{isEn ? "Douala" : "Douala"}</option>
              <option value="yaoundé">{isEn ? "Yaoundé" : "Yaoundé"}</option>
              <option value="libreville">{isEn ? "Libreville" : "Libreville"}</option>
              <option value="brazzaville">{isEn ? "Brazzaville" : "Brazzaville"}</option>
              <option value="n'djamena">{isEn ? "N'Djamena" : "N'Djamena"}</option>
              <option value="bangui">{isEn ? "Bangui" : "Bangui"}</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#6B7280] dark:text-slate-400 font-sans">
          <span>
            {isEn
              ? `${filteredProfiles.length} anonymized profile(s) found`
              : `${filteredProfiles.length} profil(s) anonymisé(s) trouvé(s)`}
          </span>
          <span>{isEn ? "Structured data & verified by Alex IA" : "Données structurées & vérifiées par Alex IA"}</span>
        </div>

        {/* Profile List */}
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 hover:border-[#3667F0]/40 rounded-[16px] p-6 transition-all duration-200 elevation-1 hover:elevation-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold font-heading text-lg text-[#0F223D] dark:text-white">{profile.jobTitle}</h3>
                  <span className="bg-[#3667F0]/10 text-[#3667F0] dark:text-[#5D82FF] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#3667F0]/30 font-sans">
                    {profile.matchScore}% Match IA
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#6B7280] dark:text-slate-400 font-sans">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                    {profile.location}
                  </span>
                  <span>•</span>
                  <span>{isEn ? `${profile.experienceYears} years experience` : `${profile.experienceYears} ans d'expérience`}</span>
                </div>

                <p className="text-sm text-[#374151] dark:text-slate-300 font-sans leading-relaxed">
                  {profile.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#F3F4F6] dark:bg-slate-800 text-[#374151] dark:text-slate-200 font-sans text-xs px-2.5 py-1 rounded-[6px] border border-[#D1D5DB] dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Unlock / Contact Box */}
              <div className="lg:w-64 flex-shrink-0 bg-[#FAFAFC] dark:bg-slate-900/60 border border-[#D1D5DB] dark:border-slate-800 rounded-[12px] p-4 flex flex-col items-center justify-center text-center">
                {profile.isUnlocked && profile.contact ? (
                  <div className="w-full space-y-2 text-left animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-xs text-[#25C78A] font-semibold mb-2 font-sans">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{isEn ? "Contact Details Unlocked" : "Coordonnées Débloquées"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {profile.contact.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={profile.contact.photoUrl}
                          alt={profile.contact.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#25C78A] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#3667F0]/10 border border-[#3667F0]/30 flex items-center justify-center text-[#3667F0] font-bold text-xs flex-shrink-0 font-heading">
                          {profile.contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold font-heading text-[#0F223D] dark:text-white truncate">{profile.contact.name}</div>
                        <div className="text-xs text-[#6B7280] dark:text-slate-400 font-sans">{profile.contact.phone}</div>
                      </div>
                    </div>
                    <div className="text-xs text-[#3667F0] dark:text-[#5D82FF] truncate pt-1 font-semibold">{profile.contact.email}</div>
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#6B7280] dark:text-slate-400 font-medium font-sans">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEn ? "Contact info hidden" : "Coordonnées masquées"}</span>
                    </div>
                    <button
                      onClick={() => handleUnlock(profile.id)}
                      disabled={unlockingId === profile.id}
                      className="w-full flex items-center justify-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-[12px] transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 font-sans"
                    >
                      {unlockingId === profile.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>
                          {creditsBalance > 0
                            ? (isEn ? "Débloquer (1 Crédit)" : "Débloquer le profil (1 Crédit)")
                            : (isEn ? "Acheter des Crédits (5 000 FCFA)" : "Débloquer (5 000 FCFA)")}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
        )}

      </main>
    </div>
  );
}

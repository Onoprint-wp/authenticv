"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Lock, Unlock, ArrowLeft, Loader2, PlusCircle, Users, CheckCircle } from "lucide-react";
import { RecruiterBuyCreditsModal } from "./RecruiterBuyCreditsModal";

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
  const [activeTab, setActiveTab] = useState<"search" | "unlocked">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [profiles, setProfiles] = useState<CandidateProfile[]>(MOCK_TALENTS);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<number>(5);

  const backUrl = isEn ? "/en/recruiter" : "/recruiter";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <RecruiterBuyCreditsModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        isEn={isEn}
      />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={backUrl}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isEn ? "Back" : "Retour"}</span>
            </Link>
            <h1 className="font-bold text-white text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>{isEn ? "CEMAC Talent Search Engine" : "Moteur de Recherche Talents CEMAC"}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              {isEn ? "Available credits: " : "Crédits disponibles : "}<span className="text-amber-400 font-bold">{isEn ? `${creditsBalance} Credits` : `${creditsBalance} Crédits`}</span>
            </div>

            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
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
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "search"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isEn ? "All Talents (CEMAC)" : "Tous les Talents CEMAC"}</span>
          </button>

          <button
            onClick={() => setActiveTab("unlocked")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "unlocked"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? "My Unlocked Talents" : "Mes Talents Débloqués"}</span>
            {unlockedCount > 0 && (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unlockedCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Search Bar & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 mb-8 shadow-xl flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isEn ? "Search by role or skill (e.g. React, Accountant, Marketing)..." : "Rechercher par poste ou compétence (ex: React, Comptable, Marketing)..."}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">{isEn ? "All cities" : "Toutes les villes"}</option>
              <option value="douala">Douala</option>
              <option value="yaoundé">Yaoundé</option>
              <option value="libreville">Libreville</option>
              <option value="brazzaville">Brazzaville</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <span>
            {isEn
              ? `${filteredProfiles.length} anonymized profile(s) found`
              : `${filteredProfiles.length} profil(s) anonymisé(s) trouvé(s)`}
          </span>
          <span>{isEn ? "Structured data & verified by Alex AI" : "Données structurées & vérifiées par Alex IA"}</span>
        </div>

        {/* Profile List */}
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-lg text-white">{profile.jobTitle}</h3>
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {profile.matchScore}% {isEn ? "AI Match" : "Match IA"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {profile.location}
                  </span>
                  <span>•</span>
                  <span>{isEn ? `${profile.experienceYears} years experience` : `${profile.experienceYears} ans d'expérience`}</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {profile.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-950 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Unlock / Contact Box */}
              <div className="lg:w-64 flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                {profile.isUnlocked && profile.contact ? (
                  <div className="w-full space-y-2 text-left animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-2">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{isEn ? "Contact Details Unlocked" : "Coordonnées Débloquées"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {profile.contact.photoUrl ? (
                        <img
                          src={profile.contact.photoUrl}
                          alt={profile.contact.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs flex-shrink-0">
                          {profile.contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{profile.contact.name}</div>
                        <div className="text-xs text-slate-300">{profile.contact.phone}</div>
                      </div>
                    </div>
                    <div className="text-xs text-indigo-400 truncate pt-1">{profile.contact.email}</div>
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEn ? "Contact info hidden" : "Coordonnées masquées"}</span>
                    </div>
                    <button
                      onClick={() => handleUnlock(profile.id)}
                      disabled={unlockingId === profile.id}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {unlockingId === profile.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>
                          {creditsBalance > 0
                            ? (isEn ? "Débloquer (1 Crédit)" : "Débloquer (1 Crédit)")
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

      </main>
    </div>
  );
}

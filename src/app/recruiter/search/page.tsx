"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Lock, Unlock, ArrowLeft, Loader2 } from "lucide-react";

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

export default function RecruiterSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [profiles, setProfiles] = useState<CandidateProfile[]>(MOCK_TALENTS);
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  const handleUnlock = async (profileId: string) => {
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
    } finally {
      setUnlockingId(null);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      selectedLocation === "all" || p.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/recruiter"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </Link>
            <h1 className="font-bold text-white text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>Moteur de Recherche Talents CEMAC</span>
            </h1>
          </div>

          <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            Crédits disponibles : <span className="text-amber-400 font-bold">5 Crédits</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        
        {/* Search Bar & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 mb-8 shadow-xl flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par poste ou compétence (ex: React, Comptable, Marketing)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 min-w-[200px]">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Toutes les villes</option>
              <option value="douala">Douala</option>
              <option value="yaoundé">Yaoundé</option>
              <option value="libreville">Libreville</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredProfiles.length} profil(s) anonymisé(s) trouvé(s)</span>
          <span>Données structurées &amp; vérifiées par Alex IA</span>
        </div>

        {/* Profiles List */}
        <div className="space-y-6">
          {filteredProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-white">{p.jobTitle}</h2>
                  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {p.matchScore}% Match IA
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {p.location}
                  </span>
                  <span>•</span>
                  <span>{p.experienceYears} ans d'expérience</span>
                </div>

                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {p.summary}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {p.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action / Unlock box */}
              <div className="w-full md:w-auto flex-shrink-0 bg-slate-950 border border-slate-800 p-4 rounded-xl text-center flex flex-col items-center justify-center min-w-[220px]">
                {p.isUnlocked && p.contact ? (
                  <div className="space-y-2 text-left w-full">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                      <Unlock className="w-4 h-4" /> Coordonnées Débloquées
                    </div>
                    <div className="text-sm font-bold text-white">{p.contact.name}</div>
                    <div className="text-xs text-slate-300">{p.contact.phone}</div>
                    <div className="text-xs text-indigo-400 truncate">{p.contact.email}</div>
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="text-xs text-slate-400 mb-3">Coordonnées masquées</div>
                    <button
                      onClick={() => handleUnlock(p.id)}
                      disabled={unlockingId === p.id}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {unlockingId === p.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Débloquer (5 000 FCFA)"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

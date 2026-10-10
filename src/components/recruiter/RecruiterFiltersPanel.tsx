"use client";

import React from "react";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  Globe2,
} from "lucide-react";
import type { RecruiterFilterState } from "@/types/recruiter";

interface Props {
  filters: RecruiterFilterState;
  onChange: <K extends keyof RecruiterFilterState>(key: K, value: RecruiterFilterState[K]) => void;
  onReset: () => void;
  totalResults: number;
  isEn?: boolean;
}

const COUNTRIES = [
  { id: "all", labelFr: "Tous les pays", labelEn: "All Countries", flag: "🌍" },
  { id: "cm", labelFr: "Cameroun", labelEn: "Cameroon", flag: "🇨🇲" },
  { id: "ga", labelFr: "Gabon", labelEn: "Gabon", flag: "🇬🇦" },
  { id: "cg", labelFr: "Congo", labelEn: "Congo", flag: "🇨🇬" },
  { id: "td", labelFr: "Tchad", labelEn: "Chad", flag: "🇹🇩" },
  { id: "cf", labelFr: "Centrafrique", labelEn: "CAR", flag: "🇨🇫" },
  { id: "gq", labelFr: "Guinée Équatoriale", labelEn: "Eq. Guinea", flag: "🇬🇶" },
  { id: "int", labelFr: "Diaspora / International", labelEn: "Diaspora / Int.", flag: "✈️" },
];

const SECTORS = [
  { id: "all", labelFr: "Tous les secteurs", labelEn: "All Sectors" },
  { id: "tech", labelFr: "Tech, Dév & Réseaux", labelEn: "Tech, Dev & IT" },
  { id: "finance", labelFr: "Finance, Audit & Compta", labelEn: "Finance & Accounting" },
  { id: "commercial", labelFr: "Vente, Marketing & Caisse", labelEn: "Sales & Marketing" },
  { id: "btp", labelFr: "BTP & Ingénierie", labelEn: "Construction & Eng." },
  { id: "sante", labelFr: "Santé & Médical", labelEn: "Health & Medical" },
  { id: "logistique", labelFr: "Logistique & Supply Chain", labelEn: "Logistics & Supply" },
  { id: "rh", labelFr: "Ressources Humaines & Juridique", labelEn: "HR & Legal" },
];

const EXPERIENCES = [
  { id: "all", labelFr: "Toute expérience", labelEn: "All Experiences" },
  { id: "0-2", labelFr: "0 - 2 ans (Junior)", labelEn: "0 - 2 yrs (Junior)" },
  { id: "3-5", labelFr: "3 - 5 ans (Confirmé)", labelEn: "3 - 5 yrs (Mid-level)" },
  { id: "6-10", labelFr: "6 - 10 ans (Senior)", labelEn: "6 - 10 yrs (Senior)" },
  { id: "10+", labelFr: "+10 ans (Expert / Direction)", labelEn: "+10 yrs (Lead / Exec)" },
];

const EDUCATIONS = [
  { id: "all", labelFr: "Tous les diplômes", labelEn: "All Degrees" },
  { id: "bac", labelFr: "Baccalauréat / Niveau Bac", labelEn: "High School / Bac" },
  { id: "bac2", labelFr: "Bac+2 (BTS, DUT, DEUG)", labelEn: "Associate (Bac+2)" },
  { id: "licence", labelFr: "Bac+3 (Licence, Bachelor)", labelEn: "Bachelor (Bac+3)" },
  { id: "master", labelFr: "Bac+5 (Master, Ingénieur)", labelEn: "Master / Engineer (Bac+5)" },
  { id: "doctorat", labelFr: "Bac+8 (Doctorat, PhD)", labelEn: "Doctorate (PhD)" },
];

export function RecruiterFiltersPanel({
  filters,
  onChange,
  onReset,
  totalResults,
  isEn = false,
}: Props) {
  const hasActiveFilters =
    filters.country !== "all" ||
    filters.city !== "all" ||
    filters.experienceLevel !== "all" ||
    filters.sector !== "all" ||
    filters.education !== "all" ||
    filters.availability !== "all" ||
    Boolean(filters.query);

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#3667F0] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isEn ? "Filters" : "Filtres Avancés"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {totalResults} {isEn ? "talent(s) matched" : "talent(s) trouvé(s)"}
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
            title={isEn ? "Reset all filters" : "Réinitialiser tous les filtres"}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isEn ? "Reset" : "Effacer"}</span>
          </button>
        )}
      </div>

      {/* 1. Zone Géographique / Pays */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Globe2 className="w-3.5 h-3.5 text-[#3667F0]" />
          <span>{isEn ? "Country (CEMAC)" : "Pays (Zone CEMAC)"}</span>
        </label>
        <select
          value={filters.country}
          onChange={(e) => onChange("country", e.target.value)}
          className="w-full text-xs bg-background border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-[#3667F0]/30 cursor-pointer"
        >
          {COUNTRIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.flag} {isEn ? c.labelEn : c.labelFr}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Secteur d'activité */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Briefcase className="w-3.5 h-3.5 text-[#3667F0]" />
          <span>{isEn ? "Industry Sector" : "Secteur d'activité"}</span>
        </label>
        <select
          value={filters.sector}
          onChange={(e) => onChange("sector", e.target.value)}
          className="w-full text-xs bg-background border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-[#3667F0]/30 cursor-pointer"
        >
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>
              {isEn ? s.labelEn : s.labelFr}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Niveau d'expérience */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Clock className="w-3.5 h-3.5 text-[#3667F0]" />
          <span>{isEn ? "Years of Experience" : "Années d'expérience"}</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {EXPERIENCES.map((exp) => {
            const isSelected = filters.experienceLevel === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => onChange("experienceLevel", exp.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-[#3667F0] text-white font-semibold shadow-sm"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{isEn ? exp.labelEn : exp.labelFr}</span>
                {isSelected && <span className="text-[10px]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Niveau d'études / Diplômes */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <GraduationCap className="w-3.5 h-3.5 text-[#3667F0]" />
          <span>{isEn ? "Education Level" : "Niveau d'études"}</span>
        </label>
        <select
          value={filters.education}
          onChange={(e) => onChange("education", e.target.value)}
          className="w-full text-xs bg-background border border-input rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-[#3667F0]/30 cursor-pointer"
        >
          {EDUCATIONS.map((ed) => (
            <option key={ed.id} value={ed.id}>
              {isEn ? ed.labelEn : ed.labelFr}
            </option>
          ))}
        </select>
      </div>

      {/* Note de réassurance sous les filtres */}
      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-200">
        💡{" "}
        <span className="font-semibold">
          {isEn ? "AI-Verified Talents:" : "Talents vérifiés par Alex IA :"}
        </span>{" "}
        {isEn
          ? "All candidate competencies and identities are validated in the CEMAC database."
          : "Les données métiers et compétences sont auditées et garanties fiables."}
      </div>
    </div>
  );
}

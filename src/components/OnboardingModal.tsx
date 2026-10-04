"use client";

import { useState } from "react";
import { Bot, Sparkles, ArrowRight, X, GraduationCap, Briefcase, Cpu, Wrench, HeartPulse, Calculator } from "lucide-react";
import { useCvStore } from "@/store/useCvStore";

interface OnboardingModalProps {
  onStart: (initialPrompt?: string) => void;
}

const PRESET_PROFILES = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Étudiant / Stage",
    description: "Recherche de stage académique ou professionnel",
    prompt: "Je suis étudiant et je recherche un stage. Peux-tu générer la structure complète de mon CV avec mes compétences clés, ma formation et un résumé professionnel percutant ?",
  },
  {
    id: "sales",
    icon: Briefcase,
    title: "Commercial & Vente",
    description: "Prospection, négociation, relation client",
    prompt: "Je travaille dans le commerce et la vente. Rédige un CV percutant avec mes compétences en prospection, négociation et relation client.",
  },
  {
    id: "it",
    icon: Cpu,
    title: "Informatique & Réseaux",
    description: "Systèmes, support, développement, télécoms",
    prompt: "Je suis dans l'informatique et les réseaux. Rédige un CV technique avec mes compétences clés (systèmes, outils, support) et mes missions.",
  },
  {
    id: "tech_btp",
    icon: Wrench,
    title: "Technique & BTP",
    description: "Chantier, électricité, maintenance, industrie",
    prompt: "Je travaille dans les métiers techniques et le bâtiment. Rédige un CV solide avec mes compétences pratiques et chantiers réalisés.",
  },
  {
    id: "health",
    icon: HeartPulse,
    title: "Santé & Soins",
    description: "Infirmier, aide-soignant, laboratoire",
    prompt: "Je suis dans le domaine médical et des soins. Rédige un CV professionnel avec mes stages hospitaliers et compétences en soins aux patients.",
  },
  {
    id: "finance",
    icon: Calculator,
    title: "Comptabilité & Gestion",
    description: "Comptable, audit, gestion administrative",
    prompt: "Je suis dans la comptabilité et la gestion financière. Rédige un CV professionnel structuré avec la tenue des comptes, fiscalité et outils comptables.",
  },
];

export function OnboardingModal({ onStart }: OnboardingModalProps) {
  const [customJob, setCustomJob] = useState("");
  const cvData = useCvStore((s) => s.cvData);
  const firstName = cvData.personalInfo?.firstName?.trim() || "";

  const handleSelectPreset = (prompt: string) => {
    onStart(prompt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = customJob.trim();
    if (!job) return;
    onStart(`Mon métier est "${job}". Peux-tu générer la structure complète de mon CV avec un résumé professionnel percutant, mes compétences clés et des expériences types adaptées ?`);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-[#0F223D] border border-[#D1D5DB] dark:border-slate-800 rounded-[20px] shadow-2xl overflow-hidden relative font-sans">
        
        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-border bg-[#FAFAFC] dark:bg-slate-900/60">
          <div className="w-12 h-12 gradient-ai text-white rounded-[14px] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold font-heading text-[#0F223D] dark:text-white mb-1">
            {firstName ? `Bienvenue ${firstName} !` : "Bienvenue sur AuthentiCV !"}
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Alex IA va rédiger et structurer l&apos;intégralité de votre CV certifié en 30 secondes. Choisissez votre domaine :
          </p>
        </div>

        {/* Presets Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_PROFILES.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.prompt)}
                  className="flex items-start gap-3 p-3 text-left rounded-[12px] bg-[#F3F4F6] hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-[#D1D5DB] dark:border-slate-700 hover:border-[#3667F0]/40 transition-all group cursor-pointer active:scale-98"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-white dark:bg-slate-900 flex items-center justify-center text-[#3667F0] shrink-0 border border-border group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-heading text-[#0F223D] dark:text-white group-hover:text-[#3667F0] transition-colors truncate">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-[#6B7280] dark:text-slate-400 truncate">
                      {preset.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Job Input */}
          <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-border">
            <label className="block text-xs font-semibold text-[#374151] dark:text-slate-300 mb-1.5">
              Ou saisissez votre métier spécifique :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customJob}
                onChange={(e) => setCustomJob(e.target.value)}
                placeholder="ex. Chauffeur, Secrétaire, Enseignant, Cuisinier..."
                className="flex-1 bg-[#FAFAFC] dark:bg-slate-900 border border-[#D1D5DB] dark:border-slate-700 rounded-[10px] px-3.5 py-2.5 text-xs text-[#111827] dark:text-slate-100 placeholder:text-muted-foreground focus:outline-none focus:border-[#3667F0] focus:ring-2 focus:ring-[#3667F0]/20"
              />
              <button
                type="submit"
                disabled={!customJob.trim()}
                className="flex items-center gap-1.5 bg-[#3667F0] hover:bg-[#3667F0]/90 disabled:opacity-40 text-white font-semibold text-xs px-4 py-2.5 rounded-[10px] transition-all shadow-sm active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Générer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAFAFC] dark:bg-slate-900/60 border-t border-border flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#6B7280] dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#3667F0]" />
            <span>Format optimisé normes CEMAC & ATS</span>
          </span>
          <button
            onClick={() => onStart("")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline cursor-pointer"
          >
            Je préfère écrire directement
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onStart("")}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

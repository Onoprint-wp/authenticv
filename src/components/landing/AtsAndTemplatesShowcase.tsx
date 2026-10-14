"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ScanLine,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileCheck2,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { SECTOR_TEMPLATES, getTheme } from "@/lib/themes";
import { MiniCvPreview } from "./MiniCvPreview";

const SAMPLE_ATS_STREAM = `=== AUTHENTICV NATIVE VECTOR STREAM (ISO-ATS v2.5) ===
PARSER_STATUS : 100% READABLE_TEXT | ATS_SCORE : 98/100
ROBOT_ENGINES : Workday ✓ | Taleo ✓ | Greenhouse ✓ | SAP ✓

[01. CANDIDATE_IDENTITY]
FULL_NAME     : Clarisse Biya-Ndongo
TARGET_TITLE  : Responsable Audit & Contrôle de Gestion OHADA
CONTACT       : c.ndongo@email.cm | +237 699 00 00 00
LOCATION      : Douala, Cameroun (Mobilité Zone CEMAC)

[02. QUANTIFIED_EXPERIENCE]
#1 [2022-01 -> PRESENT] Senior Financial Controller @ Groupe SABC
   IMPACT_METRIC : Réduction de 28% des délais de clôture mensuelle
   IMPACT_METRIC : Pilotage d'un budget opérationnel de 4,2 Milliards FCFA

[03. INDEXED_KEYWORDS]
[Comptabilité OHADA] [Audit Interne] [SAP FI/CO] [Contrôle Budgétaire] [IFRS]`;

type FilterCategory = "all" | "exec-finance" | "tech-indus" | "sales-creative" | "ngo-campus";

const FILTER_TABS: { id: FilterCategory; label: string; ids?: string[] }[] = [
  { id: "all", label: "Tous les modèles (10)" },
  {
    id: "exec-finance",
    label: "Direction, Banque & Droit",
    ids: ["executive", "finance-banque", "rh-juridique", "minimal-ats"],
  },
  {
    id: "tech-indus",
    label: "Tech, Ingénierie & BTP",
    ids: ["tech-data", "ingenierie-btp", "minimal-ats"],
  },
  {
    id: "sales-creative",
    label: "Commerce, Marketing & Digital",
    ids: ["commercial-marketing", "digital-creatif"],
  },
  {
    id: "ngo-campus",
    label: "Santé, ONG & 1er Emploi",
    ids: ["sante-ong", "campus-stage"],
  },
];

export function AtsAndTemplatesShowcase() {
  const [activeTab, setActiveTab] = useState<"xray" | "human">("xray");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");

  const activeFilter = FILTER_TABS.find((f) => f.id === selectedCategory);
  const displayedTemplates =
    selectedCategory === "all" || !activeFilter?.ids
      ? SECTOR_TEMPLATES
      : SECTOR_TEMPLATES.filter((t) => activeFilter.ids!.includes(t.id));

  return (
    <section className="py-24 bg-[#0F223D] relative border-b border-slate-800" id="modeles-ats">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* PART 1: Radiographie ATS Proof */}
        <div className="grid lg:grid-cols-12 gap-10 items-center mb-24">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25C78A]/10 border border-[#25C78A]/30 text-[#25C78A] text-xs font-bold mb-4">
              <ScanLine className="w-3.5 h-3.5" />
              <span>EXCLUSIVITÉ AUTHENTICV · RADIOGRAPHIE ATS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mb-4 leading-tight">
              Voyez votre CV exactement comme le{" "}
              <span className="text-[#32D3E1]">robot recruteur</span> le lit.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              75 % des CV créés sur Canva ou Word sont rejetés avant même qu&apos;un humain ne les ouvre, car leurs colonnes graphiques brouillent les logiciels RH (Workday, Taleo, SAP). Avec la{" "}
              <strong className="text-white">Radiographie ATS</strong> intégrée à notre éditeur, vous inspectez en direct le flux texte extrait de votre CV.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Encodage PDF vectoriel natif (aucun calque image bloquant)",
                "Extraction structurée des dates, intitulés de postes et KPIs chiffrés",
                "1er téléchargement PDF HD sans filigrane 100 % offert dès l'inscription",
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#25C78A] flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <Link
              href="/builder"
              className="inline-flex items-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
            >
              <span>Tester la Radiographie ATS gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#081426] border border-slate-700/80 shadow-2xl overflow-hidden">
              {/* Top Console Bar */}
              <div className="px-4 py-3 bg-[#162B46] border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25C78A]" />
                  <span className="ml-2 text-xs font-mono text-slate-300 font-semibold">
                    Radiographie ATS — Inspecteur Temps Réel
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#081426] p-1 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab("xray")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "xray"
                        ? "bg-[#3667F0] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Vue Robot ATS
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("human")}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "human"
                        ? "bg-[#3667F0] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Diagnostic 7 Points
                  </button>
                </div>
              </div>

              {/* Console Body */}
              {activeTab === "xray" ? (
                <div className="p-5">
                  <pre className="font-mono text-xs leading-relaxed text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                    {SAMPLE_ATS_STREAM}
                  </pre>
                </div>
              ) : (
                <div className="p-5 grid sm:grid-cols-2 gap-3">
                  {[
                    { label: "Flux Vectoriel Natif", detail: "Compatible Workday, Taleo, Greenhouse" },
                    { label: "Identité & Contact", detail: "Email, Téléphone (+237) & Ville indexés" },
                    { label: "Mot-Clé Titre H1", detail: "Correspondance directe avec l'offre" },
                    { label: "Densité Sémantique", detail: "Verbes d'action & résultats chiffrés détectés" },
                    { label: "Chronologie ISO", detail: "Aucune rupture temporelle non expliquée" },
                    { label: "Matrice de Compétences", detail: "Hard skills & normes OHADA/IFRS extraits" },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#162B46] border border-slate-700/70 flex items-start gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#25C78A] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white">{c.label}</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PART 2: 10 Sector Templates Gallery */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3667F0]/15 border border-[#3667F0]/30 text-[#32D3E1] text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>10 MODÈLES SECTORIELS PRÊTS À L&apos;EMPLOI</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mb-4">
            Un modèle calibré pour{" "}
            <span className="text-[#32D3E1]">chaque secteur d&apos;activité</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base mb-8">
            Cliquez sur le modèle de votre secteur pour l&apos;ouvrir directement dans l&apos;éditeur avec Alex et bénéficier de votre{" "}
            <strong className="text-white">1er export PDF HD sans filigrane offert</strong>.
          </p>

          {/* Interactive Sector Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-[#3667F0] text-white border-[#32D3E1]/50 shadow-[0_0_20px_rgba(54,103,240,0.4)]"
                      : "bg-[#162B46]/90 text-slate-300 border-slate-700/80 hover:border-slate-500 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacious 3-Column / 4-Column Gallery Grid with Real Miniature A4 Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTemplates.map((tpl, idx) => {
            const theme = getTheme(tpl.settings.colorTheme);
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="bg-gradient-to-b from-[#162B46] to-[#0C1A30] border border-slate-700/80 hover:border-[#32D3E1] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:shadow-[0_12px_40px_rgba(50,211,225,0.12)]"
              >
                <div>
                  {/* Top Bar: Sector Badge + ATS Score */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span
                      className="text-[11px] font-bold px-3 py-1 rounded-full text-white shadow-xs"
                      style={{ background: theme.swatch }}
                    >
                      {tpl.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[#25C78A] bg-[#25C78A]/10 border border-[#25C78A]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ATS {tpl.atsScore}</span>
                    </span>
                  </div>

                  {/* Realistic Miniature A4 CV Preview */}
                  <Link href={`/builder?template=${tpl.id}`} className="block mb-4">
                    <MiniCvPreview template={tpl} />
                  </Link>

                  {/* Title, Sector & Complete Non-Truncated Description */}
                  <div className="mb-4">
                    <h3 className="text-lg font-extrabold font-heading text-white mb-1 group-hover:text-[#32D3E1] transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[#32D3E1] font-semibold mb-2">
                      {tpl.sector}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                {/* Footer: Single-Row Role Pills + Vibrant High-Contrast CTA */}
                <div className="pt-3 border-t border-slate-800/90">
                  <div className="flex items-center gap-1.5 mb-3.5 overflow-hidden">
                    {tpl.recommendedFor.slice(0, 2).map((role) => (
                      <span
                        key={role}
                        className="text-[11px] font-medium text-slate-200 bg-[#081426] border border-slate-700 px-2.5 py-1 rounded-lg truncate"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/builder?template=${tpl.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3667F0]/20 hover:bg-[#3667F0] text-white border border-[#3667F0]/50 hover:border-[#32D3E1] text-xs font-bold transition-all shadow-sm group-hover:shadow-[0_0_20px_rgba(54,103,240,0.35)]"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#32D3E1] group-hover:text-white transition-colors" />
                    <span>Choisir ce modèle (1er PDF Offert)</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/modeles-cv"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#162B46] hover:bg-[#1E3A5F] border border-slate-700 text-xs font-bold text-[#32D3E1] hover:text-white transition-all"
          >
            <span>Explorer le guide détaillé des 10 modèles de CV sectoriels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

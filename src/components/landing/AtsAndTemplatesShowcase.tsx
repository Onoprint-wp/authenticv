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

export function AtsAndTemplatesShowcase() {
  const [activeTab, setActiveTab] = useState<"xray" | "human">("xray");

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3667F0]/15 border border-[#3667F0]/30 text-[#32D3E1] text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>10 MODÈLES SECTORIELS PRÊTS À L&apos;EMPLOI</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white mb-4">
            Un modèle calibré pour{" "}
            <span className="text-[#32D3E1]">chaque secteur d&apos;activité</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Cliquez sur le modèle de votre secteur pour l&apos;ouvrir directement dans l&apos;éditeur avec Alex et bénéficier de votre{" "}
            <strong className="text-white">1er export PDF HD sans filigrane offert</strong>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {SECTOR_TEMPLATES.map((tpl, idx) => {
            const theme = getTheme(tpl.settings.colorTheme);
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="bg-[#162B46] border border-slate-700/70 hover:border-[#32D3E1]/60 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-md"
              >
                <div>
                  {/* Mini Header Bar with Swatch & ATS Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: theme.swatch }}
                    >
                      {tpl.badge}
                    </span>
                    <span className="text-[10px] font-bold text-[#25C78A] bg-[#25C78A]/10 border border-[#25C78A]/30 px-2 py-0.5 rounded-full">
                      ATS {tpl.atsScore}
                    </span>
                  </div>

                  {/* Mini Visual Wireframe Preview */}
                  <div className="w-full h-24 rounded-xl bg-white p-2.5 mb-3 border border-slate-200 overflow-hidden shadow-inner flex flex-col justify-between">
                    {tpl.settings.layout === "modern" ? (
                      <div className="flex gap-2 h-full">
                        <div
                          className="w-1/3 h-full rounded-md p-1.5 flex flex-col gap-1"
                          style={{ background: theme.pdfHeaderBg }}
                        >
                          <div className="w-4 h-4 rounded-full bg-white/30 mx-auto" />
                          <div className="h-1 w-full bg-white/50 rounded" />
                          <div className="h-1 w-2/3 bg-white/30 rounded" />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5 py-1">
                          <div className="h-2 w-3/4 rounded" style={{ background: theme.swatch }} />
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                          <div className="h-1.5 w-2/3 bg-slate-200 rounded" />
                        </div>
                      </div>
                    ) : tpl.settings.layout === "classic" ? (
                      <div className="flex flex-col h-full justify-between">
                        <div
                          className="w-full h-7 rounded-md px-2 flex items-center justify-between"
                          style={{ background: theme.pdfHeaderBg }}
                        >
                          <div className="h-2 w-1/2 bg-white/80 rounded" />
                          <div className="h-1.5 w-1/4 bg-white/40 rounded" />
                        </div>
                        <div className="space-y-1.5 py-1">
                          <div className="h-1.5 w-1/3 rounded" style={{ background: theme.swatch }} />
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full justify-between py-0.5">
                        <div className="border-b pb-1.5" style={{ borderColor: theme.swatch }}>
                          <div className="h-2 w-2/3 bg-slate-900 rounded mb-1" />
                          <div className="h-1.5 w-1/3 rounded" style={{ background: theme.swatch }} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                          <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold font-heading text-white mb-1 group-hover:text-[#32D3E1] transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-[11px] text-[#32D3E1] font-medium mb-2">{tpl.sector}</p>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                    {tpl.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tpl.recommendedFor.slice(0, 2).map((role) => (
                      <span
                        key={role}
                        className="text-[10px] text-slate-300 bg-[#081426] border border-slate-700/80 px-2 py-0.5 rounded-md truncate max-w-full"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/builder?template=${tpl.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#081426] hover:bg-[#3667F0] text-slate-200 hover:text-white border border-slate-700 hover:border-[#3667F0] text-xs font-bold transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-[#32D3E1] group-hover:text-white" />
                    <span>Choisir ce modèle</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/modeles-cv"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#32D3E1] hover:text-white transition-colors"
          >
            <span>Explorer le guide détaillé des 10 modèles de CV sectoriels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { getTheme, type SectorTemplate } from "@/lib/themes";
import { MapPin, Mail, Phone, Award, CheckCircle2 } from "lucide-react";

interface MiniPersona {
  initials: string;
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  exp1Role: string;
  exp1Company: string;
  exp1Date: string;
  exp1Bullet1: string;
  exp1Bullet2: string;
  exp2Role: string;
  exp2Company: string;
  exp2Date: string;
  education: string;
  skills: string[];
  kpiHighlight: string;
}

const PERSONAS: Record<string, MiniPersona> = {
  executive: {
    initials: "AN",
    fullName: "ARMAND NKOT",
    title: "Directeur Général Adjoint & Administrateur",
    location: "Douala · CEMAC",
    email: "a.nkot@exec.cm",
    phone: "+237 699 12 34 56",
    summary:
      "Dirigeant exécutif (15+ ans) spécialisé en pilotage P&L multi-pays, restructuration industrielle et gouvernance OHADA.",
    exp1Role: "Directeur Général Adjoint",
    exp1Company: "Groupe SABC · Douala",
    exp1Date: "2021 – Présent",
    exp1Bullet1: "Pilotage d'un P&L de 14,5 Mds FCFA (+22 % d'EBITDA en 24 mois).",
    exp1Bullet2: "Direction de 380 collaborateurs et transformation Supply Chain.",
    exp2Role: "Directeur Conseil & Audit",
    exp2Company: "Deloitte Afrique Centrale",
    exp2Date: "2017 – 2021",
    education: "Executive MBA — HEC Paris · Master Gouvernance UCAC",
    skills: ["Pilotage P&L", "Gouvernance OHADA", "Stratégie M&A", "Comité Direction"],
    kpiHighlight: "+22% EBITDA · 14,5 Mds FCFA",
  },
  "tech-data": {
    initials: "SF",
    fullName: "STÉPHANE FOKOU",
    title: "Senior Cloud, DevOps & Data Engineer",
    location: "Yaoundé · Remote",
    email: "s.fokou@dev.cm",
    phone: "+237 677 88 90 12",
    summary:
      "Ingénieur Cloud & Data certifié AWS. Conception d'architectures distribuées haute disponibilité et pipelines temps réel.",
    exp1Role: "Lead Cloud & Platform Engineer",
    exp1Company: "MTN Cameroon · Douala",
    exp1Date: "2022 – Présent",
    exp1Bullet1: "Migration microservices Kubernetes (12M abonnés, -40 % latence API).",
    exp1Bullet2: "Automatisation CI/CD Terraform & pipelines BigQuery / Airflow.",
    exp2Role: "Full-Stack & Data Engineer",
    exp2Company: "Orange Digital Center",
    exp2Date: "2019 – 2022",
    education: "Ingénieur Génie Informatique — École Nationale Supérieure Polytechnique",
    skills: ["AWS / Kubernetes", "TypeScript & Go", "PostgreSQL", "Docker / CI-CD"],
    kpiHighlight: "99.98% Uptime · -40% Latence",
  },
  "finance-banque": {
    initials: "CB",
    fullName: "CLARISSE BIYA-NDONGO",
    title: "Responsable Audit & Contrôle de Gestion OHADA",
    location: "Douala, Cameroun",
    email: "c.ndongo@finance.cm",
    phone: "+237 694 55 21 08",
    summary:
      "Experte-comptable mémorialiste spécialisée en normes SYSCOHADA révisé, conformité COBAC et reporting IFRS.",
    exp1Role: "Responsable Audit & Contrôle",
    exp1Company: "Afriland First Bank",
    exp1Date: "2021 – Présent",
    exp1Bullet1: "Supervision budgétaire de 8,4 Mds FCFA et réduction de 28 % des délais de clôture.",
    exp1Bullet2: "Conformité réglementaire COBAC/BEAC et audit du portefeuille crédit PME.",
    exp2Role: "Auditrice Financière Senior",
    exp2Company: "KPMG Afrique Centrale",
    exp2Date: "2018 – 2021",
    education: "DSCG & Master Comptabilité-Contrôle-Audit (CCA) — ESSEC Douala",
    skills: ["SYSCOHADA Révisé", "Normes IFRS", "Réglementation COBAC", "SAP FI/CO"],
    kpiHighlight: "8,4 Mds FCFA Audités · SAP FI",
  },
  "commercial-marketing": {
    initials: "YT",
    fullName: "YANNICK TCHOUA",
    title: "Key Account Manager B2B & Développement",
    location: "Douala · Zone CEMAC",
    email: "y.tchoua@sales.cm",
    phone: "+237 655 40 19 82",
    summary:
      "Business Developer B2B orienté conquête de parts de marché, grands comptes FMCG/Télécoms et animation réseau.",
    exp1Role: "Key Account Manager B2B",
    exp1Company: "Guinness Cameroun SA",
    exp1Date: "2022 – Présent",
    exp1Bullet1: "Croissance de +38 % du CA B2B (+1,8 Md FCFA) sur la zone Littoral & Sud-Ouest.",
    exp1Bullet2: "Ouverture de 45 comptes grands distributeurs et taux de recouvrement de 98 %.",
    exp2Role: "Chef de Secteur Commercial",
    exp2Company: "Nestlé Afrique Centrale",
    exp2Date: "2019 – 2022",
    education: "Master Marketing & Stratégie Commerciale — IUC Douala",
    skills: ["Négociation Grands Comptes", "Trade Marketing", "CRM Salesforce", "Leadership"],
    kpiHighlight: "+38% CA B2B (+1,8 Md FCFA)",
  },
  "ingenierie-btp": {
    initials: "PM",
    fullName: "PATRICE MBARGA",
    title: "Ingénieur Génie Civil & Directeur Travaux HSE",
    location: "Kribi & Douala",
    email: "p.mbarga@btp.cm",
    phone: "+237 670 33 48 91",
    summary:
      "Ingénieur Génie Civil (ONIGC) certifié HSE ISO 45001. Pilotage d'infrastructures portuaires, VRD et chantiers industriels.",
    exp1Role: "Directeur de Chantier & HSE",
    exp1Company: "AGL / Port Autonome de Kribi",
    exp1Date: "2020 – Présent",
    exp1Bullet1: "Livraison d'infrastructures VRD (budget 6,2 Mds FCFA) avec 0 accident de travail.",
    exp1Bullet2: "Coordination de 14 sous-traitants et contrôle qualité béton/géotechnique.",
    exp2Role: "Ingénieur Études & Méthodes",
    exp2Company: "Cimencam (LafargeHolcim)",
    exp2Date: "2017 – 2020",
    education: "Diplôme d'Ingénieur de Conception Génie Civil — ENSTP Yaoundé",
    skills: ["AutoCAD / Revit BIM", "Norme HSE ISO 45001", "Marchés Publics", "Génie Civil"],
    kpiHighlight: "Chantier 6,2 Mds F · 0 Accident",
  },
  "sante-ong": {
    initials: "AB",
    fullName: "DR. AÏSSATOU BELLO",
    title: "Coordinatrice Programmes Santé Publique & MEAL",
    location: "Yaoundé · CEMAC",
    email: "a.bello@ngo.org",
    phone: "+237 691 74 60 33",
    summary:
      "Médecin de Santé Publique (MPH) spécialisée en gestion de projets financés (OMS, UNICEF, Fonds Mondial) et suivi MEAL.",
    exp1Role: "Coordinatrice Nationale Santé",
    exp1Company: "UNICEF Cameroun",
    exp1Date: "2021 – Présent",
    exp1Bullet1: "Supervision de 18 districts sanitaires (budget bailleurs 2,4 M$ USD, 100 % conformité).",
    exp1Bullet2: "Déploiement du système digital de collecte de données épidémiologiques DHIS2.",
    exp2Role: "Responsable Médicale Terrain",
    exp2Company: "Médecins Sans Frontières (MSF)",
    exp2Date: "2018 – 2021",
    education: "Doctorat en Médecine (FMSB Yaoundé) · Master Santé Publique (MPH)",
    skills: ["Gestion Bailleurs ONU", "Suivi-Évaluation MEAL", "DHIS2 / KoboToolbox", "Anglais C1"],
    kpiHighlight: "Budget 2,4 M$ USD · Norme ONU",
  },
  "rh-juridique": {
    initials: "JE",
    fullName: "ME JEAN-PAUL EWANE",
    title: "Directeur Juridique OHADA & Ressources Humaines",
    location: "Douala & Libreville",
    email: "jp.ewane@legal.cm",
    phone: "+237 698 11 27 45",
    summary:
      "Juriste d'affaires OHADA et DRH. Sécurisation contractuelle, gouvernance des conseils d'administration et dialogue social.",
    exp1Role: "Directeur Juridique & RH Zone",
    exp1Company: "TotalEnergies Marketing CM",
    exp1Date: "2020 – Présent",
    exp1Bullet1: "Conformité Actes Uniformes OHADA et gestion sociale de 450 collaborateurs.",
    exp1Bullet2: "Réduction de 65 % du risque contentieux social et refonte de la grille GPEC.",
    exp2Role: "Juriste Senior Droit des Sociétés",
    exp2Company: "Cabinet Conseil Juridique CEMAC",
    exp2Date: "2016 – 2020",
    education: "Master II Droit des Affaires OHADA — Université de Douala / Paris II",
    skills: ["Droit Affaires OHADA", "Droit du Travail", "Secrétariat Général", "GPEC & Paie"],
    kpiHighlight: "450 Collaborateurs · Droit OHADA",
  },
  "campus-stage": {
    initials: "LN",
    fullName: "LÉA NKODO",
    title: "Analyste Junior Finance & Data (Lauréate Master)",
    location: "Yaoundé · Prête à l'emploi",
    email: "lea.nkodo@ucac.cm",
    phone: "+237 651 82 94 10",
    summary:
      "Major de promotion Master Finance & Audit (UCAC). Rigoureuse, bilingue (FR/EN) et formée à l'automatisation Power BI.",
    exp1Role: "Stagiaire Audit Financier (PFE)",
    exp1Company: "PwC Cameroun · Douala",
    exp1Date: "Jan – Juil 2026",
    exp1Bullet1: "Participation aux missions de commissariat aux comptes de 6 entreprises agro-industrielles.",
    exp1Bullet2: "Conception d'un tableau de bord Power BI réduisant de 4h le reporting hebdomadaire.",
    exp2Role: "Présidente Club Finance & Invest",
    exp2Company: "Université Catholique (UCAC)",
    exp2Date: "2024 – 2026",
    education: "Master II Audit & Contrôle de Gestion (Mention Très Bien) — UCAC",
    skills: ["Power BI & Excel VBA", "Comptabilité OHADA", "Analyse Financière", "Bilingue FR/EN"],
    kpiHighlight: "Major de Promo · Stage PwC",
  },
  "minimal-ats": {
    initials: "SE",
    fullName: "SAMUEL ETOUNDI, PMP®",
    title: "Senior International Program & PMO Director",
    location: "Douala · Paris · Genève",
    email: "s.etoundi@global.com",
    phone: "+237 690 44 10 05",
    summary:
      "Certifié PMP® & PRINCE2. 12 ans d'expérience en pilotage de programmes internationaux (Big Four, Banques & Institutions).",
    exp1Role: "Senior Manager Advisory & PMO",
    exp1Company: "EY (Ernst & Young) Advisory",
    exp1Date: "2020 – Présent",
    exp1Bullet1: "Direction de la transformation digitale bancaire dans 5 pays CEMAC (budget 9,5 M€).",
    exp1Bullet2: "100 % des jalons livrés à date selon les standards Workday, SAP et ISO 27001.",
    exp2Role: "Project Manager Consultant",
    exp2Company: "Groupe Banque Mondiale",
    exp2Date: "2017 – 2020",
    education: "MSc Project Management — London School of Economics · PMP® Certified",
    skills: ["PMP® / PRINCE2", "Workday & SAP ERP", "Change Management", "English Native"],
    kpiHighlight: "100% Workday & Taleo Ready",
  },
  "digital-creatif": {
    initials: "CN",
    fullName: "CHLOÉ NGUEMA",
    title: "Directrice Artistique, Brand & UI/UX Lead",
    location: "Douala & Abidjan",
    email: "chloe@studio-digital.cm",
    phone: "+237 696 20 83 77",
    summary:
      "Directrice Artistique & Product Designer (8 ans). Création d'identités de marque mémorables et campagnes digitales à fort ROI.",
    exp1Role: "Head of Brand & Digital Design",
    exp1Company: "Canal+ Afrique Centrale",
    exp1Date: "2022 – Présent",
    exp1Bullet1: "Pilotage des campagnes 360° (+2,4M d'impressions organiques, +31 % de conversion web).",
    exp1Bullet2: "Refonte du Design System Figma mobile & supervision d'un studio de 6 créatifs.",
    exp2Role: "Senior UI/UX & Brand Designer",
    exp2Company: "Agence McCann Douala",
    exp2Date: "2019 – 2022",
    education: "Master Direction Artistique & Design Numérique — Beaux-Arts / SupdePub",
    skills: ["Figma Design System", "Stratégie Social Media", "Brand Identity", "Adobe CC"],
    kpiHighlight: "+2,4M Impressions · +31% Conv.",
  },
};

interface Props {
  template: SectorTemplate;
  className?: string;
}

export function MiniCvPreview({ template, className = "" }: Props) {
  const theme = getTheme(template.settings.colorTheme);
  const persona = PERSONAS[template.id] ?? PERSONAS.executive;
  const layout = template.settings.layout;
  const isSerif = template.settings.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";

  return (
    <div
      className={`relative w-full h-60 rounded-xl bg-slate-950/90 p-2.5 border border-slate-700/70 group-hover:border-[#32D3E1]/60 overflow-hidden transition-all duration-300 shadow-inner flex items-start justify-center ${className}`}
    >
      {/* Subtle Ambient Glow behind the A4 sheet matching the template theme */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-24 rounded-full blur-2xl opacity-30 pointer-events-none transition-opacity group-hover:opacity-60"
        style={{ background: theme.swatch }}
      />

      {/* Realistic A4 Paper Sheet */}
      <div
        className={`relative w-full h-full bg-white text-slate-800 rounded-lg shadow-[0_8px_28px_rgba(0,0,0,0.45)] border border-slate-200/90 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] flex flex-col justify-between select-none ${fontClass}`}
      >
        {layout === "modern" ? (
          /* ── ARCHITECTURE 1 : MODERN 2-COLUMN SIDEBAR ── */
          <div className="flex h-full w-full">
            {/* Left Colored Sidebar */}
            <div
              className="w-[34%] h-full p-2.5 text-white flex flex-col justify-between shrink-0"
              style={{ background: theme.pdfHeaderBg }}
            >
              <div>
                {/* Avatar Initials Circle */}
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[10px] font-extrabold text-white mx-auto mb-2 shadow-xs">
                  {persona.initials}
                </div>
                <div className="text-[7px] uppercase tracking-wider font-bold text-white/70 mb-1 border-b border-white/20 pb-0.5">
                  Contact
                </div>
                <div className="space-y-0.5 text-[6.5px] text-white/90 leading-tight mb-2">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-2 h-2 shrink-0 opacity-80" />
                    <span className="truncate">{persona.location}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Phone className="w-2 h-2 shrink-0 opacity-80" />
                    <span className="truncate">{persona.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Mail className="w-2 h-2 shrink-0 opacity-80" />
                    <span className="truncate">{persona.email}</span>
                  </div>
                </div>

                <div className="text-[7px] uppercase tracking-wider font-bold text-white/70 mb-1 border-b border-white/20 pb-0.5">
                  Compétences
                </div>
                <div className="flex flex-col gap-1">
                  {persona.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[6.5px] font-semibold bg-white/15 px-1.5 py-0.5 rounded text-white truncate"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* KPI Pill at bottom of sidebar */}
              <div className="bg-black/25 border border-white/20 rounded px-1.5 py-1 text-[6px] font-bold text-emerald-300 truncate text-center">
                ★ {persona.kpiHighlight}
              </div>
            </div>

            {/* Right Main Content */}
            <div className="flex-1 p-2.5 flex flex-col justify-between bg-white overflow-hidden">
              <div>
                <div className="border-b border-slate-200 pb-1.5 mb-1.5">
                  <div className="text-[10px] font-extrabold text-slate-900 tracking-tight leading-none truncate">
                    {persona.fullName}
                  </div>
                  <div
                    className="text-[7.5px] font-bold mt-0.5 truncate"
                    style={{ color: theme.swatch }}
                  >
                    {persona.title}
                  </div>
                  <p className="text-[6.5px] text-slate-500 leading-snug mt-1 line-clamp-2">
                    {persona.summary}
                  </p>
                </div>

                {/* Experience Section */}
                <div className="mb-1.5">
                  <div
                    className="text-[6.5px] font-extrabold uppercase tracking-wider mb-1 flex items-center justify-between"
                    style={{ color: theme.swatch }}
                  >
                    <span>Expérience Professionnelle</span>
                    <span className="text-[6px] text-slate-400 font-normal">ATS Verified</span>
                  </div>

                  <div className="mb-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[7.5px] font-bold text-slate-900 truncate">
                        {persona.exp1Role}
                      </span>
                      <span className="text-[6px] font-semibold text-slate-400 shrink-0">
                        {persona.exp1Date}
                      </span>
                    </div>
                    <div className="text-[6.5px] font-semibold text-slate-600 mb-0.5 truncate">
                      {persona.exp1Company}
                    </div>
                    <ul className="space-y-0.5 text-[6.5px] text-slate-600 leading-tight">
                      <li className="truncate">• {persona.exp1Bullet1}</li>
                      <li className="truncate">• {persona.exp1Bullet2}</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[7px] font-bold text-slate-800 truncate">
                        {persona.exp2Role}
                      </span>
                      <span className="text-[6px] text-slate-400 shrink-0">
                        {persona.exp2Date}
                      </span>
                    </div>
                    <div className="text-[6px] text-slate-500 truncate">
                      {persona.exp2Company}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Footer */}
              <div className="pt-1 border-t border-slate-100">
                <div
                  className="text-[6px] font-extrabold uppercase tracking-wider"
                  style={{ color: theme.swatch }}
                >
                  Formation &amp; Diplômes
                </div>
                <div className="text-[6.5px] font-medium text-slate-700 truncate">
                  {persona.education}
                </div>
              </div>
            </div>
          </div>
        ) : layout === "classic" ? (
          /* ── ARCHITECTURE 2 : CLASSIC EXECUTIVE / CORPORATE BANNER ── */
          <div className="flex flex-col h-full w-full justify-between">
            <div>
              {/* Full-width colored header */}
              <div
                className="px-3 py-2 text-white flex items-center justify-between gap-2"
                style={{ background: theme.pdfHeaderBg }}
              >
                <div className="min-w-0">
                  <div className="text-[10.5px] font-extrabold tracking-wide leading-none truncate">
                    {persona.fullName}
                  </div>
                  <div className="text-[7.5px] font-medium text-white/90 mt-0.5 truncate">
                    {persona.title}
                  </div>
                  <div className="flex items-center gap-2 text-[6px] text-white/75 mt-1 truncate">
                    <span>{persona.location}</span>
                    <span>•</span>
                    <span>{persona.phone}</span>
                    <span>•</span>
                    <span className="truncate">{persona.email}</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                  {persona.initials}
                </div>
              </div>

              {/* Body */}
              <div className="p-2.5 space-y-1.5">
                {/* Summary */}
                <p className="text-[6.5px] text-slate-600 leading-snug border-l-2 pl-1.5 line-clamp-2" style={{ borderColor: theme.swatch }}>
                  {persona.summary}
                </p>

                {/* Experience */}
                <div>
                  <div
                    className="text-[6.5px] font-extrabold uppercase tracking-wider border-b pb-0.5 mb-1 flex items-center justify-between"
                    style={{ color: theme.swatch, borderColor: `${theme.swatch}33` }}
                  >
                    <span>Parcours Professionnel</span>
                    <span className="text-[6px] font-bold px-1 rounded bg-slate-100 text-slate-700">
                      {persona.kpiHighlight}
                    </span>
                  </div>

                  <div className="mb-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[7.5px] font-bold text-slate-900 truncate">
                        {persona.exp1Role} — <span className="text-slate-600">{persona.exp1Company}</span>
                      </span>
                      <span className="text-[6px] font-semibold text-slate-400 shrink-0 ml-1">
                        {persona.exp1Date}
                      </span>
                    </div>
                    <ul className="space-y-0.5 text-[6.5px] text-slate-600 leading-tight mt-0.5">
                      <li className="truncate">• {persona.exp1Bullet1}</li>
                      <li className="truncate">• {persona.exp1Bullet2}</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-[6.5px] text-slate-700">
                    <span className="font-bold truncate">
                      {persona.exp2Role} — <span className="font-normal text-slate-500">{persona.exp2Company}</span>
                    </span>
                    <span className="text-[6px] text-slate-400 shrink-0 ml-1">{persona.exp2Date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Education + Skills Bar */}
            <div className="px-2.5 pb-2 pt-1 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-1">
              <div className="flex flex-wrap gap-1 overflow-hidden max-h-4">
                {persona.skills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[6px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 truncate"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="text-[6px] text-slate-500 font-semibold truncate shrink-0">
                {persona.education.split("—")[0]}
              </span>
            </div>
          </div>
        ) : (
          /* ── ARCHITECTURE 3 : MINIMALIST INTERNATIONAL / ONU / BIG FOUR ── */
          <div className="p-3 flex flex-col h-full w-full justify-between bg-white">
            <div>
              {/* Top Minimalist Header with Accent Top Rule */}
              <div className="border-b-2 pb-1.5 mb-1.5" style={{ borderColor: theme.swatch }}>
                <div className="flex items-baseline justify-between gap-1">
                  <div className="text-[10.5px] font-extrabold text-slate-900 tracking-tight truncate">
                    {persona.fullName}
                  </div>
                  <span
                    className="text-[6px] font-bold px-1.5 py-0.5 rounded-full text-white shrink-0"
                    style={{ background: theme.swatch }}
                  >
                    {persona.kpiHighlight}
                  </span>
                </div>
                <div
                  className="text-[7.5px] font-bold truncate mt-0.5"
                  style={{ color: theme.swatch }}
                >
                  {persona.title}
                </div>
                <div className="flex items-center gap-2 text-[6px] text-slate-500 mt-0.5 truncate">
                  <span>{persona.location}</span>
                  <span>|</span>
                  <span>{persona.phone}</span>
                  <span>|</span>
                  <span className="truncate">{persona.email}</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-[6.5px] text-slate-600 leading-snug mb-1.5 line-clamp-2">
                {persona.summary}
              </p>

              {/* Experience */}
              <div className="mb-1">
                <div className="text-[6.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  Professional Experience
                </div>
                <div className="mb-1">
                  <div className="flex items-center justify-between text-[7.5px] font-bold text-slate-900">
                    <span className="truncate">{persona.exp1Role} · {persona.exp1Company}</span>
                    <span className="text-[6px] text-slate-400 shrink-0 ml-1">{persona.exp1Date}</span>
                  </div>
                  <ul className="space-y-0.5 text-[6.5px] text-slate-600 leading-tight mt-0.5">
                    <li className="truncate">• {persona.exp1Bullet1}</li>
                    <li className="truncate">• {persona.exp1Bullet2}</li>
                  </ul>
                </div>
                <div className="flex items-center justify-between text-[6.5px] text-slate-700">
                  <span className="font-semibold truncate">{persona.exp2Role} · {persona.exp2Company}</span>
                  <span className="text-[6px] text-slate-400 shrink-0 ml-1">{persona.exp2Date}</span>
                </div>
              </div>
            </div>

            {/* Bottom Skills */}
            <div className="pt-1 border-t border-slate-200 flex items-center justify-between gap-1">
              <div className="flex gap-1 overflow-hidden">
                {persona.skills.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[6px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="text-[6px] font-bold text-emerald-700 flex items-center gap-0.5 shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5" /> ISO-ATS
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Layout Architecture Pill in bottom-right corner */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-700 shadow-md flex items-center gap-1 pointer-events-none">
        <Award className="w-2.5 h-2.5 text-[#32D3E1]" />
        <span>
          {layout === "modern"
            ? "2 Colonnes"
            : layout === "classic"
            ? "Exécutif"
            : "Linéaire ATS"}
          {isSerif ? " · Serif" : " · Sans"}
        </span>
      </div>
    </div>
  );
}

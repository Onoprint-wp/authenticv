export interface ColorTheme {
  id: string;
  label: string;
  swatch: string;
  headerGradient: string;
  accentColor: string;
  accentLight: string;
  accentBg: string;
  pdfAccentColor: string;
  pdfHeaderBg: string;
}

export interface DesignSettings {
  colorTheme: string;
  fontFamily: "sans" | "serif";
  layout: "classic" | "modern" | "minimal";
  spacing: "compact" | "normal" | "spacious";
  recruiterVisible: boolean;
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  colorTheme: "indigo",
  fontFamily: "sans",
  layout: "classic",
  spacing: "normal",
  recruiterVisible: true,
};

export const PDF_SPACING = {
  compact:  { headerPadH: 26, headerPadV: 18, mainPadH: 18, mainPadV: 16, sidebarPadH: 12, sidebarPadV: 16, sidebarGap: 10, sectionMb: 12, itemMb: 6,  pagePadH: 30, pagePadV: 26 },
  normal:   { headerPadH: 36, headerPadV: 28, mainPadH: 26, mainPadV: 24, sidebarPadH: 16, sidebarPadV: 24, sidebarGap: 16, sectionMb: 20, itemMb: 10, pagePadH: 44, pagePadV: 40 },
  spacious: { headerPadH: 48, headerPadV: 40, mainPadH: 34, mainPadV: 32, sidebarPadH: 22, sidebarPadV: 32, sidebarGap: 22, sectionMb: 28, itemMb: 14, pagePadH: 58, pagePadV: 52 },
} as const;

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: "indigo",
    label: "Indigo",
    swatch: "#6366f1",
    headerGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
    accentColor: "#6366f1",
    accentLight: "#a5b4fc",
    accentBg: "#eef2ff",
    pdfAccentColor: "#6366f1",
    pdfHeaderBg: "#1e1b4b",
  },
  {
    id: "slate",
    label: "Ardoise",
    swatch: "#475569",
    headerGradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    accentColor: "#475569",
    accentLight: "#94a3b8",
    accentBg: "#f1f5f9",
    pdfAccentColor: "#475569",
    pdfHeaderBg: "#0f172a",
  },
  {
    id: "emerald",
    label: "Émeraude",
    swatch: "#10b981",
    headerGradient: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #14532d 100%)",
    accentColor: "#059669",
    accentLight: "#6ee7b7",
    accentBg: "#ecfdf5",
    pdfAccentColor: "#059669",
    pdfHeaderBg: "#064e3b",
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "#f43f5e",
    headerGradient: "linear-gradient(135deg, #881337 0%, #9f1239 50%, #7f1d1d 100%)",
    accentColor: "#e11d48",
    accentLight: "#fda4af",
    accentBg: "#fff1f2",
    pdfAccentColor: "#e11d48",
    pdfHeaderBg: "#881337",
  },
  {
    id: "amber",
    label: "Ambre",
    swatch: "#f59e0b",
    headerGradient: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #7c2d12 100%)",
    accentColor: "#d97706",
    accentLight: "#fcd34d",
    accentBg: "#fffbeb",
    pdfAccentColor: "#d97706",
    pdfHeaderBg: "#78350f",
  },
  {
    id: "cyan",
    label: "Cyan",
    swatch: "#06b6d4",
    headerGradient: "linear-gradient(135deg, #164e63 0%, #155e75 50%, #1e3a5f 100%)",
    accentColor: "#0891b2",
    accentLight: "#67e8f9",
    accentBg: "#ecfeff",
    pdfAccentColor: "#0891b2",
    pdfHeaderBg: "#164e63",
  },
  {
    id: "violet",
    label: "Violet",
    swatch: "#8b5cf6",
    headerGradient: "linear-gradient(135deg, #2e1065 0%, #3b0764 50%, #1e1b4b 100%)",
    accentColor: "#7c3aed",
    accentLight: "#c4b5fd",
    accentBg: "#f5f3ff",
    pdfAccentColor: "#7c3aed",
    pdfHeaderBg: "#2e1065",
  },
  {
    id: "neutral",
    label: "Neutre",
    swatch: "#404040",
    headerGradient: "linear-gradient(135deg, #171717 0%, #262626 50%, #171717 100%)",
    accentColor: "#525252",
    accentLight: "#d4d4d4",
    accentBg: "#fafafa",
    pdfAccentColor: "#525252",
    pdfHeaderBg: "#171717",
  },
];

export function getTheme(id: string): ColorTheme {
  return COLOR_THEMES.find((t) => t.id === id) ?? COLOR_THEMES[0];
}

export interface SectorTemplate {
  id: string;
  name: string;
  sector: string;
  badge: string;
  atsScore: string;
  description: string;
  recommendedFor: string[];
  settings: Omit<DesignSettings, "recruiterVisible">;
}

export const SECTOR_TEMPLATES: SectorTemplate[] = [
  {
    id: "executive",
    name: "Exécutif & Direction",
    sector: "Direction & Conseil",
    badge: "Best-Seller Cadres",
    atsScore: "98%",
    description:
      "Hiérarchie exécutive sobre avec typographie Serif d'autorité. Idéal pour postes de direction, conseils d'administration et cabinets d'audit.",
    recommendedFor: ["Directeur Général", "Chef de Département", "Consultant Senior", "Country Manager"],
    settings: { layout: "classic", colorTheme: "slate", fontFamily: "serif", spacing: "spacious" },
  },
  {
    id: "tech-data",
    name: "Tech, Cloud & Data",
    sector: "IT, Data & Télécoms",
    badge: "Spécial Tech",
    atsScore: "99%",
    description:
      "Architecture moderne à colonne latérale mettant en valeur la stack technique, les certifications Cloud et les projets DevOps/Data.",
    recommendedFor: ["Développeur Full-Stack", "Ingénieur DevOps / Cloud", "Data Analyst", "Architecte Logiciel"],
    settings: { layout: "modern", colorTheme: "cyan", fontFamily: "sans", spacing: "compact" },
  },
  {
    id: "finance-banque",
    name: "Banque, Finance & OHADA",
    sector: "Banque, Audit & Comptabilité",
    badge: "Standard Bancaire",
    atsScore: "98%",
    description:
      "Mise en page rigoureuse pensée pour les banques, microfinances, assurances et cabinets d'expertise comptable de la zone CEMAC.",
    recommendedFor: ["Analyste Financier", "Comptable OHADA", "Auditeur Interne", "Gestionnaire de Portefeuille"],
    settings: { layout: "classic", colorTheme: "indigo", fontFamily: "serif", spacing: "normal" },
  },
  {
    id: "commercial-marketing",
    name: "Commercial, Vente & B2B",
    sector: "Commerce, FMCG & Distribution",
    badge: "Orientation Résultats",
    atsScore: "96%",
    description:
      "Design dynamique qui fait ressortir immédiatement vos chiffres d'affaires, parts de marché gagnées et KPIs commerciaux.",
    recommendedFor: ["Business Developer", "Responsable Commercial", "Key Account Manager", "Chef de Produit"],
    settings: { layout: "modern", colorTheme: "emerald", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "ingenierie-btp",
    name: "Ingénierie, Mines & BTP",
    sector: "Industrie, BTP, HSE & Logistique",
    badge: "Terrain & Projets",
    atsScore: "97%",
    description:
      "Structure dense et normée pour valoriser les chantiers livrés, habilitations HSE, budgets d'infrastructure et opérations logistiques.",
    recommendedFor: ["Ingénieur Génie Civil", "Responsable HSE", "Ingénieur Pétrole & Mines", "Supply Chain Manager"],
    settings: { layout: "classic", colorTheme: "amber", fontFamily: "sans", spacing: "compact" },
  },
  {
    id: "sante-ong",
    name: "Santé, Pharma & ONG",
    sector: "Médical, Humanitaire & Développement",
    badge: "Norme ONG / ONU",
    atsScore: "99%",
    description:
      "Format épuré haute lisibilité conforme aux exigences des agences onusiennes (OMS, UNICEF), ONG internationales et établissements de santé.",
    recommendedFor: ["Coordinateur de Projet ONG", "Médecin / Pharmacien", "Spécialiste MEAL", "Santé Publique"],
    settings: { layout: "minimal", colorTheme: "emerald", fontFamily: "sans", spacing: "spacious" },
  },
  {
    id: "rh-juridique",
    name: "RH, Juridique & Gouvernance",
    sector: "Ressources Humaines & Droit",
    badge: "Élégance Éditoriale",
    atsScore: "97%",
    description:
      "Équilibre académique et institutionnel valorisant l'expertise réglementaire, le droit des affaires OHADA et la gestion du capital humain.",
    recommendedFor: ["Responsable RH (DRH)", "Juriste d'Entreprise", "Chargé de Recrutement", "Secrétaire Général"],
    settings: { layout: "classic", colorTheme: "rose", fontFamily: "serif", spacing: "normal" },
  },
  {
    id: "campus-stage",
    name: "Campus, Lauréat & 1er Emploi",
    sector: "Étudiants & Jeunes Diplômés",
    badge: "Spécial 1er Emploi",
    atsScore: "96%",
    description:
      "Valorise la formation académique, les projets universitaires, les stages et le potentiel même avec peu d'années d'expérience.",
    recommendedFor: ["Étudiant en Master / Grande École", "Stagiaire PFE", "Jeune Diplômé", "Alternant"],
    settings: { layout: "modern", colorTheme: "violet", fontFamily: "sans", spacing: "spacious" },
  },
  {
    id: "minimal-ats",
    name: "Standard ATS International",
    sector: "Multinationales & Big Four",
    badge: "Score ATS 100%",
    atsScore: "100%",
    description:
      "Le format linéaire universel exigé par les robots Workday, Taleo et Greenhouse des multinationales. Zéro artifice, impact pur.",
    recommendedFor: ["Candidatures Internationales", "Big Four (Deloitte, PwC, EY)", "Programmes Graduate", "Mobilité Internationale"],
    settings: { layout: "minimal", colorTheme: "neutral", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "digital-creatif",
    name: "Digital, Médias & Com",
    sector: "Communication, Design & Digital",
    badge: "Créatif & ATS-Safe",
    atsScore: "95%",
    description:
      "Affirme votre identité visuelle et vos campagnes digitales tout en conservant un flux texte 100% extractible par les logiciels RH.",
    recommendedFor: ["Responsable Communication", "UI/UX Designer", "Social Media Manager", "Chef de Projet Digital"],
    settings: { layout: "modern", colorTheme: "rose", fontFamily: "sans", spacing: "normal" },
  },
];

export function getSectorTemplate(id: string): SectorTemplate | undefined {
  return SECTOR_TEMPLATES.find((t) => t.id === id);
}


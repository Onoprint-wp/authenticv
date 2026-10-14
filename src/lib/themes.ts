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

export type CvLayout =
  | "classic"
  | "modern"
  | "minimal"
  | "executive"
  | "split"
  | "compact-grid";

export interface DesignSettings {
  colorTheme: string;
  fontFamily: "sans" | "serif";
  layout: CvLayout;
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
  compact:  { scale: 0.94, headerPadH: 28, headerPadV: 20, mainPadH: 22, mainPadV: 18, sidebarPadH: 14, sidebarPadV: 18, sidebarGap: 12, sectionMb: 14, itemMb: 8,  pagePadH: 32, pagePadV: 28 },
  normal:   { scale: 1.0,  headerPadH: 36, headerPadV: 26, mainPadH: 28, mainPadV: 24, sidebarPadH: 18, sidebarPadV: 24, sidebarGap: 16, sectionMb: 18, itemMb: 11, pagePadH: 42, pagePadV: 36 },
  spacious: { scale: 1.08, headerPadH: 44, headerPadV: 34, mainPadH: 34, mainPadV: 30, sidebarPadH: 22, sidebarPadV: 30, sidebarGap: 20, sectionMb: 24, itemMb: 14, pagePadH: 50, pagePadV: 44 },
} as const;

export const WEB_FONT_SCALE = {
  compact: 0.93,
  normal: 1,
  spacious: 1.08,
} as const;

/**
 * Normalise les séquences échappées ("\\n") ou retours chariot en vrais sauts de ligne
 * et harmonise les listes à puces pour un rendu propre Web & PDF.
 */
export function normalizeCvText(text?: string): string {
  if (!text) return "";
  const cleaned = text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 1) return cleaned;

  const hasBullets = lines.some((l) => /^[•\-*▪▸]\s*/.test(l));
  if (!hasBullets) return lines.join("\n");

  return lines
    .map((line) => {
      const stripped = line.replace(/^[•\-*▪▸]\s*/, "").trim();
      return stripped ? `• ${stripped}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

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
      "Hiérarchie exécutive Harvard en typographie Serif d'autorité pour postes de direction, conseils et cabinets d'audit.",
    recommendedFor: ["Directeur Général", "Chef de Département", "Consultant Senior", "Country Manager"],
    settings: { layout: "executive", colorTheme: "slate", fontFamily: "serif", spacing: "normal" },
  },
  {
    id: "tech-data",
    name: "Tech, Cloud & Data",
    sector: "IT, Data & Télécoms",
    badge: "Spécial Tech",
    atsScore: "99%",
    description:
      "Architecture moderne 2 colonnes valorisant la stack technique, les certifications Cloud et les projets DevOps/Data.",
    recommendedFor: ["Développeur Full-Stack", "Ingénieur Cloud", "Data Analyst", "Architecte Logiciel"],
    settings: { layout: "modern", colorTheme: "cyan", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "finance-banque",
    name: "Banque, Finance & OHADA",
    sector: "Banque, Audit & Comptabilité",
    badge: "Standard Bancaire",
    atsScore: "98%",
    description:
      "Mise en page rigoureuse calibrée pour les banques, assurances, microfinances et cabinets comptables CEMAC.",
    recommendedFor: ["Analyste Financier", "Comptable OHADA", "Auditeur Interne", "Contrôleur de Gestion"],
    settings: { layout: "classic", colorTheme: "indigo", fontFamily: "serif", spacing: "normal" },
  },
  {
    id: "commercial-marketing",
    name: "Commercial, Vente & B2B",
    sector: "Commerce, FMCG & Distribution",
    badge: "Orientation Résultats",
    atsScore: "96%",
    description:
      "Architecture Split asymétrique qui met immédiatement en évidence vos chiffres d'affaires, parts de marché et KPIs.",
    recommendedFor: ["Business Developer", "Responsable Commercial", "Key Account Manager", "Chef de Produit"],
    settings: { layout: "split", colorTheme: "emerald", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "ingenierie-btp",
    name: "Ingénierie, Mines & BTP",
    sector: "Industrie, BTP, HSE & Logistique",
    badge: "Terrain & Projets",
    atsScore: "97%",
    description:
      "Grille technique structurée valorisant les chantiers livrés, habilitations HSE ISO 45001 et budgets d'infrastructure.",
    recommendedFor: ["Ingénieur Génie Civil", "Responsable HSE", "Ingénieur Mines", "Supply Chain Manager"],
    settings: { layout: "compact-grid", colorTheme: "amber", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "sante-ong",
    name: "Santé, Pharma & ONG",
    sector: "Médical, Humanitaire & Développement",
    badge: "Norme ONG / ONU",
    atsScore: "99%",
    description:
      "Format linéaire haute lisibilité conforme aux standards des agences onusiennes (OMS, UNICEF) et ONG internationales.",
    recommendedFor: ["Coordinateur ONG", "Médecin / Pharmacien", "Spécialiste MEAL", "Santé Publique"],
    settings: { layout: "minimal", colorTheme: "emerald", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "rh-juridique",
    name: "RH, Juridique & Gouvernance",
    sector: "Ressources Humaines & Droit",
    badge: "Élégance Éditoriale",
    atsScore: "97%",
    description:
      "Équilibre institutionnel mettant en avant le droit des affaires OHADA, la conformité sociale et la direction RH.",
    recommendedFor: ["Directeur RH (DRH)", "Juriste d'Affaires", "Chargé de Recrutement", "Secrétaire Général"],
    settings: { layout: "executive", colorTheme: "rose", fontFamily: "serif", spacing: "normal" },
  },
  {
    id: "campus-stage",
    name: "Campus, Lauréat & 1er Emploi",
    sector: "Étudiants & Jeunes Diplômés",
    badge: "Spécial 1er Emploi",
    atsScore: "96%",
    description:
      "Valorise l'excellence académique, les mémoires de fin d'études, les stages PFE et le potentiel des jeunes diplômés.",
    recommendedFor: ["Lauréat Master / École", "Stagiaire PFE", "Jeune Diplômé", "Analyste Junior"],
    settings: { layout: "split", colorTheme: "violet", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "minimal-ats",
    name: "Standard ATS International",
    sector: "Multinationales & Big Four",
    badge: "Score ATS 100%",
    atsScore: "100%",
    description:
      "Le format linéaire universel exigé par les robots Workday, Taleo et Greenhouse des multinationales et Big Four.",
    recommendedFor: ["Candidature Internationale", "Big Four (Deloitte, EY)", "Programme Graduate", "PMO Senior"],
    settings: { layout: "minimal", colorTheme: "neutral", fontFamily: "sans", spacing: "normal" },
  },
  {
    id: "digital-creatif",
    name: "Digital, Médias & Com",
    sector: "Communication, Design & Digital",
    badge: "Créatif & ATS-Safe",
    atsScore: "95%",
    description:
      "Affirme votre identité créative et vos campagnes 360° tout en garantissant un flux vectoriel 100 % lisible par les ATS.",
    recommendedFor: ["Responsable Com", "UI/UX Designer", "Social Media Manager", "Brand Manager"],
    settings: { layout: "modern", colorTheme: "rose", fontFamily: "sans", spacing: "normal" },
  },
];

export function getSectorTemplate(id: string): SectorTemplate | undefined {
  return SECTOR_TEMPLATES.find((t) => t.id === id);
}


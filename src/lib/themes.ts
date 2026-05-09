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
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  colorTheme: "indigo",
  fontFamily: "sans",
  layout: "classic",
  spacing: "normal",
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

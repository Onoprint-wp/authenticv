import type { CvData } from "@/store/useCvStore";

export type Sector =
  | "tech" | "design" | "marketing" | "finance" | "rh"
  | "sante" | "commercial" | "juridique" | "education" | "autre";

const SECTOR_KEYWORDS: Record<Sector, string[]> = {
  tech: [
    "développeur", "developer", "ingénieur logiciel", "software engineer",
    "devops", "data scientist", "data engineer", "fullstack", "frontend",
    "backend", "machine learning", "ia", "ai", "cybersécurité", "architect",
    "cloud", "mobile", "ios", "android", "sre", "qa", "test",
  ],
  design: [
    "designer", "ui", "ux", "graphiste", "illustrateur", "motion",
    "créatif", "creative", "branding", "webdesign", "directeur artistique",
    "3d", "2d", "animateur", "animation",
  ],
  marketing: [
    "marketing", "seo", "sem", "content", "growth", "community manager",
    "brand", "communication", "publicité", "digital", "influencer",
    "copywriter", "rédacteur",
  ],
  finance: [
    "comptable", "finance", "comptabilité", "auditeur", "audit",
    "contrôleur de gestion", "analyste financier", "banque", "assurance",
    "trésorerie", "fiscalité", "expert-comptable",
  ],
  rh: [
    "ressources humaines", "rh", "recruteur", "recrutement", "talent",
    "formation", "paie", "relations sociales", "hrbp", "drh",
  ],
  sante: [
    "médecin", "infirmier", "pharmacien", "chirurgien", "urgentiste",
    "kiné", "psychologue", "sage-femme", "aide-soignant", "santé",
  ],
  commercial: [
    "commercial", "vente", "vendeur", "account manager", "business developer",
    "sales", "chargé d'affaires", "technico-commercial",
  ],
  juridique: [
    "juriste", "avocat", "notaire", "droit", "legal", "compliance",
    "paralegal",
  ],
  education: [
    "enseignant", "professeur", "formateur", "éducateur", "pédagogue",
    "coach", "tuteur",
  ],
  autre: [],
};

export function detectSector(cv: CvData): Sector {
  const text = [
    cv.personalInfo?.title ?? "",
    ...(cv.experiences ?? []).map((e) => `${e.position} ${e.company}`),
    ...(cv.skills ?? []),
  ]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS) as [Sector, string[]][]) {
    if (sector === "autre") continue;
    const normalized = keywords.map((k) =>
      k.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    );
    if (normalized.some((kw) => text.includes(kw))) return sector;
  }
  return "autre";
}

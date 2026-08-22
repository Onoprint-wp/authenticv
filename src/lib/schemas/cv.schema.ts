import { z } from "zod";
import { DEFAULT_DESIGN_SETTINGS } from "@/lib/themes";

// ─── Design Settings Schema ───────────────────────────────────────────────────

export const DesignSettingsSchema = z.object({
  colorTheme: z.string().default("indigo"),
  fontFamily: z.enum(["sans", "serif"]).default("sans"),
  layout: z.enum(["classic", "modern", "minimal"]).default("classic"),
  spacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
  recruiterVisible: z.boolean().default(true),
});

// ─── Personal Info Schema ─────────────────────────────────────────────────────

export const PersonalInfoSchema = z.object({
  firstName: z.string().optional().default(""),
  lastName: z.string().optional().default(""),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  title: z.string().optional().default(""),
  photoUrl: z.string().optional().default(""),
});

// ─── Sub-entities Schemas ─────────────────────────────────────────────────────

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string().optional().default(""),
  current: z.boolean().optional().default(false),
  description: z.string().optional().default(""),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional().default(""),
  startDate: z.string(),
  endDate: z.string().optional().default(""),
});

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string().optional().default(""), // e.g. "Natif", "B1", etc.
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string().optional().default(""),
  date: z.string().optional().default(""),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(""),
  link: z.string().optional(),
});

// ─── Root CvData Schema ───────────────────────────────────────────────────────

export const CvDataSchema = z.object({
  documentTitle: z.string().optional().default("Untitled CV"),
  personalInfo: PersonalInfoSchema.default(() => PersonalInfoSchema.parse({})),
  summary: z.string().optional().default(""),
  experiences: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(LanguageSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  designSettings: DesignSettingsSchema.default(() => DesignSettingsSchema.parse({})),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CvData = z.infer<typeof CvDataSchema>;
export type DesignSettings = z.infer<typeof DesignSettingsSchema>;

export interface CvDataSnapshot {
  cvData: CvData;
  savedAt: string; // ISO 8601
}

export type SyncStatus = "idle" | "saving" | "saved" | "error";

export interface ResumeListItem {
  id: string;
  title: string;
  updatedAt: string;
  isDefault: boolean;
}

// ─── Default CV Data ──────────────────────────────────────────────────────────

export const DEFAULT_CV_DATA: CvData = {
  documentTitle: "Untitled CV",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    title: "",
    photoUrl: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  designSettings: DEFAULT_DESIGN_SETTINGS,
};

// ─── Safe Parse & Migration Helper ────────────────────────────────────────────

/**
 * Normalise et sécurise n'importe quel objet JSON brut en CvData valide et rétrocompatible.
 */
export function parseCvData(raw: unknown): CvData {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_CV_DATA };
  }
  const result = CvDataSchema.safeParse(raw);
  if (result.success) {
    return result.data;
  }
  const rawObj = raw as Record<string, unknown>;
  return {
    ...DEFAULT_CV_DATA,
    ...(raw as Partial<CvData>),
    personalInfo: {
      ...DEFAULT_CV_DATA.personalInfo,
      ...((rawObj.personalInfo as Record<string, unknown>) ?? {}),
    },
    designSettings: {
      ...DEFAULT_CV_DATA.designSettings,
      ...((rawObj.designSettings as Record<string, unknown>) ?? {}),
    },
  };
}

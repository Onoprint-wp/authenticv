import { create } from "zustand";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  title: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g. "Natif", "B1", etc.
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export type SyncStatus = "idle" | "saving" | "saved" | "error";

export interface CvDataSnapshot {
  cvData: CvData;
  savedAt: string; // ISO 8601
}

export interface CvData {
  documentTitle: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
}

interface CvStore {
  cvData: CvData;
  isHydrated: boolean;
  syncStatus: SyncStatus;
  history: CvDataSnapshot[];

  // State setters
  setIsHydrated: (value: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setCvData: (data: CvData) => void;

  // Version history
  saveCheckpoint: () => void;
  restoreCheckpoint: (index: number) => void;
  clearHistory: () => void;

  // Granular updaters (called by AI tool calls)
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateDocumentTitle: (title: string) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: Omit<Experience, "id">) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  setSkills: (skills: string[]) => void;
  addEducation: (edu: Omit<Education, "id">) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  addLanguage: (lang: Omit<Language, "id">) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  addCertification: (cert: Omit<Certification, "id">) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  addProject: (proj: Omit<Project, "id">) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeExperience: (id: string) => void;
  removeEducation: (id: string) => void;
  removeLanguage: (id: string) => void;
  removeCertification: (id: string) => void;
  removeProject: (id: string) => void;
  clearCv: () => void;
}

// ─── Default empty CV ────────────────────────────────────────────────────────

const defaultCvData: CvData = {
  documentTitle: "Untitled CV",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    title: "",
  },
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useCvStore = create<CvStore>((set) => ({
  cvData: defaultCvData,
  isHydrated: false,
  syncStatus: "idle",
  history: [],

  setIsHydrated: (value) => set({ isHydrated: value }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setCvData: (data) => set({ cvData: data }),

  saveCheckpoint: () =>
    set((state) => {
      const MAX_HISTORY = 10;
      const snapshot: CvDataSnapshot = {
        cvData: JSON.parse(JSON.stringify(state.cvData)), // deep clone
        savedAt: new Date().toISOString(),
      };
      const newHistory = [snapshot, ...state.history].slice(0, MAX_HISTORY);
      return { history: newHistory };
    }),

  restoreCheckpoint: (index: number) =>
    set((state) => {
      const snapshot = state.history[index];
      if (!snapshot) return state;
      return { cvData: JSON.parse(JSON.stringify(snapshot.cvData)) };
    }),

  clearHistory: () => set({ history: [] }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        personalInfo: { ...state.cvData.personalInfo, ...info },
      },
    })),

  updateDocumentTitle: (title) =>
    set((state) => ({ cvData: { ...state.cvData, documentTitle: title } })),

  updateSummary: (summary) =>
    set((state) => ({ cvData: { ...state.cvData, summary } })),

  addExperience: (exp) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: [
          ...state.cvData.experiences,
          { ...exp, id: crypto.randomUUID() },
        ],
      },
    })),

  updateExperience: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: state.cvData.experiences.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
    })),

  setSkills: (skills) =>
    set((state) => ({ cvData: { ...state.cvData, skills } })),

  addEducation: (edu) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        education: [
          ...state.cvData.education,
          { ...edu, id: crypto.randomUUID() },
        ],
      },
    })),

  updateEducation: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        education: state.cvData.education.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
    })),

  addLanguage: (lang) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: [
          ...state.cvData.languages,
          { ...lang, id: crypto.randomUUID() },
        ],
      },
    })),

  updateLanguage: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.map((l) =>
          l.id === id ? { ...l, ...data } : l
        ),
      },
    })),

  addCertification: (cert) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: [
          ...state.cvData.certifications,
          { ...cert, id: crypto.randomUUID() },
        ],
      },
    })),

  updateCertification: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: state.cvData.certifications.map((c) =>
          c.id === id ? { ...c, ...data } : c
        ),
      },
    })),

  addProject: (proj) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        projects: [
          ...state.cvData.projects,
          { ...proj, id: crypto.randomUUID() },
        ],
      },
    })),

  updateProject: (id, data) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        projects: state.cvData.projects.map((p) =>
          p.id === id ? { ...p, ...data } : p
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: state.cvData.experiences.filter((e) => e.id !== id),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        education: state.cvData.education.filter((e) => e.id !== id),
      },
    })),

  removeLanguage: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.filter((l) => l.id !== id),
      },
    })),

  removeCertification: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: state.cvData.certifications.filter((c) => c.id !== id),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        projects: state.cvData.projects.filter((p) => p.id !== id),
      },
    })),

  clearCv: () => set({ cvData: defaultCvData }),
}));

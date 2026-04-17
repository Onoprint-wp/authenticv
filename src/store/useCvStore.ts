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

export type SyncStatus = "idle" | "saving" | "saved" | "error";

export interface CvData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

interface CvStore {
  cvData: CvData;
  isHydrated: boolean;
  syncStatus: SyncStatus;

  // State setters
  setIsHydrated: (value: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  setCvData: (data: CvData) => void;

  // Granular updaters (called by AI tool calls)
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (exp: Omit<Experience, "id">) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  setSkills: (skills: string[]) => void;
  addEducation: (edu: Omit<Education, "id">) => void;
}

// ─── Default empty CV ────────────────────────────────────────────────────────

const defaultCvData: CvData = {
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
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useCvStore = create<CvStore>((set) => ({
  cvData: defaultCvData,
  isHydrated: false,
  syncStatus: "idle",

  setIsHydrated: (value) => set({ isHydrated: value }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setCvData: (data) => set({ cvData: data }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        personalInfo: { ...state.cvData.personalInfo, ...info },
      },
    })),

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
}));

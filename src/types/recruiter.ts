export interface CandidateContact {
  name: string;
  phone: string;
  email: string;
  photoUrl?: string;
}

export interface CandidateProfile {
  id: string;
  jobTitle: string;
  location: string;
  summary: string;
  skills: string[];
  experienceYears: number;
  matchScore: number;
  isUnlocked: boolean;
  updatedAt?: string;
  freshnessBadge?: string;
  availability?: "immediate" | "1month" | "3months" | "passive";
  sector?: string;
  educationLevel?: string;
  contact?: CandidateContact;
}

export interface RecruiterFilterState {
  query: string;
  country: string; // 'all' | 'CM' | 'GA' | 'CG' | 'TD' | 'CF' | 'GQ' | 'int'
  city: string; // 'all' | specific city name
  experienceLevel: string; // 'all' | '0-2' | '3-5' | '6-10' | '10+'
  sector: string; // 'all' | 'tech' | 'finance' | 'commercial' | 'btp' | 'sante' | 'logistique' | 'rh'
  education: string; // 'all' | 'bac' | 'bac2' | 'licence' | 'master' | 'doctorat'
  availability: string; // 'all' | 'immediate' | '1month' | '3months' | 'passive'
}

export interface ShortlistCandidate {
  id: string;
  jobTitle: string;
  location: string;
  experienceYears: number;
  matchScore: number;
  skills: string[];
}

export interface BatchUnlockResult {
  unlockedProfiles: Record<string, CandidateContact>;
  creditsRemaining: number;
  unlockedCount: number;
  discountAppliedPercent: number;
}

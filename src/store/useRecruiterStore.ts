import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShortlistCandidate, RecruiterFilterState } from "@/types/recruiter";

export const DEFAULT_FILTERS: RecruiterFilterState = {
  query: "",
  country: "all",
  city: "all",
  experienceLevel: "all",
  sector: "all",
  education: "all",
  availability: "all",
};

interface RecruiterStore {
  shortlist: ShortlistCandidate[];
  addToShortlist: (candidate: ShortlistCandidate) => void;
  removeFromShortlist: (candidateId: string) => void;
  toggleShortlist: (candidate: ShortlistCandidate) => void;
  clearShortlist: () => void;
  isInShortlist: (candidateId: string) => boolean;

  filters: RecruiterFilterState;
  setFilter: <K extends keyof RecruiterFilterState>(key: K, value: RecruiterFilterState[K]) => void;
  resetFilters: () => void;
}

export const useRecruiterStore = create<RecruiterStore>()(
  persist(
    (set, get) => ({
      shortlist: [],
      addToShortlist: (candidate) => {
        const { shortlist } = get();
        if (!shortlist.some((c) => c.id === candidate.id)) {
          set({ shortlist: [...shortlist, candidate] });
        }
      },
      removeFromShortlist: (candidateId) => {
        set((state) => ({
          shortlist: state.shortlist.filter((c) => c.id !== candidateId),
        }));
      },
      toggleShortlist: (candidate) => {
        const { shortlist } = get();
        const exists = shortlist.some((c) => c.id === candidate.id);
        if (exists) {
          set({ shortlist: shortlist.filter((c) => c.id !== candidate.id) });
        } else {
          set({ shortlist: [...shortlist, candidate] });
        }
      },
      clearShortlist: () => set({ shortlist: [] }),
      isInShortlist: (candidateId) => get().shortlist.some((c) => c.id === candidateId),

      filters: DEFAULT_FILTERS,
      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },
      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },
    }),
    {
      name: "authenticv_recruiter_sourcing_v1",
      partialize: (state) => ({ shortlist: state.shortlist }),
    }
  )
);

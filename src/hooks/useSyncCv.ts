"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCvStore } from "@/store/useCvStore";
import { trackEvent } from "@/lib/analytics";
import { computeProfileCompleteness } from "@/lib/profile-qualification";
import type { CvData } from "@/lib/schemas/cv.schema";

const DEBOUNCE_MS = 2000;

interface TrackedMilestones {
  started: boolean;
  progress50: boolean;
  completed: boolean;
  qualified: boolean;
}

function getTrackedMilestones(resumeId: string): TrackedMilestones {
  if (typeof window === "undefined") {
    return { started: false, progress50: false, completed: false, qualified: false };
  }
  try {
    const raw = localStorage.getItem(`acv_milestones_${resumeId}`);
    if (raw) return JSON.parse(raw) as TrackedMilestones;
  } catch {
    // Non-blocking
  }
  return { started: false, progress50: false, completed: false, qualified: false };
}

function saveTrackedMilestones(resumeId: string, state: TrackedMilestones) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`acv_milestones_${resumeId}`, JSON.stringify(state));
  } catch {
    // Non-blocking
  }
}

function hasMeaningfulContent(cv: CvData): boolean {
  if (!cv) return false;
  const pi = cv.personalInfo;
  const hasPi = Boolean(
    pi?.firstName?.trim() ||
    pi?.lastName?.trim() ||
    pi?.title?.trim() ||
    pi?.email?.trim() ||
    pi?.phone?.trim() ||
    pi?.location?.trim()
  );
  const hasExp = Array.isArray(cv.experiences) && cv.experiences.length > 0;
  const hasEdu = Array.isArray(cv.education) && cv.education.length > 0;
  const hasSkills = Array.isArray(cv.skills) && cv.skills.length > 0;
  const hasProjects = Array.isArray(cv.projects) && cv.projects.length > 0;
  const hasSummary = Boolean(cv.summary && cv.summary.trim().length > 5);

  return hasPi || hasExp || hasEdu || hasSkills || hasProjects || hasSummary;
}

export function useSyncCv() {
  const {
    cvData,
    isHydrated,
    setIsHydrated,
    setSyncStatus,
    setCvData,
    clearCv,
    saveCheckpoint,
    setCurrentResumeId,
    setResumeList,
  } = useCvStore();

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeIdRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);
  const isSavingFromServer = useRef(false);

  // ── Hydration: load resume list + default CV ──────────────────────
  useEffect(() => {
    const hydrate = async () => {
      try {
        // Charger la liste des CVs
        const listRes = await fetch("/api/resumes/list");
        if (listRes.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (listRes.ok) {
          const list = await listRes.json();
          setResumeList(
            list.map(
              (r: {
                id: string;
                title: string;
                updated_at: string;
                is_default: boolean;
              }) => ({
                id: r.id,
                title: r.title,
                updatedAt: r.updated_at,
                isDefault: r.is_default,
              })
            )
          );
        }

        // Charger le contenu du CV le plus récent
        const response = await fetch("/api/resumes");
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!response.ok) throw new Error(`Failed to fetch resume: ${response.status}`);

        const data = await response.json();
        if (data) {
          resumeIdRef.current = data.id;
          setCurrentResumeId(data.id);
          if (data.content && Object.keys(data.content).length > 0) {
            isSavingFromServer.current = true;
            setCvData(data.content);
          }
        } else {
          const createResponse = await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: {} }),
          });
          if (createResponse.status === 401) {
            window.location.href = "/login";
            return;
          }
          if (createResponse.ok) {
            const newResume = await createResponse.json();
            resumeIdRef.current = newResume.id;
            setCurrentResumeId(newResume.id);
          }
        }
      } catch (err) {
        console.error("Hydration error:", err);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Switch: load a specific CV by ID ─────────────────────────────
  const switchResume = useCallback(
    async (id: string) => {
      try {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        isSavingFromServer.current = true;
        const res = await fetch(`/api/resumes/${id}`);
        if (!res.ok) {
          isSavingFromServer.current = false;
          return;
        }
        const data = await res.json();
        resumeIdRef.current = data.id;
        setCurrentResumeId(data.id);
        if (data.content && Object.keys(data.content).length > 0) {
          setCvData(data.content);
        } else {
          clearCv();
        }
      } catch (e) {
        console.error("[Sync] switchResume error:", e);
        isSavingFromServer.current = false;
      }
    },
    [setCvData, setCurrentResumeId, clearCv]
  );

  // ── Manual Refetch ────────────────────────────────────────────────
  const refetch = useCallback(async () => {
    try {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      const response = await fetch("/api/resumes");
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
        console.warn(`[Sync] Refetch failed: ${response.status}`);
        return;
      }
      const data = await response.json();
      if (data && data.content) {
        isSavingFromServer.current = true;
        setCvData(data.content);
      }
    } catch (e) {
      console.error("[Sync] Refetch error:", e);
    }
  }, [setCvData]);

  // ── Auto-save ─────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (!resumeIdRef.current) return;
    const currentId = resumeIdRef.current;

    setSyncStatus("saving");
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cvData, id: currentId }),
      });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error(`Failed to save resume: ${response.status}`);
      setSyncStatus("saved");
      setTimeout(() => setSyncStatus("idle"), 3000);

      // ── Idempotent Candidate Qualification Funnel Triggers ─────────
      const milestones = getTrackedMilestones(currentId);
      let milestoneChanged = false;

      // 1. profile_started (first meaningful non-empty save)
      if (!milestones.started && hasMeaningfulContent(cvData)) {
        milestones.started = true;
        milestoneChanged = true;
        trackEvent("profile_started", {
          resumeId: currentId,
          candidateId: currentId,
        });
      }

      const completeness = computeProfileCompleteness(cvData);

      // 2. profile_progress_50 (score >= 50%)
      if (!milestones.progress50 && completeness.score >= 50) {
        milestones.progress50 = true;
        milestoneChanged = true;
        trackEvent("profile_progress_50", {
          resumeId: currentId,
          candidateId: currentId,
          score: completeness.score,
        });
      }

      // 3. profile_completed (score >= 90%)
      if (!milestones.completed && completeness.score >= 90) {
        milestones.completed = true;
        milestoneChanged = true;
        trackEvent("profile_completed", {
          resumeId: currentId,
          candidateId: currentId,
          score: completeness.score,
        });
      }

      // 4. qualified_profile (meets recruiter value criteria)
      if (!milestones.qualified && completeness.isQualified) {
        milestones.qualified = true;
        milestoneChanged = true;
        trackEvent("qualified_profile", {
          resumeId: currentId,
          candidateId: currentId,
          score: completeness.score,
          userEmail: cvData.personalInfo?.email,
          userPhone: cvData.personalInfo?.phone,
        });
      }

      if (milestoneChanged) {
        saveTrackedMilestones(currentId, milestones);
      }
    } catch (err) {
      console.error("Save error:", err);
      setSyncStatus("error");
    }
  }, [cvData, setSyncStatus]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isSavingFromServer.current) {
      isSavingFromServer.current = false;
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSyncStatus("saving");
    debounceTimer.current = setTimeout(save, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [cvData, isHydrated, save, setSyncStatus]);

  return { refetch, saveCheckpoint, switchResume };
}

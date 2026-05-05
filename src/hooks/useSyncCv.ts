"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCvStore } from "@/store/useCvStore";

const DEBOUNCE_MS = 2000;

export function useSyncCv() {
  const { cvData, isHydrated, setIsHydrated, setSyncStatus, setCvData, clearCv, saveCheckpoint, setCurrentResumeId, setResumeList } =
    useCvStore();

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
        if (listRes.status === 401) { window.location.href = "/login"; return; }
        if (listRes.ok) {
          const list = await listRes.json();
          setResumeList(list.map((r: { id: string; title: string; updated_at: string; is_default: boolean }) => ({
            id: r.id,
            title: r.title,
            updatedAt: r.updated_at,
            isDefault: r.is_default,
          })));
        }

        // Charger le contenu du CV le plus récent (comportement existant)
        const response = await fetch("/api/resumes");
        if (response.status === 401) { window.location.href = "/login"; return; }
        if (!response.ok) throw new Error(`Failed to fetch resume: ${response.status}`);

        const data = await response.json();
        if (data) {
          resumeIdRef.current = data.id;
          setCurrentResumeId(data.id);
          if (data.content && Object.keys(data.content).length > 0) {
            isSavingFromServer.current = true;
            setCvData(data.content);
            setTimeout(() => { isSavingFromServer.current = false; }, 100);
          }
        } else {
          const createResponse = await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: {} }),
          });
          if (createResponse.status === 401) { window.location.href = "/login"; return; }
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
  const switchResume = useCallback(async (id: string) => {
    try {
      isSavingFromServer.current = true;
      const res = await fetch(`/api/resumes/${id}`);
      if (!res.ok) { isSavingFromServer.current = false; return; }
      const data = await res.json();
      resumeIdRef.current = data.id;
      setCurrentResumeId(data.id);
      if (data.content && Object.keys(data.content).length > 0) {
        setCvData(data.content);
      } else {
        clearCv();
      }
      setTimeout(() => { isSavingFromServer.current = false; }, 100);
    } catch (e) {
      console.error("[Sync] switchResume error:", e);
      isSavingFromServer.current = false;
    }
  }, [setCvData, setCurrentResumeId, clearCv]);

  // ── Manual Refetch ────────────────────────────────────────────────
  const refetch = useCallback(async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.status === 401) { window.location.href = "/login"; return; }
      if (!response.ok) { console.warn(`[Sync] Refetch failed: ${response.status}`); return; }
      const data = await response.json();
      if (data && data.content) {
        isSavingFromServer.current = true;
        setCvData(data.content);
        setTimeout(() => { isSavingFromServer.current = false; }, 100);
      }
    } catch (e) {
      console.error("[Sync] Refetch error:", e);
    }
  }, [setCvData]);

  // ── Auto-save ─────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (!resumeIdRef.current) return;

    setSyncStatus("saving");
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cvData }),
      });
      if (response.status === 401) { window.location.href = "/login"; return; }
      if (!response.ok) throw new Error(`Failed to save resume: ${response.status}`);
      setSyncStatus("saved");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSyncStatus("error");
    }
  }, [cvData, setSyncStatus]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (isSavingFromServer.current) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSyncStatus("saving");
    debounceTimer.current = setTimeout(save, DEBOUNCE_MS);

    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [cvData, isHydrated, save, setSyncStatus]);

  return { refetch, saveCheckpoint, switchResume };
}

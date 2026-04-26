"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCvStore } from "@/store/useCvStore";

const DEBOUNCE_MS = 2000;

export function useSyncCv() {
  const { cvData, isHydrated, setIsHydrated, setSyncStatus, setCvData, saveCheckpoint } =
    useCvStore();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeIdRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);
  const isSavingFromServer = useRef(false); // Flag to avoid save-loops

  // ── Hydration: load CV from API on mount ──────────────────────────
  useEffect(() => {
    const hydrate = async () => {
      try {
        const response = await fetch("/api/resumes");
        
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        if (data) {
          // Resume found — load it
          resumeIdRef.current = data.id;
          if (data.content && Object.keys(data.content).length > 0) {
            isSavingFromServer.current = true;
            setCvData(data.content);
            setTimeout(() => {
              isSavingFromServer.current = false;
            }, 100);
          }
        } else {
          // No resume yet — create an empty one via POST
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
          } else {
            throw new Error(`Failed to create resume: ${createResponse.status} ${createResponse.statusText}`);
          }
        }
      } catch (err) {
        console.error("Hydration error:", err);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, [setIsHydrated, setCvData]);

  // ── Manual Refetch: download latest CV from server ────────────────
  const refetch = useCallback(async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
         console.warn(`[Sync] Refetch failed: ${response.status} ${response.statusText}`);
         return;
      }
      const data = await response.json();
      if (data && data.content) {
        isSavingFromServer.current = true;
        setCvData(data.content);
        setTimeout(() => {
          isSavingFromServer.current = false;
        }, 100);
      }
    } catch (e) {
      console.error("[Sync] Refetch error:", e);
    }
  }, [setCvData]);

  // ── Auto-save: debounced write to API on cvData change ────────────
  const save = useCallback(async () => {
    if (!resumeIdRef.current) return;

    // Créer un checkpoint avant chaque sauvegarde (max 10 conservés)
    saveCheckpoint();

    setSyncStatus("saving");
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cvData }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to save resume: ${response.status} ${response.statusText}`);
      }
      
      setSyncStatus("saved");
      // Reset to idle after 3s
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSyncStatus("error");
    }
  }, [cvData, setSyncStatus, saveCheckpoint]);

  useEffect(() => {
    // Skip the very first render (hydration phase)
    if (!isHydrated) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Skip saves triggered by realtime updates from the server
    if (isSavingFromServer.current) return;

    // Debounce saves
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSyncStatus("saving");
    debounceTimer.current = setTimeout(save, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [cvData, isHydrated, save, setSyncStatus]);

  return { refetch };
}

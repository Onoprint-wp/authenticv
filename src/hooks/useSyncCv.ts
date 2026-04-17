"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCvStore } from "@/store/useCvStore";
import { createClient } from "@/utils/supabase/client";

const DEBOUNCE_MS = 2000;

export function useSyncCv() {
  const { cvData, isHydrated, setIsHydrated, setSyncStatus, setCvData } =
    useCvStore();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeIdRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);
  const isSavingFromServer = useRef(false); // Flag to avoid save-loops

  // ── Hydration: load CV from Supabase on mount ──────────────────────────
  useEffect(() => {
    const hydrate = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Try to find existing resume
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching resume:", error);
        setIsHydrated(true);
        return;
      }

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
        // No resume yet — create an empty one
        const { data: newResume, error: insertError } = await supabase
          .from("resumes")
          .insert({
            user_id: user.id,
            title: "Mon CV",
            content: {},
          })
          .select()
          .single();

        if (!insertError && newResume) {
          resumeIdRef.current = newResume.id;
        }
      }

      setIsHydrated(true);
    };

    hydrate();
  }, [setIsHydrated, setCvData]);

  // ── Supabase Realtime: receive updates from server-side tool calls ──────
  useEffect(() => {
    if (!isHydrated) return;

    const supabase = createClient();

    const setupRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !resumeIdRef.current) return;

      const channel = supabase
        .channel("resume-realtime")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "resumes",
            filter: `id=eq.${resumeIdRef.current}`,
          },
          (payload) => {
            // Received an update from the server (e.g., from AI tool execution)
            const newContent = payload.new?.content;
            if (newContent && typeof newContent === "object") {
              console.log("[Realtime] CV updated from server:", Object.keys(newContent));
              isSavingFromServer.current = true;
              setCvData(newContent as Record<string, unknown>);
              setTimeout(() => {
                isSavingFromServer.current = false;
              }, 100);
            }
          }
        )
        .subscribe((status) => {
          console.log("[Realtime] Subscription status:", status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    let cleanup: (() => void) | undefined;
    setupRealtime().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cleanup?.();
    };
  }, [isHydrated, setCvData]);

  // ── Auto-save: debounced write to Supabase on cvData change ────────────
  const save = useCallback(async () => {
    if (!resumeIdRef.current) return;

    setSyncStatus("saving");
    const supabase = createClient();

    const { error } = await supabase
      .from("resumes")
      .update({ content: cvData })
      .eq("id", resumeIdRef.current);

    if (error) {
      console.error("Save error:", error);
      setSyncStatus("error");
    } else {
      setSyncStatus("saved");
      // Reset to idle after 3s
      setTimeout(() => setSyncStatus("idle"), 3000);
    }
  }, [cvData, setSyncStatus]);

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
}

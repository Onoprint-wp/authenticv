"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim()) {
      const cleanRef = ref.trim();
      // Store in cookie for 30 days
      const maxAge = 30 * 24 * 60 * 60;
      document.cookie = `authenticv_ref_id=${encodeURIComponent(cleanRef)}; path=/; max-age=${maxAge}; SameSite=Lax`;
      
      // Also store in localStorage as backup
      try {
        localStorage.setItem("authenticv_ref_id", cleanRef);
      } catch {
        // Ignore localStorage restrictions if any
      }
    }
  }, [searchParams]);

  return null;
}

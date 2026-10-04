"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Abonnement réactif à une media query CSS.
 * Côté serveur (et pendant l'hydratation) renvoie `false`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

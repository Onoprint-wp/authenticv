"use client";

import { useCallback, useEffect, useState } from "react";

export interface PlanInfo {
  plan: "free" | "pro";
  singleCredits: number;
  messageCount: number;
  messageLimit: number;
  messagesRemaining: number | null;
  loading: boolean;
}

const DEFAULT: PlanInfo = {
  plan: "free",
  singleCredits: 0,
  messageCount: 0,
  messageLimit: 20,
  messagesRemaining: 20,
  loading: true,
};

export function usePlan(): PlanInfo & { refresh: () => void } {
  const [info, setInfo] = useState<PlanInfo>(DEFAULT);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    fetch("/api/campay/plan", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setInfo({ ...data, loading: false });
        else setInfo((p) => ({ ...p, loading: false }));
      })
      .catch(() => setInfo((p) => ({ ...p, loading: false })));
  }, [version]);

  /** Re-fetch plan/credits (e.g. once a payment has been confirmed by the webhook). */
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { ...info, refresh };
}

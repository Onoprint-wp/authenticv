"use client";

import { useEffect, useState } from "react";

export interface PlanInfo {
  plan: "free" | "pro";
  messageCount: number;
  messageLimit: number;
  messagesRemaining: number | null;
  loading: boolean;
}

const DEFAULT: PlanInfo = {
  plan: "free",
  messageCount: 0,
  messageLimit: 20,
  messagesRemaining: 20,
  loading: true,
};

export function usePlan(): PlanInfo {
  const [info, setInfo] = useState<PlanInfo>(DEFAULT);

  useEffect(() => {
    fetch("/api/campay/plan")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setInfo({ ...data, loading: false });
        else setInfo((p) => ({ ...p, loading: false }));
      })
      .catch(() => setInfo((p) => ({ ...p, loading: false })));
  }, []);

  return info;
}

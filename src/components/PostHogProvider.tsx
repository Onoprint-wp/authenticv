"use client";

import { useEffect } from "react";
import { initPostHog, posthog } from "@/lib/posthog";
import { createClient } from "@/utils/supabase/client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();

    const supabase = createClient();

    // Identify current session immediately on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        posthog.identify(user.id, { email: user.email });
      }
    });

    // Keep identity in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        posthog.identify(session.user.id, { email: session.user.email });
      } else {
        posthog.reset();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}

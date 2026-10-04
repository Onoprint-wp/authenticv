"use client";

import { useEffect } from "react";
import { initPostHog, posthog } from "@/lib/posthog";
import { createClient } from "@/utils/supabase/client";
import { useCookieConsent } from "@/lib/consent";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const consent = useCookieConsent();

  useEffect(() => {
    // Sans consentement explicite : aucun chargement PostHog (les posthog.capture() restent des no-op)
    if (consent !== "accepted") {
      if (consent === "refused" && posthog.__loaded) posthog.opt_out_capturing();
      return;
    }

    initPostHog();
    if (posthog.__loaded && posthog.has_opted_out_capturing()) posthog.opt_in_capturing();

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
  }, [consent]);

  return <>{children}</>;
}

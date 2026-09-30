"use client";

import { posthog } from "@/lib/posthog";
import { getStoredUtms, type UtmParams } from "@/lib/utm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

export type AnalyticsEvent =
  | "page_view"
  | "signup_started"
  | "signup_completed"
  | "profile_started"
  | "profile_progress_50"
  | "profile_completed"
  | "qualified_profile"
  | "login"
  | "first_message_sent"
  | "cv_section_added"
  | "cv_generated"
  | "pdf_exported"
  | "letter_generated"
  | "job_match_used"
  | "checkout_started"
  | "payment_momo_completed"
  | "subscribed_pro"
  | "single_credit_purchased"
  | "contact_unlocked";

export interface EventPayload {
  userId?: string;
  candidateId?: string;
  plan?: string;
  score?: number;
  value?: number;
  currency?: string;
  source?: string;
  category?: string;
  eventId?: string;
  userEmail?: string;
  userPhone?: string;
  [key: string]: unknown;
}

/**
 * Dispatches event to Meta Conversions API (CAPI) server endpoint
 */
async function sendServerCapiEvent(
  eventName: string,
  eventId: string,
  payload: EventPayload,
  utms: UtmParams
) {
  try {
    if (typeof window === "undefined") return;
    void fetch("/api/analytics/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        userEmail: payload.userEmail,
        userPhone: payload.userPhone,
        customData: {
          ...payload,
          ...utms,
        },
      }),
    }).catch(() => {
      // Non-blocking catch
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Universal tracking function sending events to PostHog, GTM / GA4 (dataLayer) and Meta Pixel + CAPI (fbq)
 */
export function trackEvent(eventName: AnalyticsEvent, payload: EventPayload = {}) {
  try {
    const utms = getStoredUtms();
    const eventId = payload.eventId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

    const enrichedPayload = {
      ...utms,
      ...payload,
      eventId,
    };

    // 1. PostHog Product Analytics
    if (typeof window !== "undefined" && posthog) {
      posthog.capture(eventName, enrichedPayload);
    }

    // 2. Google Tag Manager / Google Analytics dataLayer
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...enrichedPayload,
      });
    }

    // 3. Meta Pixel (Facebook Ads) + Meta Conversions API (CAPI)
    if (typeof window !== "undefined") {
      const hasFbq = typeof window.fbq === "function";

      switch (eventName) {
        case "page_view":
          if (hasFbq) window.fbq!("track", "PageView", {}, { eventID: eventId });
          break;

        case "signup_started":
          if (hasFbq) {
            window.fbq!("track", "Lead", {
              source: payload.source || "auth",
              ...utms,
            }, { eventID: eventId });
          }
          break;

        case "signup_completed":
          if (hasFbq) {
            window.fbq!("track", "CompleteRegistration", {
              plan: payload.plan || "free",
              ...utms,
            }, { eventID: eventId });
          }
          void sendServerCapiEvent("CompleteRegistration", eventId, payload, utms);
          break;

        case "profile_started":
          if (hasFbq) {
            window.fbq!("trackCustom", "ProfileStarted", {
              ...payload,
              ...utms,
            }, { eventID: eventId });
          }
          void sendServerCapiEvent("ProfileStarted", eventId, payload, utms);
          break;

        case "profile_progress_50":
          if (hasFbq) {
            window.fbq!("trackCustom", "ProfileProgress50", {
              score: payload.score || 50,
              ...utms,
            }, { eventID: eventId });
          }
          void sendServerCapiEvent("ProfileProgress50", eventId, payload, utms);
          break;

        case "profile_completed":
          if (hasFbq) {
            window.fbq!("trackCustom", "ProfileCompleted", {
              score: payload.score || 100,
              ...utms,
            }, { eventID: eventId });
          }
          void sendServerCapiEvent("ProfileCompleted", eventId, payload, utms);
          break;

        case "qualified_profile":
          if (hasFbq) {
            window.fbq!("trackCustom", "QualifiedProfile", {
              score: payload.score,
              ...utms,
            }, { eventID: eventId });
          }
          void sendServerCapiEvent("QualifiedProfile", eventId, payload, utms);
          break;

        case "cv_generated":
        case "pdf_exported":
          if (hasFbq) {
            window.fbq!("track", "ViewContent", {
              content_name: "CV_Etudiant",
              content_category: "Resume",
              ...utms,
            }, { eventID: eventId });
          }
          break;

        case "checkout_started":
          if (hasFbq) {
            window.fbq!("track", "InitiateCheckout", {
              value: payload.value || 1000,
              currency: payload.currency || "XAF",
              content_name: payload.plan || "single_cv",
              ...utms,
            }, { eventID: eventId });
          }
          break;

        case "single_credit_purchased":
        case "payment_momo_completed":
        case "subscribed_pro":
          if (hasFbq) {
            window.fbq!("track", "Purchase", {
              value: payload.value || 1000,
              currency: payload.currency || "XAF",
              content_name: payload.plan || "CV_Pro",
              ...utms,
            }, { eventID: eventId });
          }
          void sendServerCapiEvent("Purchase", eventId, payload, utms);
          break;

        default:
          if (hasFbq) {
            window.fbq!("trackCustom", eventName, enrichedPayload, { eventID: eventId });
          }
          break;
      }
    }
  } catch (err) {
    console.warn("[Analytics] Track error:", err);
  }
}

/**
 * Helper specifically for e-commerce / revenue conversion tracking
 */
export function trackConversion(params: {
  transactionId?: string;
  value: number;
  currency: "XAF" | "EUR" | "USD";
  tier: "single" | "monthly" | "annual" | "recruiter_unlock" | "recruiter_subscription";
  userEmail?: string;
  userPhone?: string;
}) {
  const eventName: AnalyticsEvent =
    params.tier === "single"
      ? "single_credit_purchased"
      : params.tier === "recruiter_unlock"
      ? "contact_unlocked"
      : "subscribed_pro";

  const eventId = params.transactionId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `tx_${Date.now()}`);

  trackEvent(eventName, {
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency,
    tier: params.tier,
    eventId,
    userEmail: params.userEmail,
    userPhone: params.userPhone,
  });
}

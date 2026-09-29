"use client";

import { posthog } from "@/lib/posthog";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

export type AnalyticsEvent =
  | "page_view"
  | "signup_started"
  | "signup_completed"
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

interface EventPayload {
  userId?: string;
  plan?: string;
  value?: number;
  currency?: string;
  source?: string;
  category?: string;
  [key: string]: unknown;
}

/**
 * Universal tracking function sending events to PostHog, GTM / GA4 (dataLayer) and Meta Pixel (fbq)
 */
export function trackEvent(eventName: AnalyticsEvent, payload: EventPayload = {}) {
  try {
    // 1. PostHog Product Analytics
    if (typeof window !== "undefined" && posthog) {
      posthog.capture(eventName, payload);
    }

    // 2. Google Tag Manager / Google Analytics dataLayer
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...payload,
      });
    }

    // 3. Meta Pixel (Facebook Ads)
    if (typeof window !== "undefined" && window.fbq) {
      switch (eventName) {
        case "page_view":
          window.fbq("track", "PageView");
          break;
        case "signup_started":
          window.fbq("track", "Lead", { source: payload.source || "auth" });
          break;
        case "signup_completed":
          window.fbq("track", "CompleteRegistration", { plan: payload.plan || "free" });
          break;
        case "cv_generated":
        case "pdf_exported":
          window.fbq("track", "ViewContent", {
            content_name: "CV_Etudiant",
            content_category: "Resume",
          });
          break;
        case "checkout_started":
          window.fbq("track", "InitiateCheckout", {
            value: payload.value || 1000,
            currency: payload.currency || "XAF",
            content_name: payload.plan || "single_cv",
          });
          break;
        case "single_credit_purchased":
        case "payment_momo_completed":
        case "subscribed_pro":
          window.fbq("track", "Purchase", {
            value: payload.value || 1000,
            currency: payload.currency || "XAF",
            content_name: payload.plan || "CV_Pro",
          });
          break;
        default:
          window.fbq("trackCustom", eventName, payload);
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
}) {
  const eventName: AnalyticsEvent =
    params.tier === "single"
      ? "single_credit_purchased"
      : params.tier === "recruiter_unlock"
      ? "contact_unlocked"
      : "subscribed_pro";

  trackEvent(eventName, {
    transaction_id: params.transactionId,
    value: params.value,
    currency: params.currency,
    tier: params.tier,
  });

  // 1. Meta Pixel Direct Purchase Event
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: params.value,
      currency: params.currency,
      content_name: `AuthentiCV_${params.tier}`,
      transaction_id: params.transactionId,
    });
  }

  // 2. Google Tag Manager / GA4 Enhanced Ecommerce Purchase Event
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: params.transactionId || `tx_${Date.now()}`,
        value: params.value,
        currency: params.currency,
        items: [
          {
            item_name: `AuthentiCV_${params.tier}`,
            price: params.value,
            quantity: 1,
          },
        ],
      },
    });
  }
}

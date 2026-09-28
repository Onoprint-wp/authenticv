"use client";

import { posthog } from "@/lib/posthog";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
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
 * Universal tracking function sending events to both PostHog and GTM / GA4 (dataLayer)
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

  // Also push standard GA4 purchase event for Google Ads / Enhanced conversions
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

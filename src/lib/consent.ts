"use client";

import { useSyncExternalStore } from "react";

/**
 * Consentement cookies (RGPD / loi camerounaise 2024-017 sur les données personnelles).
 * Les traceurs non essentiels (Meta Pixel, PostHog, Meta CAPI) ne sont chargés
 * qu'après un consentement explicite "accepted".
 */
export type ConsentState = "accepted" | "refused" | "none" | "pending";

const STORAGE_KEY = "cookie_consent";
const CHANGE_EVENT = "cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "refused" ? value : "none";
  } catch {
    return "none";
  }
}

function getServerConsent(): ConsentState {
  return "pending";
}

export function setConsent(value: "accepted" | "refused") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Stockage indisponible (navigation privée stricte) : on notifie quand même
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** true sauf si l'utilisateur a explicitement refusé les traceurs. */
export function hasAnalyticsConsent(): boolean {
  return getConsent() !== "refused";
}

export function useCookieConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getConsent, getServerConsent);
}

/**
 * UTM & Campaign Attribution Manager
 * Persists campaign parameters across visits, redirects and signup flows.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  captured_at?: string;
  [key: string]: string | undefined;
}

const STORAGE_KEY = "acv_utm_params";
const COOKIE_NAME = "acv_utm";
const COOKIE_MAX_AGE_DAYS = 30;

/**
 * Parses query params from URL search string or Window location
 */
export function extractUtmsFromSearch(search: string): UtmParams | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const utms: UtmParams = {};

  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");
  const fbclid = params.get("fbclid");
  const gclid = params.get("gclid");

  if (source) utms.utm_source = source;
  if (medium) utms.utm_medium = medium;
  if (campaign) utms.utm_campaign = campaign;
  if (content) utms.utm_content = content;
  if (term) utms.utm_term = term;
  if (fbclid) utms.fbclid = fbclid;
  if (gclid) utms.gclid = gclid;

  if (Object.keys(utms).length === 0) return null;

  utms.captured_at = new Date().toISOString();
  return utms;
}

/**
 * Saves UTM parameters in both localStorage and cookie (30 days persistence)
 */
export function saveUtmParams(utms: UtmParams) {
  if (typeof window === "undefined" || !utms) return;

  try {
    const serialized = JSON.stringify(utms);
    // 1. LocalStorage
    localStorage.setItem(STORAGE_KEY, serialized);

    // 2. Cookie (30 days, SameSite=Lax, Secure if HTTPS)
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    const isHttps = window.location.protocol === "https:";
    const secureFlag = isHttps ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  } catch (e) {
    console.warn("[UTM] Error saving parameters:", e);
  }
}

/**
 * Reads stored UTM parameters from localStorage or Cookie
 */
export function getStoredUtms(): UtmParams {
  if (typeof window === "undefined") return {};

  try {
    // 1. Try localStorage
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local) as UtmParams;
      if (parsed && typeof parsed === "object") return parsed;
    }

    // 2. Fallback to Cookie
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (match && match[1]) {
      const decoded = decodeURIComponent(match[1]);
      const parsed = JSON.parse(decoded) as UtmParams;
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (e) {
    console.warn("[UTM] Error reading stored parameters:", e);
  }

  return {};
}

/**
 * Captures UTMs from current window.location.search if present and stores them
 */
export function captureAndStoreUtms(): UtmParams {
  if (typeof window === "undefined") return {};

  const current = extractUtmsFromSearch(window.location.search);
  if (current) {
    saveUtmParams(current);
    return current;
  }

  return getStoredUtms();
}

/**
 * Safe redirect URL sanitizer to prevent open redirect vulnerabilities.
 * 
 * Rules:
 * - Must be a relative path starting with a single "/"
 * - Must NOT start with "//" (protocol-relative URL)
 * - Must NOT start with "/\\" or contain backslashes
 * - Must NOT contain CRLF control characters (\r, \n)
 */
export function sanitizeRedirectPath(raw: string | null | undefined, fallback = "/builder"): string {
  if (!raw || typeof raw !== "string") {
    return fallback;
  }

  const trimmed = raw.trim().replace(/[\r\n\t]/g, "");

  // Must start with single slash
  if (!trimmed.startsWith("/")) {
    return fallback;
  }

  // Reject protocol-relative URLs (//example.com)
  if (trimmed.startsWith("//")) {
    return fallback;
  }

  // Reject Windows-style path separators (/\ or contains \)
  if (trimmed.startsWith("/\\") || trimmed.includes("\\")) {
    return fallback;
  }

  // Reject Javascript pseudo-protocol or data URIs disguised as paths
  if (/^\/[a-zA-Z]+:/i.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

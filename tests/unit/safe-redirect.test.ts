import { describe, it, expect } from "vitest";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";

describe("sanitizeRedirectPath", () => {
  it("allows safe relative paths", () => {
    expect(sanitizeRedirectPath("/builder")).toBe("/builder");
    expect(sanitizeRedirectPath("/admin")).toBe("/admin");
    expect(sanitizeRedirectPath("/recruiter/search?q=developer")).toBe("/recruiter/search?q=developer");
    expect(sanitizeRedirectPath("/account/profile#security")).toBe("/account/profile#security");
  });

  it("blocks protocol-relative open redirect attacks (//evil.com)", () => {
    expect(sanitizeRedirectPath("//evil.com")).toBe("/builder");
    expect(sanitizeRedirectPath("//attacker.com/steal")).toBe("/builder");
  });

  it("blocks Windows-style path separators (/\\evil.com)", () => {
    expect(sanitizeRedirectPath("/\\evil.com")).toBe("/builder");
    expect(sanitizeRedirectPath("/path\\to\\somewhere")).toBe("/builder");
  });

  it("blocks absolute URLs and malicious pseudo-protocols", () => {
    expect(sanitizeRedirectPath("https://evil.com")).toBe("/builder");
    expect(sanitizeRedirectPath("http://evil.com/login")).toBe("/builder");
    expect(sanitizeRedirectPath("javascript:alert(1)")).toBe("/builder");
    expect(sanitizeRedirectPath("/javascript:alert(1)")).toBe("/builder");
    expect(sanitizeRedirectPath("/data:text/html,evil")).toBe("/builder");
  });

  it("handles null, undefined, empty, or whitespace values gracefully", () => {
    expect(sanitizeRedirectPath(null)).toBe("/builder");
    expect(sanitizeRedirectPath(undefined)).toBe("/builder");
    expect(sanitizeRedirectPath("")).toBe("/builder");
    expect(sanitizeRedirectPath("   ")).toBe("/builder");
    expect(sanitizeRedirectPath(null, "/custom-fallback")).toBe("/custom-fallback");
  });

  it("strips CRLF control characters that could cause HTTP header injection", () => {
    expect(sanitizeRedirectPath("/builder\r\nSet-Cookie: admin=true")).toBe("/builderSet-Cookie: admin=true");
  });
});

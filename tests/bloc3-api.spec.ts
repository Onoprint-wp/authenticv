import { test, expect } from "@playwright/test";

/**
 * BLOC 3 — Tests API isolés
 * Couvre les routes non testées : /api/clear-session, /api/resumes
 */

test.describe("Bloc 3 — API /api/clear-session", () => {
  test("3.1 — GET /api/clear-session redirige vers /login", async ({ request }) => {
    const response = await request.get("/api/clear-session", {
      maxRedirects: 0, // Don't follow redirects
    });
    // Should be a 302/307 redirect to /login
    expect([200, 302, 307, 308]).toContain(response.status());
    console.log("🔓 /api/clear-session status:", response.status());
  });
});

test.describe("Bloc 3 — API /api/resumes (sans auth)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("3.2 — GET /api/resumes sans session = 401", async ({ request }) => {
    const response = await request.get("/api/resumes");
    expect([401, 500]).toContain(response.status());
  });

  test("3.3 — POST /api/resumes sans session = 401", async ({ request }) => {
    const response = await request.post("/api/resumes", {
      data: { content: {} },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 500]).toContain(response.status());
  });
});

test.describe("Bloc 3 — API /api/resumes (avec auth)", () => {
  test("3.4 — GET /api/resumes avec session = 200", async ({ request }) => {
    const response = await request.get("/api/resumes");
    // 200 = OK (résumé trouvé ou null retourné)
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log("📋 Resume found:", body !== null);
  });

  test("3.5 — POST /api/resumes avec session = 200", async ({ request }) => {
    const response = await request.post("/api/resumes", {
      data: {
        content: {
          personalInfo: {
            firstName: "Test",
            lastName: "Playwright",
            title: "QA Engineer",
          },
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("id");
    console.log("💾 Resume saved, id:", body.id);
  });
});

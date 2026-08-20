import { test, expect } from "@playwright/test";

/**
 * BLOC 0 — Landing Page (/)
 * Tests de rendu, contenu, et navigation CTA
 * Pas besoin d'authentification
 */

test.describe("Bloc 0 — Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("0.1 — La page charge sans erreur JS", async ({ page }) => {
    // Listen for JS errors
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.waitForTimeout(2000);
    expect(errors).toHaveLength(0);
  });

  test("0.2 — Le titre principal est visible", async ({ page }) => {
    const title = page.locator("h1");
    await expect(title).toBeVisible();
    await expect(title).toContainText("Créez votre CV avec l'IA");
  });

  test("0.3 — Le CTA 'Créer mon CV gratuitement' est visible", async ({ page }) => {
    const cta = page.locator("a", { hasText: "Créer mon CV gratuitement" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/builder");
  });

  test("0.4 — Les 3 arguments de vente sont affichés", async ({ page }) => {
    await expect(page.locator("text=CV optimisé ATS").first()).toBeVisible();
    await expect(page.locator("text=20 messages offerts").first()).toBeVisible();
    await expect(page.locator("text=Sans carte bancaire").first()).toBeVisible();
  });

  test("0.5 — Clic CTA redirige vers /builder ou /login", async ({ page }) => {
    const cta = page.locator("a", { hasText: "Créer mon CV gratuitement" });
    await cta.click();
    await page.waitForURL(url => url.pathname.includes("/builder") || url.pathname.includes("/login"), { timeout: 10_000 });
    expect(["/builder", "/login"]).toContain(new URL(page.url()).pathname);
  });

  test("0.6 — Badge d'en-tête est visible", async ({ page }) => {
    const badge = page.locator("text=Générateur de CV par IA conversationnelle");
    await expect(badge).toBeVisible();
  });

  test("0.7 — Meta title correct", async ({ page }) => {
    const pageTitle = await page.title();
    expect(pageTitle.length).toBeGreaterThan(0);
    console.log("📄 Page title:", pageTitle);
  });
});

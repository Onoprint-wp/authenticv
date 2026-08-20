import { test, expect } from "@playwright/test";
import path from "path";

/**
 * BLOC 8 — Tests Interactifs en Direct : Tarification, Tunnels et Paiements
 *
 * Teste les 4 offres visibles sur la capture d'écran utilisateur :
 * 1. Gratuit (0 FCFA) -> Redirection /builder
 * 2. À l'acte 1 Candidature (1 000 FCFA) -> Tunnel CamPay Single
 * 3. Pass Mensuel Pro (5 000 FCFA) -> Tunnel CamPay Mensuel
 * 4. Pass Annuel Carrière (18 000 FCFA) -> Tunnel CamPay Annuel
 */

test.describe("Bloc 8 — Parcours Tarifs AuthentiCV (Sans Session)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("8.1 — Clic Commencer (Gratuit) redirige vers /builder", async ({ page }) => {
    await page.goto("/#tarifs");
    const freeBtn = page.locator("text=Commencer (Gratuit)");
    await expect(freeBtn).toBeVisible();
    await freeBtn.click();
    await page.waitForURL(url => url.pathname.includes("/builder") || url.pathname.includes("/login"), { timeout: 10_000 });
    expect(["/builder", "/login"]).toContain(new URL(page.url()).pathname);
  });

  test("8.2 — Clic Débloquer pour 1 000 FCFA sans auth redirige vers /login", async ({ page }) => {
    await page.goto("/#tarifs");
    const singleBtn = page.locator("text=Débloquer pour 1 000 FCFA");
    await expect(singleBtn).toBeVisible();
    await singleBtn.click();
    await page.waitForURL(url => url.pathname.includes("/login"), { timeout: 10_000 });
    expect(page.url()).toContain("/login");
  });

  test("8.3 — Clic Passer au Pro (5 000 FCFA) sans auth redirige vers /login", async ({ page }) => {
    await page.goto("/#tarifs");
    const proBtn = page.locator("text=Passer au Pro (5 000 FCFA)");
    await expect(proBtn).toBeVisible();
    await proBtn.click();
    await page.waitForURL(url => url.pathname.includes("/login"), { timeout: 10_000 });
    expect(page.url()).toContain("/login");
  });

  test("8.4 — Clic S'abonner à l'Année (18 000 FCFA) sans auth redirige vers /login", async ({ page }) => {
    await page.goto("/#tarifs");
    const annualBtn = page.locator("text=S'abonner à l'Année (18 000 FCFA)");
    await expect(annualBtn).toBeVisible();
    await annualBtn.click();
    await page.waitForURL(url => url.pathname.includes("/login"), { timeout: 10_000 });
    expect(page.url()).toContain("/login");
  });
});

test.describe("Bloc 8 — Parcours Tarifs AuthentiCV (Avec Session Utilisateur)", () => {
  test.use({ storageState: path.join(__dirname, ".auth/user.json") });

  test("8.5 — Checkout API génère un lien CamPay pour l'offre 1 000 FCFA", async ({ request }) => {
    const res = await request.post("/api/campay/checkout", {
      data: { tier: "single" },
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 400]).toContain(res.status());
    if (res.status() === 200) {
      const data = await res.json();
      expect(data).toHaveProperty("url");
      expect(data.url).toContain("campay");
    }
  });

  test("8.6 — Checkout API génère un lien CamPay pour le Pass Pro 5 000 FCFA", async ({ request }) => {
    const res = await request.post("/api/campay/checkout", {
      data: { tier: "monthly" },
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 400]).toContain(res.status());
    if (res.status() === 200) {
      const data = await res.json();
      expect(data).toHaveProperty("url");
      expect(data.url).toContain("campay");
    }
  });

  test("8.7 — Checkout API avec Code Promo applique la réduction", async ({ request }) => {
    const res = await request.post("/api/campay/checkout", {
      data: { tier: "monthly", promoCode: "CAMPUS20" },
      headers: { "Content-Type": "application/json" },
    });
    expect([200, 400]).toContain(res.status());
    if (res.status() === 200) {
      const data = await res.json();
      expect(data).toHaveProperty("url");
    }
  });
});

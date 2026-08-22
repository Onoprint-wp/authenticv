import { test, expect } from "@playwright/test";

/**
 * BLOC 10 — Test Navigateur en Direct : Compte Utilisateur Commercial & Commissions
 */

test.describe("AuthentiCV — Compte Commercial & Pilotage des Commissions CEMAC", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test("10.1 — Super-Admin : Gestion de l'Équipe Commerciale & Commissions dans /admin", async ({ page, request }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // 1. Basculer sur l'Onglet 6 : Équipe Commerciale & Commissions
    const tabCommercials = page.locator("button:has-text('6. Équipe Commerciale')");
    await expect(tabCommercials).toBeVisible();
    await tabCommercials.click();
    await page.waitForTimeout(500);

    // Vérifier les compteurs de commissions et la table des agents
    await expect(page.locator("text=Gestion de l'Équipe Commerciale & Attribution des Secteurs")).toBeVisible();
    await expect(page.locator("text=Équipe Commerciale CEMAC")).toBeVisible();
    await expect(page.locator("text=Commissions en Attente")).toBeVisible();
    await expect(page.locator("text=Christian Bekono")).toBeVisible();

    // Capture d'écran Super-Admin Gestion Commerciaux
    await page.screenshot({ path: "tests/screenshots/vague4-admin-commercials.png", fullPage: true });

    // 2. Tester l'API Super-Admin
    const res = await request.get("/api/admin/commercials");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.agents.length).toBeGreaterThan(0);
  });

  test("10.2 — Portail Commercial : Cockpit Personnel, Quotas, Pipeline & Boîte à Outils (/commercial)", async ({ page, request }) => {
    // 1. Visiter la page /commercial
    await page.goto("/commercial");
    await page.waitForLoadState("networkidle");

    // Vérifier les KPIs du délégué commercial
    await expect(page.locator("text=Espace Commercial")).toBeVisible();
    await expect(page.locator("text=Objectif Mensuel")).toBeVisible();
    await expect(page.locator("text=Commissions Dues (10%)")).toBeVisible();
    await expect(page.locator("text=Mon Code Partenaire")).toBeVisible();

    // 2. Vérifier le Kanban de prospection B2B
    await expect(page.locator("text=Mon Pipeline B2B & Prospects RH")).toBeVisible();
    await expect(page.locator("text=Pipeline de Prospection B2B & Ventes Entreprises CEMAC")).toBeVisible();

    // 3. Basculer sur la boîte à outils et le pitch DRH
    const pitchTab = page.locator("button:has-text('Boîte à Outils & Pitchs Vente')");
    await expect(pitchTab).toBeVisible();
    await pitchTab.click();
    await page.waitForTimeout(500);

    await expect(page.locator("text=Script d'Accroche Téléphonique / WhatsApp (DRH)")).toBeVisible();
    await expect(page.locator("text=Grille Tarifaire Officielle CEMAC (2026)")).toBeVisible();

    // Capture d'écran Espace Commercial
    await page.screenshot({ path: "tests/screenshots/vague4-commercial-portal.png", fullPage: true });

    // 4. Tester l'API du dashboard commercial
    const dashRes = await request.get("/api/commercial/dashboard");
    expect(dashRes.status()).toBe(200);
    const dashData = await dashRes.json();
    expect(dashData.success).toBe(true);
    expect(dashData.agent).toHaveProperty("full_name");
    expect(dashData.metrics).toHaveProperty("pendingCommissionXaf");
  });

  test("10.3 — Connexion Dédiée : Badge Contextuel /login?next=/commercial", async ({ browser, baseURL }) => {
    // 1. Ouvrir une session anonyme (sans cookies de session)
    const context = await browser.newContext({
      baseURL,
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto("/login?next=/commercial");
    await page.waitForLoadState("networkidle");

    // Vérifier le badge contextuel
    const commercialBadge = page.locator("text=Espace Délégué Commercial — Connexion & Cockpit Ventes CEMAC");
    await expect(commercialBadge).toBeVisible();

    // Capture d'écran Page de Connexion Commercial
    await page.screenshot({ path: "tests/screenshots/step0-commercial-login-badge.png" });

    await context.close();
  });
});

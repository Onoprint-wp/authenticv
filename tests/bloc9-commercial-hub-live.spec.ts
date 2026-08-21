import { test, expect } from "@playwright/test";

/**
 * BLOC 9 — Test en Direct du Hub Commercial & CRM CEMAC (Vagues 1, 2, 3)
 */

test.describe("Hub Commercial AuthentiCV — Tests Navigateur en Direct", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test("Vague 1 — Navigation dans le Hub Admin, Journal des Ventes MoMo & Anti-Abandon", async ({ page }) => {
    // 1. Visiter /admin
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Vérifier les 4 cartes KPIs
    await expect(page.locator("text=Chiffre d'Affaires Brut")).toBeVisible();
    await expect(page.locator("text=Marge Nette Réelle")).toBeVisible();
    await expect(page.locator("text=Zone CEMAC (XAF)")).toBeVisible();

    // Capture d'écran Cockpit
    await page.screenshot({ path: "tests/screenshots/vague1-cockpit.png", fullPage: true });

    // 2. Basculer sur l'Onglet 2 : Journal Ventes MoMo
    const tabTransactions = page.locator("button:has-text('2. Journal Ventes MoMo')");
    await expect(tabTransactions).toBeVisible();
    await tabTransactions.click();
    await page.waitForTimeout(500);

    // Vérifier la présence des filtres et du tableau
    await expect(page.locator("text=Journal des Ventes & Flux Mobile Money CEMAC")).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();

    // Capture d'écran Journal Ventes
    await page.screenshot({ path: "tests/screenshots/vague1-transactions.png", fullPage: true });

    // 3. Basculer sur l'Onglet 5 : Anti-Abandon & Relances
    const tabAbandoned = page.locator("button:has-text('5. Anti-Abandon')");
    await expect(tabAbandoned).toBeVisible();
    await tabAbandoned.click();
    await page.waitForTimeout(500);

    await expect(page.locator("text=Sauvetage de Ventes & Paniers de CV Abandonnés")).toBeVisible();

    // Cliquer sur le premier bouton de relance si disponible
    const relanceBtn = page.locator("button:has-text('Relance -20%')").first();
    if (await relanceBtn.isVisible()) {
      await relanceBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator("text=Message de Relance Personnalisé Généré")).toBeVisible();
    }

    // Capture d'écran Anti-Abandon
    await page.screenshot({ path: "tests/screenshots/vague1-abandoned.png", fullPage: true });
  });

  test("Vague 2 — Pipeline B2B Recruteurs (Kanban) & Codes Promo Dynamiques", async ({ page, request }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // 1. Basculer sur l'Onglet 3 : Pipeline B2B & Contrats
    const tabB2B = page.locator("button:has-text('3. Pipeline B2B')");
    await expect(tabB2B).toBeVisible();
    await tabB2B.click();
    await page.waitForTimeout(500);

    // Vérifier le tableau Kanban
    await expect(page.locator("text=Pipeline de Prospection B2B & Ventes Entreprises CEMAC")).toBeVisible();
    await expect(page.locator("text=1. Prospection")).toBeVisible();
    await expect(page.locator("text=2. Démo Réalisée")).toBeVisible();
    await expect(page.locator("text=3. Devis / Négociation")).toBeVisible();
    await expect(page.locator("text=4. Signé & Actif")).toBeVisible();

    // Tester l'avancement d'un prospect
    const avancerBtn = page.locator("button:has-text('Avancer')").first();
    if (await avancerBtn.isVisible()) {
      await avancerBtn.click();
      await page.waitForTimeout(300);
    }

    // Capture d'écran Pipeline B2B
    await page.screenshot({ path: "tests/screenshots/vague2-pipeline-b2b.png", fullPage: true });

    // 2. Basculer sur l'Onglet 4 : Campus & Codes Promo
    const tabCampus = page.locator("button:has-text('4. Campus & Codes Promo')");
    await expect(tabCampus).toBeVisible();
    await tabCampus.click();
    await page.waitForTimeout(500);

    await expect(page.locator("text=Gestionnaire des Codes Promotionnels & Partenaires")).toBeVisible();
    await expect(page.locator("text=Partenariats Universitaires & Écoles Partenaires")).toBeVisible();

    // Capture d'écran Codes Promo & Campus
    await page.screenshot({ path: "tests/screenshots/vague2-promos-campus.png", fullPage: true });

    // 3. Tester l'API de validation de code promo en direct
    const promoRes = await request.post("/api/promo/validate", {
      data: { promoCode: "CAMPUS20", tier: "monthly" },
      headers: { "Content-Type": "application/json" },
    });
    expect(promoRes.status()).toBe(200);
    const promoData = await promoRes.json();
    expect(promoData.valid).toBe(true);
    expect(promoData.discountPercent).toBe(20);
    expect(promoData.discountedPrice).toBe(4000); // 5 000 - 20% = 4 000 FCFA
  });

  test("Vague 3 — Espace Facturation Recruteur Self-Service & Cron Anti-Churn MoMo", async ({ page, request }) => {
    // 1. Visiter la CVthèque Recruteur
    await page.goto("/recruiter/search");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=Moteur de Recherche Talents CEMAC")).toBeVisible();

    // 2. Basculer sur l'onglet Facturation & Justificatifs Fiscaux
    const tabInvoices = page.locator("button:has-text('Facturation & Justificatifs Fiscaux')");
    await expect(tabInvoices).toBeVisible();
    await tabInvoices.click();
    await page.waitForTimeout(500);

    await expect(page.locator("text=Espace Facturation & Justificatifs Fiscaux Entreprise")).toBeVisible();
    await expect(page.locator("text=N° RCCM (Registre de Commerce)")).toBeVisible();
    await expect(page.locator("text=NIU / NIF (Identifiant Fiscal)")).toBeVisible();

    // Remplir et sauvegarder le profil fiscal
    await page.fill("input[placeholder*='Orange Cameroun']", "TotalEnergies CEMAC");
    await page.fill("input[placeholder*='RC/DLA']", "RC/DLA/2026/B/9999");
    await page.fill("input[placeholder*='M0']", "M012698765432A");

    const saveBtn = page.locator("button:has-text('Enregistrer le Profil Fiscal')");
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    await page.waitForTimeout(500);

    // Capture d'écran Facturation Self-Service
    await page.screenshot({ path: "tests/screenshots/vague3-recruiter-invoices.png", fullPage: true });

    // 3. Tester l'API du Cron de Renouvellement Mobile Money
    const cronRes = await request.get("/api/cron/momo-renewal");
    expect(cronRes.status()).toBe(200);
    const cronData = await cronRes.json();
    expect(cronData.success).toBe(true);
    expect(cronData).toHaveProperty("executedAt");
    expect(cronData).toHaveProperty("alertsCount");
  });
});

import { test, expect } from "@playwright/test";

test.describe("Bloc 12 : Hiérarchie Commerciale Nationale, Directeurs Pays & Parrainage CEMAC", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test("12.1 — Cockpit du Directeur Commercial National & Double Compteur Financier", async ({ page }) => {
    await page.goto("http://localhost:3000/commercial");
    await page.waitForLoadState("networkidle");

    // 1. Vérifier le badge et le titre de Directeur National
    await expect(page.locator("h1")).toContainText("Direction Commerciale Nationale");
    await expect(page.getByText("Country Sales Director")).toBeVisible();

    // 2. Vérifier les cartes KPI
    await expect(page.getByText("Quota National Pays")).toBeVisible();
    await expect(page.getByText("Commissions Dues (MoMo)")).toBeVisible();
    await expect(page.getByText("Ventes Directes (10%) :")).toBeVisible();
    await expect(page.getByText("Over-riding Équipe (2.5%) :")).toBeVisible();

    // 3. Vérifier la Gamification & le Code Promo
    await expect(page.getByText("Code & Liens Parrainage")).toBeVisible();

    // Capture d'écran du cockpit Directeur Pays
    await page.screenshot({ path: "tests/screenshots/step1-country-director-cockpit.png", fullPage: true });
  });

  test("12.2 — Onglet Mon Équipe Commerciale & Performance des Délégués Locaux", async ({ page }) => {
    await page.goto("http://localhost:3000/commercial");
    await page.waitForLoadState("networkidle");

    // 1. Cliquer sur l'onglet Mon Équipe Commerciale
    const teamTabButton = page.locator("button:has-text('Mon Équipe Commerciale')");
    await expect(teamTabButton).toBeVisible();
    await teamTabButton.click();
    await page.waitForTimeout(500);

    // 2. Vérifier l'affichage des délégués rattachés
    await expect(page.getByText("Équipe Commerciale Nationale")).toBeVisible();
    await expect(page.getByText("Arnaud Bopda")).toBeVisible();
    await expect(page.getByText("Marcelle Tchuente")).toBeVisible();

    // Capture d'écran de l'onglet équipe
    await page.screenshot({ path: "tests/screenshots/step2-country-director-team.png", fullPage: true });
  });

  test("12.3 — Dispatching / Réassignation d'un Prospect B2B Entrant", async ({ page }) => {
    await page.goto("http://localhost:3000/commercial");
    await page.waitForLoadState("networkidle");

    // 1. Ouvrir l'onglet équipe et cliquer sur Réassigner
    await page.locator("button:has-text('Mon Équipe Commerciale')").click();
    await page.waitForTimeout(500);

    const reassignButton = page.locator("button:has-text('Réassigner un Prospect Entrant')");
    await expect(reassignButton).toBeVisible();
    await reassignButton.click();

    // 2. Vérifier la modale de réassignation
    await expect(page.getByText("Réassigner l'Opportunité B2B")).toBeVisible();

    // 3. Sélectionner un délégué et confirmer
    await page.locator("select").selectOption({ index: 1 });
    await page.getByRole("button", { name: /Confirmer la Réassignation/i }).click();

    // 4. Vérifier le message de confirmation
    await expect(page.getByText(/Lead réassigné avec succès/i)).toBeVisible();

    // Capture d'écran de la confirmation de réassignation
    await page.screenshot({ path: "tests/screenshots/step3-country-director-lead-reassign.png" });
  });

  test("12.4 — Liens de Parrainage & Détection Promo Automatique au Checkout B2B", async ({ page }) => {
    // 1. Naviguer vers la recherche recruteur avec le lien de parrainage du Directeur (?ref=DIRCM10)
    await page.goto("http://localhost:3000/recruiter/search?ref=DIRCM10");
    await page.waitForLoadState("networkidle");

    // 2. Ouvrir le modal d'achat de crédits via le bouton d'en-tête
    const buyCreditsBtn = page.locator("button:has-text('Acheter des Crédits')");
    await expect(buyCreditsBtn).toBeVisible();
    await buyCreditsBtn.click();
    await page.waitForTimeout(500);

    // 3. Vérifier que le code DIRCM10 est pré-rempli et la réduction de -10% affichée
    await expect(page.getByText("-10% appliqué")).toBeVisible();
    await expect(page.locator("input[value='DIRCM10']")).toBeVisible();

    // Capture d'écran du parrainage B2B
    await page.screenshot({ path: "tests/screenshots/step4-recruiter-referral-discount.png" });
  });

  test("12.5 — Génération Automatique du Contrat de Mandat Directeur Pays OHADA (PDF)", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    await page.waitForLoadState("networkidle");

    // 1. Aller sur l'onglet 3. Pipeline B2B & Contrats
    const b2bTab = page.locator("button:has-text('3. Pipeline B2B')");
    await expect(b2bTab).toBeVisible();
    await b2bTab.click();
    await page.waitForTimeout(500);

    // 2. Vérifier la présence du générateur et des champs Mandat Directeur Pays
    await expect(page.getByText("Générateur Automatique de Contrats Juridiques")).toBeVisible();
    // 3. Vérifier les champs pré-remplis
    await expect(page.getByText("Nom du Directeur Commercial")).toBeVisible();
    await expect(page.getByText("Over-Riding Équipe % (Défaut : 2.5%)")).toBeVisible();
    await expect(page.getByText("Droit OHADA & Réglementations BEAC / MINESUP")).toBeVisible();

    // Capture d'écran du générateur de mandat OHADA
    await page.screenshot({ path: "tests/screenshots/step5-contract-director-mandate-ohada.png" });
  });

  test("12.6 — Supervision Hiérarchique des 6 Pôles Nationaux CEMAC dans Admin", async ({ page }) => {
    await page.goto("http://localhost:3000/admin");
    await page.waitForLoadState("networkidle");

    // 1. Aller sur l'onglet 6. Équipe Commerciale & Commissions
    const teamTab = page.locator("button:has-text('6. Équipe Commerciale')");
    await expect(teamTab).toBeVisible();
    await teamTab.click();
    await page.waitForTimeout(500);

    // 2. Vérifier les accordéons des pôles nationaux
    await expect(page.getByText("Pôle National — Cameroun")).toBeVisible();
    await expect(page.getByText("Pôle National — Gabon")).toBeVisible();
    await expect(page.getByText("Pôle National — Congo")).toBeVisible();
    await expect(page.getByText("👑 Directeur Commercial National").first()).toBeVisible();

    // Capture d'écran de l'arborescence hiérarchique admin
    await page.screenshot({ path: "tests/screenshots/step6-admin-hierarchical-country-hubs.png", fullPage: true });
  });

});

import { test, expect } from "@playwright/test";

/**
 * BLOC 11 — Test en Direct du Workflow Journalier Complet de l'Agent Commercial
 */

test.describe("Workflow Journalier en Direct de l'Agent Commercial (SOP CEMAC)", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
  });

  test("11.1 — Matin (8h30) : Prise de poste sur /commercial, vérification du Quota & Outils de pitch", async ({ page }) => {
    await page.goto("/commercial");
    await page.waitForLoadState("networkidle");

    // 1. Vérification des indicateurs clés
    await expect(page.locator("h1")).toContainText("Direction Commerciale");
    await expect(page.locator("text=Quota National Pays")).toBeVisible();
    await expect(page.locator("text=Commissions Dues (MoMo)")).toBeVisible();
    await expect(page.locator("text=DIRCM10")).toBeVisible();

    // 2. Copier le pitch WhatsApp si présent
    const copyBtn = page.locator("button:has-text('Copier')").first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. Consulter les pitchs terrain
    const pitchTab = page.locator("button:has-text('Boîte à Outils')");
    await expect(pitchTab).toBeVisible();
    await pitchTab.click();
    await page.waitForTimeout(400);

    await expect(page.locator("text=Script d'Accroche Téléphonique / WhatsApp (DRH)")).toBeVisible();
    await expect(page.locator("text=Grille Tarifaire Officielle CEMAC (2026)")).toBeVisible();

    // Capture d'écran Étape 1
    await page.screenshot({ path: "tests/screenshots/step1-commercial-cockpit.png", fullPage: true });
  });

  test("11.2 — Prospection (9h30) : Saisie d'un nouveau Prospect B2B & Avancement dans le Kanban", async ({ page }) => {
    await page.goto("/commercial");
    await page.waitForLoadState("networkidle");

    // 1. Revenir sur le Pipeline B2B
    const pipelineTab = page.locator("button:has-text('Pipeline B2B')");
    await expect(pipelineTab).toBeVisible();
    await pipelineTab.click();
    await page.waitForTimeout(400);

    // 2. Ouvrir le modal Nouveau Prospect B2B
    const newLeadBtn = page.locator("button:has-text('Nouveau Prospect B2B')");
    await expect(newLeadBtn).toBeVisible();
    await newLeadBtn.click();
    await page.waitForTimeout(400);

    await expect(page.getByText("Ajouter un Prospect Entreprise")).toBeVisible();

    // Remplir le formulaire prospect avec les identifiants OHADA
    await page.fill("input[placeholder*='TotalEnergies']", "Société Générale Cameroun");
    await page.fill("input[placeholder*='Jean Mba']", "Mme Chantal Eyinga (Responsable Recrutement)");
    await page.fill("input[placeholder*='drh@entreprise']", "recrutement@sgc.cm");
    await page.fill("input[placeholder*='+237 6']", "+237 699 88 77 66");
    await page.fill("input[placeholder*='RC/DLA']", "RC/DLA/2026/B/8821");
    await page.fill("input[placeholder*='M0']", "M042611223344B");
    await page.fill("textarea[placeholder*='Compte-rendu']", "RDV téléphonique concluant. Intéressée par le Pack 15 Contacts RH.");

    // Capture d'écran du formulaire de saisie du lead
    await page.screenshot({ path: "tests/screenshots/step2-add-lead-modal.png" });

    // Soumettre le prospect
    const submitBtn = page.locator("button:has-text('Enregistrer le Prospect')");
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    await page.waitForTimeout(1000);

    // Vérifier la présence du lead et avancer d'étape
    await expect(page.locator("text=Société Générale Cameroun").first()).toBeVisible({ timeout: 5000 });

    const moveBtn = page.locator("button:has-text('Avancer')").first();
    if (await moveBtn.isVisible()) {
      await moveBtn.click();
      await page.waitForTimeout(500);
    }

    // Capture d'écran Kanban mis à jour
    await page.screenshot({ path: "tests/screenshots/step2-kanban-updated.png", fullPage: true });
  });

  test("11.3 — Closing & Contrat (11h30) : Générateur de Contrats Commerciaux OHADA PDF", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // 1. Accéder à l'onglet Pipeline B2B & Contrats
    const b2bTab = page.locator("button:has-text('3. Pipeline B2B')");
    await expect(b2bTab).toBeVisible();
    await b2bTab.click();
    await page.waitForTimeout(500);

    await expect(page.locator("text=Générateur Automatique de Contrats Juridiques")).toBeVisible();

    // 2. Basculer sur le type de contrat B2B
    const selectDocType = page.locator("select:has(option[value='recruiter'])");
    if (await selectDocType.isVisible()) {
      await selectDocType.selectOption("recruiter");
      await page.waitForTimeout(400);
    }

    // Remplir le formulaire B2B
    const companyInput = page.locator("input[value*='MTN']").or(page.locator("input[placeholder*='MTN']")).first();
    if (await companyInput.isVisible()) {
      await companyInput.fill("Société Générale Cameroun");
    }

    // Capture d'écran Contrat OHADA prêt
    await page.screenshot({ path: "tests/screenshots/step3-contract-ohada.png", fullPage: true });

    const generatePdfBtn = page.locator("button:has-text('Générer et Télécharger le Contrat PDF')");
    await expect(generatePdfBtn).toBeVisible();
  });

  test("11.4 — Attribution Vente & Commission (16h30) : Utilisation Promo Code & Supervision Super-Admin", async ({ page, request }) => {
    // 1. Validation de l'utilisation du code promo de Christian Bekono au checkout (DIRCM10)
    const promoRes = await request.post("/api/promo/validate", {
      data: { promoCode: "DIRCM10", tier: "monthly" },
      headers: { "Content-Type": "application/json" },
    });
    expect(promoRes.status()).toBe(200);
    const promoData = await promoRes.json();
    expect(promoData.valid).toBe(true);
    expect(promoData.discountPercent).toBe(10);
    expect(promoData.discountedPrice).toBe(4500); // 5 000 FCFA - 10% = 4 500 FCFA

    // 2. Accéder à l'onglet Super-Admin Équipe Commerciale & Commissions
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const commercialsTab = page.locator("button:has-text('6. Équipe Commerciale')");
    await expect(commercialsTab).toBeVisible();
    await commercialsTab.click();
    await page.waitForTimeout(500);

    // Vérifier les compteurs d'équipe et le bouton de paiement MoMo
    await expect(page.locator("text=Équipe Commerciale CEMAC")).toBeVisible();
    await expect(page.locator("text=Christian Bekono").first()).toBeVisible();
    await expect(page.locator("text=DIRCM10").first()).toBeVisible();

    const payMoMoBtn = page.locator("button:has-text('Payer MoMo')").first();
    await expect(payMoMoBtn).toBeVisible();

    // Capture d'écran Super-Admin Clôture de Journée
    await page.screenshot({ path: "tests/screenshots/step5-superadmin-payout.png", fullPage: true });
  });
});

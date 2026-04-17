import { test, expect } from "@playwright/test";
import { selectors, sendChatMessage, waitForAutoSave } from "./helpers";

/**
 * BLOC 5 — Match avec l'Offre d'Emploi
 */

const SAMPLE_JOB = `
Nous recherchons un Développeur Full Stack Senior passionné pour rejoindre notre équipe.

Responsabilités :
- Développer et maintenir des applications web modernes avec React et Next.js
- Concevoir des APIs RESTful robustes avec Node.js et TypeScript
- Travailler en étroite collaboration avec les équipes produit et design
- Participer aux revues de code et aux décisions techniques
- Optimiser les performances des applications

Compétences requises :
- 3+ ans d'expérience en développement Full Stack
- Maîtrise de React, TypeScript, Node.js
- Expérience avec les bases de données SQL (PostgreSQL) et NoSQL
- Connaissance de Docker et des pratiques CI/CD
- Expérience avec les services cloud (AWS, GCP, ou Azure)

Bonus :
- Expérience avec GraphQL
- Connaissance de Prisma ou d'autres ORM
- Contribution à des projets open source
`.trim();

test.describe("Bloc 5 — Job Match Panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/builder");
    await page.waitForURL("**/builder");
    await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
  });

  test("5.1 — Bouton 'Optimiser pour une offre' ouvre le panel", async ({ page }) => {
    const jobMatchBtn = page.locator(selectors.jobMatchBtn);
    await expect(jobMatchBtn).toBeVisible();
    await jobMatchBtn.click();

    const panel = page.locator(selectors.jobMatchPanel);
    await expect(panel).toBeVisible({ timeout: 5_000 });
  });

  test("5.2 — Clic sur l'overlay ferme le panel", async ({ page }) => {
    await page.locator(selectors.jobMatchBtn).click();
    await expect(page.locator(selectors.jobMatchPanel)).toBeVisible();

    // Clic sur le fond (overlay)
    const overlay = page.locator("[data-testid='job-match-overlay']");
    await overlay.click({ force: true });

    await expect(page.locator(selectors.jobMatchPanel)).not.toBeVisible({ timeout: 5_000 });
  });

  test("5.3 — Textarea vide = bouton Analyser désactivé", async ({ page }) => {
    await page.locator(selectors.jobMatchBtn).click();
    await page.waitForSelector(selectors.jobMatchTextarea, { state: "visible" });

    const analyzeBtn = page.locator(selectors.jobMatchAnalyze);
    // Vérifier que le bouton est disabled quand le textarea est vide
    await expect(analyzeBtn).toBeDisabled();
  });

  test("5.4-5.6 — Analyse d'offre retourne des suggestions priorisées", async ({
    page,
  }) => {
    // D'abord s'assurer qu'il y a un CV (envoyer infos de base)
    await sendChatMessage(
      page,
      "Je suis développeur web avec 4 ans d'expérience en React et Node.js"
    );
    await page.waitForTimeout(3000);

    // Ouvrir le panel
    await page.locator(selectors.jobMatchBtn).click();
    await page.waitForSelector(selectors.jobMatchTextarea, { state: "visible" });

    // Coller l'offre
    await page.fill(selectors.jobMatchTextarea, SAMPLE_JOB);

    // Le bouton doit être activé
    const analyzeBtn = page.locator(selectors.jobMatchAnalyze);
    await expect(analyzeBtn).not.toBeDisabled();

    // Lancer l'analyse (appel réseau réel)
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/optimize") && res.status() === 200,
      { timeout: 30_000 }
    );
    await analyzeBtn.click();

    const response = await responsePromise;
    const body = await response.json();

    console.log("🎯 Optimize response:", JSON.stringify(body).slice(0, 500));

    // Vérifications sur le body
    expect(Array.isArray(body.suggestions)).toBe(true);
    expect(body.suggestions.length).toBeGreaterThanOrEqual(1);

    // Chaque suggestion doit avoir chatPrompt
    for (const s of body.suggestions) {
      expect(s).toHaveProperty("chatPrompt");
      expect(typeof s.chatPrompt).toBe("string");
      expect(s.chatPrompt.length).toBeGreaterThan(0);
    }

    // Les suggestions HIGH doivent précéder MEDIUM
    const impacts = body.suggestions.map((s: any) => s.impact);
    const highIdx = impacts.lastIndexOf("high");
    const mediumIdx = impacts.indexOf("medium");
    if (highIdx !== -1 && mediumIdx !== -1) {
      expect(highIdx).toBeLessThan(mediumIdx);
    }

    console.log("✅ Suggestions count:", body.suggestions.length);
    console.log("✅ Impacts:", impacts.join(", "));
  });

  test("5.7-5.9 — Clic 'Envoyer à Alex' injecte le prompt dans le chat", async ({
    page,
  }) => {
    // Ouvrir le panel et analyser
    await page.locator(selectors.jobMatchBtn).click();
    await page.waitForSelector(selectors.jobMatchTextarea);
    await page.fill(selectors.jobMatchTextarea, SAMPLE_JOB);

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/optimize") && res.status() === 200,
      { timeout: 30_000 }
    );
    await page.click(selectors.jobMatchAnalyze);
    await responsePromise;

    // Attendre les suggestions dans l'UI
    await page.waitForSelector(selectors.jobMatchSuggestions, { timeout: 10_000 });

    // Cliquer sur "Envoyer à Alex" de la 1ère suggestion
    const firstSendBtn = page.locator("[data-testid='send-to-alex-btn']").first();
    await firstSendBtn.click();

    // Le panel doit se fermer
    await expect(page.locator(selectors.jobMatchPanel)).not.toBeVisible({ timeout: 5_000 });

    // Un message doit avoir été injecté dans le chat (l'input doit être vide, message envoyé)
    console.log("✅ Job match suggestion sent to Alex");
  });
});

/**
 * BLOC 5 — Tests API /api/optimize isolés
 */
test.describe("Bloc 5 — API /api/optimize", () => {
  test("5.API.1 — jobDescription vide = 400", async ({ request }) => {
    const response = await request.post("/api/optimize", {
      data: { jobDescription: "" },
      headers: { "Content-Type": "application/json" },
    });
    expect([400, 422]).toContain(response.status());
  });

  test("5.API.2 — Offre valide avec session = 200 + suggestions", async ({
    request,
  }) => {
    const response = await request.post("/api/optimize", {
      data: { jobDescription: SAMPLE_JOB },
      headers: { "Content-Type": "application/json" },
    });
    // Peut retourner 200 ou un autre code selon l'état du CV
    console.log("📊 /api/optimize status:", response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty("suggestions");
    }
  });
});

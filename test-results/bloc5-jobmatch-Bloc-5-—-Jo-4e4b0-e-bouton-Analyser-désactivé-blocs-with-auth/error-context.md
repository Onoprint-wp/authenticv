# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc5-jobmatch.spec.ts >> Bloc 5 — Job Match Panel >> 5.3 — Textarea vide = bouton Analyser désactivé
- Location: tests\bloc5-jobmatch.spec.ts:58:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 90000ms exceeded.
Call log:
  - waiting for locator('#job-description-input') to be visible
    - waiting for" http://localhost:3000/builder" navigation to finish...
    - navigated to "http://localhost:3000/builder"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e6]
        - generic [ref=e9]: AuthentiCV
        - generic [ref=e10]:
          - img [ref=e11]
          - text: AI Coach
      - generic [ref=e14]:
        - generic [ref=e15]:
          - img [ref=e16]
          - generic [ref=e18]: Sauvegardé
        - button "Importer un CV" [ref=e20]:
          - img [ref=e21]
          - generic [ref=e24]: Importer un CV
        - button "Optimiser pour une offre" [ref=e25]:
          - img [ref=e26]
          - generic [ref=e29]: Optimiser pour une offre
        - button "Déconnexion" [ref=e31]:
          - img [ref=e32]
          - generic [ref=e35]: Déconnexion
    - generic [ref=e36]:
      - generic [ref=e37]:
        - paragraph [ref=e39]:
          - img [ref=e40]
          - text: Coach IA — Alex
        - generic [ref=e44]:
          - generic [ref=e46]:
            - img [ref=e48]
            - generic [ref=e51]:
              - paragraph [ref=e52]: Bonjour ! Je suis Alex 👋
              - paragraph [ref=e53]: Votre coach CV personnel. Je vais vous poser des questions pour construire un CV percutant, étape par étape.
            - paragraph [ref=e54]: Commencez par me dire votre prénom !
          - generic [ref=e56]:
            - textbox "Écrivez votre message…" [ref=e57]
            - button [disabled] [ref=e58]:
              - img [ref=e59]
      - generic [ref=e62]:
        - generic [ref=e64]:
          - button "Aperçu PDF" [ref=e65]
          - button "Édition Manuelle" [ref=e66]
        - iframe [ref=e68]:
          
  - generic [ref=e73] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e74]:
      - img [ref=e75]
    - generic [ref=e78]:
      - button "Open issues overlay" [ref=e79]:
        - generic [ref=e80]:
          - generic [ref=e81]: "0"
          - generic [ref=e82]: "1"
        - generic [ref=e83]: Issue
      - button "Collapse issues badge" [ref=e84]:
        - img [ref=e85]
  - alert [ref=e87]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { selectors, sendChatMessage, waitForAutoSave } from "./helpers";
  3   | 
  4   | /**
  5   |  * BLOC 5 — Match avec l'Offre d'Emploi
  6   |  */
  7   | 
  8   | const SAMPLE_JOB = `
  9   | Nous recherchons un Développeur Full Stack Senior passionné pour rejoindre notre équipe.
  10  | 
  11  | Responsabilités :
  12  | - Développer et maintenir des applications web modernes avec React et Next.js
  13  | - Concevoir des APIs RESTful robustes avec Node.js et TypeScript
  14  | - Travailler en étroite collaboration avec les équipes produit et design
  15  | - Participer aux revues de code et aux décisions techniques
  16  | - Optimiser les performances des applications
  17  | 
  18  | Compétences requises :
  19  | - 3+ ans d'expérience en développement Full Stack
  20  | - Maîtrise de React, TypeScript, Node.js
  21  | - Expérience avec les bases de données SQL (PostgreSQL) et NoSQL
  22  | - Connaissance de Docker et des pratiques CI/CD
  23  | - Expérience avec les services cloud (AWS, GCP, ou Azure)
  24  | 
  25  | Bonus :
  26  | - Expérience avec GraphQL
  27  | - Connaissance de Prisma ou d'autres ORM
  28  | - Contribution à des projets open source
  29  | `.trim();
  30  | 
  31  | test.describe("Bloc 5 — Job Match Panel", () => {
  32  |   test.beforeEach(async ({ page }) => {
  33  |     await page.goto("/builder");
  34  |     await page.waitForURL("**/builder");
  35  |     await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
  36  |   });
  37  | 
  38  |   test("5.1 — Bouton 'Optimiser pour une offre' ouvre le panel", async ({ page }) => {
  39  |     const jobMatchBtn = page.locator(selectors.jobMatchBtn);
  40  |     await expect(jobMatchBtn).toBeVisible();
  41  |     await jobMatchBtn.click();
  42  | 
  43  |     const panel = page.locator(selectors.jobMatchPanel);
  44  |     await expect(panel).toBeVisible({ timeout: 5_000 });
  45  |   });
  46  | 
  47  |   test("5.2 — Clic sur l'overlay ferme le panel", async ({ page }) => {
  48  |     await page.locator(selectors.jobMatchBtn).click();
  49  |     await expect(page.locator(selectors.jobMatchPanel)).toBeVisible();
  50  | 
  51  |     // Clic sur le fond (overlay)
  52  |     const overlay = page.locator("[data-testid='job-match-overlay']");
  53  |     await overlay.click({ force: true });
  54  | 
  55  |     await expect(page.locator(selectors.jobMatchPanel)).not.toBeVisible({ timeout: 5_000 });
  56  |   });
  57  | 
  58  |   test("5.3 — Textarea vide = bouton Analyser désactivé", async ({ page }) => {
  59  |     await page.locator(selectors.jobMatchBtn).click();
> 60  |     await page.waitForSelector(selectors.jobMatchTextarea, { state: "visible" });
      |                ^ Error: page.waitForSelector: Test timeout of 90000ms exceeded.
  61  | 
  62  |     const analyzeBtn = page.locator(selectors.jobMatchAnalyze);
  63  |     // Vérifier que le bouton est disabled quand le textarea est vide
  64  |     await expect(analyzeBtn).toBeDisabled();
  65  |   });
  66  | 
  67  |   test("5.4-5.6 — Analyse d'offre retourne des suggestions priorisées", async ({
  68  |     page,
  69  |   }) => {
  70  |     // D'abord s'assurer qu'il y a un CV (envoyer infos de base)
  71  |     await sendChatMessage(
  72  |       page,
  73  |       "Je suis développeur web avec 4 ans d'expérience en React et Node.js"
  74  |     );
  75  |     await page.waitForTimeout(3000);
  76  | 
  77  |     // Ouvrir le panel
  78  |     await page.locator(selectors.jobMatchBtn).click();
  79  |     await page.waitForSelector(selectors.jobMatchTextarea, { state: "visible" });
  80  | 
  81  |     // Coller l'offre
  82  |     await page.fill(selectors.jobMatchTextarea, SAMPLE_JOB);
  83  | 
  84  |     // Le bouton doit être activé
  85  |     const analyzeBtn = page.locator(selectors.jobMatchAnalyze);
  86  |     await expect(analyzeBtn).not.toBeDisabled();
  87  | 
  88  |     // Lancer l'analyse (appel réseau réel)
  89  |     const responsePromise = page.waitForResponse(
  90  |       (res) => res.url().includes("/api/optimize") && res.status() === 200,
  91  |       { timeout: 30_000 }
  92  |     );
  93  |     await analyzeBtn.click();
  94  | 
  95  |     const response = await responsePromise;
  96  |     const body = await response.json();
  97  | 
  98  |     console.log("🎯 Optimize response:", JSON.stringify(body).slice(0, 500));
  99  | 
  100 |     // Vérifications sur le body
  101 |     expect(Array.isArray(body.suggestions)).toBe(true);
  102 |     expect(body.suggestions.length).toBeGreaterThanOrEqual(1);
  103 | 
  104 |     // Chaque suggestion doit avoir chatPrompt
  105 |     for (const s of body.suggestions) {
  106 |       expect(s).toHaveProperty("chatPrompt");
  107 |       expect(typeof s.chatPrompt).toBe("string");
  108 |       expect(s.chatPrompt.length).toBeGreaterThan(0);
  109 |     }
  110 | 
  111 |     // Les suggestions HIGH doivent précéder MEDIUM
  112 |     const impacts = body.suggestions.map((s: any) => s.impact);
  113 |     const highIdx = impacts.lastIndexOf("high");
  114 |     const mediumIdx = impacts.indexOf("medium");
  115 |     if (highIdx !== -1 && mediumIdx !== -1) {
  116 |       expect(highIdx).toBeLessThan(mediumIdx);
  117 |     }
  118 | 
  119 |     console.log("✅ Suggestions count:", body.suggestions.length);
  120 |     console.log("✅ Impacts:", impacts.join(", "));
  121 |   });
  122 | 
  123 |   test("5.7-5.9 — Clic 'Envoyer à Alex' injecte le prompt dans le chat", async ({
  124 |     page,
  125 |   }) => {
  126 |     // Ouvrir le panel et analyser
  127 |     await page.locator(selectors.jobMatchBtn).click();
  128 |     await page.waitForSelector(selectors.jobMatchTextarea);
  129 |     await page.fill(selectors.jobMatchTextarea, SAMPLE_JOB);
  130 | 
  131 |     const responsePromise = page.waitForResponse(
  132 |       (res) => res.url().includes("/api/optimize") && res.status() === 200,
  133 |       { timeout: 30_000 }
  134 |     );
  135 |     await page.click(selectors.jobMatchAnalyze);
  136 |     await responsePromise;
  137 | 
  138 |     // Attendre les suggestions dans l'UI
  139 |     await page.waitForSelector(selectors.jobMatchSuggestions, { timeout: 10_000 });
  140 | 
  141 |     // Cliquer sur "Envoyer à Alex" de la 1ère suggestion
  142 |     const firstSendBtn = page.locator("[data-testid='send-to-alex-btn']").first();
  143 |     await firstSendBtn.click();
  144 | 
  145 |     // Le panel doit se fermer
  146 |     await expect(page.locator(selectors.jobMatchPanel)).not.toBeVisible({ timeout: 5_000 });
  147 | 
  148 |     // Un message doit avoir été injecté dans le chat (l'input doit être vide, message envoyé)
  149 |     console.log("✅ Job match suggestion sent to Alex");
  150 |   });
  151 | });
  152 | 
  153 | /**
  154 |  * BLOC 5 — Tests API /api/optimize isolés
  155 |  */
  156 | test.describe("Bloc 5 — API /api/optimize", () => {
  157 |   test("5.API.1 — jobDescription vide = 400", async ({ request }) => {
  158 |     const response = await request.post("/api/optimize", {
  159 |       data: { jobDescription: "" },
  160 |       headers: { "Content-Type": "application/json" },
```
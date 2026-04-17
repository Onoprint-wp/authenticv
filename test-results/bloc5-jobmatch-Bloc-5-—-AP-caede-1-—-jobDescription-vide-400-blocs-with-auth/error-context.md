# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc5-jobmatch.spec.ts >> Bloc 5 — API /api/optimize >> 5.API.1 — jobDescription vide = 400
- Location: tests\bloc5-jobmatch.spec.ts:157:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 500
Received array: [400, 422]
```

# Test source

```ts
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
  161 |     });
> 162 |     expect([400, 422]).toContain(response.status());
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  163 |   });
  164 | 
  165 |   test("5.API.2 — Offre valide avec session = 200 + suggestions", async ({
  166 |     request,
  167 |   }) => {
  168 |     const response = await request.post("/api/optimize", {
  169 |       data: { jobDescription: SAMPLE_JOB },
  170 |       headers: { "Content-Type": "application/json" },
  171 |     });
  172 |     // Peut retourner 200 ou un autre code selon l'état du CV
  173 |     console.log("📊 /api/optimize status:", response.status());
  174 |     if (response.status() === 200) {
  175 |       const body = await response.json();
  176 |       expect(body).toHaveProperty("suggestions");
  177 |     }
  178 |   });
  179 | });
  180 | 
```
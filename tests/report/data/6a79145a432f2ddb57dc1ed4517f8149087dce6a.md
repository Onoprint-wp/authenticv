# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc5-jobmatch.spec.ts >> Bloc 5 — Job Match Panel >> 5.7-5.9 — Clic 'Envoyer à Alex' injecte le prompt dans le chat
- Location: tests\bloc5-jobmatch.spec.ts:123:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#chat-input') to be visible

```

# Page snapshot

```yaml
- generic:
  - generic [active]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - navigation [ref=e6]:
            - button "previous" [disabled] [ref=e7]:
              - img "previous" [ref=e8]
            - generic [ref=e10]:
              - generic [ref=e11]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e12]:
              - img "next" [ref=e13]
          - img
        - generic [ref=e15]:
          - generic [ref=e16]:
            - img [ref=e17]
            - generic "Latest available version is detected (16.2.4)." [ref=e19]: Next.js 16.2.4
            - generic [ref=e20]: Turbopack
          - img
      - dialog "Build Error" [ref=e22]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e29]: Build Error
              - generic [ref=e30]:
                - button "Copy Error Info" [ref=e31] [cursor=pointer]:
                  - img [ref=e32]
                - button "No related documentation found" [disabled] [ref=e34]:
                  - img [ref=e35]
                - button "Attach Node.js inspector" [ref=e37] [cursor=pointer]:
                  - img [ref=e38]
            - generic [ref=e47]: Export FolderTarget doesn't exist in target module
          - generic [ref=e49]:
            - generic [ref=e51]:
              - img [ref=e53]
              - generic [ref=e56]: ./src/components/editor/CvEditorView.tsx (5:1)
              - button "Open in editor" [ref=e57] [cursor=pointer]:
                - img [ref=e59]
            - generic [ref=e62]:
              - generic [ref=e63]: Export
              - text: FolderTarget
              - generic [ref=e64]: doesn't exist in target module
              - generic [ref=e65]: 3 |
              - text: import React
              - generic [ref=e66]: ", { useState }"
              - text: from "react"
              - generic [ref=e67]: ;
              - generic [ref=e68]: 4 |
              - text: import
              - generic [ref=e69]: "{ useCvStore }"
              - text: from "@/store/useCvStore"
              - generic [ref=e70]: ;
              - text: ">"
              - generic [ref=e71]: 5 |
              - text: import
              - generic [ref=e72]: "{"
              - generic [ref=e73]: "|"
              - text: ^^^^^^^^ >
              - generic [ref=e74]: 6 |
              - text: User
              - generic [ref=e75]: ","
              - text: Briefcase
              - generic [ref=e76]: ","
              - text: GraduationCap
              - generic [ref=e77]: ","
              - text: Code
              - generic [ref=e78]: ","
              - generic [ref=e79]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ >
              - generic [ref=e80]: 7 |
              - text: Globe
              - generic [ref=e81]: ","
              - text: Award
              - generic [ref=e82]: ","
              - text: FolderTarget
              - generic [ref=e83]: ","
              - text: Plus
              - generic [ref=e84]: ","
              - text: Trash2
              - generic [ref=e85]: ","
              - generic [ref=e86]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ >
              - generic [ref=e87]: 8 |
              - text: ChevronDown
              - generic [ref=e88]: ","
              - text: ChevronUp
              - generic [ref=e89]: ","
              - text: FileText
              - generic [ref=e90]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ >
              - generic [ref=e91]: 9 |
              - generic [ref=e92]: "}"
              - text: from "lucide-react"
              - generic [ref=e93]: ;
              - generic [ref=e94]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^
              - generic [ref=e95]: 10 |
              - generic [ref=e96]: 11 |
              - text: const Input
              - generic [ref=e97]: "= (props:"
              - text: React.InputHTMLAttributes<HTMLInputElement
              - generic [ref=e98]: ">) => ("
              - generic [ref=e99]: 12 |
              - generic [ref=e100]: <input The export
              - text: FolderTarget
              - generic [ref=e101]: was not found in module
              - generic [ref=e102]: "[project]/node_modules/lucide-react/dist/esm/lucide-react.js [app-client] (ecmascript)"
              - generic [ref=e103]: . Did you mean to import
              - text: FolderTree
              - generic [ref=e104]: "? All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist. Import traces: Client Component Browser: ./src/components/editor/CvEditorView.tsx [Client Component Browser] ./src/app/builder/page.tsx [Client Component Browser] ./src/app/builder/page.tsx [Server Component] Client Component SSR: ./src/components/editor/CvEditorView.tsx [Client Component SSR] ./src/app/builder/page.tsx [Client Component SSR] ./src/app/builder/page.tsx [Server Component]"
        - generic [ref=e105]: "1"
        - generic [ref=e106]: "2"
    - generic [ref=e111] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e112]:
        - img [ref=e113]
      - button "Open issues overlay" [ref=e117]:
        - generic [ref=e118]:
          - generic [ref=e119]: "0"
          - generic [ref=e120]: "1"
        - generic [ref=e121]: Issue
  - alert [ref=e122]
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
> 35  |     await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
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
  60  |     await page.waitForSelector(selectors.jobMatchTextarea, { state: "visible" });
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
```
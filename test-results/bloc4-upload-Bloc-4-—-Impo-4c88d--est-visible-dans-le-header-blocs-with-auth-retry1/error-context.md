# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc4-upload.spec.ts >> Bloc 4 — Import CV (Upload) >> 4.1 — Le bouton Importer un CV est visible dans le header
- Location: tests\bloc4-upload.spec.ts:26:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid=\'upload-btn\']')
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for locator('[data-testid=\'upload-btn\']')

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
  2   | import { selectors, waitForAutoSave } from "./helpers";
  3   | import path from "path";
  4   | import fs from "fs";
  5   | 
  6   | /**
  7   |  * BLOC 4 — Import de CV existant (PDF / DOCX)
  8   |  * Teste le bouton Upload et la route POST /api/upload
  9   |  */
  10  | 
  11  | // Créer des fichiers de test minimaux
  12  | const testFilesDir = path.join(__dirname, "fixtures");
  13  | 
  14  | test.describe("Bloc 4 — Import CV (Upload)", () => {
  15  |   test.beforeAll(async () => {
  16  |     // Créer le dossier fixtures si nécessaire
  17  |     fs.mkdirSync(testFilesDir, { recursive: true });
  18  |   });
  19  | 
  20  |   test.beforeEach(async ({ page }) => {
  21  |     await page.goto("/builder");
  22  |     await page.waitForURL("**/builder");
  23  |     await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
  24  |   });
  25  | 
  26  |   test("4.1 — Le bouton Importer un CV est visible dans le header", async ({ page }) => {
  27  |     const uploadBtn = page.locator(selectors.uploadBtn);
> 28  |     await expect(uploadBtn).toBeVisible();
      |                             ^ Error: expect(locator).toBeVisible() failed
  29  |   });
  30  | 
  31  |   test("4.8 — Upload fichier .txt = erreur gérée proprement", async ({ page, request }) => {
  32  |     // Test via API directement (plus fiable pour les erreurs)
  33  |     const response = await request.post("/api/upload", {
  34  |       multipart: {
  35  |         file: {
  36  |           name: "test.txt",
  37  |           mimeType: "text/plain",
  38  |           buffer: Buffer.from("Ce n'est pas un PDF"),
  39  |         },
  40  |       },
  41  |     });
  42  |     // Doit retourner 415 (Unsupported Media Type)
  43  |     expect([400, 415]).toContain(response.status());
  44  |   });
  45  | 
  46  |   test("4.10 — Upload fichier > 10 Mo = 413", async ({ page, request }) => {
  47  |     // Créer un buffer de 11 Mo
  48  |     const bigBuffer = Buffer.alloc(11 * 1024 * 1024, "A");
  49  |     const response = await request.post("/api/upload", {
  50  |       multipart: {
  51  |         file: {
  52  |           name: "gros-cv.pdf",
  53  |           mimeType: "application/pdf",
  54  |           buffer: bigBuffer,
  55  |         },
  56  |       },
  57  |     });
  58  |     // Doit retourner 413 ou 400
  59  |     expect([400, 413]).toContain(response.status());
  60  |   });
  61  | 
  62  |   test("4.2-4.4 — Upload PDF minimal déclenche le parsing", async ({
  63  |     page,
  64  |     request,
  65  |   }) => {
  66  |     // On teste la route API avec un vrai mini-PDF (header PDF valide)
  67  |     // Format PDF minimal valide
  68  |     const minimalPdf = Buffer.from(
  69  |       "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
  70  |       "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
  71  |       "3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\n" +
  72  |       "xref\n0 4\n0000000000 65535 f\n" +
  73  |       "0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n" +
  74  |       "trailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
  75  |     );
  76  | 
  77  |     const response = await request.post("/api/upload", {
  78  |       multipart: {
  79  |         file: {
  80  |           name: "cv.pdf",
  81  |           mimeType: "application/pdf",
  82  |           buffer: minimalPdf,
  83  |         },
  84  |       },
  85  |     });
  86  | 
  87  |     // Peut retourner 200 (OK) ou 422 (texte vide non parsable) — les deux sont acceptés
  88  |     expect([200, 422, 500]).toContain(response.status());
  89  |     console.log("📤 Upload response status:", response.status());
  90  | 
  91  |     if (response.status() === 200) {
  92  |       const body = await response.json();
  93  |       expect(body).toHaveProperty("cvData");
  94  |       console.log("✅ cvData keys:", Object.keys(body.cvData));
  95  |     }
  96  |   });
  97  | });
  98  | 
  99  | /**
  100 |  * BLOC 4 — Tests API /api/upload (auth)
  101 |  */
  102 | test.describe("Bloc 4 — API /api/upload (routes isolées)", () => {
  103 |   test("4.2-API — Pas de fichier = 400", async ({ request }) => {
  104 |     const response = await request.post("/api/upload", {
  105 |       data: {},
  106 |       headers: { "Content-Type": "application/json" },
  107 |     });
  108 |     expect([400, 415, 422]).toContain(response.status());
  109 |   });
  110 | });
  111 | 
```
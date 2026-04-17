# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc6-history.spec.ts >> Bloc 6 — Historique de Versions >> 6.4 — Ouverture du dropdown affiche les checkpoints avec horodatage
- Location: tests\bloc6-history.spec.ts:57:7

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
  5   |  * BLOC 6 — Historique de Versions (Version History Panel)
  6   |  */
  7   | 
  8   | test.describe("Bloc 6 — Historique de Versions", () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.goto("/builder");
  11  |     await page.waitForURL("**/builder");
> 12  |     await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  13  |   });
  14  | 
  15  |   test("6.1 — Au 1er chargement, bouton Historique caché (0 checkpoints)", async ({
  16  |     page,
  17  |   }) => {
  18  |     // Le panel d'historique ne doit pas être visible immédiatement
  19  |     // (Il apparaît seulement après le 1er auto-save)
  20  |     const historyBtn = page.locator(selectors.historyBtn);
  21  |     // Either not visible OR showing "0"
  22  |     const isVisible = await historyBtn.isVisible().catch(() => false);
  23  |     if (isVisible) {
  24  |       // Si visible, doit afficher 0
  25  |       const text = await historyBtn.textContent();
  26  |       console.log("🕑 History button text:", text);
  27  |     }
  28  |     console.log("✅ History button initial state checked");
  29  |   });
  30  | 
  31  |   test("6.2 — Après modification + save, bouton Historique apparaît (≥1)", async ({
  32  |     page,
  33  |   }) => {
  34  |     await sendChatMessage(page, "J'ai travaillé comme consultant IT chez BNP Paribas");
  35  |     await waitForAutoSave(page);
  36  | 
  37  |     const historyBtn = page.locator(selectors.historyBtn);
  38  |     await expect(historyBtn).toBeVisible({ timeout: 5_000 });
  39  | 
  40  |     const text = await historyBtn.textContent();
  41  |     console.log("🕑 History button text after save:", text);
  42  |     // Le bouton doit afficher un nombre > 0
  43  |   });
  44  | 
  45  |   test("6.3 — Après 3 modifications, compteur = 3", async ({ page }) => {
  46  |     for (let i = 1; i <= 3; i++) {
  47  |       await sendChatMessage(page, `Modification numéro ${i} de mon profil`);
  48  |       await waitForAutoSave(page);
  49  |     }
  50  | 
  51  |     const historyBtn = page.locator(selectors.historyBtn);
  52  |     await expect(historyBtn).toBeVisible({ timeout: 5_000 });
  53  |     const text = await historyBtn.textContent();
  54  |     console.log("🕑 After 3 saves:", text);
  55  |   });
  56  | 
  57  |   test("6.4 — Ouverture du dropdown affiche les checkpoints avec horodatage", async ({
  58  |     page,
  59  |   }) => {
  60  |     // Créer un checkpoint
  61  |     await sendChatMessage(page, "Je suis chef de projet digital");
  62  |     await waitForAutoSave(page);
  63  | 
  64  |     const historyBtn = page.locator(selectors.historyBtn);
  65  |     await expect(historyBtn).toBeVisible({ timeout: 5_000 });
  66  |     await historyBtn.click();
  67  | 
  68  |     // Le dropdown doit être visible
  69  |     const dropdown = page.locator(selectors.historyDropdown);
  70  |     await expect(dropdown).toBeVisible({ timeout: 3_000 });
  71  | 
  72  |     // Au moins une entrée avec temps relatif
  73  |     const entries = page.locator("[data-testid='history-entry']");
  74  |     const count = await entries.count();
  75  |     expect(count).toBeGreaterThanOrEqual(1);
  76  |     console.log(`✅ History entries: ${count}`);
  77  |   });
  78  | 
  79  |   test("6.5 — Clic Restaurer revient à la version précédente", async ({ page }) => {
  80  |     // Étape 1 : créer un état A
  81  |     await sendChatMessage(page, "Première version de mon CV");
  82  |     await waitForAutoSave(page);
  83  | 
  84  |     // Étape 2 : créer un état B (modifié)
  85  |     await sendChatMessage(page, "Deuxième version de mon CV avec des changements");
  86  |     await waitForAutoSave(page);
  87  | 
  88  |     // Ouvrir historique
  89  |     await page.locator(selectors.historyBtn).click();
  90  |     await page.waitForSelector(selectors.historyDropdown, { state: "visible" });
  91  | 
  92  |     // Hover pour faire apparaître le bouton Restaurer
  93  |     const lastEntry = page.locator("[data-testid='history-entry']").last();
  94  |     await lastEntry.hover();
  95  | 
  96  |     // Restaurer
  97  |     const restoreBtn = page.locator(selectors.restoreBtn(1));
  98  |     if (await restoreBtn.isVisible().catch(() => false)) {
  99  |       await restoreBtn.click();
  100 |       // Le dropdown se ferme
  101 |       await expect(page.locator(selectors.historyDropdown)).not.toBeVisible({ timeout: 3_000 });
  102 |       console.log("✅ Restore triggered");
  103 |     } else {
  104 |       // Fallback : clic sur le premier bouton restaurer disponible
  105 |       const anyRestore = page.locator("[data-testid='restore-btn']").first();
  106 |       if (await anyRestore.isVisible().catch(() => false)) {
  107 |         await anyRestore.click();
  108 |       }
  109 |       console.log("⚠️ Restore button not found via specific selector, check data-testid");
  110 |     }
  111 |   });
  112 | 
```
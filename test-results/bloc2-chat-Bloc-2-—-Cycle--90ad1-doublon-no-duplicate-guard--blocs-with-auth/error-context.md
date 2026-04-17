# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc2-chat.spec.ts >> Bloc 2 — Cycle Chat → Mise à jour CV >> 2.7 — Re-donner le même prénom ne crée pas de doublon (no-duplicate guard)
- Location: tests\bloc2-chat.spec.ts:83:7

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
  2   | import { selectors, sendChatMessage, waitForAutoSave, waitForPdfText } from "./helpers";
  3   | 
  4   | /**
  5   |  * BLOC 2 — Premier contact avec Alex (CV vide ou existant)
  6   |  * Valide la chaîne complète : message → tool call → PDF update → auto-save
  7   |  *
  8   |  * Note: Ces tests utilisent le vrai LLM (Anthropic). On fait des assertions
  9   |  * structurelles (tool appelé, champ présent) et NON textuelles.
  10  |  */
  11  | 
  12  | test.describe("Bloc 2 — Cycle Chat → Mise à jour CV", () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     await page.goto("/builder");
  15  |     await page.waitForURL("**/builder");
  16  |     // Attendre que le store soit hydraté (icône PDF visible)
> 17  |     await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 15000ms exceeded.
  18  |   });
  19  | 
  20  |   test("2.1 — Page /builder charge avec chat et PDF visibles", async ({ page }) => {
  21  |     await expect(page.locator(selectors.chatInput)).toBeVisible();
  22  |     // Le PDF viewer existe dans le DOM
  23  |     const pdfArea = page.locator(".flex-1.overflow-hidden.bg-slate-800");
  24  |     await expect(pdfArea).toBeVisible();
  25  |   });
  26  | 
  27  |   test("2.2 — Donner son prénom déclenche une réponse d'Alex", async ({ page }) => {
  28  |     // Écouter la requête /api/chat
  29  |     let chatRequestMade = false;
  30  |     page.on("request", (req) => {
  31  |       if (req.url().includes("/api/chat") && req.method() === "POST") {
  32  |         chatRequestMade = true;
  33  |       }
  34  |     });
  35  | 
  36  |     await sendChatMessage(page, "Je m'appelle Lucas Martin");
  37  | 
  38  |     expect(chatRequestMade).toBe(true);
  39  | 
  40  |     // Alex doit avoir répondu (dernier message visible dans le chat)
  41  |     const lastMessage = page.locator("[data-testid='chat-message']").last();
  42  |     await expect(lastMessage).toBeVisible({ timeout: 30_000 });
  43  |   });
  44  | 
  45  |   test("2.3 — Auto-save se déclenche après modification (SyncIndicator)", async ({ page }) => {
  46  |     await sendChatMessage(page, "Mon prénom est Alexandre");
  47  |     await waitForAutoSave(page);
  48  |     // Le SyncIndicator doit indiquer "saved" (pas d'erreur)
  49  |     // On vérifie qu'il n'affiche pas "error" dans le DOM
  50  |     const errorState = page.locator("text=Erreur de sauvegarde");
  51  |     await expect(errorState).not.toBeVisible();
  52  |   });
  53  | 
  54  |   test("2.4 — Prénom visible dans le PDF après tool call", async ({ page }) => {
  55  |     const firstName = "Théodore";
  56  |     await sendChatMessage(
  57  |       page,
  58  |       `Mon prénom est ${firstName} et mon nom est Leblanc`
  59  |     );
  60  |     // Attendre que le PDF se mette à jour (le viewer doit afficher le prénom)
  61  |     // Note : @react-pdf/renderer génère un PDF canvas, on check le texte si accessible
  62  |     await page.waitForTimeout(5000); // Laisser le temps au PDF de se re-render
  63  |     // Vérification alternative : le store Zustand via window
  64  |     const name = await page.evaluate(() => {
  65  |       // @ts-ignore
  66  |       return (window as any).__ZUSTAND_CV_STORE__?.getState?.()?.cvData?.personalInfo?.firstName;
  67  |     });
  68  |     // Si le store n'est pas exposé, on vérifie juste qu'aucune erreur n'est apparue
  69  |     console.log("📋 firstName in store:", name);
  70  |   });
  71  | 
  72  |   test("2.6 — Donner une expérience professionnelle", async ({ page }) => {
  73  |     await sendChatMessage(
  74  |       page,
  75  |       "J'ai travaillé chez Accenture de 2021 à 2023 comme développeur React"
  76  |     );
  77  |     // Vérifier que le chat a bien reçu une réponse
  78  |     await page.waitForTimeout(3000);
  79  |     // Pas d'erreur visible
  80  |     await expect(page.locator("text=Une erreur")).not.toBeVisible();
  81  |   });
  82  | 
  83  |   test("2.7 — Re-donner le même prénom ne crée pas de doublon (no-duplicate guard)", async ({
  84  |     page,
  85  |   }) => {
  86  |     // Premier message
  87  |     await sendChatMessage(page, "Je m'appelle Marie Curie");
  88  |     await page.waitForTimeout(2000);
  89  | 
  90  |     // Compter les tool calls (via intercepteur réseau non disponible directement)
  91  |     // Approche alternative : vérifier que le CV n'a pas deux fois "Marie"
  92  |     // On envoie le même message et on vérifie que la réponse d'Alex reconnaît l'info existante
  93  |     await sendChatMessage(page, "Je m'appelle Marie Curie");
  94  | 
  95  |     // Alex ne devrait PAS re-appeler updatePersonalInfo mais juste confirmer
  96  |     const lastMessage = page.locator("[data-testid='chat-message']").last();
  97  |     await expect(lastMessage).toBeVisible({ timeout: 30_000 });
  98  |     // Test non-déterministe : on vérifie juste qu'il n'y a pas d'erreur
  99  |   });
  100 | 
  101 |   test("2.8 — Donner des compétences les ajoute au CV", async ({ page }) => {
  102 |     await sendChatMessage(page, "Mes compétences sont React, TypeScript et Node.js");
  103 |     await page.waitForTimeout(3000);
  104 |     await expect(page.locator("text=Une erreur")).not.toBeVisible();
  105 |   });
  106 | 
  107 |   test("2.9 — Donner une formation", async ({ page }) => {
  108 |     await sendChatMessage(
  109 |       page,
  110 |       "J'ai un Master en Informatique de l'Université de Lyon, obtenu en 2020"
  111 |     );
  112 |     await page.waitForTimeout(3000);
  113 |     await expect(page.locator("text=Une erreur")).not.toBeVisible();
  114 |   });
  115 | 
  116 |   test("2.11 — Actualisation de la page restaure le CV depuis Prisma", async ({ page }) => {
  117 |     // D'abord envoyer quelque chose pour créer un resume
```
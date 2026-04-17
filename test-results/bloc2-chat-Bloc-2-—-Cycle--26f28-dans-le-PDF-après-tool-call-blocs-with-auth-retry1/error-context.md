# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc2-chat.spec.ts >> Bloc 2 — Cycle Chat → Mise à jour CV >> 2.4 — Prénom visible dans le PDF après tool call
- Location: tests\bloc2-chat.spec.ts:54:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.waitForFunction: Test timeout of 90000ms exceeded.
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
  1   | import { Page } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * Helpers partagés pour les tests AuthenticV
  5   |  */
  6   | 
  7   | // ─── Sélecteurs ────────────────────────────────────────────────────────────
  8   | export const selectors = {
  9   |   // Auth
  10  |   emailInput: "#email",
  11  |   passwordInput: "#password",
  12  |   loginBtn: "#login-btn",
  13  |   logoutBtn: "#logout-btn",
  14  | 
  15  |   // Header
  16  |   syncIndicator: "[data-testid='sync-indicator']",
  17  |   uploadBtn: "[data-testid='upload-btn']",
  18  |   jobMatchBtn: "#open-job-match-btn",
  19  |   historyBtn: "#version-history-btn",
  20  | 
  21  |   // Chat
  22  |   chatInput: "#chat-input",
  23  |   chatSend: "#chat-send-btn",
  24  |   chatMessages: "[data-testid='chat-messages']",
  25  | 
  26  |   // PDF viewer
  27  |   pdfViewer: "[data-testid='pdf-viewer']",
  28  | 
  29  |   // Job match panel
  30  |   jobMatchPanel: "[data-testid='job-match-panel']",
  31  |   jobMatchTextarea: "#job-description-input",
  32  |   jobMatchAnalyze: "#analyze-job-btn",
  33  |   jobMatchSuggestions: "[data-testid='job-suggestion']",
  34  | 
  35  |   // Version history
  36  |   historyDropdown: "[data-testid='history-dropdown']",
  37  |   restoreBtn: (i: number) => `#restore-checkpoint-${i}-btn`,
  38  | };
  39  | 
  40  | // ─── Helpers ────────────────────────────────────────────────────────────────
  41  | 
  42  | /** Send a message in the chat and wait for streaming to complete */
  43  | export async function sendChatMessage(page: Page, text: string): Promise<void> {
  44  |   await page.fill(selectors.chatInput, text);
  45  | 
  46  |   // Register request listener BEFORE clicking
  47  |   let chatRequestSent = false;
  48  |   page.on("request", (req) => {
  49  |     if (req.url().includes("/api/chat") && req.method() === "POST") {
  50  |       chatRequestSent = true;
  51  |     }
  52  |   });
  53  | 
  54  |   await page.click(selectors.chatSend);
  55  | 
  56  |   // Wait for the HTTP request to be sent (fast, < 2s)
  57  |   await page.waitForFunction(
  58  |     () => true, // just a tick to allow the request listener to fire
  59  |     undefined,
  60  |     { timeout: 5_000 }
  61  |   );
  62  | 
  63  |   // Wait for streaming to fully complete: send button becomes enabled again
  64  |   // Anthropic claude-sonnet can take 60-90s with tool calls
> 65  |   await page.waitForFunction(
      |              ^ Error: page.waitForFunction: Test timeout of 90000ms exceeded.
  66  |     (sendSel) => {
  67  |       const btn = document.querySelector(sendSel) as HTMLButtonElement | null;
  68  |       return btn && !btn.disabled;
  69  |     },
  70  |     selectors.chatSend,
  71  |     { timeout: 120_000 }
  72  |   );
  73  | }
  74  | 
  75  | /** Wait for auto-save debounce + SyncIndicator to show "saved" */
  76  | export async function waitForAutoSave(page: Page): Promise<void> {
  77  |   await page.waitForTimeout(2300); // debounce = 2000ms + margin
  78  |   // Optional: wait for sync visual indicator (if testid added)
  79  | }
  80  | 
  81  | /** Wait for text to appear anywhere in the PDF viewer region */
  82  | export async function waitForPdfText(page: Page, text: string): Promise<void> {
  83  |   await page.waitForFunction(
  84  |     ([sel, txt]) => {
  85  |       return (
  86  |         document.querySelector(sel as string)?.textContent?.includes(txt as string) ?? false
  87  |       );
  88  |     },
  89  |     [selectors.pdfViewer, text],
  90  |     { timeout: 20_000 }
  91  |   );
  92  | }
  93  | 
  94  | /** Make an unauthenticated API request and return the status */
  95  | export async function unauthenticatedPost(
  96  |   page: Page,
  97  |   url: string,
  98  |   body: object
  99  | ): Promise<number> {
  100 |   const response = await page.request.post(url, {
  101 |     data: body,
  102 |     headers: { "Content-Type": "application/json" },
  103 |     // no cookies — unauthenticated
  104 |     ignoreHTTPSErrors: true,
  105 |   });
  106 |   return response.status();
  107 | }
  108 | 
```
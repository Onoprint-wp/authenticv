# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bloc2-chat.spec.ts >> Bloc 2 — Cycle Chat → Mise à jour CV >> 2.3 — Auto-save se déclenche après modification (SyncIndicator)
- Location: tests\bloc2-chat.spec.ts:45:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.waitForFunction: Test timeout of 90000ms exceeded.
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
            - generic [ref=e51]: Mon prénom est Alexandre
          - generic [ref=e53]:
            - textbox "Écrivez votre message…" [ref=e54]
            - button [disabled] [ref=e55]:
              - img [ref=e56]
      - generic [ref=e59]:
        - generic [ref=e61]:
          - button "Aperçu PDF" [ref=e62]
          - button "Édition Manuelle" [ref=e63]
        - iframe [ref=e65]:
          
  - generic [ref=e70] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e71]:
      - img [ref=e72]
    - generic [ref=e75]:
      - button "Open issues overlay" [ref=e76]:
        - generic [ref=e77]:
          - generic [ref=e78]: "1"
          - generic [ref=e79]: "2"
        - generic [ref=e80]:
          - text: Issue
          - generic [ref=e81]: s
      - button "Collapse issues badge" [ref=e82]:
        - img [ref=e83]
  - alert [ref=e85]
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
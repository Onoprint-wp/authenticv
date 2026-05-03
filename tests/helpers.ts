import { Page } from "@playwright/test";

/**
 * Helpers partagés pour les tests AuthenticV
 */

// ─── Sélecteurs ────────────────────────────────────────────────────────────
export const selectors = {
  // Auth
  emailInput: "#email",
  passwordInput: "#password",
  loginBtn: "#login-btn",
  logoutBtn: "#logout-btn",

  // Header
  syncIndicator: "[data-testid='sync-indicator']",
  uploadBtn: "[data-testid='upload-btn']",
  jobMatchBtn: "#open-job-match-btn",
  historyBtn: "#version-history-btn",

  // Chat
  chatInput: "#chat-input",
  chatSend: "#chat-send-btn",
  chatMessages: "[data-testid='chat-messages']",

  // PDF viewer
  pdfViewer: "[data-testid='pdf-viewer']",

  // Job match panel
  jobMatchPanel: "[data-testid='job-match-panel']",
  jobMatchTextarea: "#job-description-input",
  jobMatchAnalyze: "#analyze-job-btn",
  jobMatchSuggestions: "[data-testid='job-suggestion']",

  // Version history
  historyDropdown: "[data-testid='history-dropdown']",
  restoreBtn: (i: number) => `#restore-checkpoint-${i}-btn`,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Send a message in the chat and wait for streaming to complete */
export async function sendChatMessage(page: Page, text: string): Promise<void> {
  // Count existing messages before sending
  const msgsBefore = await page.locator("[data-testid='chat-message']").count();

  await page.fill(selectors.chatInput, text);
  await page.click(selectors.chatSend);

  // Wait for button to go disabled (request sent) — fast
  await page.waitForFunction(
    (sendSel) => {
      const btn = document.querySelector(sendSel) as HTMLButtonElement | null;
      return btn && btn.disabled;
    },
    selectors.chatSend,
    { timeout: 10_000 }
  );

  // Wait for streaming to complete: send button re-enabled OR new message appears
  // Vercel maxDuration=120s, give an extra 30s buffer
  await page.waitForFunction(
    ([sendSel, countBefore]) => {
      const btn = document.querySelector(sendSel as string) as HTMLButtonElement | null;
      if (btn && !btn.disabled) return true;
      // Also check if a new message appeared (covers edge case where button state lags)
      const msgs = document.querySelectorAll("[data-testid='chat-message']");
      return msgs.length > (countBefore as number);
    },
    [selectors.chatSend, msgsBefore],
    { timeout: 150_000 }
  );
}

/** Wait for auto-save debounce + SyncIndicator to show "saved" */
export async function waitForAutoSave(page: Page): Promise<void> {
  await page.waitForTimeout(2300); // debounce = 2000ms + margin
  // Optional: wait for sync visual indicator (if testid added)
}

/** Wait for text to appear anywhere in the PDF viewer region */
export async function waitForPdfText(page: Page, text: string): Promise<void> {
  await page.waitForFunction(
    ([sel, txt]) => {
      return (
        document.querySelector(sel as string)?.textContent?.includes(txt as string) ?? false
      );
    },
    [selectors.pdfViewer, text],
    { timeout: 20_000 }
  );
}

/** Make an unauthenticated API request and return the status */
export async function unauthenticatedPost(
  page: Page,
  url: string,
  body: object
): Promise<number> {
  const response = await page.request.post(url, {
    data: body,
    headers: { "Content-Type": "application/json" },
    // no cookies — unauthenticated
    ignoreHTTPSErrors: true,
  });
  return response.status();
}

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const http = require("http");

const TARGET_DIR = `C:\\Users\\PcGamerCm\\.gemini\\antigravity\\brain\\a7e5b65f-783d-41b8-bfd9-8c3a55275ea2\\screenshots`;

function checkLocalhost() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:3000", { timeout: 3000 }, (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

(async () => {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const isLocalUp = await checkLocalhost();
  const baseURL = isLocalUp ? "http://localhost:3000" : "https://www.authenticv.app";
  console.log(`Using base URL: ${baseURL} (localhost status: ${isLocalUp ? "UP" : "DOWN"})`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "fr-FR"
  });

  const page = await context.newPage();

  // Step A: Perform Login to get valid auth session
  console.log("Navigating to /login to establish session...");
  await page.goto(`${baseURL}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  const emailInput = page.locator("#email");
  if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("Logging in as authenticv.playwright.test@gmail.com...");
    await emailInput.fill("authenticv.playwright.test@gmail.com");
    await page.fill("#password", "PlaywrightTest@2026!");
    await page.click("#login-btn");
    await page.waitForTimeout(3000);
    console.log("Logged in. Current URL:", page.url());
  } else {
    console.log("Already logged in or login form not shown. Current URL:", page.url());
  }

  // Helper to dismiss cookie consent or onboarding modal if present
  async function dismissModals() {
    try {
      const cookieBtn = page.locator("button:has-text('J\\'accepte'), button:has-text('Accepter')").first();
      if (await cookieBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await cookieBtn.click();
        console.log("Dismissed cookie consent banner.");
        await page.waitForTimeout(500);
      }
      const closeOnboardingBtn = page.locator("button:has-text('Commencer'), button:has-text('Passer'), [aria-label='Close']").first();
      if (await closeOnboardingBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeOnboardingBtn.click();
        console.log("Dismissed onboarding modal.");
        await page.waitForTimeout(500);
      }
    } catch (e) {
      // Ignore
    }
  }

  // 1. Landing Page
  console.log("\n--- Capturing 1. Landing Page ---");
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await dismissModals();
  const landingPath = path.join(TARGET_DIR, "landing_page_v2.png");
  await page.screenshot({ path: landingPath, fullPage: false });
  console.log(`[SUCCESS] Saved landing_page_v2.png (${fs.statSync(landingPath).size} bytes)`);

  // 2. Studio Builder (http://localhost:3000/builder)
  console.log("\n--- Capturing 2. Studio Builder ---");
  await page.goto(`${baseURL}/builder`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await dismissModals();
  const builderPath = path.join(TARGET_DIR, "builder_v2.png");
  await page.screenshot({ path: builderPath, fullPage: false });
  console.log(`[SUCCESS] Saved builder_v2.png (${fs.statSync(builderPath).size} bytes)`);

  // 3. Candidate Form Editor tab ('Édition')
  console.log("\n--- Capturing 3. Candidate Form Editor tab ---");
  // Make sure we are on /builder
  if (!page.url().includes("/builder")) {
    await page.goto(`${baseURL}/builder`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
  }
  await dismissModals();

  console.log("Locating and clicking 'Édition' view button...");
  const editTab = page.locator("button", { hasText: "Édition" }).first();
  if (await editTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await editTab.click();
    console.log("Clicked 'Édition' button successfully.");
  } else {
    console.log("Trying alternative selector for Édition button...");
    const altTab = page.locator("button:has-text('Edition'), [data-tab='edit']").first();
    if (await altTab.isVisible().catch(() => false)) {
      await altTab.click();
    }
  }
  await page.waitForTimeout(2000);
  const editorPath = path.join(TARGET_DIR, "editor_v2.png");
  await page.screenshot({ path: editorPath, fullPage: false });
  console.log(`[SUCCESS] Saved editor_v2.png (${fs.statSync(editorPath).size} bytes)`);

  // 4. Recruiter Search (http://localhost:3000/recruiter/search)
  console.log("\n--- Capturing 4. Recruiter Search ---");
  await page.goto(`${baseURL}/recruiter/search`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await dismissModals();
  const recruiterPath = path.join(TARGET_DIR, "recruiter_v2.png");
  await page.screenshot({ path: recruiterPath, fullPage: false });
  console.log(`[SUCCESS] Saved recruiter_v2.png (${fs.statSync(recruiterPath).size} bytes)`);

  // 5. Admin Dashboard (http://localhost:3000/admin)
  console.log("\n--- Capturing 5. Admin Dashboard ---");
  await page.goto(`${baseURL}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await dismissModals();
  const adminPath = path.join(TARGET_DIR, "admin_v2.png");
  await page.screenshot({ path: adminPath, fullPage: false });
  console.log(`[SUCCESS] Saved admin_v2.png (${fs.statSync(adminPath).size} bytes)`);

  await browser.close();
  console.log("\n=============================================");
  console.log("ALL 5 SCREENSHOTS CAPTURED SUCCESSFULLY!");
  console.log("=============================================");
})();

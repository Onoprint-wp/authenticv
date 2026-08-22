import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const TARGET_DIR = `C:\\Users\\PcGamerCm\\.gemini\\antigravity\\brain\\a7e5b65f-783d-41b8-bfd9-8c3a55275ea2\\screenshots`;

test.use({
  viewport: { width: 1440, height: 900 },
  storageState: path.join(__dirname, ".auth", "user.json"),
});

test("Capture all 5 requested screenshots in 1440x900 resolution", async ({ page }) => {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // 1. Landing Page
  console.log("Navigating to Landing Page...");
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const landingPath = path.join(TARGET_DIR, "landing_page_v2.png");
  await page.screenshot({ path: landingPath, fullPage: false });
  console.log(`Saved Landing Page screenshot to ${landingPath}`);

  // 2. Studio Builder
  console.log("Navigating to Studio Builder...");
  await page.goto("/builder", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const builderPath = path.join(TARGET_DIR, "builder_v2.png");
  await page.screenshot({ path: builderPath, fullPage: false });
  console.log(`Saved Builder screenshot to ${builderPath}`);

  // 3. Candidate Form Editor tab ('Édition')
  console.log("Switching to Candidate Form Editor ('Édition') tab...");
  const editTabButton = page.locator("button", { hasText: "Édition" }).first();
  if (await editTabButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await editTabButton.click();
    await page.waitForTimeout(1500);
  } else {
    console.warn("Could not find 'Édition' button, searching alternative selectors...");
    const altButton = page.locator("button:has-text('Edition'), [data-tab='edit']").first();
    if (await altButton.isVisible().catch(() => false)) {
      await altButton.click();
      await page.waitForTimeout(1500);
    }
  }
  const editorPath = path.join(TARGET_DIR, "editor_v2.png");
  await page.screenshot({ path: editorPath, fullPage: false });
  console.log(`Saved Editor screenshot to ${editorPath}`);

  // 4. Recruiter Search
  console.log("Navigating to Recruiter Search...");
  await page.goto("/recruiter/search", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const recruiterPath = path.join(TARGET_DIR, "recruiter_v2.png");
  await page.screenshot({ path: recruiterPath, fullPage: false });
  console.log(`Saved Recruiter screenshot to ${recruiterPath}`);

  // 5. Admin Dashboard
  console.log("Navigating to Admin Dashboard...");
  await page.goto("/admin", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const adminPath = path.join(TARGET_DIR, "admin_v2.png");
  await page.screenshot({ path: adminPath, fullPage: false });
  console.log(`Saved Admin screenshot to ${adminPath}`);

  // Verify all files exist
  const files = ["landing_page_v2.png", "builder_v2.png", "editor_v2.png", "recruiter_v2.png", "admin_v2.png"];
  for (const f of files) {
    const full = path.join(TARGET_DIR, f);
    expect(fs.existsSync(full)).toBe(true);
    const stats = fs.statSync(full);
    console.log(`File: ${f}, Size: ${stats.size} bytes`);
  }
});

import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, ".auth/user.json");

/**
 * Auth setup: runs ONCE before all tests.
 * Saves the authenticated session to .auth/user.json
 * so all other tests reuse it without re-logging in.
 */
setup("authenticate", async ({ page }) => {
  // Ensure .auth directory exists
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in environment"
    );
  }

  // Navigate to login
  await page.goto("/login");

  // Wait for the page to be fully loaded
  await page.waitForLoadState("networkidle");

  // Wait for form to be ready — sélecteurs confirmés depuis src/app/login/page.tsx
  await page.waitForSelector("#email", { state: "visible", timeout: 30_000 });

  await page.fill("#email", email);
  await page.fill("#password", password);

  // Click login (formAction Supabase server action)
  await page.click("#login-btn");

  // Wait for redirect — either /builder (success) or /login?error (failure)
  await page.waitForURL(
    (url) => url.pathname.includes("/builder") || url.search.includes("error"),
    { timeout: 30_000 }
  );

  const currentUrl = page.url();
  if (currentUrl.includes("error")) {
    throw new Error(`Login failed — redirected to: ${currentUrl}`);
  }

  // Confirm we're on /builder
  await expect(page).toHaveURL(/builder/);

  // Save authenticated state
  await page.context().storageState({ path: authFile });

  console.log("✅ Auth session saved to", authFile);
  console.log("✅ Logged in as:", email);
});

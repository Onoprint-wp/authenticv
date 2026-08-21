import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Charger .env.test ou .env.local selon l'environnement
dotenv.config({ path: path.resolve(__dirname, ".env.test") });
dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: false });

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const isExternalUrl = baseURL.startsWith("https://");

export default defineConfig({
  testDir: "./tests",
  timeout: 180_000,       // 180s pour production LLM streaming (Vercel maxDuration=120s + marge)
  expect: { timeout: 20_000 },
  fullyParallel: false,   // tests séquentiels : partagent la DB Supabase
  retries: 1,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { outputFolder: "tests/report", open: "never" }],
  ],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "fr-FR",
    // Passer les vars d'env au navigateur si nécessaire
    extraHTTPHeaders: {},
  },

  projects: [
    // 1. Setup : crée la session Supabase une seule fois
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { storageState: undefined },
    },

    // 2. Bloc 0 (landing page) — PAS de session nécessaire
    {
      name: "bloc0-landing",
      testMatch: /bloc0-.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // 3. Bloc 1 & 8 (auth guards / public pricing flows) — PAS de session
    {
      name: "bloc1-noauth",
      testMatch: /bloc[18]-.*\.spec\.ts/,
      grepInvert: /Avec Session/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
      dependencies: ["setup"],
    },

    // 4. Bloc 3 API (tests sans auth) — PAS de session
    {
      name: "bloc3-api-noauth",
      testMatch: /bloc3-api\.spec\.ts/,
      testIgnore: [],
      grep: /sans auth/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
      dependencies: ["setup"],
    },

    // 5. Blocs avec session (Blocs 2 à 10)
    {
      name: "blocs-with-auth",
      testMatch: /bloc(10|[2-9])-.*\.spec\.ts/,
      grepInvert: /sans auth|Sans Session/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "tests/.auth/user.json"),
      },
      dependencies: ["setup"],
    },
  ],
  webServer: isExternalUrl ? undefined : {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

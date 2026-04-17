import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Charger .env.test ou .env.local selon l'environnement
dotenv.config({ path: path.resolve(__dirname, ".env.test") });
dotenv.config({ path: path.resolve(__dirname, ".env.local"), override: false });

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,        // 90s pour laisser le temps au LLM de streamer
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

    // 2. Bloc 1 (auth guards) — PAS de session
    {
      name: "bloc1-noauth",
      testMatch: /bloc1-auth\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
      dependencies: ["setup"],
    },

    // 3. Blocs 2, 4, 5, 6 — AVEC session
    {
      name: "blocs-with-auth",
      testMatch: /bloc[2456]-.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "tests/.auth/user.json"),
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

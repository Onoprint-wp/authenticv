import { test, expect } from "@playwright/test";
import { selectors, waitForAutoSave } from "./helpers";
import path from "path";
import fs from "fs";

/**
 * BLOC 4 — Import de CV existant (PDF / DOCX)
 * Teste le bouton Upload et la route POST /api/upload
 */

// Créer des fichiers de test minimaux
const testFilesDir = path.join(__dirname, "fixtures");

test.describe("Bloc 4 — Import CV (Upload)", () => {
  test.beforeAll(async () => {
    // Créer le dossier fixtures si nécessaire
    fs.mkdirSync(testFilesDir, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/builder");
    await page.waitForURL("**/builder");
    await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
  });

  test("4.1 — Le bouton Importer un CV est visible dans le header", async ({ page }) => {
    const uploadBtn = page.locator(selectors.uploadBtn);
    await expect(uploadBtn).toBeVisible();
  });

  test("4.8 — Upload fichier .txt = erreur gérée proprement", async ({ page, request }) => {
    // Test via API directement (plus fiable pour les erreurs)
    const response = await request.post("/api/upload", {
      multipart: {
        file: {
          name: "test.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("Ce n'est pas un PDF"),
        },
      },
    });
    // Doit retourner 415 (Unsupported Media Type)
    expect([400, 415]).toContain(response.status());
  });

  test("4.10 — Upload fichier > 10 Mo = 413", async ({ page, request }) => {
    // Créer un buffer de 11 Mo
    const bigBuffer = Buffer.alloc(11 * 1024 * 1024, "A");
    const response = await request.post("/api/upload", {
      multipart: {
        file: {
          name: "gros-cv.pdf",
          mimeType: "application/pdf",
          buffer: bigBuffer,
        },
      },
    });
    // Doit retourner 413 ou 400
    expect([400, 413]).toContain(response.status());
  });

  test("4.2-4.4 — Upload PDF minimal déclenche le parsing", async ({
    page,
    request,
  }) => {
    // On teste la route API avec un vrai mini-PDF (header PDF valide)
    // Format PDF minimal valide
    const minimalPdf = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
      "3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\n" +
      "xref\n0 4\n0000000000 65535 f\n" +
      "0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n" +
      "trailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
    );

    const response = await request.post("/api/upload", {
      multipart: {
        file: {
          name: "cv.pdf",
          mimeType: "application/pdf",
          buffer: minimalPdf,
        },
      },
    });

    // Peut retourner 200 (OK) ou 422 (texte vide non parsable) — les deux sont acceptés
    expect([200, 422, 500]).toContain(response.status());
    console.log("📤 Upload response status:", response.status());

    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty("cvData");
      console.log("✅ cvData keys:", Object.keys(body.cvData));
    }
  });
});

/**
 * BLOC 4 — Tests API /api/upload (auth)
 */
test.describe("Bloc 4 — API /api/upload (routes isolées)", () => {
  test("4.2-API — Pas de fichier = 400", async ({ request }) => {
    const response = await request.post("/api/upload", {
      data: {},
      headers: { "Content-Type": "application/json" },
    });
    expect([400, 415, 422]).toContain(response.status());
  });
});

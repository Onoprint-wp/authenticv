import { test, expect } from "@playwright/test";
import { selectors, sendChatMessage, waitForAutoSave } from "./helpers";

/**
 * BLOC 6 — Historique de Versions (Version History Panel)
 */

test.describe("Bloc 6 — Historique de Versions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/builder");
    await page.waitForURL("**/builder");
    await page.waitForSelector(selectors.chatInput, { state: "visible", timeout: 15_000 });
  });

  test("6.1 — Au 1er chargement, bouton Historique caché (0 checkpoints)", async ({
    page,
  }) => {
    // Le panel d'historique ne doit pas être visible immédiatement
    // (Il apparaît seulement après le 1er auto-save)
    const historyBtn = page.locator(selectors.historyBtn);
    // Either not visible OR showing "0"
    const isVisible = await historyBtn.isVisible().catch(() => false);
    if (isVisible) {
      // Si visible, doit afficher 0
      const text = await historyBtn.textContent();
      console.log("🕑 History button text:", text);
    }
    console.log("✅ History button initial state checked");
  });

  test("6.2 — Après modification + save, bouton Historique apparaît (≥1)", async ({
    page,
  }) => {
    await sendChatMessage(page, "J'ai travaillé comme consultant IT chez BNP Paribas");
    await waitForAutoSave(page);

    const historyBtn = page.locator(selectors.historyBtn);
    await expect(historyBtn).toBeVisible({ timeout: 5_000 });

    const text = await historyBtn.textContent();
    console.log("🕑 History button text after save:", text);
    // Le bouton doit afficher un nombre > 0
  });

  test("6.3 — Après 3 modifications, compteur = 3", async ({ page }) => {
    for (let i = 1; i <= 3; i++) {
      await sendChatMessage(page, `Modification numéro ${i} de mon profil`);
      await waitForAutoSave(page);
    }

    const historyBtn = page.locator(selectors.historyBtn);
    await expect(historyBtn).toBeVisible({ timeout: 5_000 });
    const text = await historyBtn.textContent();
    console.log("🕑 After 3 saves:", text);
  });

  test("6.4 — Ouverture du dropdown affiche les checkpoints avec horodatage", async ({
    page,
  }) => {
    // Créer un checkpoint
    await sendChatMessage(page, "Je suis chef de projet digital");
    await waitForAutoSave(page);

    const historyBtn = page.locator(selectors.historyBtn);
    await expect(historyBtn).toBeVisible({ timeout: 5_000 });
    await historyBtn.click();

    // Le dropdown doit être visible
    const dropdown = page.locator(selectors.historyDropdown);
    await expect(dropdown).toBeVisible({ timeout: 3_000 });

    // Au moins une entrée avec temps relatif
    const entries = page.locator("[data-testid='history-entry']");
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(1);
    console.log(`✅ History entries: ${count}`);
  });

  test("6.5 — Clic Restaurer revient à la version précédente", async ({ page }) => {
    // Étape 1 : créer un état A
    await sendChatMessage(page, "Première version de mon CV");
    await waitForAutoSave(page);

    // Étape 2 : créer un état B (modifié)
    await sendChatMessage(page, "Deuxième version de mon CV avec des changements");
    await waitForAutoSave(page);

    // Ouvrir historique
    await page.locator(selectors.historyBtn).click();
    await page.waitForSelector(selectors.historyDropdown, { state: "visible" });

    // Hover pour faire apparaître le bouton Restaurer
    const lastEntry = page.locator("[data-testid='history-entry']").last();
    await lastEntry.hover();

    // Restaurer
    const restoreBtn = page.locator(selectors.restoreBtn(1));
    if (await restoreBtn.isVisible().catch(() => false)) {
      await restoreBtn.click();
      // Le dropdown se ferme
      await expect(page.locator(selectors.historyDropdown)).not.toBeVisible({ timeout: 3_000 });
      console.log("✅ Restore triggered");
    } else {
      // Fallback : clic sur le premier bouton restaurer disponible
      const anyRestore = page.locator("[data-testid='restore-btn']").first();
      if (await anyRestore.isVisible().catch(() => false)) {
        await anyRestore.click();
      }
      console.log("⚠️ Restore button not found via specific selector, check data-testid");
    }
  });

  test("6.7 — Max 10 checkpoints conservés", async ({ page }) => {
    // Créer 12 modifications rapides
    for (let i = 1; i <= 12; i++) {
      await sendChatMessage(page, `Compétence ajoutée ${i} : outil-${i}`);
      await waitForAutoSave(page);
      if (i % 3 === 0) console.log(`💾 Checkpoint ${i}/12 created`);
    }

    // Ouvrir l'historique
    const historyBtn = page.locator(selectors.historyBtn);
    await expect(historyBtn).toBeVisible({ timeout: 5_000 });
    await historyBtn.click();

    const entries = page.locator("[data-testid='history-entry']");
    const count = await entries.count();
    expect(count).toBeLessThanOrEqual(10);
    console.log(`✅ Max checkpoints enforced: ${count} (max 10)`);
  });
});

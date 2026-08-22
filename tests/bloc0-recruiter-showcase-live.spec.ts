import { test, expect } from "@playwright/test";

test.describe("Vérifications Recruteurs & Showcase Vidéo", () => {
  test("1.1 — Redirection de /recruteurs vers /recruiter", async ({ page }) => {
    await page.goto("/recruteurs", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/recruiter");
    console.log("✅ Redirection /recruteurs ->", page.url());
  });

  test("1.2 — Redirection de /recruteurs/search vers /recruiter/search", async ({ page }) => {
    await page.goto("/recruteurs/search", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/recruiter/search");
    console.log("✅ Redirection /recruteurs/search ->", page.url());
  });

  test("2.1 — Showcase Vidéo : Onglet Entreprises & Recruteurs et Bouton Accéder à la CVthèque", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Localiser la section Showcase Vidéo
    const showcaseBadge = page.locator("text=L'Écosystème AuthentiCV en Action");
    await expect(showcaseBadge).toBeVisible();

    // Cliquer sur l'onglet Entreprises & Recruteurs
    const recruiterTabBtn = page.locator("button", { hasText: "Entreprises & Recruteurs" });
    await expect(recruiterTabBtn).toBeVisible();
    await recruiterTabBtn.click();

    // Vérifier le contenu de l'onglet Recruteur
    const recruiterHeadline = page.locator("text=Sorcez les meilleurs profils vérifiés d'Afrique francophone");
    await expect(recruiterHeadline).toBeVisible();

    const benefitText = page.locator("text=Filtres précis par métropoles africaines & compétences");
    await expect(benefitText).toBeVisible();

    // Vérifier le bouton Accéder à la CVthèque
    const cvthequeBtn = page.locator("a", { hasText: "Accéder à la CVthèque" });
    await expect(cvthequeBtn).toBeVisible();
    await expect(cvthequeBtn).toHaveAttribute("href", "/recruiter");

    // Cliquer sur Accéder à la CVthèque
    await cvthequeBtn.click();
    await page.waitForURL(url => url.pathname.includes("/recruiter"), { timeout: 10_000 });
    expect(page.url()).toContain("/recruiter");
    console.log("✅ Navigation réussie vers", page.url());
  });
});

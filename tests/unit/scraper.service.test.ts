import { describe, it, expect } from "vitest";
import { ScraperService } from "@/services/scraper.service";

describe("ScraperService — Sécurité SSRF, Anti-AuthWall & Parsing", () => {
  describe("Protection SSRF (isPrivateOrLocalHost)", () => {
    it("bloque localhost, loopback et cloud metadata", () => {
      expect(ScraperService.isPrivateOrLocalHost("localhost")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("127.0.0.1")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("0.0.0.0")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("::1")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("169.254.169.254")).toBe(true);
    });

    it("bloque les réseaux privés RFC 1918", () => {
      expect(ScraperService.isPrivateOrLocalHost("10.0.0.15")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("192.168.1.100")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("172.16.0.5")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("172.31.255.255")).toBe(true);
    });

    it("bloque les suffixes internes .local et .internal", () => {
      expect(ScraperService.isPrivateOrLocalHost("api.production.internal")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("server.company.local")).toBe(true);
      expect(ScraperService.isPrivateOrLocalHost("my-site.test")).toBe(true);
    });

    it("autorise les noms d'hôtes publics légitimes", () => {
      expect(ScraperService.isPrivateOrLocalHost("github.com")).toBe(false);
      expect(ScraperService.isPrivateOrLocalHost("portfolio.alexis.cm")).toBe(false);
      expect(ScraperService.isPrivateOrLocalHost("mon-site-pro.com")).toBe(false);
    });
  });

  describe("Détection des Plateformes Fermées (AuthWall)", () => {
    it("détecte LinkedIn et propose l'export PDF ou copier-coller", () => {
      const res = ScraperService.detectProtectedPlatform("www.linkedin.com");
      expect(res.isProtected).toBe(true);
      expect(res.platform).toBe("LinkedIn");
      expect(res.guidance).toContain("LinkedIn");
      expect(res.guidance).toContain("PDF");
    });

    it("détecte Facebook et Instagram et propose le copier-coller", () => {
      const fb = ScraperService.detectProtectedPlatform("facebook.com");
      expect(fb.isProtected).toBe(true);
      expect(fb.platform).toBe("Facebook");

      const insta = ScraperService.detectProtectedPlatform("instagram.com");
      expect(insta.isProtected).toBe(true);
      expect(insta.platform).toBe("Instagram");
    });

    it("laisse passer les sites personnels et portfolios ouverts", () => {
      const res = ScraperService.detectProtectedPlatform("alex-portfolio.dev");
      expect(res.isProtected).toBe(false);
    });
  });

  describe("Nettoyage HTML (cleanHtmlToText)", () => {
    it("supprime les scripts, styles, et extrait le texte structuré", () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Mon Profil</title>
            <style>body { font-size: 16px; }</style>
            <script>console.log("analytics");</script>
          </head>
          <body>
            <header>Menu navigation</header>
            <main>
              <h1>Marc Mbarga</h1>
              <p>Directeur des Opérations avec 8 ans d'expérience.</p>
              <h2>Compétences clés</h2>
              <ul>
                <li>Logistique & Supply Chain</li>
                <li>Management d'équipe</li>
              </ul>
            </main>
            <footer>Copyright 2026</footer>
          </body>
        </html>
      `;

      const text = ScraperService.cleanHtmlToText(html);
      expect(text).toContain("Marc Mbarga");
      expect(text).toContain("Directeur des Opérations");
      expect(text).toContain("Compétences clés");
      expect(text).toContain("Logistique & Supply Chain");
      expect(text).not.toContain("console.log");
      expect(text).not.toContain("font-size");
      expect(text).not.toContain("<main>");
    });
  });

  describe("Validation extractPublicProfile", () => {
    it("rejette immédiatement une IP SSRF locale sans faire de requête", async () => {
      const result = await ScraperService.extractPublicProfile("http://127.0.0.1:8080/admin");
      expect(result.status).toBe("ssrf_rejected");
      expect(result.error).toContain("Accès refusé");
    });

    it("intercepte immédiatement une URL LinkedIn avec guidance", async () => {
      const result = await ScraperService.extractPublicProfile("https://www.linkedin.com/in/jean-dupont");
      expect(result.status).toBe("blocked_platform");
      expect(result.platform).toBe("LinkedIn");
      expect(result.guidance).toBeDefined();
    });

    it("rejette les protocoles non HTTP/HTTPS (ex: file://, ftp://)", async () => {
      const result = await ScraperService.extractPublicProfile("ftp://my-server.com/cv.pdf");
      expect(result.status).toBe("fetch_error");
      expect(result.error).toContain("protocoles");
    });
  });
});

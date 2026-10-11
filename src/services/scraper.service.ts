/**
 * Service de scraping et d'extraction de contenu web pour Coach Alex
 * Intègre une protection stricte anti-SSRF et une détection préventive
 * des plateformes avec AuthWall (LinkedIn, Facebook, Instagram).
 */

export interface ScraperResult {
  status: "success" | "blocked_platform" | "ssrf_rejected" | "fetch_error";
  url: string;
  platform?: string;
  guidance?: string;
  textContent?: string;
  error?: string;
}

export class ScraperService {
  /**
   * Vérifie si un nom d'hôte ou une IP pointe vers un réseau local ou réservé (SSRF)
   */
  static isPrivateOrLocalHost(hostname: string): boolean {
    const lower = hostname.toLowerCase().trim();

    if (
      lower === "localhost" ||
      lower === "127.0.0.1" ||
      lower === "0.0.0.0" ||
      lower === "::1" ||
      lower === "169.254.169.254" // Cloud metadata AWS/GCP
    ) {
      return true;
    }

    // Détection des adresses IPv4 privées (RFC 1918)
    const ipv4Match = lower.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const octet1 = parseInt(ipv4Match[1], 10);
      const octet2 = parseInt(ipv4Match[2], 10);
      if (octet1 === 10) return true; // 10.0.0.0/8
      if (octet1 === 127) return true; // 127.0.0.0/8
      if (octet1 === 169 && octet2 === 254) return true; // Link-local
      if (octet1 === 192 && octet2 === 168) return true; // 192.168.0.0/16
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true; // 172.16.0.0/12
    }

    // Suffixes de réseaux internes
    if (
      lower.endsWith(".local") ||
      lower.endsWith(".internal") ||
      lower.endsWith(".localhost") ||
      lower.endsWith(".test")
    ) {
      return true;
    }

    return false;
  }

  /**
   * Détecte les plateformes fermées avec mur d'authentification obligatoire
   */
  static detectProtectedPlatform(hostname: string): {
    isProtected: boolean;
    platform?: string;
    guidance?: string;
  } {
    const lower = hostname.toLowerCase();

    if (lower.includes("linkedin.com")) {
      return {
        isProtected: true,
        platform: "LinkedIn",
        guidance:
          "LinkedIn protège ses profils derrière une connexion par mot de passe. Pour remplir votre CV sans effort : téléchargez votre profil LinkedIn en PDF en 2 clics (sur votre profil LinkedIn, cliquez sur 'Plus' (...) puis 'Enregistrer au format PDF') et déposez-le avec le bouton trombone 📎, ou copiez-collez le texte brut de votre profil directement ici dans le chat !",
      };
    }

    if (lower.includes("facebook.com") || lower.includes("fb.com")) {
      return {
        isProtected: true,
        platform: "Facebook",
        guidance:
          "Facebook est un réseau privé qui ne permet pas aux outils externes de lire un profil personnel sans mot de passe. Copiez simplement le texte de votre bio ou de vos expériences et collez-le ici dans notre conversation !",
      };
    }

    if (lower.includes("instagram.com")) {
      return {
        isProtected: true,
        platform: "Instagram",
        guidance:
          "Instagram est un réseau visuel privé. Copiez le texte de votre bio ou de votre parcours et collez-le directement dans notre conversation pour que je structure votre CV !",
      };
    }

    return { isProtected: false };
  }

  /**
   * Nettoie et extrait le texte lisible d'un document HTML
   */
  static cleanHtmlToText(html: string): string {
    let cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, " ")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, " ")
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, " ");

    cleaned = cleaned
      .replace(/<\/(h[1-6]|p|div|tr|li|blockquote)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ");

    cleaned = cleaned.replace(/<[^>]+>/g, " ");

    cleaned = cleaned
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">");

    const lines = cleaned
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " "))
      .filter((line) => line.length > 0);

    return lines.join("\n").slice(0, 8000);
  }

  /**
   * Analyse et extrait le contenu textuel d'une URL publique
   */
  static async extractPublicProfile(urlStr: string): Promise<ScraperResult> {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlStr.trim());
    } catch {
      return {
        status: "fetch_error",
        url: urlStr,
        error: "URL invalide ou mal formatée.",
      };
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return {
        status: "fetch_error",
        url: urlStr,
        error: "Seuls les protocoles http:// et https:// sont supportés.",
      };
    }

    if (this.isPrivateOrLocalHost(parsedUrl.hostname)) {
      return {
        status: "ssrf_rejected",
        url: urlStr,
        error: "Accès refusé : les adresses locales ou privées sont interdites pour des raisons de sécurité.",
      };
    }

    const protectedPlatform = this.detectProtectedPlatform(parsedUrl.hostname);
    if (protectedPlatform.isProtected) {
      return {
        status: "blocked_platform",
        url: urlStr,
        platform: protectedPlatform.platform,
        guidance: protectedPlatform.guidance,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(parsedUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; AuthentiCV-Bot/1.0)",
          Accept: "text/html,application/xhtml+xml,text/plain;q=0.9",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          status: "fetch_error",
          url: urlStr,
          error: `Le site web a répondu avec le statut HTTP ${response.status}.`,
        };
      }

      const html = await response.text();
      const textContent = this.cleanHtmlToText(html);

      if (!textContent || textContent.trim().length < 50) {
        return {
          status: "fetch_error",
          url: urlStr,
          error: "La page ne contient pas suffisamment de texte lisible pour générer un CV.",
        };
      }

      return {
        status: "success",
        url: urlStr,
        textContent,
      };
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === "AbortError";
      return {
        status: "fetch_error",
        url: urlStr,
        error: isTimeout
          ? "Le site web a mis trop de temps à répondre (délai dépassé de 8 secondes)."
          : "Impossible de joindre le site web spécifié.",
      };
    }
  }
}

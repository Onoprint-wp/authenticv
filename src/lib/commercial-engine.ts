/**
 * Moteur de Calcul Automatique & Règles Commerciales CEMAC (AuthentiCV v3.5)
 * Tarification officielle, Commissions directes, Over-riding managérial,
 * Gamification & Liens de Parrainage.
 */

export const CEMAC_COUNTRIES = {
  CM: { name: "Cameroun", flag: "🇨🇲", defaultDirectorQuota: 3500000, defaultAgentQuota: 500000 },
  GA: { name: "Gabon", flag: "🇬🇦", defaultDirectorQuota: 2500000, defaultAgentQuota: 500000 },
  CG: { name: "Congo", flag: "🇨🇬", defaultDirectorQuota: 2500000, defaultAgentQuota: 500000 },
  TD: { name: "Tchad", flag: "🇹🇩", defaultDirectorQuota: 1500000, defaultAgentQuota: 500000 },
  CF: { name: "RCA", flag: "🇨🇫", defaultDirectorQuota: 1000000, defaultAgentQuota: 500000 },
  GQ: { name: "Guinée Équatoriale", flag: "🇬🇶", defaultDirectorQuota: 1500000, defaultAgentQuota: 500000 },
} as const;

export type CemacCountryCode = keyof typeof CEMAC_COUNTRIES;

/**
 * Calcul automatique des commissions en temps réel à chaque encaissement Mobile Money.
 * Règle d'or : L'over-riding de 2.5% du Directeur Pays n'est jamais déduit des 10% de l'agent.
 */
export function calculateAutomatedCommissions(amountXaf: number, hasDirector: boolean = true) {
  const agentCommissionXaf = Math.round(amountXaf * 0.10); // 10% Net Agent
  const directorOverrideXaf = hasDirector ? Math.round(amountXaf * 0.025) : 0; // 2.5% Net Directeur Pays
  const platformNetXaf = amountXaf - agentCommissionXaf - directorOverrideXaf; // Marge Brute Plateforme (~87.5%)

  return {
    amountXaf,
    agentCommissionXaf,
    directorOverrideXaf,
    platformNetXaf,
  };
}

/**
 * Moteur de Gamification & Paliers de Motivation CEMAC.
 */
export interface GamificationTier {
  tier: "bronze" | "silver" | "gold" | "diamond";
  label: string;
  badge: string;
  color: string;
  progressPercent: number;
  bonusAmountXaf: number;
  bonusEligible: boolean;
}

export function calculateGamificationStatus(totalSalesXaf: number, monthlyTargetXaf: number = 500000): GamificationTier {
  const target = monthlyTargetXaf > 0 ? monthlyTargetXaf : 500000;
  const progressPercent = Math.min(100, Math.round((totalSalesXaf / target) * 100));

  if (totalSalesXaf >= target * 2) {
    return {
      tier: "diamond",
      label: "Diamant — Élite CEMAC",
      badge: "💎",
      color: "from-purple-500 to-indigo-500",
      progressPercent: 100,
      bonusAmountXaf: 25000,
      bonusEligible: true,
    };
  }

  if (totalSalesXaf >= target) {
    return {
      tier: "gold",
      label: "Or — Club 100%",
      badge: "🥇",
      color: "from-amber-400 to-orange-500",
      progressPercent: 100,
      bonusAmountXaf: 10000,
      bonusEligible: true,
    };
  }

  if (totalSalesXaf >= target * 0.5) {
    return {
      tier: "silver",
      label: "Argent — Vendeur Confirmé",
      badge: "🥈",
      color: "from-slate-300 to-slate-400",
      progressPercent,
      bonusAmountXaf: 0,
      bonusEligible: false,
    };
  }

  return {
    tier: "bronze",
    label: "Bronze — Rookie",
    badge: "🥉",
    color: "from-amber-700 to-amber-900",
    progressPercent,
    bonusAmountXaf: 0,
    bonusEligible: false,
  };
}

/**
 * Génération automatique des liens de parrainage et message WhatsApp.
 */
export function generateReferralLinks(promoCode: string, siteUrl: string = "https://authenticv.app") {
  const code = (promoCode || "AUTHENTICV10").toUpperCase();
  const recruiterLink = `${siteUrl}/recruiter/search?ref=${code}`;
  const candidateLink = `${siteUrl}/tarifs?ref=${code}`;

  const whatsappMessage = encodeURIComponent(
    `Bonjour ! Découvrez AuthentiCV, la plateforme de recrutement et création de CV IA n°1 en zone CEMAC. Bénéficiez immédiatement de -10% avec mon code officiel : ${code}\n\n👉 Accès Recruteur B2B : ${recruiterLink}\n👉 Accès Candidat : ${candidateLink}`
  );

  return {
    promoCode: code,
    recruiterLink,
    candidateLink,
    whatsappUrl: `https://wa.me/?text=${whatsappMessage}`,
  };
}

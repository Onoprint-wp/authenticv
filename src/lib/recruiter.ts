/**
 * B2B Recruiter configuration & pricing constants
 */

export const RECRUITER_PRICES = {
  single: { amount: 5000, credits: 1, label: "1 Déblocage de contact (5 000 FCFA)" },
  pack5: { amount: 20000, credits: 5, label: "Pack 5 Déblocages (20 000 FCFA)" },
  pack15: { amount: 50000, credits: 15, label: "Pack 15 Déblocages (50 000 FCFA)" },
  monthly_pro: { amount: 75000, credits: 999, label: "Pass Recruteur Mensuel Illimité (75 000 FCFA)" },
} as const;

export type RecruiterPackType = keyof typeof RECRUITER_PRICES;

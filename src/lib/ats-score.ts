import type { CvData } from "@/store/useCvStore";

export interface AtsSuggestion {
  priority: number;
  text: string;
}

export interface AtsResult {
  score: number; // 0–100
  suggestions: AtsSuggestion[];
}

export function computeAtsScore(cv: CvData): AtsResult {
  let score = 0;
  const suggestions: AtsSuggestion[] = [];

  // 1. Identity — 25 pts
  const pi = cv.personalInfo;
  if (pi.firstName && pi.lastName) {
    score += 5;
  } else {
    suggestions.push({ priority: 1, text: "Renseignez votre nom complet (prénom + nom)" });
  }
  if (pi.email) {
    score += 5;
  } else {
    suggestions.push({ priority: 2, text: "Ajoutez votre adresse email" });
  }
  if (pi.phone) {
    score += 5;
  } else {
    suggestions.push({ priority: 6, text: "Ajoutez votre numéro de téléphone" });
  }
  if (pi.location) {
    score += 5;
  } else {
    suggestions.push({ priority: 7, text: "Indiquez votre localisation (ville, pays)" });
  }
  if (pi.title) {
    score += 5;
  } else {
    suggestions.push({ priority: 3, text: "Ajoutez un titre professionnel accrocheur" });
  }

  // 2. Résumé — 10 pts
  const summary = cv.summary ?? "";
  if (summary.length > 20) {
    score += 5;
    if (summary.length > 100) {
      score += 5;
    } else {
      suggestions.push({ priority: 8, text: "Étoffez votre résumé (100+ caractères recommandés)" });
    }
  } else {
    suggestions.push({ priority: 4, text: "Rédigez un résumé professionnel percutant" });
  }

  // 3. Expériences — 25 pts
  const experiences = cv.experiences ?? [];
  if (experiences.length > 0) {
    score += 10;
    const detailed = experiences.filter((e) => (e.description ?? "").length > 80);
    const bonus = Math.min(detailed.length, 5) * 3;
    score += bonus;
    if (bonus < 15) {
      suggestions.push({ priority: 9, text: "Détaillez vos missions avec des résultats mesurables (chiffres, impact)" });
    }
  } else {
    suggestions.push({ priority: 2, text: "Ajoutez vos expériences professionnelles" });
  }

  // 4. Formation — 10 pts
  if ((cv.education ?? []).length > 0) {
    score += 10;
  } else {
    suggestions.push({ priority: 10, text: "Ajoutez votre formation académique" });
  }

  // 5. Compétences — 15 pts
  const skills = cv.skills ?? [];
  if (skills.length > 0) {
    score += 5;
    if (skills.length >= 5) {
      score += 5;
      if (skills.length >= 10) {
        score += 5;
      } else {
        suggestions.push({ priority: 11, text: `Ajoutez plus de compétences (${skills.length}/10 recommandées)` });
      }
    } else {
      suggestions.push({ priority: 11, text: `Ajoutez plus de compétences (${skills.length}/5 recommandées)` });
    }
  } else {
    suggestions.push({ priority: 3, text: "Listez vos compétences clés (langages, outils, savoir-faire)" });
  }

  // 6. Langues — 5 pts
  if ((cv.languages ?? []).length > 0) {
    score += 5;
  } else {
    suggestions.push({ priority: 12, text: "Ajoutez les langues que vous maîtrisez" });
  }

  // 7. Extras — 10 pts
  if (pi.linkedin) {
    score += 5;
  } else {
    suggestions.push({ priority: 13, text: "Ajoutez votre profil LinkedIn" });
  }
  if ((cv.projects ?? []).length > 0 || (cv.certifications ?? []).length > 0) {
    score += 5;
  } else {
    suggestions.push({ priority: 14, text: "Ajoutez des projets ou certifications pour vous démarquer" });
  }

  suggestions.sort((a, b) => a.priority - b.priority);
  return { score: Math.min(score, 100), suggestions };
}

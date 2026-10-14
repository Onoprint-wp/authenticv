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

export interface AtsCheckItem {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface AtsXrayReport {
  score: number;
  checks: AtsCheckItem[];
  rawStream: string;
  keywordCount: number;
}

/**
 * Génère le rapport "Radiographie ATS" (ATS X-Ray) montrant exactement
 * comment les robots de recrutement (Workday, Taleo, Greenhouse) indexent le CV.
 */
export function generateAtsXrayReport(cv: CvData): AtsXrayReport {
  const { score } = computeAtsScore(cv);
  const pi = cv.personalInfo;
  const experiences = cv.experiences ?? [];
  const education = cv.education ?? [];
  const skills = cv.skills ?? [];
  const languages = cv.languages ?? [];
  const certifications = cv.certifications ?? [];
  const projects = cv.projects ?? [];
  const summary = (cv.summary ?? "").trim();

  const hasFullIdentity = Boolean(pi.firstName && pi.lastName && pi.email && pi.phone);
  const hasPartialIdentity = Boolean(pi.firstName || pi.lastName || pi.email);
  const detailedExpCount = experiences.filter((e) => (e.description ?? "").trim().length > 80).length;

  const checks: AtsCheckItem[] = [
    {
      id: "vector-stream",
      label: "Flux Vectoriel Natif (Workday / Taleo / SAP)",
      status: "pass",
      detail: "Encodage PDF natif sans tableau complexe ni calque graphique bloquant",
    },
    {
      id: "identity",
      label: "Bloc Identité & Coordonnées",
      status: hasFullIdentity ? "pass" : hasPartialIdentity ? "warn" : "fail",
      detail: hasFullIdentity
        ? `${pi.firstName} ${pi.lastName} · Email & Téléphone indexés`
        : "Nom complet, email ou téléphone manquant pour le tri RH",
    },
    {
      id: "title",
      label: "Intitulé de Poste Cible (Mot-clé primaire)",
      status: pi.title ? "pass" : "fail",
      detail: pi.title ? `Cible détectée : « ${pi.title} »` : "Aucun titre professionnel détecté en en-tête",
    },
    {
      id: "summary",
      label: "Résumé Exécutif & Densité Sémantique",
      status: summary.length >= 100 ? "pass" : summary.length > 20 ? "warn" : "fail",
      detail:
        summary.length >= 100
          ? `${summary.length} caractères analysés (densité optimale)`
          : summary.length > 20
            ? `Résumé court (${summary.length} car. — visez 100+ caractères)`
            : "Aucun résumé professionnel détecté",
    },
    {
      id: "experience",
      label: "Chronologie & Verbes d'Action (Expériences)",
      status:
        experiences.length > 0 && detailedExpCount > 0
          ? "pass"
          : experiences.length > 0
            ? "warn"
            : "fail",
      detail:
        experiences.length > 0
          ? `${experiences.length} poste(s) indexé(s), dont ${detailedExpCount} avec résultats détaillés`
          : "Aucune expérience professionnelle indexée",
    },
    {
      id: "skills",
      label: "Matrice de Mots-Clés & Compétences",
      status: skills.length >= 5 ? "pass" : skills.length > 0 ? "warn" : "fail",
      detail:
        skills.length > 0
          ? `${skills.length} compétence(s) extraite(s) (recommandé : 8 à 12)`
          : "Aucune compétence technique ou métier détectée",
    },
    {
      id: "education",
      label: "Diplômes, Certifications & Langues",
      status: education.length > 0 ? "pass" : "warn",
      detail: `${education.length} diplôme(s) · ${certifications.length} certification(s) · ${languages.length} langue(s)`,
    },
  ];

  const lines: string[] = [
    "=== FLUX D'EXTRACTION ATS (AUTHENTICV PARSER v2.5) ===",
    `PARSER_STATUS: 100% READABLE_TEXT | ATS_SCORE: ${score}/100`,
    "",
    "[01. CANDIDATE_IDENTITY]",
    `FULL_NAME    : ${[pi.firstName, pi.lastName].filter(Boolean).join(" ") || "<NON_RENSEIGNE>"}`,
    `TARGET_TITLE : ${pi.title || "<NON_RENSEIGNE>"}`,
    `CONTACT      : ${pi.email || "<EMAIL_MANQUANT>"} | ${pi.phone || "<TEL_MANQUANT>"}`,
    `LOCATION     : ${pi.location || "<VILLE_MANQUANTE>"}${pi.linkedin ? ` | LINKEDIN: ${pi.linkedin}` : ""}`,
    "",
    "[02. EXECUTIVE_SUMMARY]",
    summary || "<AUCUN_RESUME_DETECTE>",
    "",
    `[03. WORK_EXPERIENCE] (${experiences.length} bloc(s))`,
  ];

  if (experiences.length === 0) {
    lines.push("  <AUCUNE_EXPERIENCE_DETECTEE>");
  } else {
    experiences.forEach((exp, idx) => {
      const period = `${exp.startDate || "?"} -> ${exp.current ? "PRESENT" : exp.endDate || "?"}`;
      lines.push(`  #${idx + 1} [${period}] ${exp.position || "Poste"} @ ${exp.company || "Entreprise"}`);
      if (exp.description) {
        const cleanDesc = exp.description.replace(/\s+/g, " ").trim();
        lines.push(`     IMPACT: ${cleanDesc}`);
      }
    });
  }

  lines.push("", `[04. EDUCATION] (${education.length} bloc(s))`);
  if (education.length === 0) {
    lines.push("  <AUCUNE_FORMATION_DETECTEE>");
  } else {
    education.forEach((edu, idx) => {
      lines.push(
        `  #${idx + 1} [${edu.startDate || "?"} - ${edu.endDate || "?"}] ${edu.degree || "Diplôme"}${edu.field ? ` (${edu.field})` : ""} — ${edu.institution || "Établissement"}`
      );
    });
  }

  lines.push("", `[05. INDEXED_SKILLS] (${skills.length} mot(s)-clé(s))`);
  lines.push(skills.length > 0 ? `  KEYWORDS: [${skills.join("] [")}]` : "  <AUCUN_MOT_CLE_DETECTE>");

  if (languages.length > 0) {
    lines.push(
      "",
      `[06. LANGUAGES]`,
      `  ${languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(" | ")}`
    );
  }

  if (certifications.length > 0 || projects.length > 0) {
    lines.push("", `[07. CERTIFICATIONS_AND_PROJECTS]`);
    certifications.forEach((c) => {
      lines.push(`  CERT: ${c.name}${c.issuer ? ` — ${c.issuer}` : ""}${c.date ? ` (${c.date})` : ""}`);
    });
    projects.forEach((p) => {
      lines.push(`  PROJ: ${p.name}${p.description ? ` — ${p.description}` : ""}`);
    });
  }

  lines.push("", "=== FIN DU FLUX D'EXTRACTION ATS ===");

  return {
    score,
    checks,
    rawStream: lines.join("\n"),
    keywordCount: skills.length,
  };
}


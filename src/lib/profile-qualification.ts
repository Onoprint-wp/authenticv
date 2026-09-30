import type { CvData } from "@/lib/schemas/cv.schema";

export interface ProfileCompletenessResult {
  score: number; // 0 to 100
  missing: string[];
  isQualified: boolean;
  sections: {
    identity: boolean;
    title: boolean;
    contact: boolean;
    summary: boolean;
    experienceOrProject: boolean;
    education: boolean;
    skills: boolean;
  };
}

/**
 * Pure business logic defining whether a candidate profile is "Qualified" (has real recruitment value).
 *
 * Requirements for a Qualified Profile in AuthentiCV:
 * 1. Identity: First name and last name provided.
 * 2. Professional Target: Job title provided.
 * 3. Contact: Email or Phone provided.
 * 4. Experience or Projects: At least 1 experience (with title & company) OR 1 documented project.
 * 5. Skills: At least 3 skills listed.
 * 6. Education: At least 1 education entry (with institution & degree).
 */
export function isQualifiedCandidateProfile(cv?: CvData | null): boolean {
  if (!cv) return false;
  const pi = cv.personalInfo;
  if (!pi) return false;

  const hasName = Boolean(pi.firstName?.trim() && pi.lastName?.trim());
  const hasTitle = Boolean(pi.title?.trim());
  const hasContact = Boolean(pi.email?.trim() || pi.phone?.trim());

  const hasExperience = Array.isArray(cv.experiences) && cv.experiences.some(
    (e) => Boolean(e.position?.trim() && e.company?.trim())
  );
  const hasProject = Array.isArray(cv.projects) && cv.projects.some(
    (p) => Boolean(p.name?.trim())
  );
  const hasExperienceOrProject = hasExperience || hasProject;

  const hasSkills = Array.isArray(cv.skills) && cv.skills.filter((s) => Boolean(s?.trim())).length >= 3;

  const hasEducation = Array.isArray(cv.education) && cv.education.some(
    (e) => Boolean(e.institution?.trim() && e.degree?.trim())
  );

  return hasName && hasTitle && hasContact && hasExperienceOrProject && hasSkills && hasEducation;
}

/**
 * Computes profile completeness score (0-100%) and missing elements.
 */
export function computeProfileCompleteness(cv?: CvData | null): ProfileCompletenessResult {
  if (!cv || !cv.personalInfo) {
    return {
      score: 0,
      missing: ["Nom et prénom", "Titre professionnel", "Contact (email/téléphone)", "Expérience ou projet", "Formation", "Compétences (min. 3)"],
      isQualified: false,
      sections: {
        identity: false,
        title: false,
        contact: false,
        summary: false,
        experienceOrProject: false,
        education: false,
        skills: false,
      },
    };
  }

  const pi = cv.personalInfo;
  const missing: string[] = [];
  let score = 0;

  // 1. Identity (20 pts)
  const hasIdentity = Boolean(pi.firstName?.trim() && pi.lastName?.trim());
  if (hasIdentity) score += 20;
  else missing.push("Prénom et Nom");

  // 2. Title (10 pts)
  const hasTitle = Boolean(pi.title?.trim());
  if (hasTitle) score += 10;
  else missing.push("Titre professionnel");

  // 3. Contact (10 pts)
  const hasEmail = Boolean(pi.email?.trim());
  const hasPhone = Boolean(pi.phone?.trim());
  const hasContact = hasEmail || hasPhone;
  if (hasContact) {
    score += 10;
  } else {
    missing.push("Email ou Téléphone");
  }

  // 4. Summary (10 pts)
  const hasSummary = Boolean(cv.summary && cv.summary.trim().length >= 25);
  if (hasSummary) score += 10;
  else missing.push("Résumé professionnel (min. 25 car.)");

  // 5. Experience or Project (25 pts)
  const hasExperience = Array.isArray(cv.experiences) && cv.experiences.some(
    (e) => Boolean(e.position?.trim() && e.company?.trim())
  );
  const hasProject = Array.isArray(cv.projects) && cv.projects.some(
    (p) => Boolean(p.name?.trim())
  );
  const hasExperienceOrProject = hasExperience || hasProject;
  if (hasExperienceOrProject) score += 25;
  else missing.push("Au moins 1 expérience ou projet");

  // 6. Education (15 pts)
  const hasEducation = Array.isArray(cv.education) && cv.education.some(
    (e) => Boolean(e.institution?.trim() && e.degree?.trim())
  );
  if (hasEducation) score += 15;
  else missing.push("Formation académique");

  // 7. Skills (10 pts)
  const validSkills = Array.isArray(cv.skills) ? cv.skills.filter((s) => Boolean(s?.trim())) : [];
  const hasSkills = validSkills.length >= 3;
  if (hasSkills) score += 10;
  else missing.push("Compétences (min. 3)");

  const isQualified = isQualifiedCandidateProfile(cv);

  return {
    score: Math.min(score, 100),
    missing,
    isQualified,
    sections: {
      identity: hasIdentity,
      title: hasTitle,
      contact: hasContact,
      summary: hasSummary,
      experienceOrProject: hasExperienceOrProject,
      education: hasEducation,
      skills: hasSkills,
    },
  };
}

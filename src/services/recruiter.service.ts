import { type SupabaseClient } from "@supabase/supabase-js";
import { parseCvData, type CvData } from "@/lib/schemas/cv.schema";

export interface JobMatchCriteria {
  jobTitle: string;
  requiredSkills: string[];
  location?: string;
  minYearsExperience?: number;
  jobDescription?: string;
}

export interface MatchedCandidate {
  resumeId: string;
  userId: string;
  matchScore: number; // 0–100%
  matchingSkills: string[];
  missingSkills: string[];
  anonymizedProfile: {
    displayName: string;
    title: string;
    location: string;
    summary: string;
    skills: string[];
    yearsOfExperience: number;
    experienceCount: number;
    educationDegree?: string;
  };
  isUnlocked?: boolean;
}

export class RecruiterMatchingService {
  /**
   * Calcule le score de correspondance d'un CV par rapport à une offre d'emploi.
   */
  static calculateScore(cv: CvData, criteria: JobMatchCriteria): {
    score: number;
    matchingSkills: string[];
    missingSkills: string[];
    yearsOfExperience: number;
  } {
    const candidateSkills = (cv.skills || []).map((s) => s.toLowerCase().trim());
    const required = (criteria.requiredSkills || []).map((s) => s.toLowerCase().trim());

    // 1. Compétences en commun (Poids: 50%)
    let skillScore = 0;
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    if (required.length > 0) {
      for (const req of required) {
        const found = candidateSkills.some((cs) => cs.includes(req) || req.includes(cs));
        if (found) {
          matchingSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      }
      skillScore = (matchingSkills.length / required.length) * 50;
    } else {
      skillScore = candidateSkills.length > 0 ? 30 : 0;
    }

    // 2. Adéquation du Titre / Résumé (Poids: 25%)
    let titleScore = 0;
    const candidateTitle = (cv.personalInfo.title || "").toLowerCase();
    const candidateSummary = (cv.summary || "").toLowerCase();
    const targetTitle = (criteria.jobTitle || "").toLowerCase();

    if (targetTitle && (candidateTitle.includes(targetTitle) || targetTitle.includes(candidateTitle))) {
      titleScore = 25;
    } else if (targetTitle && candidateSummary.includes(targetTitle)) {
      titleScore = 15;
    } else if (candidateTitle) {
      titleScore = 10;
    }

    // 3. Années d'expérience estimées (Poids: 15%)
    let yearsOfExperience = 0;
    for (const exp of cv.experiences || []) {
      const startYear = parseInt(exp.startDate?.slice(0, 4) || "0", 10);
      const endYear = exp.current ? new Date().getFullYear() : parseInt(exp.endDate?.slice(0, 4) || "0", 10);
      if (startYear > 1990 && endYear >= startYear) {
        yearsOfExperience += Math.max(1, endYear - startYear);
      } else {
        yearsOfExperience += 1.5; // estimation forfaitaire par expérience
      }
    }
    yearsOfExperience = Math.round(yearsOfExperience * 10) / 10;

    const minYears = criteria.minYearsExperience || 1;
    const expScore = Math.min(15, (yearsOfExperience / minYears) * 15);

    // 4. Localisation (Poids: 10%)
    let locScore = 5; // valeur par défaut
    if (criteria.location && cv.personalInfo.location) {
      if (cv.personalInfo.location.toLowerCase().includes(criteria.location.toLowerCase())) {
        locScore = 10;
      }
    }

    const totalScore = Math.min(100, Math.round(skillScore + titleScore + expScore + locScore));

    return {
      score: totalScore,
      matchingSkills,
      missingSkills,
      yearsOfExperience,
    };
  }

  /**
   * Recherche et classe les meilleurs profils candidats dans Supabase.
   */
  static async matchCandidates(
    supabase: SupabaseClient,
    criteria: JobMatchCriteria,
    limit: number = 10
  ): Promise<MatchedCandidate[]> {
    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("id, user_id, content, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error || !resumes) {
      console.error("[RecruiterMatchingService] Query Error:", error);
      return [];
    }

    const results: MatchedCandidate[] = [];

    for (const item of resumes) {
      const cvData = parseCvData(item.content);
      const { score, matchingSkills, missingSkills, yearsOfExperience } = this.calculateScore(cvData, criteria);

      // Ne retenir que les profils ayant un minimum de complétude
      if (cvData.skills.length === 0 && cvData.experiences.length === 0) continue;

      const firstName = cvData.personalInfo.firstName || "Candidat";
      const lastInitial = cvData.personalInfo.lastName ? `${cvData.personalInfo.lastName[0]}.` : "";
      const displayName = `${firstName} ${lastInitial}`.trim();

      results.push({
        resumeId: item.id,
        userId: item.user_id,
        matchScore: score,
        matchingSkills,
        missingSkills,
        anonymizedProfile: {
          displayName,
          title: cvData.personalInfo.title || "Profil Professionnel",
          location: cvData.personalInfo.location || "Non spécifiée",
          summary: cvData.summary || "",
          skills: cvData.skills,
          yearsOfExperience,
          experienceCount: cvData.experiences.length,
          educationDegree: cvData.education[0]?.degree,
        },
      });
    }

    // Tri par score décroissant et sélection du top N
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
  }
}

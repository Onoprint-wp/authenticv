import { describe, it, expect } from "vitest";
import { isQualifiedCandidateProfile, computeProfileCompleteness } from "@/lib/profile-qualification";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";

describe("Profile Qualification & Completeness", () => {
  it("returns false and 0 score for empty/default CV", () => {
    expect(isQualifiedCandidateProfile(DEFAULT_CV_DATA)).toBe(false);
    const completeness = computeProfileCompleteness(DEFAULT_CV_DATA);
    expect(completeness.isQualified).toBe(false);
    expect(completeness.score).toBe(0);
  });

  it("returns false if only identity is provided", () => {
    const cv: CvData = {
      ...DEFAULT_CV_DATA,
      personalInfo: {
        ...DEFAULT_CV_DATA.personalInfo,
        firstName: "Marc",
        lastName: "Mbarga",
        title: "Développeur Web",
        email: "marc@test.com",
      },
    };
    expect(isQualifiedCandidateProfile(cv)).toBe(false);
    const res = computeProfileCompleteness(cv);
    expect(res.score).toBe(40); // Identity 20 + Title 10 + Contact 10
    expect(res.isQualified).toBe(false);
  });

  it("qualifies a candidate with experience, 3 skills and education", () => {
    const cv: CvData = {
      ...DEFAULT_CV_DATA,
      personalInfo: {
        ...DEFAULT_CV_DATA.personalInfo,
        firstName: "Marie",
        lastName: "Dubois",
        title: "Comptable Junior",
        phone: "+237699112233",
      },
      experiences: [
        {
          id: "exp-1",
          company: "SABC",
          position: "Stagiaire Comptable",
          startDate: "2024",
          endDate: "2025",
          current: false,
          description: "Tenue des comptes",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Université de Douala",
          degree: "Licence Gestion",
          startDate: "2021",
          endDate: "2024",
        },
      ],
      skills: ["Comptabilité générale", "Excel avancé", "Sage SAARI"],
    };

    expect(isQualifiedCandidateProfile(cv)).toBe(true);
    const res = computeProfileCompleteness(cv);
    expect(res.isQualified).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(80);
  });

  it("qualifies a candidate using projects instead of formal experience", () => {
    const cv: CvData = {
      ...DEFAULT_CV_DATA,
      personalInfo: {
        ...DEFAULT_CV_DATA.personalInfo,
        firstName: "Cedric",
        lastName: "Fosso",
        title: "Développeur Frontend React",
        email: "cedric@test.com",
      },
      projects: [
        {
          id: "proj-1",
          name: "Application Mobile Money Tracker",
          description: "Création d'une application Flutter & Supabase",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "IUT de Bandjoun",
          degree: "DUT Informatique",
          startDate: "2022",
          endDate: "2024",
        },
      ],
      skills: ["React", "TypeScript", "Tailwind CSS"],
    };

    expect(isQualifiedCandidateProfile(cv)).toBe(true);
  });
});

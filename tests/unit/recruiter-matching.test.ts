import { describe, it, expect } from "vitest";
import { RecruiterMatchingService } from "@/services/recruiter.service";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";

describe("RecruiterMatchingService (Reverse ATS Candidate Matching)", () => {
  const candidateCv: CvData = {
    ...DEFAULT_CV_DATA,
    personalInfo: {
      firstName: "Fatima",
      lastName: "Ndiaye",
      email: "fatima@example.com",
      phone: "+221 77 000 00 00",
      location: "Dakar / Remote",
      linkedin: "linkedin.com/in/fatima",
      title: "Senior Fullstack Developer",
      photoUrl: "",
    },
    summary: "Développeuse Fullstack experte en React, TypeScript, Next.js et architectures Cloud.",
    skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    experiences: [
      {
        id: "exp-1",
        company: "Tech Hub",
        position: "Senior Frontend Lead",
        startDate: "2020-01",
        endDate: "2024-01",
        current: false,
        description: "Gestion de 5 développeurs React",
      },
    ],
  };

  it("should score high match when required skills match candidate profile", () => {
    const criteria = {
      jobTitle: "Senior Fullstack Developer",
      requiredSkills: ["React", "TypeScript", "Next.js", "Node.js"],
      location: "Dakar",
      minYearsExperience: 3,
    };

    const match = RecruiterMatchingService.calculateScore(candidateCv, criteria);

    expect(match.score).toBeGreaterThanOrEqual(80);
    expect(match.matchingSkills).toContain("react");
    expect(match.matchingSkills).toContain("typescript");
    expect(match.missingSkills).toHaveLength(0);
  });

  it("should detect missing skills accurately", () => {
    const criteria = {
      jobTitle: "Mobile Flutter Engineer",
      requiredSkills: ["Flutter", "Dart", "React Native"],
      minYearsExperience: 2,
    };

    const match = RecruiterMatchingService.calculateScore(candidateCv, criteria);

    expect(match.score).toBeLessThan(50);
    expect(match.missingSkills).toContain("flutter");
    expect(match.missingSkills).toContain("dart");
  });
});

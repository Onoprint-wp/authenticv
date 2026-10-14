import { describe, it, expect } from "vitest";
import { computeAtsScore, generateAtsXrayReport } from "@/lib/ats-score";
import { SECTOR_TEMPLATES, getSectorTemplate } from "@/lib/themes";
import { WELCOME_FREE_SINGLE_CREDITS } from "@/lib/plan";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";

describe("computeAtsScore & generateAtsXrayReport", () => {
  it("should return a low score and suggestions for an empty CV", () => {
    const result = computeAtsScore(DEFAULT_CV_DATA);
    expect(result.score).toBeLessThan(20);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("should calculate a high score when all sections are filled and detailed", () => {
    const completeCv: CvData = {
      ...DEFAULT_CV_DATA,
      personalInfo: {
        firstName: "Jean",
        lastName: "Ewane",
        email: "jean.ewane@example.com",
        phone: "+237 690 00 00 00",
        location: "Douala, Cameroun",
        linkedin: "linkedin.com/in/jeanewane",
        title: "Directeur Technique & Architecte Cloud",
        photoUrl: "",
      },
      summary: "Ingénieur logiciel chevronné avec plus de 10 ans d'expérience dans la conception d'architectures résilientes et la direction d'équipes pluridisciplinaires en Afrique Centrale.",
      experiences: [
        {
          id: "exp-1",
          company: "Orange Cameroun",
          position: "Lead Architect",
          startDate: "2020-01",
          endDate: "2024-01",
          current: false,
          description: "Direction technique d'une équipe de 15 ingénieurs, réduction de 40% de la dette technique et migration de l'infrastructure vers le Cloud avec 99.99% de disponibilité.",
        },
        {
          id: "exp-2",
          company: "MTN",
          position: "Senior Backend Developer",
          startDate: "2016-03",
          endDate: "2019-12",
          current: false,
          description: "Déploiement de microservices de paiement Mobile Money traitant plus de 500 000 transactions par jour avec des temps de réponse sous les 100ms.",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Polytechnique Yaoundé",
          degree: "Diplôme d'Ingénieur",
          field: "Génie Informatique",
          startDate: "2010",
          endDate: "2015",
        },
      ],
      skills: [
        "TypeScript", "Next.js", "React", "Node.js", "PostgreSQL",
        "Supabase", "Docker", "Kubernetes", "Architecture Cloud", "CI/CD"
      ],
      languages: [
        { id: "lang-1", name: "Français", level: "Natif" },
        { id: "lang-2", name: "Anglais", level: "Courant (C1)" },
      ],
      certifications: [
        { id: "cert-1", name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", date: "2023" },
      ],
      projects: [
        { id: "proj-1", name: "Plateforme Fintech", description: "Passerelle de paiement régionale", link: "https://example.com" },
      ],
      designSettings: DEFAULT_CV_DATA.designSettings,
    };

    const result = computeAtsScore(completeCv);
    expect(result.score).toBeGreaterThanOrEqual(80);

    const xray = generateAtsXrayReport(completeCv);
    expect(xray.score).toBe(result.score);
    expect(xray.checks).toHaveLength(7);
    expect(xray.checks.every((c) => c.status === "pass")).toBe(true);
    expect(xray.rawStream).toContain("Jean Ewane");
    expect(xray.rawStream).toContain("Orange Cameroun");
    expect(xray.keywordCount).toBe(10);
  });

  it("should provide 10 valid sector templates and 1 welcome free PDF credit", () => {
    expect(WELCOME_FREE_SINGLE_CREDITS).toBe(1);
    expect(SECTOR_TEMPLATES).toHaveLength(10);
    expect(getSectorTemplate("executive")?.settings.layout).toBe("classic");
    expect(getSectorTemplate("tech-data")?.settings.layout).toBe("modern");
    expect(getSectorTemplate("minimal-ats")?.settings.layout).toBe("minimal");
  });
});


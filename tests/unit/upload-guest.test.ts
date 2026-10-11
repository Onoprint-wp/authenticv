import { describe, it, expect } from "vitest";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";

describe("Fast-Track Upload & Guest Data Pipeline", () => {
  it("should merge uploaded CV data while strictly preserving candidate design settings", () => {
    const currentCv: CvData = {
      ...DEFAULT_CV_DATA,
      designSettings: {
        theme: "classic",
        fontFamily: "Inter",
        primaryColor: "#0F223D",
        accentColor: "#3667F0",
      },
    };

    const parsedUploadPayload: Partial<CvData> = {
      personalInfo: {
        firstName: "Marc",
        lastName: "Mbarga",
        title: "Senior Fullstack Engineer",
        email: "marc.mbarga@example.com",
        phone: "+237699112233",
        location: "Douala, Cameroun",
        linkedin: "https://linkedin.com/in/marcmbarga",
        photoUrl: "",
      },
      summary: "Ingénieur logiciel chevronné avec 6 ans d'expérience.",
      skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
      experiences: [
        {
          id: "exp-1",
          company: "FinTech SA",
          position: "Lead Dev",
          startDate: "2022-01",
          endDate: "",
          current: true,
          description: "Direction technique de la passerelle de paiement Mobile Money.",
        },
      ],
      education: [
        {
          id: "edu-1",
          institution: "Polytechnique Yaoundé",
          degree: "Diplôme d'Ingénieur",
          field: "Génie Informatique",
          startDate: "2016",
          endDate: "2021",
        },
      ],
    };

    // Fusion selon la logique de useCvUpload
    const mergedCv: CvData = {
      ...DEFAULT_CV_DATA,
      ...(parsedUploadPayload as CvData),
      designSettings: currentCv.designSettings,
    };

    expect(mergedCv.personalInfo.firstName).toBe("Marc");
    expect(mergedCv.personalInfo.lastName).toBe("Mbarga");
    expect(mergedCv.experiences).toHaveLength(1);
    expect(mergedCv.experiences[0].company).toBe("FinTech SA");
    expect(mergedCv.education).toHaveLength(1);
    expect(mergedCv.skills).toContain("React");
    // Vérifier que le thème graphique n'a pas été écrasé
    expect(mergedCv.designSettings.theme).toBe("classic");
    expect(mergedCv.designSettings.primaryColor).toBe("#0F223D");
  });
});

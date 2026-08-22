import { describe, it, expect } from "vitest";
import {
  CvDataSchema,
  parseCvData,
  DEFAULT_CV_DATA,
  ExperienceSchema,
} from "@/lib/schemas/cv.schema";

describe("CvDataSchema & parseCvData (Single Source of Truth)", () => {
  it("should provide default values for an empty object", () => {
    const parsed = parseCvData({});
    expect(parsed.documentTitle).toBe("Untitled CV");
    expect(parsed.personalInfo.firstName).toBe("");
    expect(parsed.experiences).toEqual([]);
    expect(parsed.skills).toEqual([]);
    expect(parsed.designSettings.colorTheme).toBe("indigo");
  });

  it("should handle null or invalid input gracefully without throwing", () => {
    const fromNull = parseCvData(null);
    const fromUndefined = parseCvData(undefined);
    const fromString = parseCvData("invalid");

    expect(fromNull).toEqual(DEFAULT_CV_DATA);
    expect(fromUndefined).toEqual(DEFAULT_CV_DATA);
    expect(fromString).toEqual(DEFAULT_CV_DATA);
  });

  it("should preserve valid existing resume data while filling missing defaults", () => {
    const legacyResume = {
      personalInfo: {
        firstName: "Alex",
        lastName: "Dupont",
        email: "alex@example.com",
      },
      experiences: [
        {
          id: "exp-1",
          company: "Tech Corp",
          position: "Frontend Dev",
          startDate: "2022-01",
          description: "Développement React",
        },
      ],
    };

    const parsed = parseCvData(legacyResume);
    expect(parsed.personalInfo.firstName).toBe("Alex");
    expect(parsed.personalInfo.lastName).toBe("Dupont");
    expect(parsed.personalInfo.phone).toBe(""); // Champ manquant complété
    expect(parsed.experiences).toHaveLength(1);
    expect(parsed.experiences[0].company).toBe("Tech Corp");
    expect(parsed.experiences[0].current).toBe(false); // Valeur par défaut
    expect(parsed.skills).toEqual([]); // Tableau par défaut
  });

  it("should validate and parse individual experience items", () => {
    const validExp = {
      id: "uuid-123",
      company: "Google",
      position: "Senior Engineer",
      startDate: "2020-01",
    };

    const parsed = ExperienceSchema.parse(validExp);
    expect(parsed.company).toBe("Google");
    expect(parsed.endDate).toBe("");
    expect(parsed.current).toBe(false);
    expect(parsed.description).toBe("");
  });
});

import { describe, it, expect } from "vitest";
import { createCvTools, deepMergeCv } from "@/lib/ai/tools/cv-tools";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";

describe("AI CV Tools & State Mutators", () => {
  it("should merge partial personal info without losing other fields", () => {
    let state: CvData = { ...DEFAULT_CV_DATA };

    state = deepMergeCv(state, {
      personalInfo: {
        ...state.personalInfo,
        firstName: "Samuel",
        lastName: "Eto'o",
      },
    });

    expect(state.personalInfo.firstName).toBe("Samuel");
    expect(state.personalInfo.lastName).toBe("Eto'o");
    expect(state.personalInfo.email).toBe(""); // Préservé
  });

  it("should execute addExperience tool and update state immutably", async () => {
    let state: CvData = { ...DEFAULT_CV_DATA };

    const applyUpdate = async (updater: (content: CvData) => CvData) => {
      state = updater(state);
      return true;
    };

    const tools = createCvTools(applyUpdate);

    // Exécuter l'outil addExperience
    await tools.addExperience.execute!(
      {
        company: "AuthentiCV",
        position: "Product Manager",
        startDate: "2024-01",
        description: "Lancement de la plateforme",
        current: true,
      },
      { toolCallId: "test-1", messages: [] }
    );

    expect(state.experiences).toHaveLength(1);
    expect(state.experiences[0].company).toBe("AuthentiCV");
    expect(state.experiences[0].position).toBe("Product Manager");
    expect(state.experiences[0].id).toBeDefined();
  });

  it("should execute setSkills tool and replace skills list", async () => {
    let state: CvData = { ...DEFAULT_CV_DATA, skills: ["JavaScript"] };

    const applyUpdate = async (updater: (content: CvData) => CvData) => {
      state = updater(state);
      return true;
    };

    const tools = createCvTools(applyUpdate);

    await tools.setSkills.execute!(
      {
        skills: ["React", "TypeScript", "Tailwind CSS"],
      },
      { toolCallId: "test-2", messages: [] }
    );

    expect(state.skills).toEqual(["React", "TypeScript", "Tailwind CSS"]);
  });

  it("should execute removeExperience tool and delete specific item", async () => {
    const expId = "target-exp-id";
    let state: CvData = {
      ...DEFAULT_CV_DATA,
      experiences: [
        {
          id: expId,
          company: "Old Company",
          position: "Intern",
          startDate: "2020",
          endDate: "2021",
          current: false,
          description: "Stage",
        },
        {
          id: "keep-exp-id",
          company: "New Company",
          position: "Dev",
          startDate: "2021",
          endDate: "",
          current: true,
          description: "CDI",
        },
      ],
    };

    const applyUpdate = async (updater: (content: CvData) => CvData) => {
      state = updater(state);
      return true;
    };

    const tools = createCvTools(applyUpdate);

    await tools.removeExperience.execute!({ id: expId }, { toolCallId: "test-3", messages: [] });

    expect(state.experiences).toHaveLength(1);
    expect(state.experiences[0].id).toBe("keep-exp-id");
  });
});

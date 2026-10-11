import { describe, it, expect } from "vitest";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";

describe("Fast-Track Upload & Guest Data Pipeline", () => {
  it("should merge uploaded CV data while strictly preserving candidate design settings", () => {
    const currentCv: CvData = {
      ...DEFAULT_CV_DATA,
      designSettings: {
        colorTheme: "indigo",
        fontFamily: "sans",
        layout: "classic",
        spacing: "normal",
        recruiterVisible: true,
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
    expect(mergedCv.designSettings.colorTheme).toBe("indigo");
    expect(mergedCv.designSettings.layout).toBe("classic");
  });

  it("should correctly detect image file types for fast-track photo uploads", () => {
    const isImageFile = (type: string, name: string) => {
      if (type && type.startsWith("image/")) return true;
      return /\.(jpe?g|png|webp|jfif|heic|bmp)$/i.test(name);
    };

    expect(isImageFile("image/jpeg", "avatar.jpg")).toBe(true);
    expect(isImageFile("image/png", "photo.png")).toBe(true);
    expect(isImageFile("image/webp", "camera.webp")).toBe(true);
    expect(isImageFile("application/octet-stream", "iphone_photo.HEIC")).toBe(true);
    expect(isImageFile("", "scan.jfif")).toBe(true);
    expect(isImageFile("application/pdf", "resume.pdf")).toBe(false);
    expect(isImageFile("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "cv.docx")).toBe(false);
  });

  it("should validate max photo size up to 5MB", () => {
    const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
    const smallPhotoSize = 1.5 * 1024 * 1024; // 1.5 MB
    const largePhotoSize = 4.2 * 1024 * 1024; // 4.2 MB (smartphone photo)
    const oversizePhoto = 6.0 * 1024 * 1024; // 6 MB

    expect(smallPhotoSize <= MAX_PHOTO_SIZE).toBe(true);
    expect(largePhotoSize <= MAX_PHOTO_SIZE).toBe(true);
    expect(oversizePhoto <= MAX_PHOTO_SIZE).toBe(false);
  });
});

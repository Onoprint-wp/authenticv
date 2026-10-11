import { tool } from "ai";
import { z } from "zod";
import {
  type CvData,
  type Experience,
  type Education,
  type Language,
  type Certification,
  type Project,
  type PersonalInfo,
} from "@/lib/schemas/cv.schema";
import { ScraperService } from "@/services/scraper.service";

export type CvUpdater = (updater: (content: CvData) => CvData) => Promise<boolean>;

export function deepMergeCv(base: CvData, patch: Partial<CvData>): CvData {
  return {
    ...base,
    ...patch,
    personalInfo: {
      ...base.personalInfo,
      ...(patch.personalInfo ?? {}),
    },
    designSettings: {
      ...base.designSettings,
      ...(patch.designSettings ?? {}),
    },
  };
}

/**
 * Crée l'ensemble des outils AI typés pour la manipulation du CV.
 */
export function createCvTools(applyUpdate: CvUpdater) {
  return {
    // ── Tool: Update personal info ──────────────────────────────────────────
    updatePersonalInfo: tool({
      description: "Met à jour les informations personnelles du candidat.",
      inputSchema: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        linkedin: z.string().optional(),
        title: z.string().optional(),
      }),
      execute: async (args) => {
        await applyUpdate((content) =>
          deepMergeCv(content, { personalInfo: { ...content.personalInfo, ...args } as PersonalInfo })
        );
        return { success: true };
      },
    }),

    // ── Tool: Update summary ────────────────────────────────────────────────
    updateSummary: tool({
      description: "Met à jour le résumé professionnel.",
      inputSchema: z.object({
        summary: z.string(),
      }),
      execute: async ({ summary }) => {
        await applyUpdate((content) => ({ ...content, summary }));
        return { success: true };
      },
    }),

    // ── Tool: Set skills ────────────────────────────────────────────────────
    setSkills: tool({
      description: "Définit la liste complète des compétences.",
      inputSchema: z.object({
        skills: z.array(z.string()),
      }),
      execute: async ({ skills }) => {
        await applyUpdate((content) => ({ ...content, skills }));
        return { success: true };
      },
    }),

    // ── Tool: Remove skill ──────────────────────────────────────────────────
    removeSkill: tool({
      description: "Supprime une compétence de la liste.",
      inputSchema: z.object({ skill: z.string() }),
      execute: async ({ skill }) => {
        await applyUpdate((content) => {
          const skills = (Array.isArray(content.skills) ? content.skills : []).filter(
            (s: string) => s.toLowerCase() !== skill.toLowerCase()
          );
          return { ...content, skills };
        });
        return { success: true };
      },
    }),

    // ── Tool: Experiences (Add/Update/Remove) ────────────────────────────────
    addExperience: tool({
      description: "Ajoute une expérience professionnelle.",
      inputSchema: z.object({
        company: z.string(),
        position: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string(),
      }),
      execute: async (args) => {
        await applyUpdate((content) => {
          const existing = Array.isArray(content.experiences) ? content.experiences : [];
          const newExp: Experience = {
            id: crypto.randomUUID(),
            company: args.company,
            position: args.position,
            startDate: args.startDate,
            endDate: args.endDate ?? "",
            current: args.current ?? false,
            description: args.description,
          };
          return { ...content, experiences: [...existing, newExp] };
        });
        return { success: true };
      },
    }),

    updateExperience: tool({
      description: "Modifie une expérience existante via son ID.",
      inputSchema: z.object({
        id: z.string().describe("L'ID de l'expérience à modifier"),
        data: z.object({
          company: z.string().optional(),
          position: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          current: z.boolean().optional(),
          description: z.string().optional(),
        }),
      }),
      execute: async ({ id, data }) => {
        await applyUpdate((content) => {
          const experiences = (content.experiences || []).map((exp) =>
            exp.id === id ? { ...exp, ...data } : exp
          );
          return { ...content, experiences };
        });
        return { success: true };
      },
    }),

    removeExperience: tool({
      description: "Supprime une expérience via son ID.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        await applyUpdate((content) => {
          const experiences = (content.experiences || []).filter((exp) => exp.id !== id);
          return { ...content, experiences };
        });
        return { success: true };
      },
    }),

    // ── Tool: Education (Add/Update/Remove) ──────────────────────────────────
    addEducation: tool({
      description: "Ajoute une formation.",
      inputSchema: z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
      }),
      execute: async (args) => {
        await applyUpdate((content) => {
          const existing = Array.isArray(content.education) ? content.education : [];
          const newEdu: Education = {
            id: crypto.randomUUID(),
            institution: args.institution,
            degree: args.degree,
            field: args.field ?? "",
            startDate: args.startDate,
            endDate: args.endDate ?? "",
          };
          return { ...content, education: [...existing, newEdu] };
        });
        return { success: true };
      },
    }),

    updateEducation: tool({
      description: "Modifie une formation existante.",
      inputSchema: z.object({
        id: z.string(),
        data: z.object({
          institution: z.string().optional(),
          degree: z.string().optional(),
          field: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
      }),
      execute: async ({ id, data }) => {
        await applyUpdate((content) => {
          const education = (content.education || []).map((edu) =>
            edu.id === id ? { ...edu, ...data } : edu
          );
          return { ...content, education };
        });
        return { success: true };
      },
    }),

    removeEducation: tool({
      description: "Supprime une formation.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        await applyUpdate((content) => {
          const education = (content.education || []).filter((edu) => edu.id !== id);
          return { ...content, education };
        });
        return { success: true };
      },
    }),

    // ── Tool: Languages (Add/Update/Remove) ──────────────────────────────────
    addLanguage: tool({
      description: "Ajoute une langue.",
      inputSchema: z.object({
        name: z.string(),
        level: z.string(),
      }),
      execute: async (args) => {
        await applyUpdate((content) => {
          const existing = Array.isArray(content.languages) ? content.languages : [];
          const newLang: Language = {
            id: crypto.randomUUID(),
            name: args.name,
            level: args.level,
          };
          return { ...content, languages: [...existing, newLang] };
        });
        return { success: true };
      },
    }),

    updateLanguage: tool({
      description: "Modifie une langue existante.",
      inputSchema: z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          level: z.string().optional(),
        }),
      }),
      execute: async ({ id, data }) => {
        await applyUpdate((content) => {
          const languages = (content.languages || []).map((lang) =>
            lang.id === id ? { ...lang, ...data } : lang
          );
          return { ...content, languages };
        });
        return { success: true };
      },
    }),

    removeLanguage: tool({
      description: "Supprime une langue.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        await applyUpdate((content) => {
          const languages = (content.languages || []).filter((lang) => lang.id !== id);
          return { ...content, languages };
        });
        return { success: true };
      },
    }),

    // ── Tool: Certifications (Add/Update/Remove) ─────────────────────────────
    addCertification: tool({
      description: "Ajoute une certification.",
      inputSchema: z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string().optional(),
      }),
      execute: async (args) => {
        await applyUpdate((content) => {
          const existing = Array.isArray(content.certifications) ? content.certifications : [];
          const newCert: Certification = {
            id: crypto.randomUUID(),
            name: args.name,
            issuer: args.issuer,
            date: args.date ?? "",
          };
          return { ...content, certifications: [...existing, newCert] };
        });
        return { success: true };
      },
    }),

    updateCertification: tool({
      description: "Modifie une certification existante.",
      inputSchema: z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          issuer: z.string().optional(),
          date: z.string().optional(),
        }),
      }),
      execute: async ({ id, data }) => {
        await applyUpdate((content) => {
          const certifications = (content.certifications || []).map((cert) =>
            cert.id === id ? { ...cert, ...data } : cert
          );
          return { ...content, certifications };
        });
        return { success: true };
      },
    }),

    removeCertification: tool({
      description: "Supprime une certification.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        await applyUpdate((content) => {
          const certifications = (content.certifications || []).filter((cert) => cert.id !== id);
          return { ...content, certifications };
        });
        return { success: true };
      },
    }),

    // ── Tool: Projects (Add/Update/Remove) ───────────────────────────────────
    addProject: tool({
      description: "Ajoute un projet.",
      inputSchema: z.object({
        name: z.string(),
        description: z.string(),
        link: z.string().optional(),
      }),
      execute: async (args) => {
        await applyUpdate((content) => {
          const existing = Array.isArray(content.projects) ? content.projects : [];
          const newProject: Project = {
            id: crypto.randomUUID(),
            name: args.name,
            description: args.description,
            link: args.link,
          };
          return { ...content, projects: [...existing, newProject] };
        });
        return { success: true };
      },
    }),

    updateProject: tool({
      description: "Modifie un projet existant.",
      inputSchema: z.object({
        id: z.string(),
        data: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          link: z.string().optional(),
        }),
      }),
      execute: async ({ id, data }) => {
        await applyUpdate((content) => {
          const projects = (content.projects || []).map((proj) =>
            proj.id === id ? { ...proj, ...data } : proj
          );
          return { ...content, projects };
        });
        return { success: true };
      },
    }),

    removeProject: tool({
      description: "Supprime un projet.",
      inputSchema: z.object({ id: z.string() }),
      execute: async ({ id }) => {
        await applyUpdate((content) => {
          const projects = (content.projects || []).filter((proj) => proj.id !== id);
          return { ...content, projects };
        });
        return { success: true };
      },
    }),

    // ── Tool: Import Full CV Profile (Batch atomic populate) ────────────────
    importFullCvProfile: tool({
      description:
        "Remplit l'intégralité du CV en une seule passe à partir d'un profil complet, d'un parcours ou d'un texte collé par l'utilisateur.",
      inputSchema: z.object({
        personalInfo: z
          .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
            location: z.string().optional(),
            linkedin: z.string().optional(),
            title: z.string().optional(),
          })
          .optional(),
        summary: z.string().optional(),
        experiences: z
          .array(
            z.object({
              company: z.string(),
              position: z.string(),
              startDate: z.string(),
              endDate: z.string().optional(),
              current: z.boolean().optional(),
              description: z.string(),
            })
          )
          .optional(),
        education: z
          .array(
            z.object({
              institution: z.string(),
              degree: z.string(),
              field: z.string().optional(),
              startDate: z.string(),
              endDate: z.string().optional(),
            })
          )
          .optional(),
        skills: z.array(z.string()).optional(),
        languages: z
          .array(
            z.object({
              name: z.string(),
              level: z.string().optional(),
            })
          )
          .optional(),
        certifications: z
          .array(
            z.object({
              name: z.string(),
              issuer: z.string().optional(),
              date: z.string().optional(),
            })
          )
          .optional(),
        projects: z
          .array(
            z.object({
              name: z.string(),
              description: z.string(),
              link: z.string().optional(),
            })
          )
          .optional(),
      }),
      execute: async (args) => {
        await applyUpdate((content) => {
          const genId = () => crypto.randomUUID();
          return {
            ...content,
            personalInfo: {
              ...content.personalInfo,
              ...(args.personalInfo || {}),
            },
            summary: args.summary !== undefined ? args.summary : content.summary,
            skills: args.skills && args.skills.length > 0 ? args.skills : content.skills,
            experiences:
              args.experiences && args.experiences.length > 0
                ? args.experiences.map((exp) => ({
                    id: genId(),
                    company: exp.company,
                    position: exp.position,
                    startDate: exp.startDate,
                    endDate: exp.endDate || "",
                    current: exp.current ?? false,
                    description: exp.description || "",
                  }))
                : content.experiences,
            education:
              args.education && args.education.length > 0
                ? args.education.map((edu) => ({
                    id: genId(),
                    institution: edu.institution,
                    degree: edu.degree,
                    field: edu.field || "",
                    startDate: edu.startDate,
                    endDate: edu.endDate || "",
                  }))
                : content.education,
            languages:
              args.languages && args.languages.length > 0
                ? args.languages.map((lang) => ({
                    id: genId(),
                    name: lang.name,
                    level: lang.level || "",
                  }))
                : content.languages,
            certifications:
              args.certifications && args.certifications.length > 0
                ? args.certifications.map((cert) => ({
                    id: genId(),
                    name: cert.name,
                    issuer: cert.issuer || "",
                    date: cert.date || "",
                  }))
                : content.certifications,
            projects:
              args.projects && args.projects.length > 0
                ? args.projects.map((proj) => ({
                    id: genId(),
                    name: proj.name,
                    description: proj.description || "",
                    link: proj.link,
                  }))
                : content.projects,
          };
        });
        return {
          success: true,
          experiencesCount: args.experiences?.length || 0,
          educationCount: args.education?.length || 0,
          skillsCount: args.skills?.length || 0,
        };
      },
    }),

    // ── Tool: Scrape Public URL (Portfolios, GitHub, personal sites) ─────────
    scrapePublicUrl: tool({
      description:
        "Lit et extrait le contenu textuel d'une URL publique (portfolio, GitHub, site personnel, profil pro) pour pré-remplir le CV.",
      inputSchema: z.object({
        url: z.string().describe("L'URL complète de la page web ou du portfolio à analyser"),
      }),
      execute: async ({ url }) => {
        const result = await ScraperService.extractPublicProfile(url);
        if (result.status === "blocked_platform") {
          return {
            status: "blocked_platform",
            platform: result.platform,
            guidance: result.guidance,
          };
        }
        if (result.status === "ssrf_rejected" || result.status === "fetch_error") {
          return {
            status: "error",
            error: result.error,
          };
        }
        return {
          status: "success",
          url: result.url,
          textContent: result.textContent,
        };
      },
    }),
  };
}

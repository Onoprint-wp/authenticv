import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `Tu es Alex, un coach CV expert et bienveillant, spécialisé dans la création de CVs percutants pour le marché francophone.

Ton objectif : guider l'utilisateur pour construire un CV ATS-optimisé et authentique, qui reflète vraiment qui il est.

## Tes règles d'or :
- Pose UNE SEULE question à la fois pour ne pas surcharger l'utilisateur
- APPELLE IMMÉDIATEMENT updatePersonalInfo dès que l'utilisateur te donne son prénom ET nom — n'attends pas d'autres informations
- APPELLE IMMÉDIATEMENT addExperience dès que l'utilisateur décrit une nouvelle expérience professionnelle
- APPELLE IMMÉDIATEMENT setSkills dès que l'utilisateur mentionne des compétences
- APPELLE IMMÉDIATEMENT addEducation dès que l'utilisateur mentionne une formation
- APPELLE IMMÉDIATEMENT addLanguage dès que l'utilisateur mentionne une langue
- APPELLE IMMÉDIATEMENT addCertification dès que l'utilisateur mentionne une certification
- APPELLE IMMÉDIATEMENT addProject dès que l'utilisateur mentionne un projet
- SI L'UTILISATEUR SOUHAITE MODIFIER une information existante (titre, description, date), utilise les outils "update..." correspondants.
- SI L'UTILISATEUR SOUHAITE SUPPRIMER une entrée, utilise les outils "remove..." correspondants.
- Emploie des verbes d'action percutants : "piloté", "développé", "optimisé", "lancé", "dirigé"
- Reformule les descriptions banales en points d'impact avec des chiffres quand possible
- Sois encourageant et positif — construire un CV est un exercice de confiance en soi
- Parle en français sauf si l'utilisateur parle en anglais

## Important CRITIQUE :
- Après CHAQUE réponse de l'utilisateur, vérifie si tu peux appeler un outil
- Si l'utilisateur donne son nom → appelle updatePersonalInfo AVANT de poser la prochaine question
- Si l'utilisateur mentionne un titre → mets à jour updatePersonalInfo avec le titre aussi
- Ne demande JAMAIS la permission d'appeler un outil — fais-le immédiatement
- Après chaque outil appelé, explique BRIÈVEMENT ce que tu viens d'ajouter ou modifier au CV, puis pose la prochaine question
`;

const extractText = (message: any) => {
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("\n");
  }
  return "";
};

const deepMerge = (
  base: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> => {
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (
      value !== undefined &&
      value !== null &&
      !Array.isArray(value) &&
      typeof value === "object" &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

const updateResume = async (userId: string, patch: Record<string, unknown>) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resumes")
    .select("id, content")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return false;

  const content = (data.content as Record<string, unknown>) ?? {};
  const updated = deepMerge(content, patch);

  await supabase
    .from("resumes")
    .update({ content: updated, updated_at: new Date().toISOString() })
    .eq("id", data.id);

  return true;
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  const coreMessages = (messages as any[])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: extractText(m),
    }))
    .filter((m) => m.content.trim().length > 0);

  const userId = user.id;

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    messages: coreMessages,
    tools: {
      // ── Tool: Update personal info ────────────────────────────────────────
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
          await updateResume(userId, { personalInfo: args });
          return { success: true };
        },
      }),

      // ── Tool: Update summary ──────────────────────────────────────────────
      updateSummary: tool({
        description: "Met à jour le résumé professionnel.",
        inputSchema: z.object({
          summary: z.string(),
        }),
        execute: async ({ summary }) => {
          await updateResume(userId, { summary });
          return { success: true };
        },
      }),

      // ── Tool: Set skills ──────────────────────────────────────────────────
      setSkills: tool({
        description: "Définit la liste complète des compétences.",
        inputSchema: z.object({
          skills: z.array(z.string()),
        }),
        execute: async ({ skills }) => {
          await updateResume(userId, { skills });
          return { success: true };
        },
      }),

      // ── Tool: Add experience ──────────────────────────────────────────────
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
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const existing = Array.isArray(content.experiences) ? content.experiences : [];
          const updated = { ...content, experiences: [...existing, { ...args, id: crypto.randomUUID() }] };
          await prisma.resume.update({ where: { id: resume.id }, data: { content: updated, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      // ── Tool: Update experience ───────────────────────────────────────────
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
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const experiences = (content.experiences as any[]).map(exp => exp.id === id ? { ...exp, ...data } : exp);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, experiences }, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      // ── Tool: Remove experience ───────────────────────────────────────────
      removeExperience: tool({
        description: "Supprime une expérience via son ID.",
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const experiences = (content.experiences as any[]).filter(exp => exp.id !== id);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, experiences }, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      // ── Tool: Education (Add/Update/Remove) ───────────────────────────────
      addEducation: tool({
        description: "Ajoute une formation.",
        inputSchema: z.object({ institution: z.string(), degree: z.string(), field: z.string().optional(), startDate: z.string(), endDate: z.string().optional() }),
        execute: async (args) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const existing = Array.isArray(content.education) ? content.education : [];
          const updated = { ...content, education: [...existing, { ...args, id: crypto.randomUUID() }] };
          await prisma.resume.update({ where: { id: resume.id }, data: { content: updated, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      updateEducation: tool({
        description: "Modifie une formation existante.",
        inputSchema: z.object({ id: z.string(), data: z.object({ institution: z.string().optional(), degree: z.string().optional(), field: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional() }) }),
        execute: async ({ id, data }) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const education = (content.education as any[]).map(edu => edu.id === id ? { ...edu, ...data } : edu);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, education }, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      removeEducation: tool({
        description: "Supprime une formation.",
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const education = (content.education as any[]).filter(edu => edu.id !== id);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, education }, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      // ── Tool: Languages (Add/Update/Remove) ──────────────────────────────
      addLanguage: tool({
        description: "Ajoute une langue.",
        inputSchema: z.object({ name: z.string(), level: z.string() }),
        execute: async (args) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const existing = Array.isArray(content.languages) ? content.languages : [];
          const updated = { ...content, languages: [...existing, { ...args, id: crypto.randomUUID() }] };
          await prisma.resume.update({ where: { id: resume.id }, data: { content: updated, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      removeLanguage: tool({
        description: "Supprime une langue.",
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const languages = (content.languages as any[]).filter(lang => lang.id !== id);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, languages }, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      // ── Tool: Certifications (Add/Update/Remove) ─────────────────────────
      addCertification: tool({
        description: "Ajoute une certification.",
        inputSchema: z.object({ name: z.string(), issuer: z.string(), date: z.string().optional() }),
        execute: async (args) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const existing = Array.isArray(content.certifications) ? content.certifications : [];
          const updated = { ...content, certifications: [...existing, { ...args, id: crypto.randomUUID() }] };
          await prisma.resume.update({ where: { id: resume.id }, data: { content: updated, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      removeCertification: tool({
        description: "Supprime une certification.",
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const certifications = (content.certifications as any[]).filter(cert => cert.id !== id);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, certifications }, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      // ── Tool: Projects (Add/Update/Remove) ───────────────────────────────
      addProject: tool({
        description: "Ajoute un projet.",
        inputSchema: z.object({ name: z.string(), description: z.string(), link: z.string().optional() }),
        execute: async (args) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const existing = Array.isArray(content.projects) ? content.projects : [];
          const updated = { ...content, projects: [...existing, { ...args, id: crypto.randomUUID() }] };
          await prisma.resume.update({ where: { id: resume.id }, data: { content: updated, updatedAt: new Date() }});
          return { success: true };
        },
      }),

      removeProject: tool({
        description: "Supprime un projet.",
        inputSchema: z.object({ id: z.string() }),
        execute: async ({ id }) => {
          const resume = await prisma.resume.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" }});
          if (!resume) return { success: false };
          const content = (resume.content as any) ?? {};
          const projects = (content.projects as any[]).filter(proj => proj.id !== id);
          await prisma.resume.update({ where: { id: resume.id }, data: { content: { ...content, projects }, updatedAt: new Date() }});
          return { success: true };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

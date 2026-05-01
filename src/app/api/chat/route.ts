import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { chatRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BASE_SYSTEM_PROMPT = `Tu es Alex, un coach CV expert et bienveillant, spécialisé dans la création de CVs percutants pour le marché francophone.

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
- NE DUPLIQUE JAMAIS une entrée déjà présente dans le CV (vérifie l'état actuel avant d'ajouter)
`;

// ── Génère un system prompt dynamique avec le contexte CV actuel ──────────────
const buildSystemPrompt = (cvJson: Record<string, unknown>): string => {
  const hasData = Object.keys(cvJson).length > 0;
  const cvSection = hasData
    ? `\n\n## État actuel du CV de l'utilisateur (JSON) :\n\`\`\`json\n${JSON.stringify(cvJson, null, 2)}\n\`\`\`\nConsulte ces données pour éviter les doublons et contextualiser tes réponses. Ne re-demande pas des informations déjà présentes.`
    : `\n\n## État actuel du CV : vide — commence l'entretien depuis le début.`;
  return BASE_SYSTEM_PROMPT + cvSection;
};

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

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { success } = await chatRateLimit.limit(user.id);
    if (!success) {
      return new Response(
        JSON.stringify({ 
          error: "Too Many Requests", 
          details: "Vous avez envoyé trop de messages. Veuillez patienter une minute pour protéger le système." 
        }), 
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    // Tronquer l'historique à 12 derniers messages pour garder une meilleure mémoire de conversation
    // tout en contrôlant les coûts en tokens.
    const MAX_HISTORY = 12;
    const coreMessages = (messages as any[])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: extractText(m),
      }))
      .filter((m) => m.content.trim().length > 0)
      .slice(-MAX_HISTORY);

    const userId = user.id;

    // Récupérer le CV actuel pour l'injecter dans le contexte du LLM
    const { data: resumes } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    const currentResume = resumes && resumes.length > 0 ? resumes[0] : null;
    
    // Memory State to prevent race conditions during concurrent tool calls
    let localContent = (currentResume?.content as Record<string, any>) ?? {};

    // Helper unifié pour appliquer les modifications au CV
    const applyUpdate = async (updater: (content: any) => any) => {
      if (!currentResume) return false;
      // Mise à jour de l'état local en mémoire (synchrone, donc thread-safe vis-à-vis des autres outils)
      localContent = updater(localContent);
      
      // Sauvegarde asynchrone dans la base (Supabase va simplement écraser avec le dernier état de localContent complet)
      await supabase
        .from("resumes")
        .update({ content: localContent, updated_at: new Date().toISOString() })
        .eq("id", currentResume.id);
      return true;
    };

    const dynamicSystemPrompt = buildSystemPrompt(localContent);

    const result = streamText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      system: dynamicSystemPrompt,
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
            await applyUpdate((content) => deepMerge(content, { personalInfo: args }));
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
            await applyUpdate((content) => deepMerge(content, { summary }));
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
            await applyUpdate((content) => deepMerge(content, { skills }));
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
            await applyUpdate((content) => {
              const existing = Array.isArray(content.experiences) ? content.experiences : [];
              return { ...content, experiences: [...existing, { ...args, id: crypto.randomUUID() }] };
            });
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
            await applyUpdate((content) => {
              const experiences = (content.experiences as any[] || []).map(exp => exp.id === id ? { ...exp, ...data } : exp);
              return { ...content, experiences };
            });
            return { success: true };
          },
        }),

        // ── Tool: Remove experience ───────────────────────────────────────────
        removeExperience: tool({
          description: "Supprime une expérience via son ID.",
          inputSchema: z.object({ id: z.string() }),
          execute: async ({ id }) => {
            await applyUpdate((content) => {
              const experiences = (content.experiences as any[] || []).filter(exp => exp.id !== id);
              return { ...content, experiences };
            });
            return { success: true };
          },
        }),

        // ── Tool: Education (Add/Update/Remove) ───────────────────────────────
        addEducation: tool({
          description: "Ajoute une formation.",
          inputSchema: z.object({ institution: z.string(), degree: z.string(), field: z.string().optional(), startDate: z.string(), endDate: z.string().optional() }),
          execute: async (args) => {
            await applyUpdate((content) => {
              const existing = Array.isArray(content.education) ? content.education : [];
              return { ...content, education: [...existing, { ...args, id: crypto.randomUUID() }] };
            });
            return { success: true };
          },
        }),

        updateEducation: tool({
          description: "Modifie une formation existante.",
          inputSchema: z.object({ id: z.string(), data: z.object({ institution: z.string().optional(), degree: z.string().optional(), field: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional() }) }),
          execute: async ({ id, data }) => {
            await applyUpdate((content) => {
              const education = (content.education as any[] || []).map(edu => edu.id === id ? { ...edu, ...data } : edu);
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
              const education = (content.education as any[] || []).filter(edu => edu.id !== id);
              return { ...content, education };
            });
            return { success: true };
          },
        }),

        // ── Tool: Languages (Add/Update/Remove) ──────────────────────────────
        addLanguage: tool({
          description: "Ajoute une langue.",
          inputSchema: z.object({ name: z.string(), level: z.string() }),
          execute: async (args) => {
            await applyUpdate((content) => {
              const existing = Array.isArray(content.languages) ? content.languages : [];
              return { ...content, languages: [...existing, { ...args, id: crypto.randomUUID() }] };
            });
            return { success: true };
          },
        }),

        updateLanguage: tool({
          description: "Modifie une langue existante.",
          inputSchema: z.object({ id: z.string(), data: z.object({ name: z.string().optional(), level: z.string().optional() }) }),
          execute: async ({ id, data }) => {
            await applyUpdate((content) => {
              const languages = (content.languages as any[] || []).map(lang => lang.id === id ? { ...lang, ...data } : lang);
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
              const languages = (content.languages as any[] || []).filter(lang => lang.id !== id);
              return { ...content, languages };
            });
            return { success: true };
          },
        }),

        // ── Tool: Certifications (Add/Update/Remove) ─────────────────────────
        addCertification: tool({
          description: "Ajoute une certification.",
          inputSchema: z.object({ name: z.string(), issuer: z.string(), date: z.string().optional() }),
          execute: async (args) => {
            await applyUpdate((content) => {
              const existing = Array.isArray(content.certifications) ? content.certifications : [];
              return { ...content, certifications: [...existing, { ...args, id: crypto.randomUUID() }] };
            });
            return { success: true };
          },
        }),

        updateCertification: tool({
          description: "Modifie une certification existante.",
          inputSchema: z.object({ id: z.string(), data: z.object({ name: z.string().optional(), issuer: z.string().optional(), date: z.string().optional() }) }),
          execute: async ({ id, data }) => {
            await applyUpdate((content) => {
              const certifications = (content.certifications as any[] || []).map(cert => cert.id === id ? { ...cert, ...data } : cert);
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
              const certifications = (content.certifications as any[] || []).filter(cert => cert.id !== id);
              return { ...content, certifications };
            });
            return { success: true };
          },
        }),

        // ── Tool: Projects (Add/Update/Remove) ───────────────────────────────
        addProject: tool({
          description: "Ajoute un projet.",
          inputSchema: z.object({ name: z.string(), description: z.string(), link: z.string().optional() }),
          execute: async (args) => {
            await applyUpdate((content) => {
              const existing = Array.isArray(content.projects) ? content.projects : [];
              return { ...content, projects: [...existing, { ...args, id: crypto.randomUUID() }] };
            });
            return { success: true };
          },
        }),

        updateProject: tool({
          description: "Modifie un projet existant.",
          inputSchema: z.object({ id: z.string(), data: z.object({ name: z.string().optional(), description: z.string().optional(), link: z.string().optional() }) }),
          execute: async ({ id, data }) => {
            await applyUpdate((content) => {
              const projects = (content.projects as any[] || []).map(proj => proj.id === id ? { ...proj, ...data } : proj);
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
              const projects = (content.projects as any[] || []).filter(proj => proj.id !== id);
              return { ...content, projects };
            });
            return { success: true };
          },
        }),

        removeSkill: tool({
          description: "Supprime une compétence de la liste.",
          inputSchema: z.object({ skill: z.string() }),
          execute: async ({ skill }) => {
            await applyUpdate((content) => {
              const skills = (Array.isArray(content.skills) ? content.skills : []).filter((s: string) => s.toLowerCase() !== skill.toLowerCase());
              return { ...content, skills };
            });
            return { success: true };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[API Chat POST Error]:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

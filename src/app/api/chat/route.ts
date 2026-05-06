/* eslint-disable @typescript-eslint/no-explicit-any */
import { streamText, tool } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { chatRateLimit } from "@/lib/rate-limit";
import { getUserPlan, getMonthlyMessageCount, incrementMessageCount, FREE_MONTHLY_MESSAGES } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// ── Sanitize API key (strip invisible \r\n from Vercel env vars) ──────────────
const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");

const DEFAULT_MODEL = "claude-sonnet-4-6";

const getAnthropicModel = () => {
  const provider = createAnthropic({ apiKey: sanitizedApiKey });
  const modelId = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  return provider(modelId);
};

const INTERVIEW_SYSTEM_PROMPT_FR = `Tu es Alex, un coach expert en préparation aux entretiens d'embauche, spécialisé dans les marchés francophones. Tu connais le CV du candidat et tu vas simuler un entretien réaliste pour l'aider à se préparer.

Ton rôle :
- Poser des questions d'entretien variées : présentation, motivation, expériences concrètes, compétences, questions comportementales ("Racontez une situation où…"), points forts/faibles, questions de culture d'entreprise
- Adapter les questions au profil du candidat (son CV)
- Donner un bref feedback constructif après chaque réponse (2-3 phrases) avant de passer à la question suivante
- Varier le registre : questions directes, mises en situation, questions déstabilisantes

Règles :
- UNE question à la fois
- Commence toujours par : "Bonjour ! Pour débuter, pourriez-vous vous présenter en 2-3 minutes ?"
- Sois encourageant mais exigeant
- Parle toujours en français
- N'essaie PAS de modifier le CV — tu n'as pas d'outils disponibles en mode entretien
`;

const INTERVIEW_SYSTEM_PROMPT_EN = `You are Alex, an expert interview preparation coach specializing in the international job market. You know the candidate's resume and will simulate a realistic interview to help them prepare.

Your role:
- Ask varied interview questions: self-introduction, motivation, concrete experiences, skills, behavioral questions ("Tell me about a time when…"), strengths/weaknesses, culture-fit questions
- Tailor questions to the candidate's profile (their CV)
- Give brief constructive feedback after each answer (2-3 sentences) before moving to the next question
- Vary the tone: direct questions, situational scenarios, challenging questions

Rules:
- ONE question at a time
- Always start with: "Hello! To begin, could you introduce yourself in 2-3 minutes?"
- Be encouraging but demanding
- Always respond in English
- Do NOT try to modify the CV — no tools are available in interview mode
`;

const BASE_SYSTEM_PROMPT_FR = `Tu es Alex, un coach CV expert et bienveillant, spécialisé dans la création de CVs percutants pour le marché francophone.

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
- Parle toujours en français

## Important CRITIQUE :
- Après CHAQUE réponse de l'utilisateur, vérifie si tu peux appeler un outil
- Si l'utilisateur donne son nom → appelle updatePersonalInfo AVANT de poser la prochaine question
- Si l'utilisateur mentionne un titre → mets à jour updatePersonalInfo avec le titre aussi
- Ne demande JAMAIS la permission d'appeler un outil — fais-le immédiatement
- Après chaque outil appelé, explique BRIÈVEMENT ce que tu viens d'ajouter ou modifier au CV, puis pose la prochaine question
- NE DUPLIQUE JAMAIS une entrée déjà présente dans le CV (vérifie l'état actuel avant d'ajouter)

## Mise en page et sauts de page :
- N'affirme JAMAIS que tu "ne gères pas la mise en page" ou que tu "ne peux pas intervenir sur les sauts de page" — c'est faux et frustrant pour l'utilisateur.
- Quand l'utilisateur signale qu'une section déborde ou que le CV fait trop de pages, propose des actions concrètes sur le CONTENU :
  - Raccourcir les descriptions d'expériences (supprimer les phrases superflues, garder l'essentiel en bullet points)
  - Réduire le nombre de compétences (garder les 8-10 plus pertinentes)
  - Condenser le résumé professionnel (3-4 lignes max)
  - Supprimer des entrées moins importantes (projets mineurs, certifications anciennes)
- Utilise les outils updateExperience, setSkills, updateSummary, removeProject, removeCertification, etc. pour appliquer ces optimisations directement.
- Objectif : aider à faire tenir le CV en 1-2 pages en travaillant sur le fond, pas la forme.
`;

const BASE_SYSTEM_PROMPT_EN = `You are Alex, a friendly and expert CV coach, specializing in creating compelling, ATS-optimized resumes for the international job market.

Your goal: guide the user to build an authentic, impactful resume that truly reflects who they are.

## Your golden rules:
- Ask ONE question at a time so you don't overwhelm the user
- IMMEDIATELY call updatePersonalInfo as soon as the user gives their first AND last name — don't wait for more info
- IMMEDIATELY call addExperience when the user describes a new work experience
- IMMEDIATELY call setSkills when the user mentions skills
- IMMEDIATELY call addEducation when the user mentions education
- IMMEDIATELY call addLanguage when the user mentions a language
- IMMEDIATELY call addCertification when the user mentions a certification
- IMMEDIATELY call addProject when the user mentions a project
- IF THE USER WANTS TO MODIFY existing info (title, description, date), use the corresponding "update..." tools.
- IF THE USER WANTS TO DELETE an entry, use the corresponding "remove..." tools.
- Use powerful action verbs: "spearheaded", "developed", "optimized", "launched", "led"
- Transform bland descriptions into impact statements with metrics when possible
- Be encouraging and positive — building a resume is a confidence exercise
- Always respond in English

## CRITICAL:
- After EACH user response, check if you can call a tool
- If the user gives their name → call updatePersonalInfo BEFORE asking the next question
- If the user mentions a title → also update updatePersonalInfo with the title
- NEVER ask permission to call a tool — just do it immediately
- After each tool call, BRIEFLY explain what you added or changed, then ask the next question
- NEVER duplicate an entry already in the CV (check current state before adding)

## Page layout and page breaks:
- NEVER say you "can't manage page layout" or "can't handle page breaks" — this is incorrect and frustrating for the user.
- When the user reports content overflowing or the CV spanning too many pages, propose concrete CONTENT-based actions:
  - Shorten experience descriptions (remove filler phrases, keep impact statements)
  - Reduce the skills list (keep the 8-10 most relevant ones)
  - Condense the professional summary (3-4 lines max)
  - Remove less important entries (minor projects, old certifications)
- Use updateExperience, setSkills, updateSummary, removeProject, removeCertification, etc. to apply these optimizations directly.
- Goal: help fit the CV in 1-2 pages by working on content, not visual formatting.
`;

// ── Génère un system prompt dynamique avec le contexte CV actuel ──────────────
const buildSystemPrompt = (
  cvJson: Record<string, unknown>,
  lang: "fr" | "en" = "fr",
  mode: "coach" | "interview" = "coach"
): string => {
  const isInterview = mode === "interview";
  const basePrompt = isInterview
    ? (lang === "en" ? INTERVIEW_SYSTEM_PROMPT_EN : INTERVIEW_SYSTEM_PROMPT_FR)
    : (lang === "en" ? BASE_SYSTEM_PROMPT_EN : BASE_SYSTEM_PROMPT_FR);

  const hasData = Object.keys(cvJson).length > 0;
  const cvLabel = lang === "en" ? "Candidate CV" : "CV du candidat";
  const emptyLabel = lang === "en"
    ? "Candidate CV: empty."
    : "CV du candidat : vide.";
  const cvNote = isInterview
    ? (lang === "en"
        ? "Use this CV to ask targeted, relevant questions."
        : "Utilise ce CV pour poser des questions ciblées et pertinentes.")
    : (lang === "en"
        ? "Check this data to avoid duplicates and contextualize your responses. Don't re-ask for info already present."
        : "Consulte ces données pour éviter les doublons et contextualiser tes réponses. Ne re-demande pas des informations déjà présentes.");

  const cvSection = hasData
    ? `\n\n## ${cvLabel} (JSON) :\n\`\`\`json\n${JSON.stringify(cvJson, null, 2)}\n\`\`\`\n${cvNote}`
    : `\n\n## ${emptyLabel}`;
  return basePrompt + cvSection;
};

const extractText = (message: any) => {
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("\n");
  }
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

    // Vérification du quota mensuel pour les utilisateurs Free
    const [plan, messageCount] = await Promise.all([
      getUserPlan(user.id),
      getMonthlyMessageCount(user.id),
    ]);

    if (plan === "free" && messageCount >= FREE_MONTHLY_MESSAGES) {
      return new Response(
        JSON.stringify({
          error: "quota_exceeded",
          details: `Vous avez atteint la limite de ${FREE_MONTHLY_MESSAGES} messages gratuits ce mois-ci. Passez à Pro pour continuer.`,
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    // Incrémenter le compteur après lecture du body (évite d'incrémenter si body invalide)
    if (plan === "free") {
      await incrementMessageCount(user.id);
    }
    const headerLang = req.headers.get("X-Coach-Language");
    const lang: "fr" | "en" = headerLang === "en" ? "en" : "fr";
    const headerMode = req.headers.get("X-Chat-Mode");
    const mode: "coach" | "interview" = headerMode === "interview" ? "interview" : "coach";

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
      localContent = updater(localContent);

      if (currentResume) {
        await supabase
          .from("resumes")
          .update({ content: localContent, updated_at: new Date().toISOString() })
          .eq("id", currentResume.id);
      } else {
        // Crée automatiquement le CV si l'utilisateur n'en a pas encore
        await supabase
          .from("resumes")
          .insert({ user_id: userId, content: localContent, updated_at: new Date().toISOString() });
      }
      return true;
    };

    const dynamicSystemPrompt = buildSystemPrompt(localContent, lang, mode);

    const tools = mode === "interview" ? undefined : {
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
    };

    const result = streamText({
      model: getAnthropicModel(),
      system: dynamicSystemPrompt,
      messages: coreMessages,
      ...(tools !== undefined ? { tools } : {}),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[API Chat POST Error]:", error);
    
    // Classify the error for better frontend feedback
    const errMsg = error instanceof Error ? error.message : String(error);
    let status = 500;
    let errorCode = "internal_error";
    let userMessage = "Une erreur interne est survenue. Veuillez réessayer.";
    
    if (errMsg.includes("401") || errMsg.includes("authentication") || errMsg.includes("invalid x-api-key")) {
      status = 502;
      errorCode = "auth_error";
      userMessage = "Erreur d'authentification avec le service IA. Contactez le support.";
    } else if (errMsg.includes("model") || errMsg.includes("not_found")) {
      status = 502;
      errorCode = "model_error";
      userMessage = "Le modèle IA est temporairement indisponible. Réessayez dans quelques instants.";
    } else if (errMsg.includes("rate") || errMsg.includes("429")) {
      status = 429;
      errorCode = "rate_limit";
      userMessage = "Le service IA est surchargé. Patientez quelques secondes et réessayez.";
    } else if (errMsg.includes("timeout") || errMsg.includes("ECONNREFUSED")) {
      status = 504;
      errorCode = "timeout";
      userMessage = "Le service IA met trop de temps à répondre. Réessayez.";
    }
    
    return new Response(JSON.stringify({ 
      error: errorCode, 
      message: userMessage,
      details: process.env.NODE_ENV === "development" ? errMsg : undefined 
    }), { 
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

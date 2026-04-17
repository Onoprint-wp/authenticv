import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 60;

const SYSTEM_PROMPT = `Tu es Alex, un coach CV expert et bienveillant, spécialisé dans la création de CVs percutants pour le marché francophone.

Ton objectif : guider l'utilisateur pour construire un CV ATS-optimisé et authentique, qui reflète vraiment qui il est.

## Tes règles d'or :
- Pose UNE SEULE question à la fois pour ne pas surcharger l'utilisateur
- APPELLE IMMÉDIATEMENT updatePersonalInfo dès que l'utilisateur te donne son prénom ET nom — n'attends pas d'autres informations
- APPELLE IMMÉDIATEMENT addExperience dès que l'utilisateur décrit une expérience professionnelle
- APPELLE IMMÉDIATEMENT setSkills dès que l'utilisateur mentionne des compétences
- APPELLE IMMÉDIATEMENT addEducation dès que l'utilisateur mentionne une formation
- Emploie des verbes d'action percutants : "piloté", "développé", "optimisé", "lancé", "dirigé"
- Reformule les descriptions banales en points d'impact avec des chiffres quand possible
- Sois encourageant et positif — construire un CV est un exercice de confiance en soi
- Parle en français sauf si l'utilisateur parle en anglais

## Important CRITIQUE :
- Après CHAQUE réponse de l'utilisateur, vérifie si tu peux appeler un outil
- Si l'utilisateur donne son nom → appelle updatePersonalInfo AVANT de poser la prochaine question
- Si l'utilisateur mentionne un titre → mets à jour updatePersonalInfo avec le titre aussi
- Ne demande JAMAIS la permission d'appeler un outil — fais-le immédiatement
- Après chaque outil appelé, explique BRIÈVEMENT ce que tu viens d'ajouter au CV, puis pose la prochaine question
`;

// Helper: extract text from AI SDK v6 UIMessage (parts[]) or legacy string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(msg: any): string {
  if (typeof msg.content === "string") return msg.content;
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: { type: string }) => p.type === "text")
      .map((p: { text: string }) => p.text ?? "")
      .join("");
  }
  if (Array.isArray(msg.content)) {
    return msg.content
      .filter((p: { type: string }) => p.type === "text")
      .map((p: { text: string }) => p.text ?? "")
      .join("");
  }
  return "";
}

// Helper: update the user's resume in Supabase (merge-patch semantics)
async function updateResume(
  userId: string,
  patch: Record<string, unknown>
): Promise<void> {
  const supabase = await createClient();

  // 1. Fetch current content
  const { data } = await supabase
    .from("resumes")
    .select("id, content")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return; // No resume yet; will be created by useSyncCv on hydration

  const current = (data.content as Record<string, unknown>) ?? {};
  const merged = deepMerge(current, patch);

  await supabase
    .from("resumes")
    .update({ content: merged, updated_at: new Date().toISOString() })
    .eq("id", data.id);
}

// Deep merge two plain objects (arrays from patch REPLACE, not merge)
function deepMerge(
  base: Record<string, unknown>,
  patch: Record<string, unknown>
): Record<string, unknown> {
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
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  // Normalize messages to CoreMessage[] format for streamText
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // ── Tool 1: Update personal info ──────────────────────────────────────
      updatePersonalInfo: tool({
        description:
          "Met à jour les informations personnelles du candidat. APPELLE-LE IMMÉDIATEMENT quand tu as le prénom et/ou le nom.",
        inputSchema: z.object({
          firstName: z.string().optional().describe("Prénom"),
          lastName: z.string().optional().describe("Nom de famille"),
          email: z.string().optional().describe("Adresse email"),
          phone: z.string().optional().describe("Numéro de téléphone"),
          location: z.string().optional().describe("Ville / pays de résidence"),
          linkedin: z
            .string()
            .optional()
            .describe("URL LinkedIn ou nom d'utilisateur"),
          title: z
            .string()
            .optional()
            .describe(
              "Titre professionnel (ex: Développeur Full Stack Senior)"
            ),
        }),
        execute: async (args) => {
          const patch: Record<string, unknown> = { personalInfo: args };
          await updateResume(userId, patch);
          console.log("[Tool] updatePersonalInfo:", args);
          return { success: true, updated: "personalInfo" };
        },
      }),

      // ── Tool 2: Update summary ────────────────────────────────────────────
      updateSummary: tool({
        description: "Met à jour le profil / résumé professionnel du CV.",
        inputSchema: z.object({
          summary: z
            .string()
            .describe("Le résumé professionnel optimisé, 3-5 lignes."),
        }),
        execute: async ({ summary }) => {
          await updateResume(userId, { summary });
          console.log("[Tool] updateSummary:", summary.slice(0, 60));
          return { success: true, updated: "summary" };
        },
      }),

      // ── Tool 3: Add experience ────────────────────────────────────────────
      addExperience: tool({
        description:
          "Ajoute une expérience professionnelle au CV. Appelle-le pour chaque poste mentionné.",
        inputSchema: z.object({
          company: z.string().describe("Nom de l'entreprise"),
          position: z.string().describe("Intitulé du poste"),
          startDate: z
            .string()
            .describe("Date de début (ex: Jan 2022 ou 2022)"),
          endDate: z.string().optional().describe("Date de fin"),
          current: z
            .boolean()
            .default(false)
            .describe("Vrai si poste actuel"),
          description: z
            .string()
            .describe("Description avec verbes d'action et résultats."),
        }),
        execute: async (args) => {
          // Append (don't replace) to experiences array
          const supabase = await createClient();
          const { data } = await supabase
            .from("resumes")
            .select("id, content")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false })
            .limit(1)
            .single();

          if (!data) return { success: false };

          const content = (data.content as Record<string, unknown>) ?? {};
          const existing = Array.isArray(content.experiences)
            ? (content.experiences as unknown[])
            : [];
          const updated = {
            ...content,
            experiences: [...existing, { ...args, id: crypto.randomUUID() }],
          };

          await supabase
            .from("resumes")
            .update({
              content: updated,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.id);

          console.log("[Tool] addExperience:", args.company, args.position);
          return { success: true, updated: "experiences" };
        },
      }),

      // ── Tool 4: Set skills ────────────────────────────────────────────────
      setSkills: tool({
        description:
          "Définit la liste complète des compétences (remplace la liste existante).",
        inputSchema: z.object({
          skills: z.array(z.string()).describe("Liste des compétences"),
        }),
        execute: async ({ skills }) => {
          await updateResume(userId, { skills });
          console.log("[Tool] setSkills:", skills.length, "skills");
          return { success: true, updated: "skills" };
        },
      }),

      // ── Tool 5: Add education ─────────────────────────────────────────────
      addEducation: tool({
        description: "Ajoute un diplôme ou une formation au CV.",
        inputSchema: z.object({
          institution: z.string().describe("Nom de l'établissement"),
          degree: z.string().describe("Niveau / diplôme"),
          field: z.string().optional().describe("Domaine d'études"),
          startDate: z.string().describe("Année de début"),
          endDate: z.string().optional().describe("Année de fin"),
        }),
        execute: async (args) => {
          const supabase = await createClient();
          const { data } = await supabase
            .from("resumes")
            .select("id, content")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false })
            .limit(1)
            .single();

          if (!data) return { success: false };

          const content = (data.content as Record<string, unknown>) ?? {};
          const existing = Array.isArray(content.education)
            ? (content.education as unknown[])
            : [];
          const updated = {
            ...content,
            education: [...existing, { ...args, id: crypto.randomUUID() }],
          };

          await supabase
            .from("resumes")
            .update({
              content: updated,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.id);

          console.log("[Tool] addEducation:", args.institution, args.degree);
          return { success: true, updated: "education" };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}

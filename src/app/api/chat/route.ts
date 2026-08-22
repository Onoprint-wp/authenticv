import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createClient } from "@/utils/supabase/server";
import { chatRateLimit } from "@/lib/rate-limit";
import { getUserPlan, incrementMessageCount } from "@/lib/plan";
import { DEFAULT_CV_DATA, type CvData } from "@/lib/schemas/cv.schema";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { createCvTools } from "@/lib/ai/tools/cv-tools";
import { ResumeService } from "@/services/resume.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// ── Sanitize API key (strip invisible \r\n from Vercel env vars) ──────────────
const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");

const DEFAULT_MODEL_PRO = "claude-sonnet-4-6";
const DEFAULT_MODEL_FREE = "claude-haiku-4-5";

const getAnthropicModel = (isPro: boolean = false) => {
  const provider = createAnthropic({ apiKey: sanitizedApiKey });
  const modelId = process.env.ANTHROPIC_MODEL ?? (isPro ? DEFAULT_MODEL_PRO : DEFAULT_MODEL_FREE);
  return provider(modelId);
};

interface MessagePart {
  type: string;
  text?: string;
}

interface RawUIMessage {
  role: "user" | "assistant" | "system";
  content?: string | MessagePart[];
  parts?: MessagePart[];
}

const extractText = (message: RawUIMessage): string => {
  // AI SDK v6 UIMessage: content="" (compat) + parts[].text (actual content)
  if (Array.isArray(message.parts)) {
    const fromParts = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n");
    if (fromParts.trim()) return fromParts;
  }
  if (typeof message.content === "string" && message.content.trim()) return message.content;
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part) => part.type === "text")
      .map((part) => part.text ?? "")
      .join("\n");
  }
  return "";
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

    // Suivi de l'utilisation mensuelle (non-bloquant pour la création de CV de base)
    const plan = await getUserPlan(user.id);
    const { messages } = await req.json();

    if (plan === "free") {
      await incrementMessageCount(user.id);
    }
    const headerLang = req.headers.get("X-Coach-Language");
    const lang: "fr" | "en" = headerLang === "en" ? "en" : "fr";
    const headerMode = req.headers.get("X-Chat-Mode");
    const mode: "coach" | "interview" = headerMode === "interview" ? "interview" : "coach";

    const MAX_HISTORY = 20;
    const coreMessages = ((messages as RawUIMessage[]) || [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: extractText(m),
      }))
      .filter((m) => m.content.trim().length > 0)
      .slice(-MAX_HISTORY);

    const userId = user.id;

    // Récupérer le CV actuel via la couche service
    const currentResume = await ResumeService.getLatestResume(supabase, userId);
    let currentResumeId: string | null = currentResume?.id ?? null;

    // État mémoire pour éviter les race conditions pendant les exécutions concurrentes de tools
    let localContent: CvData = currentResume?.content ?? { ...DEFAULT_CV_DATA };

    // Helper unifié pour appliquer les modifications au CV
    const applyUpdate = async (updater: (content: CvData) => CvData) => {
      localContent = updater(localContent);
      const res = await ResumeService.saveResumeContent(supabase, userId, currentResumeId, localContent);
      if (res.resumeId) {
        currentResumeId = res.resumeId;
      }
      return true;
    };

    const dynamicSystemPrompt = buildSystemPrompt(localContent, lang, mode);
    const tools = mode === "interview" ? undefined : createCvTools(applyUpdate);

    const result = streamText({
      model: getAnthropicModel(plan === "pro"),
      system: dynamicSystemPrompt,
      messages: coreMessages,
      ...(tools !== undefined ? { tools } : {}),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[API Chat POST Error]:", error);

    // Classification standardisée des erreurs pour l'interface utilisateur
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
      details: process.env.NODE_ENV === "development" ? errMsg : undefined,
    }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}

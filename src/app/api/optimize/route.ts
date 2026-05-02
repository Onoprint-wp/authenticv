import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateText, Output } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { optimizeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Sanitize API key (strip invisible \r\n from Vercel env vars) ──────────────
const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");

const DEFAULT_OPTIMIZE_MODEL = "claude-haiku-4-5";

const getOptimizeModel = () => {
  const provider = createAnthropic({ apiKey: sanitizedApiKey });
  const modelId = process.env.ANTHROPIC_OPTIMIZE_MODEL ?? DEFAULT_OPTIMIZE_MODEL;
  return provider(modelId);
};

// ─── Schéma de suggestion ─────────────────────────────────────────────────────

const SuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      section: z
        .string()
        .describe(
          "Section du CV concernée : 'Expériences', 'Compétences', 'Résumé', 'Formation', 'Langues', 'Projets', 'Certifications'"
        ),
      type: z
        .enum(["add", "rewrite", "highlight"])
        .describe(
          "Type : add=ajouter un élément manquant, rewrite=reformuler pour mieux correspondre, highlight=mettre en avant ce qui existe déjà"
        ),
      suggestion: z
        .string()
        .describe("Suggestion concrète et actionnable en français"),
      impact: z
        .enum(["high", "medium", "low"])
        .describe("Impact sur les chances d'être sélectionné"),
      chatPrompt: z
        .string()
        .describe(
          "Message prêt à envoyer à Alex pour appliquer cette suggestion (commence par un verbe d'action)"
        ),
    })
  ),
});

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Auth guard
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success: optimizeOk } = await optimizeRateLimit.limit(user.id);
  if (!optimizeOk) {
    return NextResponse.json(
      { error: "Trop d'analyses. Patientez une minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.jobDescription?.trim()) {
    return NextResponse.json(
      { error: "Le texte de l'offre d'emploi est requis." },
      { status: 400 }
    );
  }

  const { jobDescription } = body as { jobDescription: string };

  // Récupérer le CV actuel via Supabase
  const { data: resumes } = await supabase
    .from("resumes")
    .select("content")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  const cvJson = JSON.stringify(resumes?.[0]?.content ?? {}, null, 2);
  const truncatedJob = jobDescription.slice(0, 5000);

  try {
    const { output: object } = await generateText({
      model: getOptimizeModel(),
      output: Output.object({ schema: SuggestionSchema }),
      prompt: `Tu es un expert en recrutement qui analyse la compatibilité entre un CV et une offre d'emploi.

## CV actuel (JSON) :
\`\`\`json
${cvJson}
\`\`\`

## Offre d'emploi :
---
${truncatedJob}
---

## Ta mission :
Génère entre 3 et 7 suggestions CONCRÈTES et PRIORITISÉES pour améliorer ce CV afin de maximiser les chances d'être sélectionné pour ce poste.

RÈGLES :
- Identifie les mots-clés de l'offre absents du CV (compétences, outils, certifications)
- Identifie les expériences existantes à mettre davantage en valeur
- Propose des reformulations percutantes alignées sur le vocabulaire de l'offre
- Génère un chatPrompt prêt à l'emploi pour chaque suggestion (ex: "Reformule mon expérience chez X pour mettre en avant Docker et Kubernetes")
- Trie par impact décroissant (high en premier)`,
    });

    return NextResponse.json({ success: true, ...object });
  } catch (err) {
    console.error("[Optimize] Erreur LLM:", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    
    let status = 500;
    let errorCode = "internal_error";
    let userMessage = "Erreur lors de l'analyse par l'IA. Réessayez.";
    
    if (errMsg.includes("401") || errMsg.includes("authentication") || errMsg.includes("invalid x-api-key")) {
      status = 502;
      errorCode = "auth_error";
      userMessage = "Erreur d'authentification avec le service IA. Contactez le support.";
    } else if (errMsg.includes("rate") || errMsg.includes("429")) {
      status = 429;
      errorCode = "rate_limit";
      userMessage = "Le service IA est surchargé. Réessayez dans quelques secondes.";
    }
    
    return NextResponse.json(
      { error: errorCode, message: userMessage, details: process.env.NODE_ENV === "development" ? errMsg : undefined },
      { status }
    );
  }
}

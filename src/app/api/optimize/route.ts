import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  const body = await req.json().catch(() => null);
  if (!body?.jobDescription?.trim()) {
    return NextResponse.json(
      { error: "Le texte de l'offre d'emploi est requis." },
      { status: 400 }
    );
  }

  const { jobDescription } = body as { jobDescription: string };

  // Récupérer le CV actuel
  const resume = await prisma.resume.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { content: true },
  });

  const cvJson = JSON.stringify(resume?.content ?? {}, null, 2);
  const truncatedJob = jobDescription.slice(0, 5000);

  try {
    const { object } = await generateObject({
      model: anthropic("claude-haiku-4-5"),
      schema: SuggestionSchema,
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
    return NextResponse.json(
      { error: "Erreur lors de l'analyse par l'IA." },
      { status: 500 }
    );
  }
}

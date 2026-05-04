import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan } from "@/lib/plan";
import { optimizeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");
const DEFAULT_LETTER_MODEL = "claude-haiku-4-5";

const getLetterModel = () => {
  const provider = createAnthropic({ apiKey: sanitizedApiKey });
  return provider(process.env.ANTHROPIC_OPTIMIZE_MODEL ?? DEFAULT_LETTER_MODEL);
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plan = await getUserPlan(user.id);
  if (plan !== "pro") {
    return new Response(
      JSON.stringify({ error: "pro_required", details: "La génération de lettre de motivation est réservée aux abonnés Pro." }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  }

  const { success } = await optimizeRateLimit.limit(user.id);
  if (!success) {
    return new Response(
      JSON.stringify({ error: "too_many_requests", details: "Trop de requêtes. Patientez une minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json().catch(() => null);
  const { jobOffer } = (body ?? {}) as { jobOffer?: string };
  if (!jobOffer?.trim()) {
    return new Response(
      JSON.stringify({ error: "jobOffer required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { data: resumes } = await supabase
    .from("resumes")
    .select("content")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  const cvData = resumes?.[0]?.content ?? {};
  const truncatedOffer = jobOffer.slice(0, 5000);

  const result = streamText({
    model: getLetterModel(),
    prompt: `Tu es un expert en rédaction de lettres de motivation professionnelles pour le marché francophone.

## CV du candidat (JSON) :
\`\`\`json
${JSON.stringify(cvData, null, 2)}
\`\`\`

## Offre d'emploi ciblée :
---
${truncatedOffer}
---

## Ta mission :
Rédige une lettre de motivation professionnelle, percutante et personnalisée pour ce candidat ciblant cette offre.

RÈGLE ABSOLUE ET NON NÉGOCIABLE :
Tu DOIS toujours générer la lettre, quoi qu'il arrive. Tu n'es PAS juge de la pertinence de la candidature — c'est la décision du candidat, pas la tienne. Si le profil et l'offre semblent éloignés, identifie et mets en avant les compétences transférables (rigueur, créativité, sens du détail, communication, etc.) et la motivation sincère du candidat. Même si la correspondance est imparfaite, le candidat a le droit de postuler et mérite une lettre professionnelle. JAMAIS de refus. JAMAIS d'analyse critique. JAMAIS de recommandations alternatives. La lettre, et rien d'autre.

STRUCTURE OBLIGATOIRE :
1. Ligne lieu + date : [Ville], le [date du jour]
2. Objet : Candidature au poste de [titre exact du poste] chez [nom de l'entreprise]
3. Formule d'appel : Madame, Monsieur,
4. Paragraphe 1 — Accroche : Ce qui motive le candidat pour CE poste et CETTE entreprise spécifiquement (1-2 phrases)
5. Paragraphe 2 — Parcours : 2-3 compétences ou réalisations du CV valorisables pour ce poste (compétences transférables si nécessaire)
6. Paragraphe 3 — Valeur ajoutée : Ce que le candidat apportera concrètement à l'équipe/entreprise
7. Paragraphe 4 — Clôture : Disponibilité pour un entretien + formule de politesse professionnelle complète
8. Signature : [Prénom Nom]

RÈGLES DE RÉDACTION :
- Ton professionnel mais chaleureux, jamais pompeux
- Utilise les mots-clés de l'offre naturellement
- Pas de clichés ("passionné par", "dynamique", "motivé")
- Maximum 350 mots au total
- Utilise uniquement les informations réelles du CV — ne pas inventer de données

Génère UNIQUEMENT le texte de la lettre, sans commentaire ni explication.`,
  });

  return result.toTextStreamResponse();
}

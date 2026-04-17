import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Schéma Zod du CV (miroir de CvData dans useCvStore) ─────────────────────

const ExperienceSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  company: z.string().describe("Nom de l'entreprise"),
  position: z.string().describe("Intitulé du poste"),
  startDate: z.string().describe("Date de début au format YYYY-MM ou YYYY"),
  endDate: z.string().optional().describe("Date de fin, vide si poste actuel"),
  current: z.boolean().optional().default(false),
  description: z.string().describe("Description des missions et réalisations"),
});

const EducationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  institution: z.string(),
  degree: z.string().describe("Diplôme ou titre obtenu"),
  field: z.string().optional().describe("Domaine d'études"),
  startDate: z.string(),
  endDate: z.string().optional(),
});

const LanguageSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().describe("Nom de la langue (ex: Français, Anglais)"),
  level: z
    .string()
    .describe("Niveau (ex: Natif, Courant, B2, Intermédiaire)"),
});

const CertificationSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string(),
  issuer: z.string().describe("Organisme émetteur"),
  date: z.string().optional().describe("Date d'obtention"),
});

const ProjectSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string(),
  description: z.string(),
  link: z.string().optional().describe("Lien vers le projet (URL)"),
});

const CvDataSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().optional().default(""),
    lastName: z.string().optional().default(""),
    email: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    location: z.string().optional().default(""),
    linkedin: z.string().optional().default(""),
    title: z.string().optional().default(""),
  }),
  summary: z.string().optional().default(""),
  experiences: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(LanguageSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
});

// ─── Extracteurs de texte ─────────────────────────────────────────────────────

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mammoth = require("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

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

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide — multipart/form-data attendu" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  // Taille max : 10 MB
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (max 10 Mo)" },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  // Extraire le texte selon le type de fichier
  let rawText = "";
  try {
    if (fileName.endsWith(".pdf")) {
      rawText = await extractTextFromPdf(buffer);
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      rawText = await extractTextFromDocx(buffer);
    } else {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez un PDF ou DOCX." },
        { status: 415 }
      );
    }
  } catch (extractError) {
    console.error("[Upload] Erreur extraction texte:", extractError);
    return NextResponse.json(
      { error: "Impossible de lire le fichier. Vérifiez qu'il n'est pas protégé." },
      { status: 422 }
    );
  }

  if (!rawText.trim()) {
    return NextResponse.json(
      { error: "Le fichier ne contient pas de texte lisible." },
      { status: 422 }
    );
  }

  // Limiter le texte pour éviter de dépasser la fenêtre de contexte
  const truncatedText = rawText.slice(0, 12000);

  // Demander au LLM de structurer le texte en JSON CV
  try {
    const { object: parsedCv } = await generateObject({
      model: anthropic("claude-haiku-4-5"),
      schema: CvDataSchema,
      prompt: `Tu es un expert en parsing de CVs. Analyse le texte brut suivant extrait d'un CV et extrais toutes les informations structurées.

RÈGLES IMPORTANTES :
- Extrais TOUTES les expériences professionnelles mentionnées
- Reformule les descriptions en verbes d'action percutants si elles sont trop vagues
- Pour les dates, utilise le format YYYY-MM si possible, sinon YYYY
- Si le texte est en anglais, garde les informations en la langue d'origine
- N'invente aucune information qui n'est pas dans le texte

TEXTE DU CV :
---
${truncatedText}
---`,
    });

    return NextResponse.json({ success: true, cvData: parsedCv });
  } catch (llmError) {
    console.error("[Upload] Erreur LLM parsing:", llmError);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du CV par l'IA." },
      { status: 500 }
    );
  }
}

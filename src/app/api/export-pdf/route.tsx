import { renderToStream } from "@react-pdf/renderer";
import { CvDocument } from "@/components/pdf/CvDocument";
import { CvDocumentModern } from "@/components/pdf/CvDocumentModern";
import { CvDocumentMinimal } from "@/components/pdf/CvDocumentMinimal";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan, getUserSingleCredits, consumeSingleCredit } from "@/lib/plan";
import React from "react";

export const runtime = "nodejs"; // Requis pour @react-pdf/renderer sur le serveur
export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generatePdfResponse(cvData: any, showWatermark: boolean): Promise<Response> {
  // Convertir la photo en base64 pour éviter les échecs de fetch dans le contexte serverless
  if (cvData?.personalInfo?.photoUrl) {
    try {
      const imgRes = await fetch(cvData.personalInfo.photoUrl);
      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer();
        const contentType = imgRes.headers.get("content-type") || "image/jpeg";

        // react-pdf cannot render WebP — skip the photo in that case
        if (contentType.includes("webp")) {
          cvData.personalInfo.photoUrl = "";
        } else {
          cvData.personalInfo.photoUrl = `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
        }
      }
    } catch {
      cvData.personalInfo.photoUrl = "";
    }
  }

  // Génération du flux PDF selon le layout choisi
  const layout = cvData.designSettings?.layout ?? "classic";
  let docElement: React.ReactElement;
  if (layout === "modern") {
    docElement = <CvDocumentModern cvData={cvData} showWatermark={showWatermark} />;
  } else if (layout === "minimal") {
    docElement = <CvDocumentMinimal cvData={cvData} showWatermark={showWatermark} />;
  } else {
    docElement = <CvDocument cvData={cvData} showWatermark={showWatermark} />;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(docElement as any);

  // Construction du nom de fichier dynamique
  const firstName = cvData.personalInfo?.firstName?.trim() || "Authenti";
  const lastName = cvData.personalInfo?.lastName?.trim() || "CV";
  const fileName = `CV_${firstName}_${lastName}.pdf`.replace(/\s+/g, '_');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const plan = await getUserPlan(user.id);
    let showWatermark = plan !== "pro";

    // Si l'utilisateur a acheté un déblocage à l'acte (1 000 FCFA), on consomme 1 crédit pour exporter sans filigrane
    if (showWatermark) {
      const singleCredits = await getUserSingleCredits(user.id);
      if (singleCredits > 0) {
        const consumed = await consumeSingleCredit(user.id);
        if (consumed) {
          showWatermark = false;
        }
      }
    }

    // Récupérer le CV via Supabase
    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("content")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    const resume = resumes && resumes.length > 0 ? resumes[0] : null;

    if (!resume || !resume.content) {
      return new Response("Not found", { status: 404 });
    }

    return await generatePdfResponse(resume.content, showWatermark);
  } catch (error) {
    console.error("[Export PDF Error]:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let showWatermark = true;
    if (user) {
      const plan = await getUserPlan(user.id);
      if (plan === "pro") {
        showWatermark = false;
      } else {
        const singleCredits = await getUserSingleCredits(user.id);
        if (singleCredits > 0) {
          const consumed = await consumeSingleCredit(user.id);
          if (consumed) showWatermark = false;
        }
      }
    }

    const body = await req.json();
    const cvData = body.content;

    if (!cvData) {
      return new Response("Missing cvData content", { status: 400 });
    }

    return await generatePdfResponse(cvData, showWatermark);
  } catch (error) {
    console.error("[Export PDF POST Error]:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

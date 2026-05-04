import { renderToStream } from "@react-pdf/renderer";
import { CvDocument } from "@/components/pdf/CvDocument";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan } from "@/lib/plan";
import React from "react";

export const runtime = "nodejs"; // Requis pour @react-pdf/renderer sur le serveur
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const plan = await getUserPlan(user.id);
    if (plan !== "pro") {
      return new Response(
        JSON.stringify({ error: "pro_required", details: "L'export PDF est réservé aux abonnés Pro." }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
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

    if (!resume) {
      return new Response("Not found", { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cvData = resume.content as any;

    // Convertir la photo en base64 pour éviter les échecs de fetch dans le contexte serverless
    if (cvData?.personalInfo?.photoUrl) {
      try {
        const imgRes = await fetch(cvData.personalInfo.photoUrl);
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          const contentType = imgRes.headers.get("content-type") || "image/jpeg";
          cvData.personalInfo.photoUrl = `data:${contentType};base64,${Buffer.from(buffer).toString("base64")}`;
        }
      } catch {
        cvData.personalInfo.photoUrl = "";
      }
    }

    // Génération du flux PDF côté serveur
    const stream = await renderToStream(<CvDocument cvData={cvData} />);

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

  } catch (error) {
    console.error("[Export PDF Error]:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

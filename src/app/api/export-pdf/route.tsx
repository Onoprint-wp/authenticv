import { renderToStream } from "@react-pdf/renderer";
import { CvDocument } from "@/components/pdf/CvDocument";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import React from "react";

export const runtime = "nodejs"; // Requis pour @react-pdf/renderer sur le serveur
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const resume = await prisma.resume.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    if (!resume) {
      return new Response("Not found", { status: 404 });
    }

    const cvData = resume.content as any;
    
    // Génération du flux PDF côté serveur
    const stream = await renderToStream(<CvDocument cvData={cvData} />);

    // Construction du nom de fichier dynamique
    const firstName = cvData.personalInfo?.firstName?.trim() || "Authenti";
    const lastName = cvData.personalInfo?.lastName?.trim() || "CV";
    const fileName = `CV_${firstName}_${lastName}.pdf`.replace(/\s+/g, '_');

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

import { renderToStream } from "@react-pdf/renderer";
import { CoverLetterDocument } from "@/components/pdf/CoverLetterDocument";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan } from "@/lib/plan";
import React from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const plan = await getUserPlan(user.id);
    if (plan !== "pro") {
      return new Response(
        JSON.stringify({ error: "pro_required" }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    const { letterText } = await req.json();
    if (!letterText?.trim()) {
      return new Response("letterText required", { status: 400 });
    }

    const { data: resumes } = await supabase
      .from("resumes")
      .select("content")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cvData = (resumes?.[0]?.content ?? {}) as any;
    const stream = await renderToStream(
      <CoverLetterDocument letterText={letterText} cvData={cvData} />
    );

    const firstName = cvData?.personalInfo?.firstName?.trim() || "Lettre";
    const lastName = cvData?.personalInfo?.lastName?.trim() || "";
    const fileName = `Lettre_${firstName}_${lastName}.pdf`.replace(/\s+/g, "_");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("[Export Letter PDF Error]:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

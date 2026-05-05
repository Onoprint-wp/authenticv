import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide — multipart/form-data attendu" },
      { status: 400 }
    );
  }

  const file = formData.get("photo") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Photo trop volumineuse (max 2 Mo)" },
      { status: 413 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG ou WebP." },
      { status: 415 }
    );
  }

  try {
    let ext = file.name.split(".").pop() || "jpg";
    let buffer = Buffer.from(await file.arrayBuffer());
    let contentType = file.type;

    // @react-pdf/renderer only supports JPEG & PNG.
    // Convert WebP uploads to JPEG so the photo works everywhere.
    if (file.type === "image/webp") {
      try {
        const sharp = (await import("sharp")).default;
        buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer() as Buffer<ArrayBuffer>;
        ext = "jpg";
        contentType = "image/jpeg";
      } catch (sharpErr) {
        console.warn("[Upload Photo] sharp conversion failed, storing as-is:", sharpErr);
        // Fallback: store as webp — client-side viewer will still convert via canvas
      }
    }

    const filePath = `${user.id}/photo.${ext}`;

    // Upload to Supabase Storage (upsert to overwrite previous photo)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[Upload Photo] Storage error:", uploadError);
      return NextResponse.json(
        { error: "Erreur lors de l'upload de la photo." },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const photoUrl = urlData.publicUrl;

    // Persist photoUrl directly in the resume so a client-side refetch
    // (triggered by the AI coach) doesn't overwrite it before the debounced sync fires.
    const { data: resume } = await supabase
      .from("resumes")
      .select("id, content")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (resume) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const current = (resume.content as any) ?? {};
      await supabase
        .from("resumes")
        .update({
          content: {
            ...current,
            personalInfo: { ...(current.personalInfo ?? {}), photoUrl },
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", resume.id);
    }

    return NextResponse.json({ success: true, photoUrl });
  } catch (error) {
    console.error("[Upload Photo] Error:", error);
    return NextResponse.json(
      { error: "Erreur inattendue lors de l'upload." },
      { status: 500 }
    );
  }
}

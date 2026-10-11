import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { uploadRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo pour supporter les photos smartphone
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Rate limiting hybride : clé par user ID ou par IP pour les invités
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "guest_ip";
  const rateLimitKey = user ? user.id : `guest:${clientIp}`;
  const { success: rateOk } = await uploadRateLimit.limit(rateLimitKey);

  if (!rateOk) {
    return NextResponse.json(
      { error: "Limite de téléchargements atteinte. Veuillez patienter une minute." },
      { status: 429 }
    );
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
      { error: "Photo trop volumineuse (max 5 Mo)" },
      { status: 413 }
    );
  }

  const isAllowed = ALLOWED_TYPES.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!isAllowed) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG ou WebP." },
      { status: 415 }
    );
  }

  try {
    let ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    let buffer = Buffer.from(await file.arrayBuffer());
    let contentType = file.type || "image/jpeg";

    // @react-pdf/renderer only supports JPEG & PNG.
    // Convert WebP uploads to JPEG so the photo works everywhere.
    if (file.type === "image/webp" || ext === "webp") {
      try {
        const sharp = (await import("sharp")).default;
        buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer() as Buffer<ArrayBuffer>;
        ext = "jpg";
        contentType = "image/jpeg";
      } catch (sharpErr) {
        console.warn("[Upload Photo] sharp conversion failed, storing as-is:", sharpErr);
      }
    }

    const identifier = user ? user.id : `guest_${clientIp.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
    const filePath = `${identifier}/photo.${ext}`;

    let photoUrl = "";

    // Upload to Supabase Storage (upsert to overwrite previous photo)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      photoUrl = urlData.publicUrl;
    } else {
      console.warn("[Upload Photo] Storage upload warning, falling back to data URI:", uploadError);
      photoUrl = `data:${contentType};base64,${buffer.toString("base64")}`;
    }

    // Persist photoUrl directly in the resume for authenticated users
    if (user) {
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
    }

    return NextResponse.json({ success: true, photoUrl });
  } catch (error) {
    console.error("[Upload Photo] Error:", error);
    return NextResponse.json(
      { error: "Erreur inattendue lors de l'upload de la photo." },
      { status: 500 }
    );
  }
}

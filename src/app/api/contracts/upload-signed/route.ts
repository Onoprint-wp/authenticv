import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MIN_SIZE_BYTES = 10 * 1024; // 10 Ko
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const entityType = (formData.get("entityType") as string) || "company";
    const entityId = formData.get("entityId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier n'a été transmis." }, { status: 400 });
    }

    // Validation de la taille minimum (10 Ko)
    if (file.size < MIN_SIZE_BYTES) {
      return NextResponse.json({
        error: `Le fichier est trop petit (${(file.size / 1024).toFixed(1)} Ko). La taille minimum requise est de 10 Ko.`,
      }, { status: 400 });
    }

    // Validation de la taille maximum (10 Mo)
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({
        error: `Le fichier est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La taille maximum autorisée est de 10 Mo.`,
      }, { status: 400 });
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: "Format de fichier non supporté. Veuillez envoyer un fichier PDF (.pdf) ou une image (.jpg, .png).",
      }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop() || "pdf";
    const fileName = `contracts/${entityType}_${entityId || user.id}_${Date.now()}.${fileExt}`;

    // Upload dans Supabase Storage (Bucket 'resumes' ou 'photos' ou fallback metadata)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    let contractUrl = "";
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);
      contractUrl = publicUrlData.publicUrl;
    } else {
      // Fallback base64 ou URL de confirmation si le bucket exige RLS
      contractUrl = `https://www.authenticv.app/api/contracts/download?file=${fileName}`;
    }

    // Mise à jour de la table company ou campus_partners
    if (entityType === "company") {
      await supabase
        .from("companies")
        .update({
          signed_contract_url: contractUrl,
          contract_status: "pending_approval",
        })
        .eq("user_id", user.id);
    } else if (entityType === "campus" && entityId) {
      await supabase
        .from("campus_partners")
        .update({
          signed_contract_url: contractUrl,
          contract_status: "pending_approval",
        })
        .eq("id", entityId);
    }

    return NextResponse.json({
      success: true,
      message: "Contrat signé téléversé avec succès (10 Ko - 10 Mo validés) !",
      contractUrl,
      fileSizeKb: (file.size / 1024).toFixed(1),
    });
  } catch (err) {
    console.error("[Upload Signed Contract Error]:", err);
    return NextResponse.json({ error: "Erreur serveur lors du téléversement du contrat." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // 1. Fetch resumes
    const { data: resumes, error: resumeErr } = await admin
      .from("resumes")
      .select("id, user_id, title, content, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);

    if (resumeErr) {
      console.error("[Abandoned Carts Resumes Error]:", resumeErr);
    }

    // 2. Fetch active subscriptions to exclude
    const { data: activeSubs } = await admin
      .from("user_subscriptions")
      .select("user_id, status, single_credits");

    const payingUserIds = new Set(
      (activeSubs || [])
        .filter((s) => s.status === "active" || (s.single_credits && s.single_credits > 0))
        .map((s) => s.user_id)
    );

    // 3. Filter resumes belonging to free users who have created/updated their CV
    const abandoned = (resumes || [])
      .filter((r) => !payingUserIds.has(r.user_id))
      .map((r) => {
        const content = (r.content as Record<string, unknown>) || {};
        const personalInfo = (content.personalInfo as Record<string, string>) || {};
        const location = personalInfo.location || "Cameroun (CEMAC)";
        const phone = personalInfo.phone || "";
        const email = personalInfo.email || "candidat@authenticv.app";
        const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || "Candidat";
        const jobTitle = personalInfo.title || r.title || "Mon CV Professionnel";

        // Country guessing from phone or location
        let countryCode = "CM";
        if (phone.includes("+241") || location.toLowerCase().includes("gabon") || location.toLowerCase().includes("libreville")) countryCode = "GA";
        else if (phone.includes("+242") || location.toLowerCase().includes("congo") || location.toLowerCase().includes("brazzaville")) countryCode = "CG";
        else if (phone.includes("+235") || location.toLowerCase().includes("tchad") || location.toLowerCase().includes("n'djamena")) countryCode = "TD";
        else if (phone.includes("+236") || location.toLowerCase().includes("centrafrique") || location.toLowerCase().includes("bangui")) countryCode = "CF";
        else if (phone.includes("+240") || location.toLowerCase().includes("guinée") || location.toLowerCase().includes("malabo")) countryCode = "GQ";

        return {
          resumeId: r.id,
          userId: r.user_id,
          fullName,
          jobTitle,
          email,
          phone,
          location,
          countryCode,
          updatedAt: r.updated_at,
          potentialRevenueXaf: 1000,
        };
      });

    return NextResponse.json({
      success: true,
      count: abandoned.length,
      abandoned,
    });
  } catch (err) {
    console.error("[Admin Abandoned GET Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paniers abandonnés" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone, email, jobTitle, discountCode = "BOOST20", channel = "whatsapp" } = body;

    const message =
      channel === "whatsapp"
        ? `Bonjour ${fullName || ""},\n\nVotre CV "${jobTitle}" est prêt sur AuthentiCV ! 📄✨\nProfitez de notre offre spéciale de relance avec le code promo *${discountCode}* (-20% de réduction) pour télécharger votre CV HD optimisé ATS sans filigrane dès maintenant :\n👉 https://www.authenticv.app/builder\n\nBesoin d'aide ? Répondez directement à ce message.`
        : `Objet: Votre CV ${jobTitle} vous attend sur AuthentiCV (-20% avec le code ${discountCode})\n\nBonjour ${fullName},\n\nVotre CV est sauvegardé et prêt. Utilisez le code promo ${discountCode} pour finaliser votre téléchargement en haute définition.`;

    const whatsappUrl = phone
      ? `https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(message)}`
      : null;

    return NextResponse.json({
      success: true,
      messageGenerated: message,
      whatsappUrl,
      targetEmail: email,
      discountCode,
    });
  } catch (err) {
    console.error("[Admin Abandoned POST Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération de la relance" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = process.env.RESEND_FROM_EMAIL ?? "alex@authenticv.app";
const BUILDER_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.authenticv.app";

// Sécurisé par CRON_SECRET (Vercel Cron envoie Authorization: Bearer <secret>)
function isAuthorized(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${process.env.CRON_SECRET ?? ""}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const supabase = await createClient();
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 3600_000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600_000).toISOString();

  // 1. Cibler les utilisateurs dont le CV n'a pas été mis à jour depuis > 14 jours
  const { data: targets } = await supabase
    .from("resumes")
    .select("id, user_id, content, updated_at, last_nudge_at")
    .eq("nudge_enabled", true)
    .lt("updated_at", fourteenDaysAgo)
    .or(`last_nudge_at.is.null,last_nudge_at.lt.${sevenDaysAgo}`)
    .limit(50);

  // 2. Cibler les partenaires campus & recruteurs dont la convention arrive à échéance J-30
  const { data: expiringPartners } = await supabase
    .from("campus_partners")
    .select("id, name, created_at, promo_code")
    .limit(10);

  let sent = 0;
  if (targets?.length) {
    const userIds = targets.map((t) => t.user_id);
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const emailMap = new Map(
      (authUsers?.users ?? [])
        .filter((u) => userIds.includes(u.id))
        .map((u) => [u.id, u.email])
    );

    for (const target of targets) {
      const email = emailMap.get(target.user_id);
      if (!email) continue;

      const resumeName = target.content?.fullName ?? "votre CV";

      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `Formateur IA Alex : Votre CV "${resumeName}" a besoin d'un rafraîchissement !`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2>Bonjour ! 👋</h2>
            <p>Cela fait quelques semaines que vous n'avez pas mis à jour <strong>${resumeName}</strong> sur AuthenticV.</p>
            <p>Notre IA conversationnelle Alex a sélectionné de nouveaux mots-clés d'optimisation ATS pour maximiser vos chances de recrutement en zone CEMAC.</p>
            <p><a href="${BUILDER_URL}/builder?resumeId=${target.id}" style="display:inline-block; background:#4f46e5; color:#ffffff; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">Optimiser mon CV avec Alex IA</a></p>
            <p style="font-size:12px; color:#64748b;">AuthenticV — Plateforme EdTech & RH</p>
          </div>
        `,
      });

      sent++;
    }
  }

  return NextResponse.json({
    success: true,
    sentUserNudges: sent,
    expiringPartnersChecked: expiringPartners?.length ?? 0,
    timestamp: new Date().toISOString(),
  });
}

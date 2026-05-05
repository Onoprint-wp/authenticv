import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FROM = process.env.RESEND_FROM_EMAIL ?? "alex@authenticv.com";
const BUILDER_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://authenticv.com";

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

  // Cibler les utilisateurs dont le CV n'a pas été mis à jour depuis > 14 jours
  // ET qui n'ont pas reçu de nudge depuis > 7 jours (ou jamais)
  // ET qui ont activé les nudges
  const { data: targets } = await supabase
    .from("resumes")
    .select("id, user_id, content, updated_at, last_nudge_at")
    .eq("nudge_enabled", true)
    .lt("updated_at", fourteenDaysAgo)
    .or(`last_nudge_at.is.null,last_nudge_at.lt.${sevenDaysAgo}`)
    .limit(50); // sécurité anti-spam

  if (!targets?.length) {
    return NextResponse.json({ sent: 0 });
  }

  // Récupérer les emails depuis auth.users via l'admin client
  const userIds = targets.map((t) => t.user_id);
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const emailMap = new Map(
    (authUsers?.users ?? [])
      .filter((u) => userIds.includes(u.id))
      .map((u) => [u.id, u.email])
  );

  let sent = 0;
  const resumeUpdates: string[] = [];

  for (const target of targets) {
    const email = emailMap.get(target.user_id);
    if (!email) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cv = (target.content as any) ?? {};
    const firstName = cv.personalInfo?.firstName || "vous";
    const daysSinceUpdate = Math.round(
      (now.getTime() - new Date(target.updated_at).getTime()) / 86_400_000
    );

    const subject = `Alex a des conseils pour améliorer votre CV`;
    const html = buildNudgeEmail(firstName, daysSinceUpdate, BUILDER_URL);

    const { error } = await resend.emails.send({ from: FROM, to: email, subject, html });
    if (!error) {
      sent++;
      resumeUpdates.push(target.id);
    }
  }

  // Marquer les résumés comme nudgés
  if (resumeUpdates.length) {
    await supabase
      .from("resumes")
      .update({ last_nudge_at: now.toISOString() })
      .in("id", resumeUpdates);
  }

  return NextResponse.json({ sent });
}

function buildNudgeEmail(firstName: string, days: number, builderUrl: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,sans-serif;color:#e2e8f0;">
  <div style="max-width:520px;margin:40px auto;padding:32px 24px;">
    <div style="margin-bottom:24px;">
      <div style="width:40px;height:40px;background:#4f46e5;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="color:#fff;font-size:18px;">✦</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:20px;color:#f1f5f9;">Bonjour ${firstName} 👋</h1>
      <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.6;">
        Votre CV n'a pas été mis à jour depuis <strong style="color:#e2e8f0;">${days} jours</strong>.
        Votre coach Alex a quelques idées pour le rendre encore plus percutant.
      </p>
    </div>
    <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:13px;color:#94a3b8;">Ce que vous pouvez améliorer :</p>
      <ul style="margin:0;padding:0 0 0 16px;color:#cbd5e1;font-size:13px;line-height:2;">
        <li>Complétez votre résumé professionnel</li>
        <li>Ajoutez vos dernières expériences</li>
        <li>Mettez à jour vos compétences</li>
      </ul>
    </div>
    <a href="${builderUrl}/builder" style="display:block;text-align:center;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;">
      Ouvrir mon CV avec Alex →
    </a>
    <p style="margin:24px 0 0;font-size:11px;color:#475569;text-align:center;">
      Pour ne plus recevoir ces emails, désactivez les conseils dans votre
      <a href="${builderUrl}/account" style="color:#6366f1;">espace compte</a>.
    </p>
  </div>
</body>
</html>`;
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://authenticv.vercel.app";
const FROM = process.env.RESEND_FROM_EMAIL ?? "alex@authenticv.com";

async function sendWelcomeEmail(email: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `Alex — AuthentiCV <${FROM}>`,
      to: email,
      subject: "Bienvenue sur AuthentiCV 👋",
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">

    <!-- Logo -->
    <div style="margin-bottom:32px">
      <span style="display:inline-flex;align-items:center;gap:10px">
        <span style="display:inline-block;width:36px;height:36px;background:#4f46e5;border-radius:8px;text-align:center;line-height:36px;font-size:18px">📄</span>
        <span style="color:#ffffff;font-size:18px;font-weight:700">AuthentiCV</span>
      </span>
    </div>

    <!-- Hero -->
    <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 12px">
      Bienvenue ! Je suis Alex, votre coach CV ✨
    </h1>
    <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 28px">
      Votre compte est créé. Je suis là pour vous aider à construire un CV qui vous ressemble
      vraiment — authentique, percutant, et optimisé pour les recruteurs.
    </p>

    <!-- Steps -->
    <div style="background:#1e293b;border-radius:12px;padding:24px;margin-bottom:28px">
      <p style="color:#e2e8f0;font-size:13px;font-weight:600;margin:0 0 16px;text-transform:uppercase;letter-spacing:0.05em">
        Par où commencer ?
      </p>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;gap:14px;align-items:flex-start">
          <span style="background:#312e81;color:#a5b4fc;border-radius:50%;width:26px;height:26px;min-width:26px;text-align:center;line-height:26px;font-size:12px;font-weight:700">1</span>
          <div>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0 0 2px">Dites-moi qui vous êtes</p>
            <p style="color:#64748b;font-size:13px;margin:0">Parlez-moi dans le chat — je noterai tout et construirai votre CV avec vous.</p>
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start">
          <span style="background:#312e81;color:#a5b4fc;border-radius:50%;width:26px;height:26px;min-width:26px;text-align:center;line-height:26px;font-size:12px;font-weight:700">2</span>
          <div>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0 0 2px">Ou importez votre CV existant</p>
            <p style="color:#64748b;font-size:13px;margin:0">Glissez un PDF ou Word — je l'analyse et le mets en forme instantanément.</p>
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start">
          <span style="background:#312e81;color:#a5b4fc;border-radius:50%;width:26px;height:26px;min-width:26px;text-align:center;line-height:26px;font-size:12px;font-weight:700">3</span>
          <div>
            <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0 0 2px">Suivez votre score ATS</p>
            <p style="color:#64748b;font-size:13px;margin:0">Je calcule en temps réel vos chances de passer les filtres automatiques des recruteurs.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:36px">
      <a href="${SITE_URL}/builder"
         style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600">
        Créer mon CV maintenant →
      </a>
    </div>

    <!-- Footer -->
    <hr style="border:none;border-top:1px solid #1e293b;margin-bottom:20px">
    <p style="color:#475569;font-size:12px;text-align:center;margin:0">
      Vous recevez cet e-mail car vous venez de créer un compte sur
      <a href="${SITE_URL}" style="color:#6366f1">AuthentiCV</a>.<br>
      <a href="${SITE_URL}/account" style="color:#475569">Gérer mes préférences e-mail</a>
    </p>
  </div>
</body>
</html>`,
    });
  } catch {
    // Non-bloquant — l'auth ne doit jamais échouer à cause de l'email
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type"); // "signup" | "recovery" | "magiclink"
  const next = searchParams.get("next") ?? "/builder";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Envoyer l'email de bienvenue uniquement pour les nouvelles inscriptions
      if (type === "signup" && data.user?.email) {
        void sendWelcomeEmail(data.user.email);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Le lien de confirmation a expiré ou est invalide. Veuillez réessayer.")}`
  );
}

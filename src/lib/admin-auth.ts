import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Source unique de la liste blanche des administrateurs.
 * - Comptes codés en dur : historiques du projet (identiques à l'ancienne liste dupliquée).
 * - ADMIN_EMAIL / ADMIN_EMAILS (séparés par des virgules) : ajout via variables d'environnement.
 *
 * ⚠️ Ne JAMAIS ajouter ici un compte de test : le dépôt est public et l'inscription Supabase
 *    ne demande pas de confirmation d'email (mailer_autoconfirm) → n'importe qui pourrait
 *    créer ce compte et devenir admin. Pour les tests, utiliser ADMIN_EMAILS en local.
 */
const HARDCODED_ADMIN_EMAILS = [
  "onoprint25@gmail.com",
];

export function getAdminEmails(): string[] {
  const fromEnv = [process.env.ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS ?? "").split(",")]
    .map((e) => (e ?? "").trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...HARDCODED_ADMIN_EMAILS, ...fromEnv]));
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/**
 * Garde serveur pour les routes /api/admin/*.
 * Retourne { user } si admin, sinon { response } (401 / 403) à renvoyer tel quel.
 */
export async function verifyAdmin(): Promise<{ user: User } | { response: NextResponse }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (!isAdminEmail(user.email)) {
    return {
      response: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }),
    };
  }

  return { user };
}

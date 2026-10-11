import crypto from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";
import type { createClient } from "@/utils/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export type GuestProvisionResult =
  | { ok: true; userId: string; userEmail: string }
  | { ok: false; status: number; code: string; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_JSON_CHARS = 1_500_000;

function isEmailTaken(err: { code?: string; message?: string; status?: number } | null): boolean {
  if (!err) return false;
  return err.code === "email_exists" || err.status === 422 || /already (been )?registered|already exists/i.test(err.message ?? "");
}

/** Keeps the CV payload reasonable (base64 photos can be huge) and returns null if empty/invalid. */
function sanitizeCvContent(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const cv = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;
  if (Object.keys(cv).length === 0) return null;
  if (JSON.stringify(cv).length > MAX_CV_JSON_CHARS) {
    const pi = cv.personalInfo as Record<string, unknown> | undefined;
    if (pi && typeof pi.photoUrl === "string" && pi.photoUrl.startsWith("data:")) {
      pi.photoUrl = "";
    }
    if (JSON.stringify(cv).length > MAX_CV_JSON_CHARS) return null;
  }
  return cv;
}

/**
 * Zero-login checkout: creates a fresh account for the visitor, OPENS A SESSION on it
 * (auth cookies are set on the current response) and saves the CV built in guest mode.
 *
 * Without the session, the webhook credits an account the visitor cannot access and the
 * PDF stays locked after payment. We never sign a visitor into a pre-existing account:
 * if a real email is already registered, the caller must ask them to log in.
 */
export async function provisionGuestSession(opts: {
  supabase: ServerSupabase;
  rawEmail: string;
  cleanPhone: string;
  createdVia: string;
  extraMetadata?: Record<string, unknown>;
  cvContent?: unknown;
}): Promise<GuestProvisionResult> {
  const { supabase, rawEmail, cleanPhone, createdVia, extraMetadata, cvContent } = opts;
  const admin = createAdminClient();
  const password = crypto.randomBytes(24).toString("base64url");
  const hasRealEmail = EMAIL_RE.test(rawEmail) && !rawEmail.endsWith("@authenticv.app");

  const candidates = hasRealEmail
    ? [rawEmail]
    : cleanPhone
      ? [`candidat_${cleanPhone}@authenticv.app`, `candidat_${cleanPhone}_${crypto.randomUUID().slice(0, 6)}@authenticv.app`]
      : [`guest_${crypto.randomUUID().slice(0, 12)}@authenticv.app`];

  let userId = "";
  let userEmail = "";

  for (const email of candidates) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        created_via: createdVia,
        phone: cleanPhone || undefined,
        contact_email: hasRealEmail ? rawEmail : undefined,
        ...extraMetadata,
      },
    });
    if (!error && data?.user) {
      userId = data.user.id;
      userEmail = email;
      break;
    }
    if (isEmailTaken(error)) {
      if (hasRealEmail) {
        return {
          ok: false,
          status: 409,
          code: "ACCOUNT_EXISTS",
          error: "Un compte existe déjà avec cet email. Connectez-vous pour finaliser votre paiement : votre CV sera conservé.",
        };
      }
      continue; // phone-derived alias taken → try the next unique alias
    }
    console.error("[GuestCheckout] createUser failed:", error?.message);
    break;
  }

  if (!userId) {
    return { ok: false, status: 500, code: "GUEST_CREATE_FAILED", error: "Impossible de préparer votre paiement. Réessayez dans un instant." };
  }

  // Open the session on THIS browser (sets sb-* cookies on the response).
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: userEmail, password });
  if (signInError) {
    console.error("[GuestCheckout] signIn failed:", signInError.message);
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    return { ok: false, status: 500, code: "GUEST_SESSION_FAILED", error: "Impossible de préparer votre session. Réessayez dans un instant." };
  }

  // Persist the guest CV so that the PDF export (server-side, reads `resumes`) works after payment.
  const content = sanitizeCvContent(cvContent);
  if (content) {
    const { error: resumeError } = await admin
      .from("resumes")
      .insert({ user_id: userId, content, is_default: true });
    if (resumeError) console.error("[GuestCheckout] resume insert failed:", resumeError.message);
  }

  return { ok: true, userId, userEmail };
}

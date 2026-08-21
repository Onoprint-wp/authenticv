import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createMoovPaymentLink, SITE_URL } from "@/lib/moov";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/moov/recruiter-checkout
 *
 * Body: { pack: "single" | "pack5" | "pack15" | "monthly_pro", countryCode?: string }
 * Creates a Moov Money payment link for Recruiter credits / subscriptions.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let pack = "pack5";
  let countryCode = "GA";

  try {
    const body = await req.json();
    if (body.pack) pack = String(body.pack);
    if (body.countryCode) countryCode = String(body.countryCode).toUpperCase();
  } catch {
    // default
  }

  let amount = 15000; // Pack 5 CVs default (15 000 FCFA)
  let description = "AuthenticV Recruteur – Pack 5 CVs (Moov Money)";

  if (pack === "single") {
    amount = 5000;
    description = "AuthenticV Recruteur – 1 Déblocage Candidat (Moov Money)";
  } else if (pack === "pack15") {
    amount = 50000;
    description = "AuthenticV Recruteur – Pack 15 CVs (Moov Money)";
  } else if (pack === "monthly_pro") {
    amount = 75000;
    description = "AuthenticV Recruteur – Pass Pro Mensuel Illimité (Moov Money)";
  }

  const externalRef = `recruiter:${user.id}:${pack}`;

  try {
    const result = await createMoovPaymentLink({
      amount,
      userId: externalRef,
      userEmail: user.email ?? "",
      countryCode,
      redirectUrl: `${SITE_URL}/recruiter?credited=true&gateway=moov&pack=${pack}`,
      description,
    });

    return NextResponse.json({ url: result.payment_url, transaction_id: result.transaction_id });
  } catch (err) {
    console.error("[Moov Recruiter Checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement recruteur Moov Money" },
      { status: 500 }
    );
  }
}

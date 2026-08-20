import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createPaymentLink, SITE_URL } from "@/lib/campay";
import { RECRUITER_PRICES, type RecruiterPackType } from "@/lib/recruiter-plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/campay/recruiter-checkout
 * Body: { pack: "single" | "pack5" | "pack15" | "monthly_pro", companyName?: string }
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const pack = (body.pack ?? "pack5") as RecruiterPackType;

    const packConfig = RECRUITER_PRICES[pack];
    if (!packConfig) {
      return NextResponse.json({ error: "Pack recruteur invalide" }, { status: 400 });
    }

    // Ensure company record exists in companies table
    const companyName = body.companyName || user.user_metadata?.company_name || user.email?.split("@")[0] || "Entreprise";
    
    await supabase.from("companies").upsert(
      {
        user_id: user.id,
        company_name: companyName,
        email: user.email ?? "",
      },
      { onConflict: "user_id" }
    );

    // External reference formatted to indicate recruiter purchase:
    // "recruiter:{userId}:{pack}"
    const externalRef = `recruiter:${user.id}:${pack}`;

    const result = await createPaymentLink({
      amount: packConfig.amount,
      userId: externalRef,
      userEmail: user.email ?? "",
      redirectUrl: `${SITE_URL}/recruiter/search?payment=success&pack=${pack}`,
      description: `AuthenticV Recruteur – ${packConfig.label}`,
    });

    return NextResponse.json({ url: result.link });
  } catch (err) {
    console.error("[Recruiter CamPay Checkout Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement recruteur" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createPaymentLink, SITE_URL } from "@/lib/campay";
import { RECRUITER_PRICES, type RecruiterPackType } from "@/lib/recruiter-plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/campay/recruiter-checkout
 * Body: { pack: "single" | "pack5" | "pack15" | "monthly_pro", companyName?: string, promoCode?: string }
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
    const promoCode = (body.promoCode || "").trim().toUpperCase();

    const packConfig = RECRUITER_PRICES[pack];
    if (!packConfig) {
      return NextResponse.json({ error: "Pack recruteur invalide" }, { status: 400 });
    }

    let finalAmount = packConfig.amount;
    let discountApplied = 0;

    // Validate promo code if provided
    if (promoCode) {
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode)
        .eq("is_active", true)
        .maybeSingle();

      const discountPercent = promo?.discount_percent || 10; // Default 10% for commercial affiliate codes
      discountApplied = Math.round(finalAmount * (discountPercent / 100));
      finalAmount = finalAmount - discountApplied;
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

    // External reference formatted to indicate recruiter purchase & affiliate tracking:
    // "recruiter:{userId}:{pack}:{promoCode}"
    const externalRef = `recruiter:${user.id}:${pack}${promoCode ? `:${promoCode}` : ""}`;

    const result = await createPaymentLink({
      amount: finalAmount,
      userId: externalRef,
      userEmail: user.email ?? "",
      redirectUrl: `${SITE_URL}/recruiter/search?payment=success&pack=${pack}${promoCode ? `&ref=${promoCode}` : ""}`,
      description: `AuthenticV Recruteur – ${packConfig.label}${discountApplied > 0 ? ` (-${discountApplied} F Réduction ${promoCode})` : ""}`,
    });

    return NextResponse.json({ url: result.link, finalAmount, discountApplied });
  } catch (err) {
    console.error("[Recruiter CamPay Checkout Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'initialisation du paiement recruteur" },
      { status: 500 }
    );
  }
}

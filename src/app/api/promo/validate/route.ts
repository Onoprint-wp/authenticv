import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { PRICE_SINGLE_XAF, PRICE_MONTHLY_XAF, PRICE_ANNUAL_XAF } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Static configured promo codes (with partner attribution)
const STATIC_PROMO_CODES: Record<string, { discountPercent: number; name: string; requiredDomain?: string }> = {
  CAMPUS20: { discountPercent: 20, name: "Partenariat Campus CEMAC (-20%)" },
  STUDENT50: { discountPercent: 50, name: "Tarif Étudiant Spécial (-50%)" },
  UY1: { discountPercent: 30, name: "Université de Yaoundé I (-30%)", requiredDomain: "univ-yaounde1.cm" },
  UDLA: { discountPercent: 30, name: "Université de Douala (-30%)", requiredDomain: "univ-douala.cm" },
  UBUEA: { discountPercent: 30, name: "University of Buea (-30%)", requiredDomain: "ubuea.cm" },
  UDSH: { discountPercent: 30, name: "Université de Dschang (-30%)", requiredDomain: "univ-dschang.org" },
  AUTHVIP: { discountPercent: 25, name: "Code Partenaire VIP (-25%)" },
  LAUNCH2026: { discountPercent: 20, name: "Offre Spéciale Lancement (-20%)" },
};

/**
 * POST /api/promo/validate
 * Body: { promoCode?: string, email?: string, tier?: "single" | "monthly" | "annual" }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const promoCode = (body.promoCode || "").trim().toUpperCase();
    const email = (body.email || "").trim().toLowerCase();
    const tier = (body.tier || "monthly") as "single" | "monthly" | "annual";

    let basePrice = PRICE_MONTHLY_XAF;
    if (tier === "single") basePrice = PRICE_SINGLE_XAF;
    if (tier === "annual") basePrice = PRICE_ANNUAL_XAF;

    let discountPercent = 0;
    let partnerName = "";
    let requiredDomain: string | undefined;

    // 1. Check static promo codes
    if (promoCode && STATIC_PROMO_CODES[promoCode]) {
      discountPercent = STATIC_PROMO_CODES[promoCode].discountPercent;
      partnerName = STATIC_PROMO_CODES[promoCode].name;
      requiredDomain = STATIC_PROMO_CODES[promoCode].requiredDomain;
    }

    // 2. Check campus_partners table by email domain or promo code in DB
    if (!discountPercent && (email || promoCode)) {
      const supabase = await createClient();
      const userDomain = email ? email.split("@")[1] : "";

      if (userDomain) {
        const { data: partnerByDomain } = await supabase
          .from("campus_partners")
          .select("university_name, discount_percent, domain")
          .eq("domain", userDomain)
          .maybeSingle();

        if (partnerByDomain) {
          discountPercent = partnerByDomain.discount_percent || 20;
          partnerName = `${partnerByDomain.university_name} (-${discountPercent}%)`;
        }
      }

      if (!discountPercent && promoCode) {
        const { data: partnerByCode } = await supabase
          .from("campus_partners")
          .select("university_name, discount_percent, domain")
          .or(`domain.ilike.%${promoCode}%,university_name.ilike.%${promoCode}%`)
          .maybeSingle();

        if (partnerByCode) {
          discountPercent = partnerByCode.discount_percent || 20;
          partnerName = `${partnerByCode.university_name} (-${discountPercent}%)`;
          requiredDomain = partnerByCode.domain || undefined;
        }
      }
    }

    if (discountPercent <= 0) {
      return NextResponse.json(
        { valid: false, error: "Code promo ou partenariat non reconnu." },
        { status: 400 }
      );
    }

    // Verification du domaine académique si requis
    if (requiredDomain && email) {
      const userDomain = email.split("@")[1];
      if (userDomain && !userDomain.toLowerCase().endsWith(requiredDomain.toLowerCase())) {
        return NextResponse.json({
          valid: false,
          error: `Ce code promo est exclusivement réservé aux étudiants de l'établissement avec une adresse email @${requiredDomain}.`,
        }, { status: 400 });
      }
    }

    const discountedPrice = Math.max(100, Math.round(basePrice * (1 - discountPercent / 100)));
    const savings = basePrice - discountedPrice;

    return NextResponse.json({
      valid: true,
      code: promoCode || "CAMPUS_DOMAIN",
      partnerName,
      discountPercent,
      originalPrice: basePrice,
      discountedPrice,
      savings,
    });
  } catch (err) {
    console.error("[Promo Validate Error]:", err);
    return NextResponse.json(
      { valid: false, error: "Erreur lors de la validation du code." },
      { status: 500 }
    );
  }
}

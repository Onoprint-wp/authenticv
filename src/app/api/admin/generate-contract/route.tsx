import { renderToStream } from "@react-pdf/renderer";
import { createClient } from "@/utils/supabase/server";
import { CampusCemacContractDocument } from "@/components/pdf/contracts/CampusCemacContractDocument";
import { RecruiterB2BCemacContractDocument } from "@/components/pdf/contracts/RecruiterB2BCemacContractDocument";
import React from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Authentification minimale requise
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      contractType,
      countryCode = "CM",
      universityName,
      representativeName = "Le Représentant Légal",
      promoCode = "CAMPUS20",
      discountPercent = 20,
      commissionPercent = 0,
      companyName,
      rccm = "En cours",
      niu = "En cours",
      creditsPurchased = 5,
      totalPriceFcfa = "25 000 FCFA",
    } = body;

    let filename = `Contrat_${Date.now()}.pdf`;

    if (contractType === "campus") {
      filename = `Convention_Campus_${(universityName || "Université").replace(/\s+/g, "_")}.pdf`;
      const stream = await renderToStream(
        <CampusCemacContractDocument
          universityName={universityName || "Université Partenaire"}
          countryCode={countryCode}
          representativeName={representativeName}
          promoCode={promoCode}
          discountPercent={Number(discountPercent) || 20}
          commissionPercent={Number(commissionPercent) || 0}
        />
      );
      return new Response(stream as unknown as ReadableStream, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else if (contractType === "recruiter") {
      filename = `Contrat_Recruteur_B2B_${(companyName || user.email?.split("@")[0] || "Entreprise").replace(/\s+/g, "_")}.pdf`;
      const stream = await renderToStream(
        <RecruiterB2BCemacContractDocument
          companyName={companyName || user.email?.split("@")[0] || "Entreprise Cliente"}
          rccm={rccm}
          niu={niu}
          countryCode={countryCode}
          representativeName={representativeName !== "Le Représentant Légal" ? representativeName : (user.email || "Représentant RH")}
          creditsPurchased={Number(creditsPurchased) || 5}
          totalPriceFcfa={totalPriceFcfa}
        />
      );
      return new Response(stream as unknown as ReadableStream, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } else {
      return new Response("Type de contrat invalide", { status: 400 });
    }
  } catch (err) {
    console.error("[Generate Contract API Error]:", err);
    return new Response("Erreur serveur lors de la génération du contrat PDF", { status: 500 });
  }
}

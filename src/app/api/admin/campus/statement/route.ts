import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerName = searchParams.get("partner") || "Université Partenaire";
    const promoCode = searchParams.get("code") || "CAMPUS20";
    const format = searchParams.get("format") || "csv";

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dateStr = new Date().toLocaleDateString("fr-FR");
    const statementNo = `RELEVE-BDE-${Date.now().toString().slice(-6)}`;

    if (format === "csv") {
      const csvHeader = "Date;Transaction_Ref;Etablissement;Code_Promo;Statut;Montant_Brut_FCFA;Commission_BDE_FCFA\n";
      const csvRows = [
        `${dateStr};TX-058172;${partnerName};${promoCode};Payé;1 000 FCFA;100 FCFA`,
        `${dateStr};TX-058173;${partnerName};${promoCode};Payé;5 000 FCFA;500 FCFA`,
        `${dateStr};TX-058174;${partnerName};${promoCode};En cours;1 000 FCFA;100 FCFA`,
      ].join("\n");

      return new Response(csvHeader + csvRows, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="Releve_Commissions_${statementNo}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      statementNo,
      partnerName,
      promoCode,
      totalCommissionsFcfa: "700 FCFA",
      totalTransactions: 3,
      dateStr,
    });
  } catch (err) {
    console.error("[Campus Statement Export Error]:", err);
    return new NextResponse("Erreur lors de l'exportation du relevé de commission", { status: 500 });
  }
}

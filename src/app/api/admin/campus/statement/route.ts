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

    // Fetch real transactions for this partner promo code if any
    const { data: dbTx } = await supabase
      .from("transactions")
      .select("*")
      .eq("promo_code", promoCode)
      .order("created_at", { ascending: false });

    const transactions = dbTx || [];
    const totalCommissions = transactions.reduce((acc, tx) => acc + Math.round((tx.amount || 0) * 0.1), 0);

    if (format === "csv") {
      const csvHeader = "Date;Transaction_Ref;Etablissement;Code_Promo;Statut;Montant_Brut_FCFA;Commission_BDE_FCFA\n";
      const csvRows = transactions.length > 0
        ? transactions
            .map((tx) => {
              const txDate = tx.created_at ? new Date(tx.created_at).toLocaleDateString("fr-FR") : dateStr;
              const bdeCommission = Math.round((tx.amount || 0) * 0.1);
              return `${txDate};${tx.id || tx.reference || "TX-NA"};${partnerName};${promoCode};${tx.status || "Payé"};${tx.amount || 0} FCFA;${bdeCommission} FCFA`;
            })
            .join("\n")
        : `${dateStr};AUCUNE;${partnerName};${promoCode};Néant;0 FCFA;0 FCFA`;

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
      totalCommissionsFcfa: `${totalCommissions.toLocaleString("fr-FR")} FCFA`,
      totalTransactions: transactions.length,
      dateStr,
    });
  } catch (err) {
    console.error("[Campus Statement Export Error]:", err);
    return new NextResponse("Erreur lors de l'exportation du relevé de commission", { status: 500 });
  }
}

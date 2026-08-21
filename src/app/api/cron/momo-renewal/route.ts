import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cron/momo-renewal
 * Routine automatisée exécutable quotidiennement par Vercel Cron ou déclencheur externe.
 * Détecte les abonnements Pro arrivant à échéance à J-3 et J-1, ou expirés à J+1.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional bearer secret check if configured in production
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const admin = createAdminClient();
    const now = new Date();

    // Fetch active or recently expired subscriptions
    const { data: subs, error } = await admin
      .from("user_subscriptions")
      .select("user_id, plan_name, status, current_period_end, campay_phone, campay_operator, updated_at");

    if (error) {
      console.error("[MoMo Renewal Cron Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const notifications: Array<{
      userId: string;
      phone?: string;
      operator?: string;
      daysRemaining: number;
      renewalType: "j_minus_3" | "j_minus_1" | "j_plus_1" | "none";
      message: string;
      checkoutUrl: string;
    }> = [];

    (subs || []).forEach((s) => {
      if (!s.current_period_end) return;
      const periodEnd = new Date(s.current_period_end);
      const diffTime = periodEnd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let renewalType: "j_minus_3" | "j_minus_1" | "j_plus_1" | "none" = "none";
      let msg = "";

      if (diffDays === 3) {
        renewalType = "j_minus_3";
        msg = `AuthentiCV : Votre Pass Pro expire dans 3 jours. Renouvelez votre accès illimité au Coach IA Alex et à vos modèles en 1 clic via Mobile Money : https://www.authenticv.app/tarifs`;
      } else if (diffDays === 1) {
        renewalType = "j_minus_1";
        msg = `AuthentiCV URGENT : Votre Pass Pro expire demain ! Évitez toute interruption de vos candidatures et téléchargez vos CVs HD sans filigrane : https://www.authenticv.app/tarifs`;
      } else if (diffDays === -1) {
        renewalType = "j_plus_1";
        msg = `AuthentiCV : Votre abonnement Pro a pris fin hier. Réactivez votre compte pour continuer à générer vos lettres de motivation et CVs IA : https://www.authenticv.app/tarifs`;
      }

      if (renewalType !== "none") {
        notifications.push({
          userId: s.user_id,
          phone: s.campay_phone || undefined,
          operator: s.campay_operator || "Mobile Money",
          daysRemaining: diffDays,
          renewalType,
          message: msg,
          checkoutUrl: "https://www.authenticv.app/tarifs",
        });
      }
    });

    console.log(`[MoMo Renewal Cron] Prepared ${notifications.length} renewal alerts across CEMAC.`);

    return NextResponse.json({
      success: true,
      executedAt: now.toISOString(),
      alertsCount: notifications.length,
      alerts: notifications,
    });
  } catch (err) {
    console.error("[MoMo Renewal Cron Execution Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'exécution de la routine de renouvellement" },
      { status: 500 }
    );
  }
}

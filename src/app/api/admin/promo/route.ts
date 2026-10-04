import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authCheck = await verifyAdmin();
    if ("response" in authCheck) return authCheck.response;

    const admin = createAdminClient();
    const { data: promos, error } = await admin
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    const promoList = (error || !promos) ? [] : promos;
    const totalRevenue = promoList.reduce((acc, p) => acc + (p.total_revenue_generated_xaf || 0), 0);
    const totalUses = promoList.reduce((acc, p) => acc + (p.current_uses || 0), 0);

    return NextResponse.json({
      success: true,
      promos: promoList,
      summary: {
        totalCodes: promoList.length,
        totalUses,
        totalRevenueGeneratedXaf: totalRevenue,
      },
    });
  } catch (err) {
    console.error("[Admin Promo GET Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des codes promo" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authCheck = await verifyAdmin();
    if ("response" in authCheck) return authCheck.response;

    const body = await req.json();
    const {
      code,
      discount_percent = 20,
      target_plan = "all",
      max_uses = 100,
      campaign_name,
      expires_at,
    } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Le code est obligatoire" }, { status: 400 });
    }

    const admin = createAdminClient();
    const normalizedCode = code.trim().toUpperCase();

    const { data: newPromo, error } = await admin
      .from("promo_codes")
      .insert({
        code: normalizedCode,
        discount_percent: Number(discount_percent) || 20,
        target_plan,
        max_uses: Number(max_uses) || 100,
        campaign_name: campaign_name || "Campagne Marketing",
        expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("[Admin Promo Create Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Code promo ${normalizedCode} créé avec succès !`,
      promo: newPromo,
    });
  } catch (err) {
    console.error("[Admin Promo POST Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du code promo" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const authCheck = await verifyAdmin();
    if ("response" in authCheck) return authCheck.response;

    const body = await req.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: "id est requis" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("promo_codes")
      .update({ is_active })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Statut du code promo mis à jour (${is_active ? "Actif" : "Inactif"})`,
    });
  } catch (err) {
    console.error("[Admin Promo PATCH Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

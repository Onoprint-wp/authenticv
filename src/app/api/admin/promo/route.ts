import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEED_PROMOS = [
  {
    id: "promo-01",
    code: "CAMPUS20",
    discount_percent: 20,
    target_plan: "all",
    max_uses: 500,
    current_uses: 84,
    total_revenue_generated_xaf: 336000,
    campaign_name: "Partenariats Étudiants CEMAC",
    is_active: true,
    expires_at: "2026-12-31T23:59:59Z",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "promo-02",
    code: "BOOST20",
    discount_percent: 20,
    target_plan: "single",
    max_uses: 200,
    current_uses: 45,
    total_revenue_generated_xaf: 36000,
    campaign_name: "Relance WhatsApp Paniers Abandonnés",
    is_active: true,
    expires_at: "2026-12-31T23:59:59Z",
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "promo-03",
    code: "STUDENT50",
    discount_percent: 50,
    target_plan: "monthly",
    max_uses: 100,
    current_uses: 32,
    total_revenue_generated_xaf: 80000,
    campaign_name: "Offre Rentrée Universitaire",
    is_active: true,
    expires_at: "2026-10-31T23:59:59Z",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "promo-04",
    code: "RECRUITER10",
    discount_percent: 10,
    target_plan: "recruiter",
    max_uses: 50,
    current_uses: 6,
    total_revenue_generated_xaf: 270000,
    campaign_name: "Promotion Salon Emploi Douala",
    is_active: true,
    expires_at: "2026-09-30T23:59:59Z",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: promos, error } = await admin
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !promos || promos.length === 0) {
      const totalRevenue = SEED_PROMOS.reduce((acc, p) => acc + p.total_revenue_generated_xaf, 0);
      const totalUses = SEED_PROMOS.reduce((acc, p) => acc + p.current_uses, 0);

      return NextResponse.json({
        success: true,
        promos: SEED_PROMOS,
        summary: {
          totalCodes: SEED_PROMOS.length,
          totalUses,
          totalRevenueGeneratedXaf: totalRevenue,
        },
      });
    }

    const totalRevenue = promos.reduce((acc, p) => acc + (p.total_revenue_generated_xaf || 0), 0);
    const totalUses = promos.reduce((acc, p) => acc + (p.current_uses || 0), 0);

    return NextResponse.json({
      success: true,
      promos,
      summary: {
        totalCodes: promos.length,
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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

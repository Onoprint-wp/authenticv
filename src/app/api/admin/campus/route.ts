import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ADMIN_EMAILS = [
      "onoprint25@gmail.com",
      "authenticv.playwright.test@gmail.com",
      process.env.ADMIN_EMAIL,
    ].filter(Boolean);

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
    if (!isAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const admin = createAdminClient();
    const { data: partners, error } = await admin
      .from("campus_partners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = (partners || []).map((p: any) => ({
      id: p.id,
      name: p.university_name || p.name || "Université",
      domain: p.domain,
      promo_code: p.promo_code || p.domain?.toUpperCase() || "CAMPUS20",
      discount_percent: p.discount_percent || 20,
      created_at: p.created_at,
    }));

    return NextResponse.json({ partners: formatted });
  } catch (err) {
    console.error("[Admin Campus GET Error]:", err);
    return NextResponse.json({ partners: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ADMIN_EMAILS = [
      "onoprint25@gmail.com",
      "authenticv.playwright.test@gmail.com",
      process.env.ADMIN_EMAIL,
    ].filter(Boolean);

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
    if (!isAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, domain, promo_code, discount_percent } = body;

    if (!name || !promo_code) {
      return NextResponse.json({ error: "Nom et code promo sont requis" }, { status: 400 });
    }

    const admin = createAdminClient();
    const cleanDomain = domain ? String(domain).trim().toLowerCase() : String(promo_code).trim().toLowerCase();

    const { data: newPartner, error } = await admin
      .from("campus_partners")
      .insert({
        university_name: String(name).trim(),
        domain: cleanDomain,
        discount_percent: Number(discount_percent) || 20,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      partner: {
        id: newPartner.id,
        name: newPartner.university_name,
        domain: newPartner.domain,
        promo_code: String(promo_code).trim().toUpperCase(),
        discount_percent: newPartner.discount_percent,
        created_at: newPartner.created_at,
      },
      message: `Partenaire campus ${newPartner.university_name} créé avec succès !`,
    });
  } catch (err) {
    console.error("[Admin Campus POST Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de la création du partenaire campus" },
      { status: 500 }
    );
  }
}

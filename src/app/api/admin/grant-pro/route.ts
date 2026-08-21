import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ADMIN_EMAILS = [
      "onoprint25@gmail.com",
      process.env.ADMIN_EMAIL,
    ].filter(Boolean);

    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
    if (!isAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { email, action, credits } = await req.json().catch(() => ({}));

    if (!email || !action) {
      return NextResponse.json({ error: "email and action are required" }, { status: 400 });
    }

    const admin = createAdminClient();

    // 1. Find user by email in auth or profiles
    const { data: users, error: userError } = await admin.auth.admin.listUsers();

    if (userError) {
      throw userError;
    }

    const targetUser = users.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!targetUser) {
      return NextResponse.json({ error: `Aucun utilisateur trouvé avec l'email "${email}"` }, { status: 404 });
    }

    if (action === "grant_pro") {
      // Grant 30 days Pro subscription
      const { error: subError } = await admin
        .from("user_subscriptions")
        .upsert(
          {
            user_id: targetUser.id,
            status: "active",
            plan_name: "pro",
            campay_reference: `MANUAL_ADMIN_GRANT_${Date.now()}`,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (subError) throw subError;

      return NextResponse.json({
        success: true,
        message: `Plan Pro accordé avec succès à ${email} !`,
      });
    }

    if (action === "add_credits") {
      const creditsToAdd = Number(credits) || 5;

      // Find or create company
      const { data: company } = await admin
        .from("companies")
        .select("id, credits_balance")
        .eq("user_id", targetUser.id)
        .maybeSingle();

      if (company) {
        const newBalance = (company.credits_balance ?? 0) + creditsToAdd;
        await admin
          .from("companies")
          .update({ credits_balance: newBalance })
          .eq("id", company.id);
      } else {
        await admin
          .from("companies")
          .insert({
            user_id: targetUser.id,
            company_name: targetUser.email?.split("@")[0] || "Entreprise",
            email: targetUser.email ?? "",
            credits_balance: creditsToAdd,
            plan: "pay_as_you_go",
          });
      }

      return NextResponse.json({
        success: true,
        message: `+${creditsToAdd} Crédits RH ajoutés avec succès à ${email} !`,
      });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (err) {
    console.error("[Admin Grant API Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Error" },
      { status: 500 }
    );
  }
}

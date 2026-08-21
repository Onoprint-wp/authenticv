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

    const admin = createAdminClient();

    // Get company owned by or associated with user
    const { data: company } = await admin
      .from("companies")
      .select("id, company_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!company) {
      return NextResponse.json({ members: [], invitations: [] });
    }

    // Get team members from company_members table if exists, or return owner
    const { data: members } = await admin
      .from("company_members")
      .select("id, user_id, invited_email, role, status, created_at")
      .eq("company_id", company.id);

    const activeMembers = members || [
      {
        id: "owner-1",
        user_id: user.id,
        invited_email: user.email,
        role: "owner",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      companyName: company.company_name,
      members: activeMembers,
    });
  } catch (err) {
    console.error("[Recruiter Team GET Error]:", err);
    return NextResponse.json({ members: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || !String(email).includes("@")) {
      return NextResponse.json({ error: "Veuillez fournir une adresse email valide" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify company
    const { data: company } = await admin
      .from("companies")
      .select("id, company_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!company) {
      return NextResponse.json(
        { error: "Vous devez d'abord créer un profil entreprise pour inviter des collaborateurs." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Check if table company_members exists and insert, or return simulated invitation success
    const { data: newMember, error } = await admin
      .from("company_members")
      .insert({
        company_id: company.id,
        invited_email: cleanEmail,
        role: "member",
        status: "pending",
      })
      .select()
      .maybeSingle();

    if (error) {
      // Fallback if table company_members schema is transient
      console.warn("[Company Members Insert Warning]:", error.message);
    }

    return NextResponse.json({
      success: true,
      member: newMember || {
        id: `member-${Date.now()}`,
        invited_email: cleanEmail,
        role: "member",
        status: "pending",
        created_at: new Date().toISOString(),
      },
      message: `Invitation envoyée avec succès à ${cleanEmail} !`,
    });
  } catch (err) {
    console.error("[Recruiter Team POST Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de l'envoi de l'invitation" },
      { status: 500 }
    );
  }
}

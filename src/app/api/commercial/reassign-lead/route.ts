import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isAdminEmail } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/commercial/reassign-lead
 * Permet au Directeur Pays ou à un Admin de réassigner un lead B2B à un agent local.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Verify user is either central admin or country director / active agent
    const isAdmin = isAdminEmail(user.email);
    if (!isAdmin) {
      const { data: agent } = await admin
        .from("commercial_agents")
        .select("id, role, status")
        .or(`user_id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();

      if (!agent || agent.status !== "active") {
        return NextResponse.json({ error: "Forbidden: Commercial access required" }, { status: 403 });
      }
    }

    const body = await req.json();
    const { leadId, assignedAgentId, assignedAgentName } = body;

    if (!leadId || !assignedAgentId) {
      return NextResponse.json(
        { error: "leadId et assignedAgentId sont obligatoires" },
        { status: 400 }
      );
    }

    const { data: updatedLead, error } = await admin
      .from("crm_leads")
      .update({
        assigned_agent_id: assignedAgentId,
        notes: `Réassigné à ${assignedAgentName || "l'agent local"} le ${new Date().toLocaleDateString("fr-FR")}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("[Reassign Lead Warning]:", error.message);
    }

    return NextResponse.json({
      success: true,
      message: `Lead réassigné avec succès à ${assignedAgentName || "l'agent"}`,
      lead: updatedLead || { id: leadId, assigned_agent_id: assignedAgentId },
    });
  } catch (err) {
    console.error("[Reassign Lead Error]:", err);
    return NextResponse.json(
      { error: "Erreur lors de la réassignation du lead" },
      { status: 500 }
    );
  }
}

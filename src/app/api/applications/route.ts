import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

// GET — liste toutes les candidatures de l'utilisateur
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("applications")
    .select("id, company, position, status, job_url, notes, cover_letter_id, applied_at, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — créer une candidature
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { company, position, status, job_url, notes, cover_letter_id } =
    (body ?? {}) as {
      company?: string;
      position?: string;
      status?: ApplicationStatus;
      job_url?: string;
      notes?: string;
      cover_letter_id?: string;
    };

  if (!company?.trim() || !position?.trim()) {
    return NextResponse.json({ error: "company and position required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      company,
      position,
      status: status ?? "saved",
      job_url: job_url ?? null,
      notes: notes ?? null,
      cover_letter_id: cover_letter_id ?? null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

// PATCH ?id= — mettre à jour le statut ou les notes
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const updates = body ?? {};

  // N'autoriser que les champs modifiables
  const allowed: Record<string, unknown> = {};
  if ("status" in updates) allowed.status = updates.status;
  if ("notes" in updates) allowed.notes = updates.notes;
  if ("job_url" in updates) allowed.job_url = updates.job_url;
  if ("cover_letter_id" in updates) allowed.cover_letter_id = updates.cover_letter_id;
  if ("applied_at" in updates) allowed.applied_at = updates.applied_at;
  allowed.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("applications")
    .update(allowed)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE ?id= — supprimer une candidature
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

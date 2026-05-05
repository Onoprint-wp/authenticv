import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/resumes/:id — charge un CV spécifique et le marque comme récent
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  // Touch updated_at so this becomes the "current" resume for the chat route
  await supabase
    .from("resumes")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json(data);
}

// PATCH /api/resumes/:id — renomme un CV
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json();
  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("resumes")
    .update({ title: title.trim() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/resumes/:id
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Vérifier que le CV appartient à l'utilisateur
  const { data: target, error: fetchError } = await supabase
    .from("resumes")
    .select("id, is_default")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !target) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  if (target.is_default) return NextResponse.json({ error: "Cannot delete the default resume" }, { status: 400 });

  // Vérifier qu'il ne reste pas qu'un seul CV
  const { count } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) <= 1) return NextResponse.json({ error: "Cannot delete the only resume" }, { status: 400 });

  const { error } = await supabase.from("resumes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

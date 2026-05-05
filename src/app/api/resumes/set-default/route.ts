import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/resumes/set-default?id=<resumeId>
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Vérifier que le CV appartient à l'utilisateur
  const { data: target, error: fetchError } = await supabase
    .from("resumes")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !target) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  // Unset all defaults for this user, then set the new one
  const { error: unsetError } = await supabase
    .from("resumes")
    .update({ is_default: false })
    .eq("user_id", user.id);

  if (unsetError) return NextResponse.json({ error: unsetError.message }, { status: 500 });

  const { error: setError } = await supabase
    .from("resumes")
    .update({ is_default: true })
    .eq("id", id);

  if (setError) return NextResponse.json({ error: setError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST — duplique un CV existant (Pro uniquement)
// Body: { id: string }
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (plan !== "pro") {
    return NextResponse.json({ error: "pro_required", details: "Le multi-CV est réservé aux abonnés Pro." }, { status: 402 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: source, error: fetchError } = await supabase
    .from("resumes")
    .select("content, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !source) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `${source.title} (copie)`,
      content: source.content,
      is_default: false,
    })
    .select("id, title, updated_at, is_default")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

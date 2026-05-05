import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST — crée un nouveau CV vide (Pro uniquement)
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (plan !== "pro") {
    return NextResponse.json({ error: "pro_required", details: "Le multi-CV est réservé aux abonnés Pro." }, { status: 402 });
  }

  const body = await req.json().catch(() => ({}));
  const title = (body.title as string) || "Nouveau CV";

  const { data, error } = await supabase
    .from("resumes")
    .insert({ user_id: user.id, title, content: {}, is_default: false })
    .select("id, title, updated_at, is_default")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

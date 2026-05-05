import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { nudge_enabled } = (body ?? {}) as { nudge_enabled?: boolean };
  if (typeof nudge_enabled !== "boolean") {
    return NextResponse.json({ error: "nudge_enabled (boolean) required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("resumes")
    .update({ nudge_enabled })
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

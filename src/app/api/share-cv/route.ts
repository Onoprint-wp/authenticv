import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

function generateSlug(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

// GET — état de partage actuel
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("resumes")
    .select("is_public, share_slug")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    isPublic: data?.is_public ?? false,
    slug: data?.share_slug ?? null,
  });
}

// POST — activer le partage (idempotent)
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: resume } = await supabase
    .from("resumes")
    .select("id, share_slug")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!resume) return NextResponse.json({ error: "No resume found" }, { status: 404 });

  const slug = resume.share_slug ?? generateSlug();

  await supabase
    .from("resumes")
    .update({ is_public: true, share_slug: slug })
    .eq("id", resume.id);

  return NextResponse.json({ isPublic: true, slug });
}

// DELETE — désactiver le partage
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: resume } = await supabase
    .from("resumes")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!resume) return NextResponse.json({ error: "No resume found" }, { status: 404 });

  await supabase
    .from("resumes")
    .update({ is_public: false })
    .eq("id", resume.id);

  return NextResponse.json({ isPublic: false, slug: null });
}

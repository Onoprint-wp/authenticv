import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    const resume = resumes && resumes.length > 0 ? resumes[0] : null;

    return NextResponse.json(resume || {});
  } catch (error) {
    console.error("[API Resumes GET Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    // Create or Update
    const { data: resumes, error: fetchError } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    const resume = resumes && resumes.length > 0 ? resumes[0] : null;

    let response;
    if (resume) {
      const { data, error } = await supabase
        .from("resumes")
        .update({
          content: content ?? resume.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resume.id)
        .select()
        .single();
        
      if (error) throw error;
      response = data;
    } else {
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          content: content ?? {},
        })
        .select()
        .single();
        
      if (error) throw error;
      response = data;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API Resumes POST Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

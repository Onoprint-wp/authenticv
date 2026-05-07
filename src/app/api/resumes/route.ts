import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { computeAtsScore } from "@/lib/ats-score";
import { detectSector } from "@/lib/sector";
import type { CvData } from "@/store/useCvStore";

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

    const { content, id: targetId } = await req.json();

    let resume;
    if (targetId) {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", targetId)
        .eq("user_id", user.id)
        .single();
      if (error || !data) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      resume = data;
    } else {
      const { data: resumes, error: fetchError } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (fetchError) throw fetchError;
      resume = resumes && resumes.length > 0 ? resumes[0] : null;
    }

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
        .insert({ user_id: user.id, content: content ?? {}, is_default: false })
        .select()
        .single();

      if (error) throw error;
      response = data;
    }

    // Enregistrer le score ATS si variation > 2 pts ou > 24h depuis le dernier enregistrement
    if (content) {
      void (async () => {
        try {
          const cvData = content as CvData;
          const newScore = computeAtsScore(cvData).score;
          const newSector = detectSector(cvData);

          // Persister score + secteur sur le résumé (pour le benchmark)
          await supabase
            .from("resumes")
            .update({ ats_score: newScore, sector: newSector })
            .eq("id", response.id)
            .eq("user_id", user.id);

          const { data: lastEntry } = await supabase
            .from("ats_score_history")
            .select("score, recorded_at")
            .eq("user_id", user.id)
            .order("recorded_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const lastScore = lastEntry?.score ?? -99;
          const lastTs = lastEntry?.recorded_at ? new Date(lastEntry.recorded_at).getTime() : 0;
          const hoursSinceLast = (Date.now() - lastTs) / 3_600_000;

          if (Math.abs(newScore - lastScore) > 2 || hoursSinceLast > 24) {
            await supabase
              .from("ats_score_history")
              .insert({ user_id: user.id, score: newScore });
          }
        } catch {
          // Non-bloquant
        }
      })();
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

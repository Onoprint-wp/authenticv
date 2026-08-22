import { type SupabaseClient } from "@supabase/supabase-js";
import { type CvData, parseCvData } from "@/lib/schemas/cv.schema";

export interface ResumeRecord {
  id: string;
  user_id: string;
  title?: string;
  content: CvData;
  updated_at: string;
  created_at?: string;
}

export class ResumeService {
  /**
   * Récupère le CV le plus récent d'un utilisateur et normalise son contenu.
   */
  static async getLatestResume(
    supabase: SupabaseClient,
    userId: string
  ): Promise<ResumeRecord | null> {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("[ResumeService.getLatestResume] Error:", error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const item = data[0];
    return {
      id: item.id,
      user_id: item.user_id,
      title: item.title,
      content: parseCvData(item.content),
      updated_at: item.updated_at,
      created_at: item.created_at,
    };
  }

  /**
   * Met à jour ou insère un CV dans la base de données.
   */
  static async saveResumeContent(
    supabase: SupabaseClient,
    userId: string,
    resumeId: string | null,
    content: CvData
  ): Promise<{ success: boolean; resumeId: string }> {
    const now = new Date().toISOString();

    if (resumeId) {
      const { error } = await supabase
        .from("resumes")
        .update({ content, updated_at: now })
        .eq("id", resumeId)
        .eq("user_id", userId);

      if (error) {
        console.error("[ResumeService.saveResumeContent] Update Error:", error);
        throw error;
      }
      return { success: true, resumeId };
    } else {
      const { data, error } = await supabase
        .from("resumes")
        .insert({ user_id: userId, content, updated_at: now })
        .select("id")
        .single();

      if (error) {
        console.error("[ResumeService.saveResumeContent] Insert Error:", error);
        throw error;
      }
      return { success: true, resumeId: data.id };
    }
  }
}

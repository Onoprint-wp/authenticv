import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KanbanBoard } from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: applications } = await supabase
    .from("applications")
    .select("id, company, position, status, job_url, notes, cover_letter_id, applied_at, created_at, updated_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/builder"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au builder
          </Link>
          <span className="text-slate-700">·</span>
          <h1 className="text-sm font-semibold text-slate-300">Suivi des candidatures</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs text-slate-500">
            Glissez les cartes d&apos;une colonne à l&apos;autre pour mettre à jour le statut.
          </p>
        </div>
        <KanbanBoard initial={applications ?? []} />
      </main>
    </div>
  );
}

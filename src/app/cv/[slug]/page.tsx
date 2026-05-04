import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CvRenderer } from "@/components/cv/CvRenderer";
import type { CvData } from "@/store/useCvStore";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getResume(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resumes")
    .select("content")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getResume(slug);
  if (!resume) return { title: "CV introuvable" };

  const cv = resume.content as CvData;
  const name = `${cv.personalInfo?.firstName ?? ""} ${cv.personalInfo?.lastName ?? ""}`.trim() || "CV";
  const title = cv.personalInfo?.title ?? "";
  const summary = cv.summary ?? "";

  return {
    title: title ? `${name} — ${title}` : name,
    description: summary.slice(0, 160) || `CV de ${name} créé avec AuthentiCV`,
    openGraph: {
      title: title ? `${name} — ${title}` : name,
      description: summary.slice(0, 160) || `CV de ${name} créé avec AuthentiCV`,
      type: "profile",
    },
  };
}

export default async function PublicCvPage({ params }: Props) {
  const { slug } = await params;
  const resume = await getResume(slug);

  if (!resume) notFound();

  const cvData = resume.content as CvData;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Bandeau AuthentiCV */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">AuthentiCV</span>
        </Link>
        <Link
          href="/login"
          className="text-xs text-slate-400 hover:text-indigo-300 transition-colors"
        >
          Créer mon CV →
        </Link>
      </div>

      {/* CV */}
      <div className="flex-1 p-4 sm:p-8 flex justify-center items-start">
        <div className="w-full max-w-[850px] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden">
          <CvRenderer cvData={cvData} />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-slate-400">
        CV créé avec{" "}
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
          AuthentiCV
        </Link>
      </div>
    </div>
  );
}

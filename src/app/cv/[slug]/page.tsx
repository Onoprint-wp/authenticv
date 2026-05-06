import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { CvRenderer } from "@/components/cv/CvRenderer";
import type { CvData } from "@/store/useCvStore";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.authenticv.app";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getResume(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resumes")
    .select("id, content")
    .eq("share_slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getResume(slug);

  if (!resume) {
    return {
      title: "CV introuvable",
      robots: { index: false, follow: false },
    };
  }

  const cv = resume.content as CvData;
  const firstName = cv.personalInfo?.firstName ?? "";
  const lastName = cv.personalInfo?.lastName ?? "";
  const name = `${firstName} ${lastName}`.trim() || "CV";
  const jobTitle = cv.personalInfo?.title ?? "";
  const summary = (cv.summary ?? "").slice(0, 160) || `CV de ${name} créé avec AuthentiCV`;
  const pageTitle = jobTitle ? `${name} — ${jobTitle} · AuthentiCV` : `${name} · AuthentiCV`;
  const canonicalUrl = `${SITE_URL}/cv/${slug}`;

  return {
    title: pageTitle,
    description: summary,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: jobTitle ? `${name} — ${jobTitle}` : name,
      description: summary,
      url: canonicalUrl,
      siteName: "AuthentiCV",
      locale: "fr_FR",
      type: "profile",
      firstName,
      lastName,
    },
    twitter: {
      card: "summary_large_image",
      title: jobTitle ? `${name} — ${jobTitle}` : name,
      description: summary,
    },
  };
}

export default async function PublicCvPage({ params }: Props) {
  const { slug } = await params;
  const resume = await getResume(slug);

  if (!resume) notFound();

  // Log view — fire-and-forget, non-blocking
  const reqHeaders = await headers();
  const country = reqHeaders.get("x-vercel-ip-country") ?? null;
  void Promise.resolve(
    createAdminClient().from("cv_views").insert({ resume_id: resume.id, country })
  ).catch(() => {});

  const cvData = resume.content as CvData;
  const firstName = cvData.personalInfo?.firstName ?? "";
  const lastName = cvData.personalInfo?.lastName ?? "";
  const name = `${firstName} ${lastName}`.trim();
  const jobTitle = cvData.personalInfo?.title ?? "";
  const canonicalUrl = `${SITE_URL}/cv/${slug}`;

  // Structured data JSON-LD — Person schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    ...(name && { name }),
    ...(jobTitle && { jobTitle }),
    ...(cvData.personalInfo?.location && { address: { "@type": "PostalAddress", addressLocality: cvData.personalInfo.location } }),
    ...(cvData.personalInfo?.email && { email: cvData.personalInfo.email }),
    ...(cvData.personalInfo?.linkedin && { sameAs: cvData.personalInfo.linkedin }),
    ...(cvData.summary && { description: cvData.summary.slice(0, 500) }),
    ...(cvData.skills?.length && { knowsAbout: cvData.skills }),
    url: canonicalUrl,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

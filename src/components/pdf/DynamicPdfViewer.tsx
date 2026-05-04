"use client";

import { useEffect, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import type { CvData } from "@/store/useCvStore";

// Dynamically import PDFViewer to avoid SSR issues
let PDFViewer: React.ComponentType<{
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  showToolbar?: boolean;
}>;
let CvDocumentComponent: React.ComponentType<{
  cvData: CvData;
}>;

export function DynamicPdfViewer() {
  const cvData = useCvStore((s) => s.cvData);
  const [ready, setReady] = useState(false);
  // Resolved photo as base64 data URI (avoids react-pdf CORS issues with external URLs)
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Lazy-load @react-pdf/renderer only on the client
    Promise.all([
      import("@react-pdf/renderer").then((m) => m.PDFViewer),
      import("./CvDocument").then((m) => m.CvDocument),
    ]).then(([viewer, doc]) => {
      PDFViewer = viewer as typeof PDFViewer;
      CvDocumentComponent = doc as typeof CvDocumentComponent;
      setReady(true);
    });
  }, []);

  // Convert photoUrl to base64 data URI so react-pdf can embed it without CORS issues.
  // react-pdf fetches images in a web worker where Supabase public URLs may be blocked.
  useEffect(() => {
    const url = cvData.personalInfo.photoUrl;
    if (!url) { setResolvedPhotoUrl(undefined); return; }
    if (url.startsWith("data:")) { setResolvedPhotoUrl(url); return; }

    let cancelled = false;
    fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((blob) => new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(blob);
      }))
      .then((dataUri) => { if (!cancelled) setResolvedPhotoUrl(dataUri); })
      .catch(() => { if (!cancelled) setResolvedPhotoUrl(url); }); // fallback to original

    return () => { cancelled = true; };
  }, [cvData.personalInfo.photoUrl]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Chargement du PDF…</p>
        </div>
      </div>
    );
  }

  const displayCvData: CvData = cvData.personalInfo.photoUrl
    ? { ...cvData, personalInfo: { ...cvData.personalInfo, photoUrl: resolvedPhotoUrl ?? cvData.personalInfo.photoUrl } }
    : cvData;

  return (
    <PDFViewer
      style={{ width: "100%", height: "100%", border: "none" }}
      showToolbar={true}
    >
      <CvDocumentComponent cvData={displayCvData} />
    </PDFViewer>
  );
}

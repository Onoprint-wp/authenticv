"use client";

import { useEffect, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import type { CvData } from "@/store/useCvStore";

type Layout = "classic" | "modern" | "minimal";

let PDFViewer: React.ComponentType<{
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  showToolbar?: boolean;
}>;

const CvDocumentComponents: Record<Layout, React.ComponentType<{ cvData: CvData }>> = {} as never;

export function DynamicPdfViewer() {
  const cvData = useCvStore((s) => s.cvData);
  const [ready, setReady] = useState(false);
  const [resolvedPhotoUrl, setResolvedPhotoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      import("@react-pdf/renderer").then((m) => m.PDFViewer),
      import("./CvDocument").then((m) => m.CvDocument),
      import("./CvDocumentModern").then((m) => m.CvDocumentModern),
      import("./CvDocumentMinimal").then((m) => m.CvDocumentMinimal),
    ]).then(([viewer, classic, modern, minimal]) => {
      PDFViewer = viewer as typeof PDFViewer;
      CvDocumentComponents.classic = classic as React.ComponentType<{ cvData: CvData }>;
      CvDocumentComponents.modern = modern as React.ComponentType<{ cvData: CvData }>;
      CvDocumentComponents.minimal = minimal as React.ComponentType<{ cvData: CvData }>;
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const url = cvData.personalInfo.photoUrl;
    if (!url) { setResolvedPhotoUrl(undefined); return; }

    if (url.startsWith("data:image/jpeg") || url.startsWith("data:image/png")) {
      setResolvedPhotoUrl(url);
      return;
    }

    let cancelled = false;

    const convertToPng = async () => {
      try {
        const src = url.startsWith("data:")
          ? url
          : await fetch(url)
              .then((r) => (r.ok ? r.blob() : Promise.reject()))
              .then(
                (blob) =>
                  new Promise<string>((res, rej) => {
                    const reader = new FileReader();
                    reader.onload = () => res(reader.result as string);
                    reader.onerror = rej;
                    reader.readAsDataURL(blob);
                  }),
              );

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = src;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");
        ctx.drawImage(img, 0, 0);

        const pngDataUri = canvas.toDataURL("image/png");
        if (!cancelled) setResolvedPhotoUrl(pngDataUri);
      } catch {
        if (!cancelled) setResolvedPhotoUrl(url);
      }
    };

    convertToPng();
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

  const layout: Layout = (cvData.designSettings?.layout as Layout) ?? "classic";
  const CvDocumentComponent = CvDocumentComponents[layout] ?? CvDocumentComponents.classic;

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

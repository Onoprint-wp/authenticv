"use client";

import { useEffect, useState } from "react";
import { useCvStore } from "@/store/useCvStore";

// Dynamically import PDFViewer to avoid SSR issues
let PDFViewer: React.ComponentType<{
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  showToolbar?: boolean;
}>;
let CvDocumentComponent: React.ComponentType<{
  cvData: ReturnType<typeof useCvStore.getState>["cvData"];
}>;

export function DynamicPdfViewer() {
  const cvData = useCvStore((s) => s.cvData);
  const [ready, setReady] = useState(false);

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

  return (
    <PDFViewer
      style={{ width: "100%", height: "100%", border: "none" }}
      showToolbar={true}
    >
      <CvDocumentComponent cvData={cvData} />
    </PDFViewer>
  );
}

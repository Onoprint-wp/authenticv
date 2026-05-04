"use client";

import { useRef, useState, useEffect } from "react";
import { useCvStore } from "@/store/useCvStore";
import { CvRenderer } from "./CvRenderer";

const A4_PAGE_PX = 1122;

export function HtmlCvPreview() {
  const cvData = useCvStore((s) => s.cvData);
  const paperRef = useRef<HTMLDivElement>(null);
  const [paperHeight, setPaperHeight] = useState(0);

  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPaperHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects } = cvData;
  const hasContent = summary || experiences.length > 0 || education.length > 0 || skills.length > 0
    || languages.length > 0 || certifications.length > 0 || projects.length > 0
    || personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  if (!hasContent && !personalInfo.firstName && !personalInfo.lastName && !personalInfo.title) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100/50">
        <div className="text-slate-400 text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <p>Le CV est vide. Commencez par ajouter des informations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-200 p-4 sm:p-8 flex justify-center items-start custom-scrollbar">
      <div
        ref={paperRef}
        className="relative w-full max-w-[850px] min-h-[1122px] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col"
      >
        {/* Page break indicators */}
        {Array.from({ length: Math.floor(paperHeight / A4_PAGE_PX) }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 pointer-events-none z-20 flex flex-col items-center"
            style={{ top: `${(i + 1) * A4_PAGE_PX}px` }}
          >
            <div className="w-full h-px bg-slate-400/40 border-t border-dashed border-slate-400/50" />
            <span className="bg-slate-300 text-slate-500 text-[10px] font-semibold px-2.5 py-0.5 rounded-b tracking-wide">
              Page {i + 2}
            </span>
          </div>
        ))}

        <CvRenderer cvData={cvData} />
      </div>
    </div>
  );
}

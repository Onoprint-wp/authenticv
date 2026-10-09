"use client";

import { useRef, useState, useEffect } from "react";
import { Sparkles, MessageSquare, PenLine } from "lucide-react";
import { useCvStore } from "@/store/useCvStore";
import { CvRenderer } from "./CvRenderer";
import { CvRendererModern } from "./CvRendererModern";
import { CvRendererMinimal } from "./CvRendererMinimal";

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
    const handleGoToChat = () => {
      window.dispatchEvent(new CustomEvent("switch-mobile-tab", { detail: "chat" }));
    };
    const handleGoToEdit = () => {
      window.dispatchEvent(new CustomEvent("switch-mobile-tab", { detail: "edit" }));
    };

    return (
      <div className="flex-1 w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900/40">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 dark:bg-blue-950/50 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-blue-200/80 dark:border-blue-800/50 mb-4 shadow-xs">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-brand-blue" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-foreground font-heading mb-1.5">
          Votre CV est encore vide
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed font-sans">
          Discutez avec Alex Coach pour générer un CV technique complet et optimisé ATS en 30 secondes, ou commencez par l'édition manuelle.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
          <button
            type="button"
            onClick={handleGoToChat}
            className="w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Créer avec Alex Coach
          </button>
          <button
            type="button"
            onClick={handleGoToEdit}
            className="w-full flex items-center justify-center gap-2 bg-card border border-border text-foreground font-medium text-xs py-2.5 px-4 rounded-xl hover:bg-muted transition-all active:scale-95 cursor-pointer"
          >
            <PenLine className="w-4 h-4 text-muted-foreground" />
            Remplir manuellement
          </button>
        </div>
      </div>
    );
  }

  const layout = cvData.designSettings?.layout ?? "classic";

  return (
    <div className="flex-1 overflow-auto bg-slate-200/80 dark:bg-slate-900/60 p-4 sm:p-8 flex justify-center items-start custom-scrollbar relative">
      {/* Floating Canvas Zoom Controls */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-1 z-30 shadow-lg bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 p-1">
        <button
          type="button"
          title="Zoom avant"
          className="w-8 h-8 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors font-bold text-base"
        >
          +
        </button>
        <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2" />
        <span className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 font-label-bold text-[10px]">
          100%
        </span>
        <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2" />
        <button
          type="button"
          title="Zoom arrière"
          className="w-8 h-8 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors font-bold text-base"
        >
          -
        </button>
      </div>

      <div
        ref={paperRef}
        className="relative w-full max-w-[850px] min-h-[1122px] bg-white rounded-2xl shadow-[0_12px_32px_rgba(15,34,61,0.08)] border border-slate-200/80 overflow-hidden flex flex-col"
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

        {layout === "modern" && <CvRendererModern cvData={cvData} />}
        {layout === "minimal" && <CvRendererMinimal cvData={cvData} />}
        {layout === "classic" && <CvRenderer cvData={cvData} />}
      </div>
    </div>
  );
}

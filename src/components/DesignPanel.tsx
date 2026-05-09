"use client";

import { useEffect, useRef } from "react";
import { useCvStore } from "@/store/useCvStore";
import { COLOR_THEMES } from "@/lib/themes";
import { Check, Type } from "lucide-react";

interface Props {
  onClose: () => void;
}

const LAYOUTS = [
  {
    id: "classic" as const,
    label: "Classic",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="0" y="0" width="48" height="18" rx="2" fill="#312e81" />
        <rect x="4" y="22" width="28" height="4" rx="1" fill="#e2e8f0" />
        <rect x="4" y="29" width="28" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="34" width="22" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="40" width="28" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="45" width="20" height="2" rx="1" fill="#e2e8f0" />
        <rect x="36" y="22" width="9" height="3" rx="1" fill="#c7d2fe" />
        <rect x="36" y="28" width="9" height="2" rx="1" fill="#e2e8f0" />
        <rect x="36" y="33" width="7" height="2" rx="1" fill="#e2e8f0" />
        <rect x="36" y="38" width="9" height="2" rx="1" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "modern" as const,
    label: "Modern",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="0" y="0" width="16" height="60" rx="2" fill="#312e81" />
        <circle cx="8" cy="12" r="5" fill="rgba(255,255,255,0.25)" />
        <rect x="2" y="21" width="12" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="3" y="25" width="10" height="1.5" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="2" y="31" width="12" height="1.5" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="2" y="35" width="10" height="1.5" rx="1" fill="rgba(255,255,255,0.3)" />
        <rect x="20" y="6" width="24" height="4" rx="1" fill="#e2e8f0" />
        <rect x="20" y="13" width="24" height="2" rx="1" fill="#e2e8f0" />
        <rect x="20" y="18" width="18" height="2" rx="1" fill="#e2e8f0" />
        <rect x="20" y="25" width="24" height="2" rx="1" fill="#e2e8f0" />
        <rect x="20" y="30" width="20" height="2" rx="1" fill="#e2e8f0" />
        <rect x="20" y="37" width="24" height="2" rx="1" fill="#e2e8f0" />
        <rect x="20" y="42" width="16" height="2" rx="1" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "minimal" as const,
    label: "Minimal",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="4" y="6" width="28" height="5" rx="1" fill="#0f172a" />
        <rect x="4" y="14" width="16" height="2" rx="1" fill="#94a3b8" />
        <rect x="4" y="19" width="8" height="1.5" rx="1" fill="#6366f1" />
        <rect x="4" y="24" width="40" height="0.5" rx="0.5" fill="#e2e8f0" />
        <rect x="4" y="29" width="12" height="1.5" rx="1" fill="#6366f1" />
        <rect x="4" y="33" width="40" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="37" width="32" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="43" width="12" height="1.5" rx="1" fill="#6366f1" />
        <rect x="4" y="47" width="40" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="51" width="28" height="2" rx="1" fill="#e2e8f0" />
      </svg>
    ),
  },
] as const;

export function DesignPanel({ onClose }: Props) {
  const designSettings = useCvStore((s) => s.cvData.designSettings);
  const updateDesignSettings = useCvStore((s) => s.updateDesignSettings);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const currentTheme = designSettings?.colorTheme ?? "indigo";
  const currentFont = designSettings?.fontFamily ?? "sans";
  const currentLayout = designSettings?.layout ?? "classic";

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 z-50 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 p-4"
    >
      {/* Modèles */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Modèle</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => updateDesignSettings({ layout: layout.id })}
            className={`relative flex flex-col items-center gap-1.5 p-1.5 rounded-lg border-2 transition-all hover:scale-[1.03] focus:outline-none ${
              currentLayout === layout.id
                ? "border-indigo-500 bg-indigo-950/40"
                : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
            }`}
          >
            <div className="w-full aspect-[4/5] rounded overflow-hidden bg-white shadow-sm">
              {layout.preview}
            </div>
            <span className={`text-[10px] font-medium ${currentLayout === layout.id ? "text-indigo-300" : "text-slate-400"}`}>
              {layout.label}
            </span>
            {currentLayout === layout.id && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Couleurs */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Couleur</p>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {COLOR_THEMES.map((theme) => (
          <button
            key={theme.id}
            title={theme.label}
            onClick={() => updateDesignSettings({ colorTheme: theme.id })}
            className="relative w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none"
            style={{
              background: theme.headerGradient,
              borderColor: currentTheme === theme.id ? theme.accentColor : "transparent",
            }}
          >
            {currentTheme === theme.id && (
              <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow" />
            )}
            <span className="sr-only">{theme.label}</span>
          </button>
        ))}
      </div>

      {/* Police */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Police</p>
      <div className="flex gap-2">
        <button
          onClick={() => updateDesignSettings({ fontFamily: "sans" })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-all ${
            currentFont === "sans"
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Sans
        </button>
        <button
          onClick={() => updateDesignSettings({ fontFamily: "serif" })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border transition-all ${
            currentFont === "serif"
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
          }`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          <Type className="w-3.5 h-3.5" />
          Serif
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useCvStore } from "@/store/useCvStore";
import { COLOR_THEMES } from "@/lib/themes";
import { Check, Type } from "lucide-react";

interface Props {
  onClose: () => void;
}

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

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 z-50 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 p-4"
    >
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

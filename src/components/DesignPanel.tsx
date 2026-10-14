"use client";

import { useEffect, useRef } from "react";
import { useCvStore } from "@/store/useCvStore";
import { COLOR_THEMES, SECTOR_TEMPLATES, getTheme } from "@/lib/themes";
import { Check, Type, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
}

const LAYOUTS = [
  {
    id: "classic" as const,
    label: "Classic",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="0" y="0" width="48" height="16" rx="2" fill="#312e81" />
        <rect x="4" y="20" width="28" height="3.5" rx="1" fill="#cbd5e1" />
        <rect x="4" y="26" width="28" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="30" width="22" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="36" width="28" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="40" width="20" height="2" rx="1" fill="#e2e8f0" />
        <rect x="35" y="20" width="9" height="3" rx="1" fill="#c7d2fe" />
        <rect x="35" y="26" width="9" height="2" rx="1" fill="#e2e8f0" />
        <rect x="35" y="30" width="7" height="2" rx="1" fill="#e2e8f0" />
        <rect x="35" y="35" width="9" height="2" rx="1" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "modern" as const,
    label: "Modern",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="0" y="0" width="16" height="60" rx="2" fill="#312e81" />
        <circle cx="8" cy="11" r="4.5" fill="rgba(255,255,255,0.28)" />
        <rect x="2" y="19" width="12" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
        <rect x="3" y="23" width="10" height="1.5" rx="1" fill="rgba(255,255,255,0.35)" />
        <rect x="2" y="29" width="12" height="1.5" rx="1" fill="rgba(255,255,255,0.35)" />
        <rect x="2" y="33" width="10" height="1.5" rx="1" fill="rgba(255,255,255,0.35)" />
        <rect x="20" y="6" width="24" height="4" rx="1" fill="#cbd5e1" />
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
        <rect x="4" y="6" width="28" height="4.5" rx="1" fill="#0f172a" />
        <rect x="4" y="13" width="16" height="2" rx="1" fill="#94a3b8" />
        <rect x="4" y="18" width="8" height="1.5" rx="1" fill="#6366f1" />
        <rect x="4" y="23" width="40" height="0.8" rx="0.4" fill="#cbd5e1" />
        <rect x="4" y="27" width="12" height="1.5" rx="1" fill="#6366f1" />
        <rect x="4" y="31" width="40" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="35" width="32" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="41" width="12" height="1.5" rx="1" fill="#6366f1" />
        <rect x="4" y="45" width="40" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="49" width="28" height="2" rx="1" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "executive" as const,
    label: "Executive",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="0" y="0" width="48" height="3" fill="#312e81" />
        <rect x="11" y="6" width="26" height="4" rx="1" fill="#0f172a" />
        <rect x="15" y="12" width="18" height="2" rx="1" fill="#4f46e5" />
        <rect x="4" y="17" width="40" height="1" fill="#312e81" />
        <rect x="6" y="21" width="36" height="4" rx="1" fill="#f1f5f9" />
        <rect x="4" y="28" width="40" height="1.5" rx="0.5" fill="#cbd5e1" />
        <rect x="4" y="32" width="40" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="36" width="34" height="2" rx="1" fill="#e2e8f0" />
        <rect x="4" y="42" width="19" height="12" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.6" />
        <rect x="25" y="42" width="19" height="12" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    id: "split" as const,
    label: "Split",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="3" y="5" width="2" height="13" rx="1" fill="#312e81" />
        <rect x="7" y="6" width="20" height="4" rx="1" fill="#0f172a" />
        <rect x="7" y="12" width="15" height="2" rx="1" fill="#4f46e5" />
        <rect x="30" y="5" width="15" height="13" rx="2" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="0.6" />
        <rect x="3" y="21" width="42" height="0.8" fill="#e2e8f0" />
        <rect x="3" y="25" width="25" height="3" rx="1" fill="#cbd5e1" />
        <rect x="3" y="31" width="25" height="2" rx="1" fill="#e2e8f0" />
        <rect x="3" y="35" width="21" height="2" rx="1" fill="#e2e8f0" />
        <rect x="3" y="41" width="25" height="2" rx="1" fill="#e2e8f0" />
        <rect x="31" y="24" width="14" height="31" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
        <rect x="33" y="28" width="10" height="2" rx="1" fill="#c7d2fe" />
        <rect x="33" y="33" width="9" height="2" rx="1" fill="#e2e8f0" />
        <rect x="33" y="38" width="10" height="2" rx="1" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "compact-grid" as const,
    label: "Tech Grid",
    preview: (
      <svg viewBox="0 0 48 60" className="w-full h-full">
        <rect x="0" y="0" width="48" height="14" fill="#1e1b4b" />
        <rect x="4" y="4" width="22" height="3.5" rx="1" fill="#ffffff" />
        <rect x="4" y="9" width="14" height="2" rx="1" fill="#a5b4fc" />
        <rect x="4" y="17" width="40" height="6" rx="1.5" fill="#eef2ff" />
        <rect x="4" y="26" width="40" height="8" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.6" />
        <rect x="4" y="36" width="40" height="8" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.6" />
        <rect x="4" y="46" width="19" height="10" rx="1.5" fill="#f1f5f9" />
        <rect x="25" y="46" width="19" height="10" rx="1.5" fill="#eef2ff" />
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
      const target = e.target instanceof Element ? e.target : null;
      const insidePanel = panelRef.current && target && panelRef.current.contains(target);
      const isTrigger = target?.closest("[data-design-panel-trigger]");
      if (!insidePanel && !isTrigger) onClose();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const currentTheme = designSettings?.colorTheme ?? "indigo";
  const currentFont = designSettings?.fontFamily ?? "sans";
  const currentLayout = designSettings?.layout ?? "classic";
  const currentSpacing = designSettings?.spacing ?? "normal";

  return (
    <div
      ref={panelRef}
      className="fixed left-3 right-3 top-14 sm:absolute sm:left-auto sm:right-0 sm:top-full mt-2 z-50 sm:w-80 max-w-[360px] max-h-[82vh] overflow-y-auto mx-auto sm:mx-0 bg-card border border-border text-card-foreground rounded-[16px] shadow-2xl p-4 backdrop-blur-md"
    >
      {/* 10 Modèles Sectoriels ATS */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-heading flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-brand-blue" />
          Modèles Sectoriels ATS (10)
        </p>
        <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
          1 clic
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-5 max-h-48 overflow-y-auto pr-1">
        {SECTOR_TEMPLATES.map((tpl) => {
          const tplTheme = getTheme(tpl.settings.colorTheme);
          const isSelected =
            currentLayout === tpl.settings.layout &&
            currentTheme === tpl.settings.colorTheme &&
            currentFont === tpl.settings.fontFamily &&
            currentSpacing === tpl.settings.spacing;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => updateDesignSettings(tpl.settings)}
              className={`flex flex-col items-start text-left p-2 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-brand-blue bg-brand-blue/10 shadow-xs"
                  : "border-border bg-muted/30 hover:border-border/80 hover:bg-muted/60"
              }`}
            >
              <div className="flex items-center justify-between w-full gap-1 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: tplTheme.swatch }}
                />
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1 py-0.2 rounded">
                  ATS {tpl.atsScore}
                </span>
              </div>
              <span className="text-[11px] font-bold text-foreground leading-tight line-clamp-1">
                {tpl.name}
              </span>
              <span className="text-[9px] text-muted-foreground line-clamp-1 mt-0.5">
                {tpl.sector}
              </span>
            </button>
          );
        })}
      </div>

      {/* Architecture (6) */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-heading">
          Architecture (6)
        </p>
        <span className="text-[10px] text-muted-foreground font-medium">Structure A4</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => updateDesignSettings({ layout: layout.id })}
            className={`relative flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 transition-all hover:scale-[1.02] focus:outline-none cursor-pointer ${
              currentLayout === layout.id
                ? "border-brand-blue bg-brand-blue/10"
                : "border-border bg-muted/40 hover:border-border/80"
            }`}
          >
            <div className="w-full aspect-[4/5] rounded overflow-hidden bg-white shadow-xs border border-border/40">
              {layout.preview}
            </div>
            <span className={`text-[10px] font-semibold leading-tight ${currentLayout === layout.id ? "text-brand-blue" : "text-muted-foreground"}`}>
              {layout.label}
            </span>
            {currentLayout === layout.id && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-blue rounded-full flex items-center justify-center shadow-xs">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Couleurs */}
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 font-heading">Couleur</p>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {COLOR_THEMES.map((theme) => (
          <button
            key={theme.id}
            title={theme.label}
            onClick={() => updateDesignSettings({ colorTheme: theme.id })}
            className="relative w-10 h-10 rounded-xl border-2 transition-all hover:scale-105 focus:outline-none cursor-pointer shadow-xs"
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
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 font-heading">Police</p>
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => updateDesignSettings({ fontFamily: "sans" })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            currentFont === "sans"
              ? "bg-brand-blue border-brand-blue text-white shadow-xs"
              : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Sans (Inter)
        </button>
        <button
          onClick={() => updateDesignSettings({ fontFamily: "serif" })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            currentFont === "serif"
              ? "bg-brand-blue border-brand-blue text-white shadow-xs"
              : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          <Type className="w-3.5 h-3.5" />
          Serif (Georgia)
        </button>
      </div>

      {/* Taille du Texte & Densité */}
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5 font-heading">
        Taille du Texte &amp; Densité
      </p>
      <div className="flex gap-2 mb-5">
        {(["compact", "normal", "spacious"] as const).map((s) => (
          <button
            key={s}
            onClick={() => updateDesignSettings({ spacing: s })}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              currentSpacing === s
                ? "bg-brand-blue border-brand-blue text-white shadow-xs"
                : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "compact" ? "Compact (S)" : s === "normal" ? "Normal (M)" : "Grand (L)"}
          </button>
        ))}
      </div>

      {/* Visibilité Recruteurs B2B */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>Visibilité CVthèque Recruteurs</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Profil anonymisé visible par les entreprises partenaires CEMAC
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateDesignSettings({ recruiterVisible: !(designSettings?.recruiterVisible ?? true) })}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              (designSettings?.recruiterVisible ?? true) ? "bg-brand-blue" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                (designSettings?.recruiterVisible ?? true) ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

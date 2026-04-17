"use client";

import { useState } from "react";
import { History, RotateCcw, ChevronDown, Clock } from "lucide-react";
import { useCvStore } from "@/store/useCvStore";

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function VersionHistoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { history, restoreCheckpoint } = useCvStore();

  if (history.length === 0) return null;

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        id="version-history-btn"
        onClick={() => setIsOpen((v) => !v)}
        title="Historique des versions"
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
          border border-slate-700/50 text-slate-400 hover:text-slate-200
          hover:bg-slate-800 transition-all duration-200"
      >
        <History className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Historique</span>
        <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
          {history.length}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 z-40
              w-72 bg-slate-900 border border-slate-700 rounded-xl
              shadow-2xl shadow-black/60 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Points de restauration ({history.length}/10)
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {history.map((snapshot, i) => (
                <div
                  key={snapshot.savedAt}
                  className="flex items-center justify-between px-4 py-3
                    border-b border-slate-800/60 last:border-0
                    hover:bg-slate-800/50 group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        i === 0 ? "bg-emerald-400" : "bg-slate-600"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">
                        {i === 0 ? "Version la plus récente" : `Version ${history.length - i}`}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatRelativeTime(snapshot.savedAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`restore-checkpoint-${i}-btn`}
                    onClick={() => {
                      restoreCheckpoint(i);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-1 text-[10px] font-medium
                      text-slate-500 hover:text-indigo-400 group-hover:opacity-100
                      opacity-0 transition-all px-2 py-1 rounded-md hover:bg-indigo-950/40"
                    title="Restaurer cette version"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurer
                  </button>
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 bg-slate-950/50 border-t border-slate-800">
              <p className="text-[10px] text-slate-600">
                Les 10 dernières versions sont conservées automatiquement.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import { useSyncCv } from "@/hooks/useSyncCv";
import { ChatPanel, type ChatPanelHandle } from "@/components/ChatPanel";
import { DynamicPdfViewer } from "@/components/pdf/DynamicPdfViewer";
import { SyncIndicator } from "@/components/SyncIndicator";
import { UploadCvButton } from "@/components/UploadCvButton";
import { JobMatchPanel } from "@/components/JobMatchPanel";
import { VersionHistoryPanel } from "@/components/VersionHistoryPanel";
import { logout } from "@/app/login/actions";
import { FileText, LogOut, Sparkles, Briefcase } from "lucide-react";
import { CvEditorView } from "@/components/editor/CvEditorView";

import { HtmlCvPreview } from "@/components/cv/HtmlCvPreview";

export default function BuilderPage() {
  const isHydrated = useCvStore((s) => s.isHydrated);
  const chatRef = useRef<ChatPanelHandle>(null);
  const [isJobMatchOpen, setIsJobMatchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"preview-web" | "preview-pdf" | "edit">("preview-web");

  // Activate auto-save sync
  const { refetch } = useSyncCv();

  // Injecte un message dans le chat depuis le JobMatchPanel
  const handleApplySuggestion = (chatPrompt: string) => {
    chatRef.current?.sendExternalMessage(chatPrompt);
  };

  // Loading screen while hydrating from Supabase
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 animate-pulse">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Chargement de votre CV…</p>
            <p className="text-slate-500 text-sm mt-1">
              Récupération de vos données
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* ── Header ── */}
      <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight">
            AuthentiCV
          </span>
          <span className="hidden sm:flex items-center gap-1 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            AI Coach
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <SyncIndicator />
          <VersionHistoryPanel />
          <UploadCvButton />

          {/* Bouton Match Offre */}
          <button
            id="open-job-match-btn"
            onClick={() => setIsJobMatchOpen(true)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
              border border-slate-700/50 text-slate-400 hover:text-violet-300
              hover:bg-violet-950/40 hover:border-violet-800/50 transition-all duration-200"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Optimiser pour une offre</span>
          </button>

          <form action={logout}>
            <button
              id="logout-btn"
              type="submit"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </div>
      </header>

      {/* ── Split-screen body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat (1/3) */}
        <div className="w-1/3 min-w-[300px] max-w-[420px] border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800">
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Coach IA — Alex
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatPanel ref={chatRef} onToolFinish={refetch} />
          </div>
        </div>

        {/* Right: PDF Preview or Editor (2/3) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-800">
          <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-950/50 p-1 rounded-md border border-slate-800">
              <button
                onClick={() => setViewMode("preview-web")}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  viewMode === "preview-web"
                    ? "bg-slate-800 text-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Aperçu Web
              </button>
              <button
                onClick={() => setViewMode("preview-pdf")}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  viewMode === "preview-pdf"
                    ? "bg-slate-800 text-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Aperçu PDF
              </button>
              <button
                onClick={() => setViewMode("edit")}
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                  viewMode === "edit"
                    ? "bg-slate-800 text-slate-200 shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Édition Manuelle
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            {viewMode === "preview-web" && <HtmlCvPreview />}
            {viewMode === "preview-pdf" && <DynamicPdfViewer />}
            {viewMode === "edit" && <CvEditorView />}
          </div>
        </div>
      </div>

      {/* ── Job Match Panel (drawer) ── */}
      <JobMatchPanel
        isOpen={isJobMatchOpen}
        onClose={() => setIsJobMatchOpen(false)}
        onApplySuggestion={handleApplySuggestion}
      />
    </div>
  );
}

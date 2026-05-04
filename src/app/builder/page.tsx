"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCvStore } from "@/store/useCvStore";
import { useSyncCv } from "@/hooks/useSyncCv";
import { usePlan } from "@/hooks/usePlan";
import { ChatPanel, type ChatPanelHandle } from "@/components/ChatPanel";
import { DynamicPdfViewer } from "@/components/pdf/DynamicPdfViewer";
import { SyncIndicator } from "@/components/SyncIndicator";
import { UploadCvButton } from "@/components/UploadCvButton";
import { JobMatchPanel } from "@/components/JobMatchPanel";
import { VersionHistoryPanel } from "@/components/VersionHistoryPanel";
import { UpgradeModal } from "@/components/UpgradeModal";
import { logout } from "@/app/login/actions";
import {
  FileText, LogOut, Sparkles, Briefcase, Download,
  Zap, MessageSquare, Eye, PenLine, Palette, UserX, Mail, User, CheckCircle, X,
} from "lucide-react";
import { CvEditorView } from "@/components/editor/CvEditorView";
import { HtmlCvPreview } from "@/components/cv/HtmlCvPreview";
import { DesignPanel } from "@/components/DesignPanel";
import { OnboardingModal } from "@/components/OnboardingModal";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { CoverLetterPanel } from "@/components/CoverLetterPanel";

type MobileTab = "chat" | "preview" | "edit" | "letter";

export default function BuilderPage() {
  const isHydrated = useCvStore((s) => s.isHydrated);
  const chatRef = useRef<ChatPanelHandle>(null);
  const lastPreviewSeenTs = useRef<number>(0);
  const [isJobMatchOpen, setIsJobMatchOpen] = useState(false);
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"preview-web" | "preview-pdf" | "edit" | "letter">("preview-web");
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; reason: "pdf" | "jobmatch" | "quota" | "letter" }>({ open: false, reason: "pdf" });
  const [showUpgradeToast, setShowUpgradeToast] = useState(false);

  const searchParams = useSearchParams();
  const plan = usePlan();
  const { refetch, saveCheckpoint } = useSyncCv();

  const cvData = useCvStore((s) => s.cvData);
  const lastAiUpdateTs = useCvStore((s) => s.lastAiUpdateTs);
  const setLastAiUpdateTs = useCvStore((s) => s.setLastAiUpdateTs);
  const hasSeenOnboarding = useCvStore((s) => s.hasSeenOnboarding);
  const setHasSeenOnboarding = useCvStore((s) => s.setHasSeenOnboarding);

  const cvIsEmpty = !cvData.personalInfo.firstName && cvData.experiences.length === 0;
  const showOnboarding = isHydrated && cvIsEmpty && !hasSeenOnboarding;
  const hasUnseenUpdate = lastAiUpdateTs > lastPreviewSeenTs.current && mobileTab !== "preview";

  // Toast after successful Stripe upgrade
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShowUpgradeToast(true);
      // Clean up URL without reload
      window.history.replaceState({}, "", "/builder");
      const timer = setTimeout(() => setShowUpgradeToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleApplySuggestion = (chatPrompt: string) => {
    chatRef.current?.sendExternalMessage(chatPrompt);
  };

  const handleToolFinish = () => {
    refetch();
    setLastAiUpdateTs();
  };

  const handleDownloadPdf = async () => {
    if (plan.plan !== "pro") { setUpgradeModal({ open: true, reason: "pdf" }); return; }
    const res = await fetch("/api/export-pdf");
    if (res.status === 402) { setUpgradeModal({ open: true, reason: "pdf" }); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "CV.pdf"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenJobMatch = () => {
    if (plan.plan !== "pro") { setUpgradeModal({ open: true, reason: "jobmatch" }); return; }
    setIsJobMatchOpen(true);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 animate-pulse">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Chargement de votre CV…</p>
            <p className="text-slate-500 text-sm mt-1">Récupération de vos données</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">

      {/* ── Header ── */}
      <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm z-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight hidden sm:block">AuthentiCV</span>
          <span className="hidden md:flex items-center gap-1 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />AI Coach
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <SyncIndicator />
          <VersionHistoryPanel />
          <UploadCvButton />

          {/* Plan badge */}
          {!plan.loading && (
            plan.plan === "pro" ? (
              <span className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-700/40 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" />Pro
              </span>
            ) : (
              <span className="text-xs text-slate-500 hidden sm:block">
                {plan.messagesRemaining ?? 0}/{plan.messageLimit}
              </span>
            )
          )}

          {/* Job Match — hidden on mobile (accessible via preview toolbar) */}
          <button
            id="open-job-match-btn"
            onClick={handleOpenJobMatch}
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
              border border-slate-700/50 text-slate-400 hover:text-violet-300
              hover:bg-violet-950/40 hover:border-violet-800/50 transition-all duration-200"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Optimiser pour une offre</span>
          </button>

          <Link
            href="/account"
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
              border border-slate-700/50 text-slate-400 hover:text-indigo-300
              hover:bg-indigo-950/40 hover:border-indigo-800/50 transition-all duration-200"
            title="Mon compte"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Compte</span>
          </Link>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-400 transition-colors"
            title="Supprimer mon compte"
          >
            <UserX className="w-3.5 h-3.5" />
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

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden">

        {/* ── Desktop / Tablet split (md+) ── */}
        <div className="hidden md:flex h-full">
          {/* Chat */}
          <div className="w-2/5 lg:w-1/3 min-w-[280px] max-w-[420px] border-r border-slate-800 flex flex-col overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800">
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Coach IA — Alex
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatPanel ref={chatRef} onToolFinish={handleToolFinish} onCheckpoint={saveCheckpoint} />
            </div>
          </div>

          {/* Preview / Editor */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-800">
            {/* Toolbar */}
            <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 bg-slate-950/50 p-1 rounded-md border border-slate-800">
                {(["preview-web", "preview-pdf", "edit", "letter"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      if (mode === "letter" && plan.plan !== "pro") {
                        setUpgradeModal({ open: true, reason: "letter" });
                        return;
                      }
                      setViewMode(mode);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                      viewMode === mode ? "bg-slate-800 text-slate-200 shadow-sm" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {mode === "preview-web" ? "Aperçu Web" : mode === "preview-pdf" ? "Aperçu PDF" : mode === "edit" ? "Édition" : "Lettre"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenJobMatch}
                  className="sm:hidden flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
                    border border-slate-700/50 text-slate-400 hover:text-violet-300
                    hover:bg-violet-950/40 hover:border-violet-800/50 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsDesignPanelOpen((p) => !p)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-all ${
                      isDesignPanelOpen
                        ? "bg-indigo-950/60 border-indigo-700/50 text-indigo-300"
                        : "border-slate-700/50 text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 hover:border-indigo-800/50"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Personnaliser</span>
                  </button>
                  {isDesignPanelOpen && <DesignPanel onClose={() => setIsDesignPanelOpen(false)} />}
                </div>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-all shadow-sm shadow-indigo-600/20 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{plan.plan === "pro" ? "Télécharger PDF" : "PDF — Pro"}</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              {viewMode === "preview-web" && <HtmlCvPreview />}
              {viewMode === "preview-pdf" && <DynamicPdfViewer />}
              {viewMode === "edit" && <CvEditorView />}
              {viewMode === "letter" && (
                <CoverLetterPanel onUpgradeRequired={() => setUpgradeModal({ open: true, reason: "letter" })} />
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile full-screen tabs (< md) ── */}
        <div className="flex md:hidden h-full flex-col">
          {mobileTab === "chat" && (
            <>
              <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Coach IA — Alex
                </p>
                {!plan.loading && plan.plan !== "pro" && (
                  <span className="text-xs text-slate-500">
                    {plan.messagesRemaining ?? 0}/{plan.messageLimit} msg restants
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatPanel ref={chatRef} onToolFinish={handleToolFinish} onCheckpoint={saveCheckpoint} />
              </div>
            </>
          )}

          {mobileTab === "preview" && (
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-800">
              <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={handleOpenJobMatch}
                  className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md
                    border border-slate-700/50 text-slate-400 hover:text-violet-300
                    hover:bg-violet-950/40 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Optimiser</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsDesignPanelOpen((p) => !p)}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-md border transition-all ${
                      isDesignPanelOpen
                        ? "bg-indigo-950/60 border-indigo-700/50 text-indigo-300"
                        : "border-slate-700/50 text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>
                  {isDesignPanelOpen && <DesignPanel onClose={() => setIsDesignPanelOpen(false)} />}
                </div>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  {plan.plan === "pro" ? "Télécharger PDF" : "PDF — Pro"}
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <HtmlCvPreview />
              </div>
            </div>
          )}

          {mobileTab === "edit" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800">
                <p className="text-xs font-medium text-slate-400">Édition manuelle</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <CvEditorView />
              </div>
            </div>
          )}

          {mobileTab === "letter" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800">
                <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-indigo-400" />
                  Lettre de motivation
                </p>
              </div>
              <div className="flex-1 overflow-hidden">
                <CoverLetterPanel onUpgradeRequired={() => setUpgradeModal({ open: true, reason: "letter" })} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden flex-shrink-0 flex border-t border-slate-800 bg-slate-950 safe-area-inset-bottom">
        {([
          { id: "chat", icon: MessageSquare, label: "Coach" },
          { id: "preview", icon: Eye, label: "Aperçu" },
          { id: "edit", icon: PenLine, label: "Édition" },
          { id: "letter", icon: Mail, label: "Lettre" },
        ] as const).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              if (id === "preview") lastPreviewSeenTs.current = Date.now();
              if (id === "letter" && plan.plan !== "pro") {
                setUpgradeModal({ open: true, reason: "letter" });
                return;
              }
              setMobileTab(id);
            }}
            className={`flex-1 relative flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              mobileTab === id ? "text-indigo-400" : "text-slate-600 hover:text-slate-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            {id === "preview" && hasUnseenUpdate && (
              <span className="absolute top-2 right-[calc(50%-14px)] w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            )}
            {label}
          </button>
        ))}
      </nav>

      {/* ── Onboarding ── */}
      {showOnboarding && (
        <OnboardingModal
          onStart={(firstName) => {
            setHasSeenOnboarding();
            if (firstName) chatRef.current?.sendExternalMessage(`Mon prénom est ${firstName}`);
          }}
        />
      )}

      {/* ── Delete Account ── */}
      {isDeleteModalOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
      )}

      {/* ── Drawers & Modals ── */}
      <JobMatchPanel
        isOpen={isJobMatchOpen}
        onClose={() => setIsJobMatchOpen(false)}
        onApplySuggestion={handleApplySuggestion}
      />
      <UpgradeModal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal((p) => ({ ...p, open: false }))}
        reason={upgradeModal.reason}
      />

      {/* ── Upgrade Success Toast ── */}
      {showUpgradeToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 bg-emerald-950/90 border border-emerald-700/50 backdrop-blur-sm
            text-emerald-200 px-5 py-3.5 rounded-xl shadow-2xl shadow-emerald-900/40">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-100">Bienvenue dans AuthenticV Pro !</p>
              <p className="text-xs text-emerald-400/80 mt-0.5">Toutes les fonctionnalités sont débloquées.</p>
            </div>
            <button
              onClick={() => setShowUpgradeToast(false)}
              className="text-emerald-500 hover:text-emerald-200 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

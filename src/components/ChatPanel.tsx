"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useCvStore } from "@/store/useCvStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatInputArea } from "@/components/chat/ChatInputArea";

// Applies a single AI tool call directly to the Zustand store for immediate re-render,
// before the background Supabase refetch confirms the canonical data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyOptimisticUpdate(toolName: string, args: Record<string, any>) {
  const store = useCvStore.getState();
  switch (toolName) {
    case "updatePersonalInfo":  store.updatePersonalInfo(args); break;
    case "updateSummary":       store.updateSummary(args.summary); break;
    case "setSkills":           store.setSkills(args.skills); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addExperience":       store.addExperience(args as any); break;
    case "updateExperience":    store.updateExperience(args.id, args.data); break;
    case "removeExperience":    store.removeExperience(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addEducation":        store.addEducation(args as any); break;
    case "updateEducation":     store.updateEducation(args.id, args.data); break;
    case "removeEducation":     store.removeEducation(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addLanguage":         store.addLanguage(args as any); break;
    case "updateLanguage":      store.updateLanguage(args.id, args.data); break;
    case "removeLanguage":      store.removeLanguage(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addCertification":    store.addCertification(args as any); break;
    case "updateCertification": store.updateCertification(args.id, args.data); break;
    case "removeCertification": store.removeCertification(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addProject":          store.addProject(args as any); break;
    case "updateProject":       store.updateProject(args.id, args.data); break;
    case "removeProject":       store.removeProject(args.id); break;
    case "removeSkill": {
      const skill = args.skill as string;
      store.setSkills(store.cvData.skills.filter((s) => s.toLowerCase() !== skill.toLowerCase()));
      break;
    }
  }
}

export interface ChatPanelHandle {
  sendExternalMessage: (text: string) => void;
}

export const ChatPanel = forwardRef<
  ChatPanelHandle,
  { onToolFinish?: () => void; onCheckpoint?: () => void }
>(function ChatPanel({ onToolFinish, onCheckpoint }, ref) {
  const isHydrated = useCvStore((s) => s.isHydrated);
  const coachLanguage = useCvStore((s) => s.coachLanguage);
  const setCoachLanguage = useCvStore((s) => s.setCoachLanguage);
  const chatMode = useCvStore((s) => s.chatMode);
  const [inputValue, setInputValue] = useState("");

  const { messages, status, sendMessage, error } = useChat({
    onError(err) {
      console.error("[Chat] Error:", err);
    },
    onFinish({ message }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts: any[] = (message as any).parts ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const toolParts = parts.filter(
        (p: any) => p.type === "tool-invocation" && p.toolInvocation?.state === "result"
      );

      if (toolParts.length > 0) {
        for (const part of toolParts) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { toolName, args } = part.toolInvocation as { toolName: string; args: Record<string, any> };
          applyOptimisticUpdate(toolName, args ?? {});
        }
        if (onToolFinish) onToolFinish();
      }
      onCheckpoint?.();
    },
  });

  const chatRequestOptions = (): { headers: Record<string, string> } => ({
    headers: {
      "X-Coach-Language": coachLanguage,
      "X-Chat-Mode": chatMode,
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useImperativeHandle(ref, () => ({
    sendExternalMessage: (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text }, chatRequestOptions());
    },
  }));

  // Speech-to-Text
  const speechLang = coachLanguage === "en" ? "en-US" : "fr-FR";
  const {
    transcript,
    isListening,
    isSupported,
    error: speechError,
    toggle: toggleMic,
    reset: resetSpeech,
  } = useSpeechRecognition(speechLang);

  useEffect(() => {
    if (transcript) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text }, chatRequestOptions());
    setInputValue("");
    resetSpeech();
  };

  const handleRetry = (text: string) => {
    sendMessage({ text }, chatRequestOptions());
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Liste des messages */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        error={error}
        coachLanguage={coachLanguage}
        chatMode={chatMode}
        isHydrated={isHydrated}
        onRetry={handleRetry}
      />

      {/* Chips de suggestions pour démarrage rapide */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {(chatMode === "interview"
            ? coachLanguage === "en"
              ? ["Start the interview simulation", "Focus on technical skills", "Practice strengths & weaknesses", "Ask tough questions"]
              : ["Démarrer la simulation d'entretien", "Concentrez-vous sur mes compétences techniques", "Entraînez-moi sur mes points forts/faibles", "Posez des questions difficiles"]
            : coachLanguage === "en"
            ? ["Tell me about your latest experience", "Improve my professional summary", "Add a technical skill", "Tailor my CV for a job offer"]
            : ["Parle-moi de ton expérience la plus récente", "Améliore mon résumé professionnel", "Ajoute une compétence technique", "Adapte mon CV pour une offre d'emploi"]
          ).map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                if (isLoading || !isHydrated) return;
                sendMessage({ text: prompt }, chatRequestOptions());
              }}
              disabled={isLoading || !isHydrated}
              className={`text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                chatMode === "interview"
                  ? "hover:text-violet-300 hover:border-violet-700/50 hover:bg-violet-950/40"
                  : "hover:text-indigo-300 hover:border-indigo-700/50 hover:bg-indigo-950/40"
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Zone de saisie et micro */}
      <ChatInputArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        isHydrated={isHydrated}
        coachLanguage={coachLanguage}
        setCoachLanguage={setCoachLanguage}
        isListening={isListening}
        isSupported={isSupported}
        speechError={speechError}
        toggleMic={toggleMic}
        onSubmit={handleSubmit}
      />
    </div>
  );
});

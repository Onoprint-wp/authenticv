"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useCvStore } from "@/store/useCvStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Send, Loader2, Bot, User, Mic, MicOff } from "lucide-react";

// Interface publique exposée via ref (utilisée par BuilderPage + JobMatchPanel)
export interface ChatPanelHandle {
  sendExternalMessage: (text: string) => void;
}

export const ChatPanel = forwardRef<
  ChatPanelHandle,
  { onToolFinish?: () => void; onCheckpoint?: () => void }
>(function ChatPanel({ onToolFinish, onCheckpoint }, ref) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isHydrated = useCvStore((s) => s.isHydrated);
  const coachLanguage = useCvStore((s) => s.coachLanguage);
  const setCoachLanguage = useCvStore((s) => s.setCoachLanguage);
  const chatMode = useCvStore((s) => s.chatMode);
  const [inputValue, setInputValue] = useState("");

  // AI SDK v6 useChat hook — handles UIMessageStream automatically
  // NOTE: headers are passed per-call via sendMessage's ChatRequestOptions
  const { messages, status, sendMessage, error } = useChat({
    onError(err) {
      console.error("[Chat] Error:", err);
    },
    onFinish({ message }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasTools = (message as any).parts?.some((p: any) => p.type === "tool-invocation");
      if (hasTools && onToolFinish) {
        onToolFinish();
      }
      // Save a version checkpoint after each complete coach response
      onCheckpoint?.();
    },
  });

  // Helper: build per-request options with current coach language + mode headers
  const chatRequestOptions = (): { headers: Record<string, string> } => ({
    headers: {
      "X-Coach-Language": coachLanguage,
      "X-Chat-Mode": chatMode,
    },
  });

  // Expose sendMessage via ref pour l'injection programmatique (ex: JobMatchPanel)
  useImperativeHandle(ref, () => ({
    sendExternalMessage: (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text }, chatRequestOptions());
    },
  }));

  const isLoading = status === "streaming" || status === "submitted";

  // ── Speech-to-Text ────────────────────────────────────────────────────────
  const speechLang = coachLanguage === "en" ? "en-US" : "fr-FR";
  const { transcript, isListening, isSupported, error: speechError, toggle: toggleMic, reset: resetSpeech } = useSpeechRecognition(speechLang);

  // Sync transcript → inputValue
  useEffect(() => {
    if (transcript) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(transcript);
    }
  }, [transcript]);

  // Reset speech state after sending a message
  const handleSendAndReset = () => {
    resetSpeech();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text }, chatRequestOptions());
    setInputValue("");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages */}
      <div data-testid="chat-messages" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              chatMode === "interview"
                ? "bg-violet-600/20 border-violet-500/30"
                : "bg-indigo-600/20 border-indigo-500/30"
            }`}>
              <Bot className={`w-7 h-7 ${chatMode === "interview" ? "text-violet-400" : "text-indigo-400"}`} />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">
                {chatMode === "interview"
                  ? (coachLanguage === "en" ? "Interview prep with Alex 🎓" : "Préparation entretien avec Alex 🎓")
                  : (coachLanguage === "en" ? "Hi! I'm Alex 👋" : "Bonjour ! Je suis Alex 👋")}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {chatMode === "interview"
                  ? (coachLanguage === "en"
                      ? "I'll simulate a real job interview based on your CV. Answer naturally — I'll give feedback after each response."
                      : "Je vais simuler un vrai entretien d'embauche basé sur votre CV. Répondez naturellement — je vous donne un retour après chaque réponse.")
                  : (coachLanguage === "en"
                      ? "Your personal CV coach. I'll ask you questions to build a compelling resume, step by step."
                      : "Votre coach CV personnel. Je vais vous poser des questions pour construire un CV percutant, étape par étape.")}
              </p>
            </div>
            {isHydrated && (
              <p className={`text-xs animate-pulse ${chatMode === "interview" ? "text-violet-400" : "text-indigo-400"}`}>
                {chatMode === "interview"
                  ? (coachLanguage === "en" ? "Click below to start the simulation" : "Cliquez ci-dessous pour démarrer la simulation")
                  : (coachLanguage === "en" ? "Start by telling me your first name!" : "Commencez par me dire votre prénom !")}
              </p>
            )}
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          // AI SDK v6 UIMessage: text lives in parts[].type==='text'.text
          const textContent = (() => {
            // v6 format: UIMessage with parts[]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const msg = m as any;
            if (Array.isArray(msg.parts)) {
              return msg.parts
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((p: any) => p.type === "text")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((p: any) => p.text ?? "")
                .join("");
            }
            if (typeof msg.content === "string") return msg.content;
            if (Array.isArray(msg.content)) {
              return msg.content
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((c: any) => c.type === "text")
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: any) => c.text ?? c.content ?? "")
                .join("");
            }
            return "";
          })();

          if (!isUser && !textContent) return null;


          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                  isUser
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-700 text-indigo-400"
                }`}
              >
                {isUser ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              <div
                data-testid="chat-message"
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-slate-800 text-slate-200 rounded-tl-sm"
                }`}
              >
                {textContent}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {error && (() => {
          // Parse error details from the API response
          const errorMessage = error.message || "";
          const isAuthError = errorMessage.includes("auth_error") || errorMessage.includes("502");
          const isRateLimit = errorMessage.includes("rate_limit") || errorMessage.includes("429");
          const isModelError = errorMessage.includes("model_error");
          const isTimeout = errorMessage.includes("timeout") || errorMessage.includes("504");
          
          const getErrorText = () => {
            if (coachLanguage === "en") {
              if (isAuthError) return "AI service authentication error. Please try again or contact support.";
              if (isRateLimit) return "Too many requests. Please wait a few seconds and try again.";
              if (isModelError) return "The AI model is temporarily unavailable. Please retry shortly.";
              if (isTimeout) return "The AI service is taking too long to respond. Please retry.";
              return "A network error occurred. Please try again.";
            }
            if (isAuthError) return "Erreur d'authentification avec le service IA. Réessayez ou contactez le support.";
            if (isRateLimit) return "Trop de requêtes. Patientez quelques secondes et réessayez.";
            if (isModelError) return "Le modèle IA est temporairement indisponible. Réessayez dans quelques instants.";
            if (isTimeout) return "Le service IA met trop de temps à répondre. Réessayez.";
            return "Une erreur réseau est survenue. Veuillez réessayer.";
          };

          // Find last user message for retry
          const lastUserMsg = [...messages].reverse().find(m => m.role === "user");

          return (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-red-900/50 border border-red-700 text-red-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-red-950/40 border border-red-900/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-red-200">
                <p className="mb-2">{getErrorText()}</p>
                <div className="flex gap-2">
                  {lastUserMsg && (
                    <button 
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const text = typeof (lastUserMsg as any).content === "string" 
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ? (lastUserMsg as any).content 
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          : (lastUserMsg as any).parts?.filter((p: any) => p.type === "text").map((p: any) => p.text).join("") ?? "";
                        if (text) sendMessage({ text }, chatRequestOptions());
                      }} 
                      className="text-xs bg-indigo-600/80 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/50"
                    >
                      {coachLanguage === "en" ? "🔄 Retry" : "🔄 Réessayer"}
                    </button>
                  )}
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-xs bg-red-900/60 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg transition-colors border border-red-700/50"
                  >
                    {coachLanguage === "en" ? "Reload page" : "Recharger la page"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick-prompt chips — visible uniquement quand le chat est vide */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {(chatMode === "interview"
            ? (coachLanguage === "en"
                ? ["Start the interview simulation", "Focus on technical skills", "Practice strengths & weaknesses", "Ask tough questions"]
                : ["Démarrer la simulation d'entretien", "Concentrez-vous sur mes compétences techniques", "Entraînez-moi sur mes points forts/faibles", "Posez des questions difficiles"])
            : (coachLanguage === "en"
                ? ["Tell me about your latest experience", "Improve my professional summary", "Add a technical skill", "Tailor my CV for a job offer"]
                : ["Parle-moi de ton expérience la plus récente", "Améliore mon résumé professionnel", "Ajoute une compétence technique", "Adapte mon CV pour une offre d'emploi"])
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

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <form onSubmit={(e) => { handleSubmit(e); handleSendAndReset(); }} className="flex gap-2 items-center">
          {/* Language Toggle */}
          <button
            id="chat-lang-btn"
            type="button"
            onClick={() => setCoachLanguage(coachLanguage === "fr" ? "en" : "fr")}
            title={coachLanguage === "fr" ? "Passer en anglais" : "Switch to French"}
            className="shrink-0 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-sm transition-all active:scale-95"
          >
            {coachLanguage === "fr" ? "🇫🇷" : "🇬🇧"}
          </button>
          <input
            id="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || !isHydrated}
            placeholder={
              isListening 
                ? (coachLanguage === "en" ? "🎤 Listening..." : "🎤 Je vous écoute…") 
                : !isHydrated 
                  ? (coachLanguage === "en" ? "Loading..." : "Chargement…") 
                  : (coachLanguage === "en" ? "Type your message..." : "Écrivez votre message…")
            }
            className={`flex-1 px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all ${
              isListening ? "border-red-500/50 ring-1 ring-red-500/30" : "border-slate-700"
            }`}
          />
          {/* Microphone Button */}
          {isSupported && (
            <button
              id="chat-mic-btn"
              type="button"
              onClick={toggleMic}
              disabled={isLoading}
              title={speechError || (isListening ? "Arrêter l'écoute" : "Dicter un message")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                isListening
                  ? "mic-recording text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            id="chat-send-btn"
            type="submit"
            disabled={isLoading || !inputValue.trim() || !isHydrated}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

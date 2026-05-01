"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useCvStore } from "@/store/useCvStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Send, Loader2, Bot, User, Mic, MicOff, Globe } from "lucide-react";

// Interface publique exposée via ref (utilisée par BuilderPage + JobMatchPanel)
export interface ChatPanelHandle {
  sendExternalMessage: (text: string) => void;
}

export const ChatPanel = forwardRef<
  ChatPanelHandle,
  { onToolFinish?: () => void }
>(function ChatPanel({ onToolFinish }, ref) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isHydrated = useCvStore((s) => s.isHydrated);
  const coachLanguage = useCvStore((s) => s.coachLanguage);
  const setCoachLanguage = useCvStore((s) => s.setCoachLanguage);
  const [inputValue, setInputValue] = useState("");

  // AI SDK v6 useChat hook — handles UIMessageStream automatically
  // NOTE: tools have server-side `execute` functions, so onToolCall is NOT needed here
  const { messages, status, sendMessage, error } = useChat({
    body: { coachLanguage },
    onError(err) {
      console.error("[Chat] Error:", err);
    },
    onFinish({ message }) {
      // Debug: log final message structure to verify parts format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log("[Chat] Message finished - parts:", JSON.stringify((message as any).parts?.map((p: any) => p.type) ?? "no-parts"));
      
      // If we have tool calls, trigger a refetch of the CV data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasTools = (message as any).parts?.some((p: any) => p.type === "tool-invocation");
      if (hasTools && onToolFinish) {
        onToolFinish();
      }
    },
  });

  // Expose sendMessage via ref pour l'injection programmatique (ex: JobMatchPanel)
  useImperativeHandle(ref, () => ({
    sendExternalMessage: (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text });
    },
  }));

  const isLoading = status === "streaming" || status === "submitted";

  // ── Speech-to-Text ────────────────────────────────────────────────────────
  const speechLang = coachLanguage === "en" ? "en-US" : "fr-FR";
  const { transcript, isListening, isSupported, error: speechError, toggle: toggleMic, reset: resetSpeech } = useSpeechRecognition(speechLang);

  // Sync transcript → inputValue
  useEffect(() => {
    if (transcript) {
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
    sendMessage({ text });
    setInputValue("");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
              <Bot className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">
                {coachLanguage === "en" ? "Hi! I'm Alex 👋" : "Bonjour ! Je suis Alex 👋"}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                {coachLanguage === "en" 
                  ? "Your personal CV coach. I'll ask you questions to build a compelling resume, step by step."
                  : "Votre coach CV personnel. Je vais vous poser des questions pour construire un CV percutant, étape par étape."
                }
              </p>
            </div>
            {isHydrated && (
              <p className="text-xs text-indigo-400 animate-pulse">
                {coachLanguage === "en" ? "Start by telling me your first name!" : "Commencez par me dire votre prénom !"}
              </p>
            )}
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";
          // AI SDK v6 UIMessage: text lives in parts[].type==='text'.text
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        {error && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-red-900/50 border border-red-700 text-red-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-red-950/40 border border-red-900/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-red-200">
              <p className="mb-2">Oups, une erreur réseau est survenue avec le serveur.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-xs bg-red-900/60 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg transition-colors border border-red-700/50"
              >
                Recharger la page
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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

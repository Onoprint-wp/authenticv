"use client";

import { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import { type UIMessage } from "ai";

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  error?: Error | null;
  coachLanguage: "fr" | "en";
  chatMode: "coach" | "interview";
  isHydrated: boolean;
  onRetry: (text: string) => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  error,
  coachLanguage,
  chatMode,
  isHydrated,
  onRetry,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div data-testid="chat-messages" className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              chatMode === "interview"
                ? "bg-violet-600/20 border-violet-500/30"
                : "bg-indigo-600/20 border-indigo-500/30"
            }`}
          >
            <Bot
              className={`w-7 h-7 ${
                chatMode === "interview" ? "text-violet-400" : "text-indigo-400"
              }`}
            />
          </div>
          <div>
            <p className="text-white font-semibold mb-1">
              {chatMode === "interview"
                ? coachLanguage === "en"
                  ? "Interview prep with Alex 🎓"
                  : "Préparation entretien avec Alex 🎓"
                : coachLanguage === "en"
                ? "Hi! I'm Alex 👋"
                : "Bonjour ! Je suis Alex 👋"}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              {chatMode === "interview"
                ? coachLanguage === "en"
                  ? "I'll simulate a real job interview based on your CV. Answer naturally — I'll give feedback after each response."
                  : "Je vais simuler un vrai entretien d'embauche basé sur votre CV. Répondez naturellement — je vous donne un retour après chaque réponse."
                : coachLanguage === "en"
                ? "Your personal CV coach. I'll ask you questions to build a compelling resume, step by step."
                : "Votre coach CV personnel. Je vais vous poser des questions pour construire un CV percutant, étape par étape."}
            </p>
          </div>
          {isHydrated && (
            <p
              className={`text-xs animate-pulse ${
                chatMode === "interview" ? "text-violet-400" : "text-indigo-400"
              }`}
            >
              {chatMode === "interview"
                ? coachLanguage === "en"
                  ? "Click below to start the simulation"
                  : "Cliquez ci-dessous pour démarrer la simulation"
                : coachLanguage === "en"
                ? "Start by telling me your first name!"
                : "Commencez par me dire votre prénom !"}
            </p>
          )}
        </div>
      )}

      {messages.map((m) => {
        const isUser = m.role === "user";
        const textContent = (() => {
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
        const errorMessage = (error.message || "") + (error.cause ? String(error.cause) : "");
        const isAuthError = errorMessage.includes("auth_error") || errorMessage.includes("401") || errorMessage.includes("502");
        const isRateLimit = errorMessage.includes("Too Many") || errorMessage.includes("rate_limit") || errorMessage.includes("429");
        const isQuota = errorMessage.includes("quota_exceeded") || errorMessage.includes("402");
        const isModelError = errorMessage.includes("model_error") || errorMessage.includes("model");
        const isTimeout = errorMessage.includes("timeout") || errorMessage.includes("504") || errorMessage.includes("ECONNREFUSED");

        const getErrorText = () => {
          if (coachLanguage === "en") {
            if (isQuota) return "You've reached your monthly free message limit. Upgrade to Pro to continue.";
            if (isAuthError) return "AI service authentication error. Please try again or contact support.";
            if (isRateLimit) return "Too many requests. Please wait a few seconds and try again.";
            if (isModelError) return "The AI model is temporarily unavailable. Please retry shortly.";
            if (isTimeout) return "The AI service is taking too long to respond. Please retry.";
            return "A network error occurred. Please try again.";
          }
          if (isQuota) return "Vous avez atteint votre limite mensuelle de messages gratuits. Passez à Pro pour continuer.";
          if (isAuthError) return "Erreur d'authentification avec le service IA. Réessayez ou contactez le support.";
          if (isRateLimit) return "Trop de requêtes. Patientez quelques secondes et réessayez.";
          if (isModelError) return "Le modèle IA est temporairement indisponible. Réessayez dans quelques instants.";
          if (isTimeout) return "Le service IA met trop de temps à répondre. Réessayez.";
          return "Une erreur réseau est survenue. Veuillez réessayer.";
        };

        const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");

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
                      const msg = lastUserMsg as unknown as { content?: string; parts?: Array<{ type: string; text?: string }> };
                      const text = typeof msg.content === "string"
                        ? msg.content
                        : msg.parts?.filter((p) => p.type === "text").map((p) => p.text ?? "").join("") ?? "";
                      if (text) onRetry(text);
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
  );
}

"use client";

import { Send, Loader2, Mic, MicOff } from "lucide-react";

interface ChatInputAreaProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isHydrated: boolean;
  coachLanguage: "fr" | "en";
  setCoachLanguage: (lang: "fr" | "en") => void;
  isListening: boolean;
  isSupported: boolean;
  speechError?: string | null;
  toggleMic: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInputArea({
  inputValue,
  setInputValue,
  isLoading,
  isHydrated,
  coachLanguage,
  setCoachLanguage,
  isListening,
  isSupported,
  speechError,
  toggleMic,
  onSubmit,
}: ChatInputAreaProps) {
  return (
    <div className="p-4 border-t border-border bg-card shadow-xs">
      <form onSubmit={onSubmit} className="flex gap-2 items-center">
        {/* Language Toggle */}
        <button
          id="chat-lang-btn"
          type="button"
          onClick={() => setCoachLanguage(coachLanguage === "fr" ? "en" : "fr")}
          title={coachLanguage === "fr" ? "Passer en anglais" : "Switch to French"}
          className="shrink-0 w-9 h-9 rounded-[10px] bg-muted hover:bg-muted/80 border border-border flex items-center justify-center text-sm transition-all active:scale-95 shadow-xs"
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
              ? coachLanguage === "en"
                ? "🎤 Listening..."
                : "🎤 Je vous écoute…"
              : !isHydrated
              ? coachLanguage === "en"
                ? "Loading..."
                : "Chargement…"
              : coachLanguage === "en"
              ? "Type your message..."
              : "Écrivez votre message…"
          }
          className={`flex-1 px-4 py-2.5 bg-background border rounded-[12px] text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#3667F0] focus:border-transparent disabled:opacity-50 transition-all font-sans shadow-xs ${
            isListening ? "border-red-500/50 ring-2 ring-red-500/30" : "border-border"
          }`}
        />

        {/* Microphone Button (Speech-to-Text) */}
        {isSupported && (
          <button
            id="chat-mic-btn"
            type="button"
            onClick={toggleMic}
            disabled={isLoading}
            title={speechError || (isListening ? "Arrêter l'écoute" : "Dicter un message")}
            className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border ${
              isListening
                ? "mic-recording text-white border-red-500"
                : "bg-muted hover:bg-muted/80 border-border text-foreground hover:text-[#3667F0]"
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}

        <button
          id="chat-send-btn"
          type="submit"
          disabled={isLoading || !inputValue.trim() || !isHydrated}
          className="w-9 h-9 gradient-ai hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed rounded-[10px] flex items-center justify-center transition-all active:scale-95 shadow-sm text-white"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </form>
    </div>
  );
}

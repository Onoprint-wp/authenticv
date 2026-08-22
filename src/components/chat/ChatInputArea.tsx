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
    <div className="p-4 border-t border-slate-800">
      <form onSubmit={onSubmit} className="flex gap-2 items-center">
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
          className={`flex-1 px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 transition-all ${
            isListening ? "border-red-500/50 ring-1 ring-red-500/30" : "border-slate-700"
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
  );
}

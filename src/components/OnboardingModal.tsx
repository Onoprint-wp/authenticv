"use client";

import { useState } from "react";
import { Bot, MessageSquare, Eye, Download, X } from "lucide-react";

interface OnboardingModalProps {
  onStart: (firstName: string) => void;
}

export function OnboardingModal({ onStart }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");

  const handleStart = () => {
    onStart(firstName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center pt-5 pb-1">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`w-2 h-2 rounded-full transition-all ${
                n === step ? "bg-indigo-400 w-4" : n < step ? "bg-indigo-700" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Bienvenue */}
        {step === 1 && (
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
              <Bot className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Bienvenue sur AuthentiCV</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Je suis <span className="text-indigo-300 font-semibold">Alex</span>, votre coach CV personnel.
                En quelques échanges, je vais vous aider à créer un CV qui vous ressemble et qui attire les recruteurs.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              Commencer →
            </button>
          </div>
        )}

        {/* Step 2 — Comment ça marche */}
        {step === 2 && (
          <div className="p-8 flex flex-col gap-5">
            <h2 className="text-xl font-bold text-white text-center">Comment ça marche ?</h2>
            <div className="flex flex-col gap-4">
              {[
                { icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-600/10 border-indigo-700/30", text: "Discutez avec Alex pour construire votre CV étape par étape" },
                { icon: Eye, color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-700/30", text: "Visualisez le résultat en temps réel dans l'aperçu" },
                { icon: Download, color: "text-violet-400", bg: "bg-violet-600/10 border-violet-700/30", text: "Téléchargez votre PDF final avec l'offre Pro" },
              ].map(({ icon: Icon, color, bg, text }) => (
                <div key={text} className={`flex items-start gap-4 p-4 rounded-xl border ${bg}`}>
                  <div className={`shrink-0 mt-0.5 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-95 mt-1"
            >
              Compris →
            </button>
          </div>
        )}

        {/* Step 3 — Première question */}
        {step === 3 && (
          <div className="p-8 flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Pour commencer…</h2>
              <p className="text-slate-400 text-sm">Alex aura besoin de vous connaître un peu.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Quel est votre prénom ?</label>
              <input
                type="text"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder="ex. Marie"
                className="w-full rounded-xl bg-slate-950/60 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              />
            </div>
            <button
              onClick={handleStart}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              C&apos;est parti !
            </button>
            <button
              onClick={() => onStart("")}
              className="text-xs text-slate-500 hover:text-slate-400 transition-colors text-center"
            >
              Passer cette étape
            </button>
          </div>
        )}

        {/* Close button (steps 2+) */}
        {step > 1 && (
          <button
            onClick={() => onStart("")}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

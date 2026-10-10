"use client";

import React, { useState } from "react";
import { Bell, BellRing, Check, RotateCcw, Sparkles } from "lucide-react";

interface Props {
  onResetFilters: () => void;
  isEn?: boolean;
}

export function RecruiterEmptyStateAlert({
  onResetFilters,
  isEn = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <div className="bg-card text-card-foreground border border-dashed border-border rounded-2xl p-8 text-center max-w-lg mx-auto my-6 space-y-4 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#3667F0] flex items-center justify-center mx-auto">
        <Bell className="w-6 h-6" />
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground">
          {isEn ? "No Talents Found for This Search" : "Aucun Talent Trouvé pour cette Recherche"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {isEn
            ? "Try adjusting your filters, or create an instant alert to be notified as soon as a matching candidate builds a CV with Alex IA."
            : "Ajustez vos filtres, ou créez une alerte instantanée pour être notifié dès qu'un candidat correspondant optimise son CV avec Alex IA."}
        </p>
      </div>

      {subscribed ? (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>
            {isEn
              ? "Alert activated! You will receive an email for new profiles."
              : "Alerte activée ! Vous recevrez un email dès l'arrivée d'un profil correspondant."}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isEn ? "Your work email..." : "Votre email professionnel..."}
            required
            className="text-xs bg-background border border-input rounded-xl px-3.5 py-2.5 flex-1 focus:outline-none focus:ring-2 focus:ring-[#3667F0]/30"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>{isEn ? "Alert Me" : "M'alerter"}</span>
          </button>
        </form>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEn ? "Reset all search filters" : "Réinitialiser tous les filtres"}</span>
        </button>
      </div>
    </div>
  );
}

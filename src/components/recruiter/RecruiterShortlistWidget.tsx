"use client";

import React, { useState } from "react";
import {
  BookmarkCheck,
  Trash2,
  Unlock,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { useRecruiterStore } from "@/store/useRecruiterStore";
import type { CandidateContact } from "@/types/recruiter";

interface Props {
  creditsBalance: number;
  onBatchUnlockSuccess: (unlockedProfiles: Record<string, CandidateContact>, newBalance: number) => void;
  onOpenBuyModal: () => void;
  isEn?: boolean;
}

export function RecruiterShortlistWidget({
  creditsBalance,
  onBatchUnlockSuccess,
  onOpenBuyModal,
  isEn = false,
}: Props) {
  const { shortlist, removeFromShortlist, clearShortlist } = useRecruiterStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const count = shortlist.length;

  // Calcul du barème dégressif
  let discountPercent = 0;
  let totalCostCredits = count;

  if (count >= 5) {
    discountPercent = 20;
    totalCostCredits = Math.max(1, Math.ceil(count * 0.8));
  } else if (count >= 3) {
    discountPercent = 10;
    totalCostCredits = Math.max(1, Math.ceil(count * 0.9));
  }

  const hasEnoughCredits = creditsBalance >= totalCostCredits;
  const neededCredits = Math.max(0, totalCostCredits - creditsBalance);

  const handleBatchUnlock = async () => {
    if (count === 0) return;
    if (!hasEnoughCredits) {
      onOpenBuyModal();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/recruiter/unlock-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeIds: shortlist.map((s) => s.id) }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Erreur lors du déblocage");
      }

      onBatchUnlockSuccess(data.unlockedProfiles || {}, data.creditsRemaining ?? creditsBalance);
      clearShortlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isEn ? "My Shortlist" : "Ma Sélection"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {count} {isEn ? "talent(s) selected" : "profil(s) sélectionné(s)"}
            </p>
          </div>
        </div>

        {count > 0 && (
          <button
            onClick={clearShortlist}
            className="text-[11px] text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
            title={isEn ? "Clear selection" : "Vider la sélection"}
          >
            <Trash2 className="w-3 h-3" />
            <span>{isEn ? "Clear" : "Vider"}</span>
          </button>
        )}
      </div>

      {/* Body / List */}
      {count === 0 ? (
        <div className="text-center py-6 px-3 bg-muted/20 border border-dashed border-border rounded-xl space-y-2">
          <p className="text-xs text-muted-foreground">
            {isEn
              ? "No talents selected yet. Click 'Select' on candidate cards to unlock in bulk with discounts."
              : "Aucun talent sélectionné. Cochez des profils pour débloquer en lot et bénéficier de réductions."}
          </p>
          <p className="text-[11px] text-[#3667F0] font-semibold">
            ✨ {isEn ? "Up to -20% volume discount" : "Jusqu'à -20% de remise groupée"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* List items */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {shortlist.map((talent) => (
              <div
                key={talent.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/40 text-xs border border-border/60"
              >
                <div className="truncate flex-1">
                  <p className="font-semibold text-foreground truncate">{talent.jobTitle}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{talent.location}</p>
                </div>
                <button
                  onClick={() => removeFromShortlist(talent.id)}
                  className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Pricing breakdown with discount */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{isEn ? "Profiles to unlock:" : "Profils à débloquer :"}</span>
              <span className="font-bold text-foreground">{count}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {isEn ? `Bulk Discount (-${discountPercent}%):` : `Remise Groupée (-${discountPercent}%) :`}
                </span>
                <span>-{count - totalCostCredits} {isEn ? "credit(s)" : "crédit(s)"}</span>
              </div>
            )}

            <div className="pt-2 border-t border-border flex justify-between items-center">
              <span className="font-bold text-foreground">
                {isEn ? "Total Cost:" : "Coût Total :"}
              </span>
              <span className="font-bold text-[#3667F0] text-sm">
                {totalCostCredits} {isEn ? "Credit(s)" : "Crédit(s)"}{" "}
                <span className="text-[11px] font-normal text-muted-foreground">
                  ({(totalCostCredits * 5000).toLocaleString("fr-FR")} FCFA)
                </span>
              </span>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-rose-500 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Action CTA */}
          {hasEnoughCredits ? (
            <button
              onClick={handleBatchUnlock}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? "Unlocking all profiles..." : "Déblocage groupé en cours..."}</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>
                    {isEn
                      ? `Unlock All (${totalCostCredits} Credits)`
                      : `Débloquer la sélection (${totalCostCredits} Crédits)`}
                  </span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenBuyModal}
              className="w-full flex items-center justify-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>
                {isEn
                  ? `Buy ${neededCredits} Credit(s) to Unlock`
                  : `Recharger ${neededCredits} Crédit(s) pour Débloquer`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Guarantee Footer */}
      <div className="pt-2 border-t border-border/70 flex items-start gap-2 text-[10px] text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          <strong className="text-foreground">{isEn ? "Verified Guarantee:" : "Garantie Vérifiée :"}</strong>{" "}
          {isEn
            ? "Unreachable or invalid contact? Credit automatically refunded within 24h."
            : "Contact invalide ou injoignable ? Crédit restitué automatiquement sous 24h."}
        </span>
      </div>
    </div>
  );
}

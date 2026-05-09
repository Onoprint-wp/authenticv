"use client";

import { useState } from "react";
import { Zap, ExternalLink } from "lucide-react";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import Link from "next/link";

interface Props {
  isPro?: boolean;
  hasSubscription?: boolean;
  deleteOnly?: boolean;
}

export function AccountActions({ isPro, hasSubscription, deleteOnly }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Danger zone only — delete button
  if (deleteOnly) {
    return (
      <>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex-shrink-0 text-sm font-medium text-red-400 hover:text-red-300
            bg-red-950/30 hover:bg-red-950/50 border border-red-900/40 hover:border-red-700/50
            px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          Supprimer mon compte
        </button>
        {isDeleteModalOpen && (
          <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
        )}
      </>
    );
  }

  // Full subscription actions
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {isPro ? (
        // Pro user — info (CamPay doesn't have a customer portal)
        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium
          border border-indigo-700/40 text-indigo-300 bg-indigo-950/30
          rounded-xl">
          <ExternalLink className="w-4 h-4" />
          Abonnement actif via Campay
        </div>
      ) : (
        // Free user — upgrade
        <>
          <Link
            href="/pricing"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold
              bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all
              shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Passer à Pro — 5 000 FCFA/mois
          </Link>
          {hasSubscription && (
            <div className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium
              border border-slate-700 text-slate-400 rounded-xl">
              <ExternalLink className="w-4 h-4" />
              Abonnement expiré
            </div>
          )}
        </>
      )}

      {isDeleteModalOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
}

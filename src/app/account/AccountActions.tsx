"use client";

import { useState } from "react";
import { Zap, ExternalLink } from "lucide-react";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import Link from "next/link";

interface Props {
  isPro?: boolean;
  hasStripeCustomer?: boolean;
  deleteOnly?: boolean;
}

export function AccountActions({ isPro, hasStripeCustomer, deleteOnly }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silent
    } finally {
      setPortalLoading(false);
    }
  };

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
        // Pro user — manage subscription
        <button
          onClick={openPortal}
          disabled={portalLoading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium
            border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500
            rounded-xl transition-all disabled:opacity-50 disabled:cursor-wait"
        >
          <ExternalLink className="w-4 h-4" />
          {portalLoading ? "Chargement..." : "Gérer mon abonnement"}
        </button>
      ) : (
        // Free user — upgrade or manage
        <>
          <Link
            href="/pricing"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold
              bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all
              shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Passer à Pro — 9 €/mois
          </Link>
          {hasStripeCustomer && (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium
                border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500
                rounded-xl transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              <ExternalLink className="w-4 h-4" />
              {portalLoading ? "..." : "Factures"}
            </button>
          )}
        </>
      )}

      {isDeleteModalOpen && (
        <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
}

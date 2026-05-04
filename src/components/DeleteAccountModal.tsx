"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { deleteAccount } from "@/app/account/actions";

interface Props {
  onClose: () => void;
}

export function DeleteAccountModal({ onClose }: Props) {
  const [confirmText, setConfirmText] = useState("");
  const confirmed = confirmText === "SUPPRIMER";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/30 rounded-xl flex items-center justify-center border border-red-700/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Supprimer mon compte</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-red-200 mb-2">Cette action est irréversible :</p>
            <ul className="list-disc list-inside space-y-1 text-red-300/80">
              <li>Votre CV et toutes vos données seront supprimés</li>
              <li>Votre photo de profil sera effacée</li>
              <li>Votre abonnement Pro sera résilié immédiatement</li>
              <li>Aucun remboursement ne sera effectué</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              Tapez{" "}
              <span className="font-bold text-red-400 font-mono">SUPPRIMER</span>{" "}
              pour confirmer
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              autoComplete="off"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 font-mono tracking-widest"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all border border-slate-700"
            >
              Annuler
            </button>
            <form action={deleteAccount} className="flex-1">
              <button
                type="submit"
                disabled={!confirmed}
                className="w-full py-2.5 bg-red-700 hover:bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all border border-red-600 disabled:border-slate-700 active:scale-95"
              >
                Supprimer définitivement
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

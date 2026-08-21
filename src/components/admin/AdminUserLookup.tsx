"use client";

import { useState } from "react";
import { UserCheck, Search, Zap, Loader2, Check, AlertCircle, ShieldCheck } from "lucide-react";

export function AdminUserLookup() {
  const [email, setEmail] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: "grant_pro" | "add_credits") => {
    if (!email.trim()) {
      setError("Veuillez saisir l'adresse email de l'utilisateur.");
      return;
    }

    setLoadingAction(action);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/grant-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), action, credits: 5 }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'action administrateur");
      }

      setMessage(data.message || "Action effectuée avec succès !");
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <ShieldCheck className="w-5 h-5 text-indigo-400" />
        <h2 className="text-sm font-semibold text-white">Module Support Client & Activation Manuelle</h2>
      </div>

      <p className="text-xs text-slate-400">
        Recherchez un utilisateur par email pour lui accorder manuellement un statut Pro ou créditer son compte entreprise en cas de demande support.
      </p>

      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Saisissez l'email de l'utilisateur (ex: client@gmail.com)"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleAction("grant_pro")}
            disabled={!!loadingAction}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loadingAction === "grant_pro" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserCheck className="w-4 h-4" />
            )}
            <span>Accorder 1 Mois Pro (Support)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("add_credits")}
            disabled={!!loadingAction}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs px-4 py-2.5 rounded-xl border border-amber-500/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loadingAction === "add_credits" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-amber-400" />
            )}
            <span>Ajouter +5 Crédits RH</span>
          </button>
        </div>
      </div>
    </div>
  );
}

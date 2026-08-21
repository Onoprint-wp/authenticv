"use client";

import { useState } from "react";
import { Lock, Check, Loader2, KeyRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function PasswordChangeSection() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de modifier le mot de passe"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
        <Lock className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-white">Sécurité & Mot de passe</h2>
      </div>

      <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Nouveau mot de passe</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Confirmer le mot de passe</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2.5 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Votre mot de passe a été mis à jour avec succès !</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !password}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-4 py-2 rounded-xl border border-slate-700 transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Mettre à jour le mot de passe</span>
          </button>
        </div>
      </form>
    </section>
  );
}

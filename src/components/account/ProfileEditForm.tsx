"use client";

import { useState } from "react";
import { User, Phone, Check, Loader2, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Props {
  initialFirstName?: string;
  initialLastName?: string;
  initialPhone?: string;
}

export function ProfileEditForm({
  initialFirstName = "",
  initialLastName = "",
  initialPhone = "",
}: Props) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          phone: phone.trim(),
        },
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour le profil"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 pt-3 border-t border-slate-800/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Prénom</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Votre prénom"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nom</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Votre nom"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Numéro de téléphone</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="ex: +237 699 00 11 22"
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2.5 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Informations enregistrées avec succès !</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Enregistrer les modifications</span>
        </button>
      </div>
    </form>
  );
}

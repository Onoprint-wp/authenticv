import { createClient } from "@/utils/supabase/server";
import { updatePassword } from "./actions";
import { FileText, Sparkles } from "lucide-react";

interface ResetPasswordPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const error = params.error;

  const background = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl" />
    </div>
  );

  const logo = (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          AuthentiCV
        </span>
      </div>
      <p className="text-slate-400 text-sm flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Votre coach CV propulsé par l&apos;IA
      </p>
    </div>
  );

  // Self-guard : no active session means the link expired or was already used
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        {background}
        <div className="relative w-full max-w-md">
          {logo}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-xl font-semibold text-white mb-1">
              Lien expiré
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Ce lien de réinitialisation a expiré ou a déjà été utilisé.
            </p>
            <a
              href="/login?reset=true"
              className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/25"
            >
              Demander un nouveau lien
            </a>
            <a
              href="/login"
              className="block text-center text-sm text-slate-500 hover:text-slate-300 transition-colors mt-4"
            >
              ← Retour à la connexion
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {background}
      <div className="relative w-full max-w-md">
        {logo}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-1">
            Nouveau mot de passe
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            Choisissez un mot de passe sécurisé d&apos;au moins 8 caractères.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">
              {decodeURIComponent(error)}
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Nouveau mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              formAction={updatePassword}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/25 active:scale-[0.98] mt-2"
            >
              Enregistrer le nouveau mot de passe
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

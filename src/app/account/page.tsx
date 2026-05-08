import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getUserPlan, getMonthlyMessageCount, FREE_MONTHLY_MESSAGES } from "@/lib/plan";
import Link from "next/link";
import { FileText, ArrowLeft, Shield, CreditCard, BarChart3, UserCircle, Calendar, Mail, Bell } from "lucide-react";
import { AccountActions } from "./AccountActions";
import { NudgeToggle } from "./NudgeToggle";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [plan, messagesUsed] = await Promise.all([
    getUserPlan(user.id),
    getMonthlyMessageCount(user.id),
  ]);

  // Get subscription details
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("status, campay_reference, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const createdAt = new Date(user.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { data: resumePrefs } = await supabase
    .from("resumes")
    .select("nudge_enabled")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  const nudgeEnabled = resumePrefs?.nudge_enabled ?? true;

  const isPro = plan === "pro";
  const messageLimit = isPro ? "∞" : String(FREE_MONTHLY_MESSAGES);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
        <Link href="/builder" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold tracking-tight">AuthentiCV</span>
        </Link>
        <Link
          href="/builder"
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au CV
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-6">
          {/* Page title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
              <UserCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Mon compte</h1>
              <p className="text-sm text-slate-500">Gérez votre profil et votre abonnement</p>
            </div>
          </div>

          {/* ── Profile Card ── */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Informations personnelles</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Adresse email</p>
                  <p className="text-sm text-slate-200">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Inscrit depuis</p>
                  <p className="text-sm text-slate-200">{createdAt}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Subscription Card ── */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Abonnement</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {isPro ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                      <span className="inline-flex w-8 h-8 items-center justify-center bg-indigo-600/20 rounded-lg border border-indigo-500/30">
                        ⚡
                      </span>
                      Plan Pro
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <span className="inline-flex w-8 h-8 items-center justify-center bg-slate-800 rounded-lg border border-slate-700">
                        🆓
                      </span>
                      Plan Gratuit
                    </span>
                  )}
                </div>
                {isPro ? (
                  <span className="text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-700/40 px-3 py-1 rounded-full font-medium">
                    5 000 FCFA/mois
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-800/60 border border-slate-700 px-3 py-1 rounded-full">
                    0 FCFA/mois
                  </span>
                )}
              </div>

              {/* Features summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-0.5">Messages IA</p>
                  <p className="text-sm font-semibold text-slate-200">{isPro ? "Illimités" : `${FREE_MONTHLY_MESSAGES}/mois`}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-0.5">Export PDF</p>
                  <p className="text-sm font-semibold text-slate-200">{isPro ? "Inclus ✓" : "Non inclus"}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-0.5">Job Match</p>
                  <p className="text-sm font-semibold text-slate-200">{isPro ? "Inclus ✓" : "Non inclus"}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-0.5">Lettre motivation</p>
                  <p className="text-sm font-semibold text-slate-200">{isPro ? "Inclus ✓" : "Non inclus"}</p>
                </div>
              </div>

              {/* Action buttons */}
              <AccountActions isPro={isPro} hasSubscription={!!sub?.campay_reference} />
            </div>
          </section>

          {/* ── Usage Card ── */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Utilisation ce mois-ci</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">Messages IA envoyés</span>
                <span className="text-sm font-semibold text-white">
                  {messagesUsed} / {messageLimit}
                </span>
              </div>
              {!isPro && (
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((messagesUsed / FREE_MONTHLY_MESSAGES) * 100, 100)}%`,
                      background:
                        messagesUsed >= FREE_MONTHLY_MESSAGES
                          ? "linear-gradient(90deg, #ef4444, #dc2626)"
                          : messagesUsed >= FREE_MONTHLY_MESSAGES * 0.8
                            ? "linear-gradient(90deg, #f59e0b, #d97706)"
                            : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                    }}
                  />
                </div>
              )}
              {isPro && (
                <p className="text-xs text-slate-500">
                  Votre plan Pro vous offre des messages illimités. Profitez-en !
                </p>
              )}
              {!isPro && messagesUsed >= FREE_MONTHLY_MESSAGES && (
                <p className="text-xs text-amber-400 mt-2">
                  Quota atteint — Passez à Pro pour des messages illimités.
                </p>
              )}
            </div>
          </section>

          {/* ── Notifications ── */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-300">Conseils hebdomadaires d&apos;Alex</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recevez chaque lundi des suggestions pour améliorer votre CV.
                </p>
              </div>
              <NudgeToggle initialEnabled={nudgeEnabled} />
            </div>
          </section>

          {/* ── Danger Zone ── */}
          <section className="bg-slate-900 border border-red-900/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-red-900/20 flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️</span>
              <h2 className="text-sm font-semibold text-red-300">Zone dangereuse</h2>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-300">Supprimer mon compte</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supprime définitivement votre CV, vos données et votre abonnement.
                </p>
              </div>
              <AccountActions deleteOnly />
            </div>
          </section>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 pb-4">
            Conformité RGPD — Vos données sont stockées dans l&apos;UE et
            supprimables à tout moment.
          </p>
        </div>
      </main>
    </div>
  );
}

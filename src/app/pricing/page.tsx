import { Check, X, FileText } from "lucide-react";
import Link from "next/link";
import { UpgradeButton } from "@/components/UpgradeButton";

const FREE_FEATURES = [
  { label: "1 CV", included: true },
  { label: "20 messages Alex / mois", included: true },
  { label: "Aperçu Web en temps réel", included: true },
  { label: "Tableau de bord ATS & suivi de candidatures", included: true },
  { label: "Sauvegarde automatique", included: true },
  { label: "Multi-CV (plusieurs CVs)", included: false },
  { label: "Export PDF", included: false },
  { label: "Lettre de motivation IA", included: false },
  { label: "Benchmark sectoriel", included: false },
];

const PRO_FEATURES = [
  { label: "Messages Alex illimités", included: true },
  { label: "Multi-CV — un CV par candidature", included: true },
  { label: "Export PDF en un clic", included: true },
  { label: "Lettre de motivation personnalisée par IA", included: true },
  { label: "Job Match — Optimisation pour une offre", included: true },
  { label: "Benchmark sectoriel — votre rang parmi les candidats", included: true },
  { label: "Accès prioritaire aux nouveautés", included: true },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">AuthenticV</span>
        </Link>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Choisissez votre plan
          </h1>
          <p className="text-slate-400 text-lg">
            Commencez gratuitement. Passez à Pro quand vous êtes prêt.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Free */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-400 mb-1">Gratuit</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">0€</span>
                <span className="text-slate-500 text-sm">/mois</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map(({ label, included }) => (
                <li key={label} className="flex items-center gap-3">
                  {included ? (
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${included ? "text-slate-300" : "text-slate-600"}`}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="w-full flex items-center justify-center py-3 border border-slate-600
                text-slate-300 hover:text-white hover:border-slate-400 text-sm font-medium
                rounded-xl transition-all"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Pro */}
          <div className="relative bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-700/50 rounded-2xl p-7 flex flex-col shadow-xl shadow-indigo-900/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Recommandé
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-indigo-400 mb-1">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">9€</span>
                <span className="text-slate-400 text-sm">/mois · sans engagement</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map(({ label }) => (
                <li key={label} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm text-slate-200">{label}</span>
                </li>
              ))}
            </ul>

            <UpgradeButton />
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-600">
          Paiement sécurisé par Stripe · Résiliable à tout moment · TVA incluse
        </p>
      </div>
    </div>
  );
}

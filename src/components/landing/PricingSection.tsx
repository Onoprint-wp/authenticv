"use client";

import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
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

export function PricingSection() {
  return (
    <section className="py-24 bg-slate-950 relative" id="tarifs">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/15 via-slate-950/0 to-slate-950/0 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Un tarif simple et transparent
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Commencez gratuitement. Passez à Pro quand vous êtes prêt.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-7 flex flex-col"
          >
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
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-700/50 rounded-2xl p-7 flex flex-col shadow-xl shadow-indigo-900/20"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3" /> Recommandé
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
          </motion.div>
        </div>

        <p className="text-center mt-8 text-xs text-slate-600">
          Paiement sécurisé par Stripe · Résiliable à tout moment · TVA incluse
        </p>
      </div>
    </section>
  );
}

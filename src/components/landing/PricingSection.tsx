"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { UpgradeButton } from "@/components/UpgradeButton";
import type { LandingDict } from "@/lib/i18n/landing";

interface Props {
  dict: LandingDict["pricing"];
}

export function PricingSection({ dict }: Props) {
  return (
    <section className="py-24 bg-slate-950 relative" id="tarifs">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/15 via-slate-950/0 to-slate-950/0 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Tarifs AuthentiCV — <span className="text-indigo-400">Flexibles et sans surprise</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base md:text-lg"
          >
            Commencez gratuitement par Mobile Money. Payez 1 000 FCFA pour une candidature unique ou 5 000 FCFA/mois en illimité.
          </motion.p>
        </div>

        {/* 3-Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* 1. Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-400 mb-1">Gratuit</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">0 FCFA</span>
                  <span className="text-slate-500 text-xs">/mois</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sans carte ni engagement</p>
              </div>

              <ul className="space-y-2.5 mb-6 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Chat Alex &amp; rédaction CV illimités</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Aperçu Web en temps réel</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Export PDF (avec filigrane)</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span>Export PDF HD sans filigrane</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span>Lettre de motivation IA</span>
                </li>
              </ul>
            </div>

            <Link
              href="/builder"
              className="w-full flex items-center justify-center py-2.5 border border-slate-700
                text-slate-300 hover:text-white hover:border-slate-500 text-sm font-medium
                rounded-xl transition-all"
            >
              Commencer (Gratuit)
            </Link>
          </motion.div>

          {/* 2. Micro-transaction Tier (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-indigo-950/50"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-slate-950" /> LE PLUS POPULAIRE 🔥
              </span>
            </div>

            <div>
              <div className="mb-4 pt-1">
                <p className="text-sm font-semibold text-amber-400 mb-1">À l'acte — 1 Candidature</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">1 000 FCFA</span>
                  <span className="text-amber-300/80 text-xs">/une fois</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Idéal pour une offre urgente</p>
              </div>

              <ul className="space-y-2.5 mb-6 text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-medium text-white">1 Export PDF HD sans filigrane</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>1 Lettre de motivation IA sur-mesure</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>1 Analyse Job Match ATS</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-400">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Paiement MoMo instantané</span>
                </li>
              </ul>
            </div>

            <UpgradeButton tier="single" className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer">
              Débloquer pour 1 000 FCFA
            </UpgradeButton>
          </motion.div>

          {/* 3. Monthly Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-indigo-400 mb-1">Pass Mensuel Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">5 000 FCFA</span>
                  <span className="text-slate-400 text-xs">/mois</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Pour la recherche active d'emploi</p>
              </div>

              <ul className="space-y-2.5 mb-6 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-semibold text-white">Exports PDF HD ILLIMITÉS</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Lettres de motivation IA illimitées</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Multi-CVs (un CV par offre)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Benchmark sectoriel de votre profil</span>
                </li>
              </ul>
            </div>

            <UpgradeButton tier="monthly" className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer">
              Passer au Pro (5 000 FCFA)
            </UpgradeButton>
          </motion.div>

        </div>

        {/* Annual Pass Banner */}
        <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              ÉCONOMISEZ 70 %
            </span>
            <h3 className="text-white font-bold text-base md:text-lg mt-1">
              Pass Annuel Carrière &amp; Veille (18 000 FCFA / an)
            </h3>
            <p className="text-xs md:text-sm text-slate-400">
              Pour les cadres, consultants et diplômés qui maintiennent leur profil à jour toute l'année.
            </p>
          </div>
          <UpgradeButton tier="annual" className="whitespace-nowrap px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-sm font-semibold rounded-xl transition-all cursor-pointer">
            S'abonner à l'Année (18 000 FCFA)
          </UpgradeButton>
        </div>

        <p className="text-center mt-8 text-xs text-slate-500">
          Paiement sécurisé Mobile Money (MTN MoMo / Orange Money) &amp; Carte bancaire via Campay.net.
        </p>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowRight, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

export function RecruiterCTASection() {
  return (
    <section className="py-16 bg-slate-900/90 border-t border-b border-slate-800 relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-r from-slate-950 to-indigo-950/80 border border-indigo-900/50 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" /> Espace Recruteurs &amp; Entreprises
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Recrutez les meilleurs talents de la zone CEMAC <span className="text-indigo-400">sans trier des centaines de CVs</span>
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Accédez à notre CVthèque anonymisée et qualifiée par l'IA. Recherchez par compétences, secteur et niveau d'expérience, et débloquez les profils candidats prêts à l'emploi.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Profils vérifiés &amp; optimisés ATS</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Candidats qualifiés CEMAC</span>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0"
          >
            <Link
              href="/recruiter"
              className="group flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 text-sm md:text-base"
            >
              <span>Accéder au Portail Recruteur</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

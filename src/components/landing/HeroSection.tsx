"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Play, Sparkles, MessageSquareText } from "lucide-react";
import type { LandingDict } from "@/lib/i18n/landing";
import { VideoModal } from "./VideoModal";

interface Props {
  dict: LandingDict["hero"];
}

export function HeroSection({ dict }: Props) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#3341552e_1px,transparent_1px),linear-gradient(to_bottom,#3341552e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Double CTA */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-brand-blue text-xs font-semibold mb-6 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
              </span>
              <span>{dict.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight mb-6 leading-tight">
              {dict.title1}{" "}
              <span className="gradient-text-brand">
                {dict.title2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-sans mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {dict.description}
            </p>

            {/* Double Action CTA: Primary Button + Video Movie Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                href="/builder"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)]"
              >
                <span>{dict.cta1}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group flex items-center justify-center gap-3 bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:shadow-[0_0_40px_rgba(34,211,238,0.25)] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all text-cyan-300">
                  <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                </div>
                <span>Voir le film (1 min 40)</span>
              </button>
            </div>

            {/* Key Benefits Reassurance */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{dict.benefit1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{dict.benefit2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{dict.benefit3}</span>
              </div>
            </div>

            {/* Mobile Money Reassurance */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
              <span>Paiement sécurisé via :</span>
              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">MTN MoMo</span>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-bold">Orange Money</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">Moov Money</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Video Teaser Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative w-full max-w-lg mx-auto"
          >
            <div className="relative rounded-3xl bg-slate-900 border-2 border-cyan-500/30 shadow-[0_0_60px_rgba(37,99,235,0.3)] overflow-hidden group">
              {/* Video Teaser Background with auto-loop */}
              <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                <video
                  src="/videos/authenticv_spot_candidat.mp4"
                  poster="/images/candidate_jeanmarc.jpg"
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                {/* Central Cinematic Play Button Trigger */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer z-10"
                  aria-label="Lancer la vidéo complète"
                >
                  <div className="w-18 h-18 rounded-full bg-blue-600/90 text-white flex items-center justify-center border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(34,211,238,0.7)] group-hover:scale-115 group-hover:bg-blue-500 transition-all">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                  <span className="bg-slate-950/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-cyan-300 border border-cyan-500/30 shadow-lg">
                    Cliquez pour voir la démo avec son
                  </span>
                </button>

                {/* Top Badge: ATS Score */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2 pointer-events-none"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400">ATS MATCH SCORE 87%</span>
                </motion.div>

                {/* Top Left Badge: Alex IA */}
                <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-blue-500/40 rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2 pointer-events-none">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">Coach Alex IA</span>
                </div>
              </div>

              {/* Bottom Video Information Bar */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Jean-Marc K. • Cadre Commercial</div>
                    <div className="text-[11px] text-slate-400">CV généré en 8 minutes via Mobile Money</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Prêt pour l&apos;embauche
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/videos/authenticv_master_film.mp4"
        title="AuthentiCV — « Du CV à l'opportunité » (Film Master de Marque)"
      />
    </section>
  );
}

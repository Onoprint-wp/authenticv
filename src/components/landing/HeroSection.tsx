"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, CheckCircle, MessageSquareText } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              L'IA génératrice de CV
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Créez un CV qui vous ressemble, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">sans effort.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Répondez simplement à notre IA conversationnelle. Elle extrait vos meilleures expériences et génère un CV optimisé pour décrocher votre prochain entretien.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link 
                href="/login" 
                className="group flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Générer mon CV
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#comment-ca-marche" 
                className="flex items-center justify-center gap-2 bg-slate-900/50 text-white border border-slate-700 font-medium px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors duration-300"
              >
                Voir comment ça marche
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Format ATS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Test gratuit</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-md mx-auto"
          >
            <div className="relative aspect-[3/4] bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl shadow-indigo-900/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-transparent p-6">
                {/* Mock CV Header */}
                <div className="flex gap-4 items-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/2 bg-slate-700 rounded" />
                    <div className="h-3 w-1/3 bg-slate-700/50 rounded" />
                  </div>
                </div>
                {/* Mock CV Content */}
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-1/4 bg-slate-700 rounded" />
                      <div className="h-2 w-full bg-slate-700/50 rounded" />
                      <div className="h-2 w-5/6 bg-slate-700/50 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating element 1 */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -right-12 bg-indigo-600 rounded-2xl p-4 shadow-xl border border-indigo-400/20 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageSquareText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-indigo-200">Alex (IA)</div>
                    <div className="text-sm font-medium text-white">Quelles étaient vos missions ?</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating element 2 */}
              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-24 -left-12 bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">CV généré</div>
                    <div className="text-sm font-medium text-white">Mise à jour réussie</div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { FileText, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-800/40 rounded-full px-4 py-1.5 text-xs text-indigo-300 mb-8">
          <Sparkles className="w-3 h-3" />
          Propulsé par Claude 3.5 Sonnet
        </div>

        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            AuthentiCV
          </h1>
        </div>

        <p className="text-xl text-slate-300 mb-4 leading-relaxed">
          Construisez un CV <span className="text-indigo-400 font-semibold">authentique et percutant</span> grâce à votre coach IA personnel
        </p>
        <p className="text-slate-500 text-sm mb-10">
          Chattez avec Alex, notre IA coach, et regardez votre CV se construire en temps réel
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Sparkles, title: "IA Conversationnelle", desc: "Un coach qui vous guide étape par étape" },
            { icon: Zap, title: "Mise à jour en temps réel", desc: "Votre CV s'actualise à chaque échange" },
            { icon: Shield, title: "ATS-Optimisé", desc: "Format compatible avec tous les logiciels RH" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <p className="text-white text-xs font-semibold mb-1">{title}</p>
              <p className="text-slate-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Créer mon CV gratuitement
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-slate-600 text-xs mt-4">
          Gratuit · Sans carte bancaire · Prêt en 5 minutes
        </p>
      </div>
    </main>
  );
}

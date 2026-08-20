import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Search, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { fr } from "@/lib/i18n/landing";

export const metadata: Metadata = {
  title: "Portail Recruteur AuthenticV — Base de Talents Qualifiés CEMAC",
  description:
    "Recherchez et recrutez les meilleurs candidats en Afrique centrale (Cameroun, Gabon, Congo...). Profils anonymisés, compétents et optimisés ATS.",
};

export default function RecruiterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar dict={fr.navbar} />

      <main className="flex-1 pt-32 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 uppercase tracking-wider">
            <Briefcase className="w-4 h-4" /> B2B RH &amp; Recrutement CEMAC
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Trouvez les meilleurs candidats <span className="text-indigo-400">sans perdre de temps dans le tri manuel</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Accédez à la 1ère CVthèque IA structurée d'Afrique centrale. Filtrez par compétences et débloquez les coordonnées des profils prêts à l'emploi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recruiter/search"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 text-base"
            >
              <Search className="w-5 h-5" />
              <span>Explorer les Talents Anonymisés</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Profils 100 % Formatés ATS</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Fini les CVs illisibles en Word ou scannés. Tous les candidats sont accompagnés par l'IA Alex pour présenter des compétences claires et chiffrées.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Recherche par Compétences</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Filtrez instantanément par métier, ville, années d'expérience et outils maîtrisés sans biais initial grâce à la recherche anonymisée.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Pay-Per-Unlock Réaliste</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Consultez les profils gratuitement. Débloquez uniquement les coordonnées (Tel, Email, WhatsApp) des candidats que vous souhaitez vraiment contacter.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-900/50 rounded-3xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Tarifs Recruteurs &amp; Entreprises</h2>
          <p className="text-slate-400 text-sm mb-6">Paiement par virement bancaire, carte ou Mobile Money Entreprise</p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
              <div className="text-amber-400 font-bold text-sm">Déblocage à l'unité</div>
              <div className="text-2xl font-bold text-white my-1">5 000 FCFA <span className="text-xs text-slate-400">/contact</span></div>
              <p className="text-xs text-slate-400">Idéal pour les PME et recrutements ponctuels.</p>
            </div>

            <div className="bg-slate-950/60 border border-indigo-800/80 p-5 rounded-xl">
              <div className="text-indigo-400 font-bold text-sm">Abonnement Mensuel RH</div>
              <div className="text-2xl font-bold text-white my-1">75 000 FCFA <span className="text-xs text-slate-400">/mois</span></div>
              <p className="text-xs text-slate-400">Accès illimité à la recherche + 20 déblocages de contact / mois.</p>
            </div>
          </div>

          <Link
            href="/recruiter/search"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg"
          >
            Accéder à la Recherche Talents
          </Link>
        </div>

      </main>

      <Footer dict={fr.footer} />
    </div>
  );
}

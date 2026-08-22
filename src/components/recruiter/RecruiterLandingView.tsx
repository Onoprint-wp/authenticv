"use client";

import Link from "next/link";
import { Briefcase, Search, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { fr, en } from "@/lib/i18n/landing";

interface Props {
  isEn?: boolean;
}

export function RecruiterLandingView({ isEn = false }: Props) {
  const dict = isEn ? en : fr;
  const searchUrl = isEn ? "/en/recruiter/search" : "/recruiter/search";

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Navbar dict={dict.navbar} />

      <main className="flex-1 pt-32 pb-20 px-6 max-w-6xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-brand-blue text-xs font-semibold mb-6 uppercase tracking-wider">
            <Briefcase className="w-4 h-4" /> {isEn ? "B2B HR & CEMAC Recruitment" : "B2B RH & Recrutement CEMAC"}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground tracking-tight mb-6 leading-tight">
            {isEn ? (
              <>Find top candidates <span className="text-brand-blue">without wasting time on manual CV screening</span></>
            ) : (
              <>Trouvez les meilleurs candidats <span className="text-brand-blue">sans perdre de temps dans le tri manuel</span></>
            )}
          </h1>
          <p className="text-muted-foreground font-sans text-lg mb-8 leading-relaxed">
            {isEn
              ? "Access Central Africa's premier AI-curated talent database. Filter by skills and unlock contacts of job-ready candidates."
              : "Accédez à la 1ère CVthèque IA structurée d'Afrique centrale. Filtrez par compétences et débloquez les coordonnées des profils prêts à l'emploi."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={searchUrl}
              className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md text-base cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>{isEn ? "Explore Anonymized Talents" : "Explorer les Talents Anonymisés"}</span>
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
            <h3 className="text-white font-bold text-lg mb-2">
              {isEn ? "100% ATS-Formatted Profiles" : "Profils 100 % Formatés ATS"}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isEn
                ? "No more unreadable Word or scanned CVs. Every candidate is coached by AI Alex to present clear, quantified achievements."
                : "Fini les CVs illisibles en Word ou scannés. Tous les candidats sont accompagnés par l'IA Alex pour présenter des compétences claires et chiffrées."}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              {isEn ? "Skill-Based Search" : "Recherche par Compétences"}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isEn
                ? "Filter instantly by job title, city, years of experience, and mastered tools without initial bias thanks to anonymized search."
                : "Filtrez instantanément par métier, ville, années d'expérience et outils maîtrisés sans biais initial grâce à la recherche anonymisée."}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">
              {isEn ? "Realistic Pay-Per-Unlock" : "Pay-Per-Unlock Réaliste"}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isEn
                ? "Browse candidate summaries and skills for free. Pay only to unlock full contact info (Phone, Email, WhatsApp) for candidates you actually want to interview."
                : "Consultez les profils gratuitement. Débloquez uniquement les coordonnées (Tel, Email, WhatsApp) des candidats que vous souhaitez vraiment contacter."}
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-900/50 rounded-3xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isEn ? "Recruiter & Corporate Pricing" : "Tarifs Recruteurs & Entreprises"}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {isEn ? "Payment by bank transfer, corporate card, or Mobile Money" : "Paiement par virement bancaire, carte ou Mobile Money Entreprise"}
          </p>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
              <div className="text-amber-400 font-bold text-sm">
                {isEn ? "Single Contact Unlock" : "Déblocage à l'unité"}
              </div>
              <div className="text-2xl font-bold text-white my-1">
                5 000 FCFA <span className="text-xs text-slate-400">{isEn ? "/contact" : "/contact"}</span>
              </div>
              <p className="text-xs text-slate-400">
                {isEn ? "Ideal for SMEs and one-off hiring needs." : "Idéal pour les PME et recrutements ponctuels."}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-indigo-800/80 p-5 rounded-xl">
              <div className="text-indigo-400 font-bold text-sm">
                {isEn ? "Monthly HR Subscription" : "Abonnement Mensuel RH"}
              </div>
              <div className="text-2xl font-bold text-white my-1">
                75 000 FCFA <span className="text-xs text-slate-400">{isEn ? "/month" : "/mois"}</span>
              </div>
              <p className="text-xs text-slate-400">
                {isEn ? "Unlimited search access + 20 contact unlocks / month included." : "Accès illimité à la recherche + 20 déblocages de contact / mois."}
              </p>
            </div>
          </div>

          <Link
            href={searchUrl}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer"
          >
            {isEn ? "Access Talent Search" : "Accéder à la Recherche Talents"}
          </Link>
        </div>

      </main>

      <Footer dict={dict.footer} />
    </div>
  );
}

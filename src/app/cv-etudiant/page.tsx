import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { fr } from "@/lib/i18n/landing";
import {
  GraduationCap, Sparkles, CheckCircle2, ShieldCheck,
  ArrowRight, BookOpen, Award, Zap, HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "CV Étudiant & Sans Expérience : Modèle IA Gratuit | AuthentiCV",
  description:
    "Créez un CV étudiant percutant même sans expérience professionnelle. Alex, votre coach IA, transforme vos stages, projets académiques et compétences en atouts. Paiement Mobile Money dès 1 000 FCFA.",
  keywords: [
    "cv etudiant",
    "cv sans experience",
    "modele cv etudiant gratuit",
    "cv premier emploi",
    "cv stage cameroun",
    "lettre de motivation etudiant",
    "rediger cv sans experience",
    "authenticv etudiant",
  ],
  alternates: {
    canonical: "https://www.authenticv.app/cv-etudiant",
  },
  openGraph: {
    title: "CV Étudiant & Sans Expérience — Coach IA Alex | AuthentiCV",
    description:
      "Pas encore d'expérience pro ? Tes projets comptent déjà. Alex IA les transforme en expériences professionnelles pour ton CV dès 1 000 FCFA en Mobile Money.",
    url: "https://www.authenticv.app/cv-etudiant",
    type: "website",
    locale: "fr_FR",
    siteName: "AuthentiCV Campus",
    images: [
      {
        url: "/images/og-cv-etudiant-campus.jpg",
        width: 1200,
        height: 628,
        alt: "AuthentiCV Campus - CV Étudiant & Sans Expérience avec Alex IA Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CV Étudiant & Sans Expérience — Coach IA Alex | AuthentiCV",
    description:
      "Pas encore d'expérience pro ? Tes projets comptent déjà. Alex IA les transforme en expériences professionnelles pour ton CV dès 1 000 FCFA.",
    images: ["/images/og-cv-etudiant-campus.jpg"],
  },
};

const FAQ_STUDENT = [
  {
    q: "Que mettre dans mon CV si je n'ai jamais eu d'emploi salarié ?",
    a: "Coach Alex vous aide à valoriser vos projets académiques, exposés, stages d'observation, bénévolat associatif et compétences informatiques. Un recruteur junior cherche avant tout la curiosité, la rigueur et la capacité d'apprentissage.",
  },
  {
    q: "Comment fonctionne l'essai gratuit pour les étudiants ?",
    a: "Vous pouvez discuter gratuitement avec Alex pour rédiger et prévisualiser l'intégralité de votre CV. Vous pouvez exporter un PDF gratuit avec filigrane ou débloquer la version HD propre pour seulement 1 000 FCFA par Mobile Money (MTN MoMo ou Orange Money).",
  },
  {
    q: "Mon CV sera-t-il accepté par les grandes entreprises et banques ?",
    a: "Oui, tous les modèles d'AuthentiCV sont 100 % conformes aux standards ATS (Applicant Tracking Systems) utilisés par les grandes entreprises pour filtrer les candidatures de stage et d'embauche.",
  },
  {
    q: "Puis-je aussi rédiger ma lettre de motivation pour mon stage ?",
    a: "Absolument. Alex génère une lettre de motivation sur-mesure adaptée précisément à l'offre de stage ou d'alternance visée.",
  },
];

const studentFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_STUDENT.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function CvEtudiantPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studentFaqSchema) }}
      />
      <div className="min-h-screen bg-[#0F223D] text-slate-100 flex flex-col font-sans antialiased">
        <Navbar dict={fr.navbar} />

        <main className="flex-1 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Spécial Étudiants, Stages & 1er Emploi
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight mb-6 leading-tight">
              Comment faire un CV percutant <span className="text-[#32D3E1]">quand on n&apos;a pas d&apos;expérience ?</span>
            </h1>
            <p className="text-slate-300 font-sans text-lg mb-8 leading-relaxed">
              Fini l&apos;angoisse de la page blanche. Discutez 5 minutes avec <strong>Alex</strong>, votre coach IA : il transforme vos cours, projets, stages et compétences personnelles en un CV professionnel prêt pour les recruteurs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/builder"
                className="flex items-center justify-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Rédiger mon CV avec Alex</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Gratuit • Sans carte bancaire • Déblocage 1 000 FCFA par MTN MoMo / Orange Money
            </p>
          </div>

          {/* 4 Pillars for Students */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#32D3E1] mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">1. Valorisez vos projets d&apos;études</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Un projet de fin d&apos;études, un exposé en groupe ou un mini-mémoire valent autant qu&apos;une première expérience s&apos;ils sont formulés avec les bons verbes d&apos;action. Alex extrait l&apos;impact de vos réalisations.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">2. Mettez en avant vos Soft Skills</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Rigueur, esprit d&apos;équipe, adaptabilité, outils informatiques (Excel, Canva, Python, Word...) : Alex sait exactement quelles compétences les recruteurs juniors recherchent en priorité.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">3. Format 100 % Compatible ATS</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ne vous faites pas éliminer par les robots de tri à cause d&apos;une mise en page Word cassée. AuthentiCV structure vos rubriques selon les règles strictes des multinationales et cabinets RH.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading text-white mb-2">4. Paiement Mobile Money Direct</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Pas besoin de carte Visa ou Mastercard. Payez 1 000 FCFA à l&apos;acte par MTN MoMo ou Orange Money uniquement quand vous êtes 100 % satisfait de votre CV et prêt à postuler.
              </p>
            </div>
          </div>

          {/* Example Structure */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-20">
            <h2 className="text-2xl font-bold font-heading text-white text-center mb-8">
              La structure idéale d&apos;un CV Étudiant selon nos experts
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-[#32D3E1] flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Titre précis &amp; Accroche d&apos;Alex</h4>
                  <p className="text-xs text-slate-400 mt-1">Ex: « Étudiant en 3ème année Gestion — Recherche Stage de 3 mois en Audit » avec une phrase synthétisant vos atouts.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-[#32D3E1] flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Formation &amp; Diplômes détaillés</h4>
                  <p className="text-xs text-slate-400 mt-1">Mention des cours clés, projets d&apos;études marquants et mentions obtenues.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-[#32D3E1] flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Stages, Bénévolat &amp; Activités associatives</h4>
                  <p className="text-xs text-slate-400 mt-1">Même un stage de 2 semaines ou la gestion d&apos;un événement de club compte énormément.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-[#32D3E1] flex items-center justify-center font-bold text-sm shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Compétences techniques, Outils &amp; Langues</h4>
                  <p className="text-xs text-slate-400 mt-1">Logiciels maîtrisés, niveau de langues et certifications éventuelles.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student FAQ */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4 text-[#32D3E1]" /> Questions Fréquentes
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white">
                Foire aux Questions — Spécial Étudiants
              </h2>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              {FAQ_STUDENT.map((item, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white text-base mb-2">{item.q}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-800/40 rounded-3xl p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold font-heading text-white mb-3">
              Prêt à décrocher votre stage ou premier emploi ?
            </h3>
            <p className="text-slate-300 text-sm mb-6">
              Discutez gratuitement avec Coach Alex dès maintenant et repartez avec un CV impeccable.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md text-sm"
            >
              <span>Commencer mon CV Étudiant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>

        <Footer dict={fr.footer} />
      </div>
    </>
  );
}

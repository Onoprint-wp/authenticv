import type { Metadata } from "next";
import { Check, X, Zap } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { UpgradeButton } from "@/components/UpgradeButton";

export const metadata: Metadata = {
  title: "Tarifs AuthentiCV — Gratuit ou Pro 9 € | Générateur CV IA",
  description:
    "Créez votre CV avec l'IA gratuitement ou passez Pro à 9 €/mois. Accès illimité au coach Alex, export PDF, lettre de motivation IA. Sans carte bancaire pour commencer.",
  keywords: [
    "tarif cv ia",
    "prix générateur cv",
    "cv ia gratuit",
    "abonnement cv pro",
    "authenticv prix",
    "cv ia 9 euros",
  ],
  alternates: {
    canonical: "https://www.authenticv.app/tarifs",
  },
  openGraph: {
    title: "Tarifs AuthentiCV — Gratuit ou Pro 9 €",
    description:
      "Commencez gratuitement, passez Pro à 9 €/mois. Coach IA, export PDF, lettre de motivation. Sans engagement.",
    url: "https://www.authenticv.app/tarifs",
  },
};

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AuthentiCV est-il vraiment gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Le plan gratuit est accessible sans carte bancaire. Vous pouvez créer votre CV, discuter avec Alex (20 messages/mois) et prévisualiser le résultat immédiatement.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte AuthentiCV Pro ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le plan Pro coûte 9 € par mois (environ 5 900 FCFA), sans engagement. Vous pouvez résilier à tout moment en un clic.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je résilier mon abonnement Pro à tout moment ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, sans condition ni frais. Votre abonnement reste actif jusqu'à la fin de la période payée, puis vous repassez automatiquement sur le plan gratuit.",
      },
    },
    {
      "@type": "Question",
      name: "Quels moyens de paiement acceptez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nous acceptons les cartes bancaires (Visa, Mastercard) et le Mobile Money (MTN Mobile Money, Orange Money). Le paiement est sécurisé.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si j'atteins les 20 messages gratuits ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le compteur se réinitialise chaque mois. Votre CV reste accessible et sauvegardé. Pour plus de messages, passez au plan Pro.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne le Job Match Pro ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Collez le texte d'une offre d'emploi et Alex analyse les mots-clés et compétences pour vous suggérer des améliorations ciblées de votre CV. Disponible sur le plan Pro.",
      },
    },
  ],
};

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="flex-1 flex flex-col items-center pt-32 pb-16 px-4">
        {/* Hero */}
        <div className="text-center mb-14 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Tarifs AuthentiCV — <span className="text-indigo-400">Simple et transparent</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Commencez gratuitement, sans carte bancaire. Passez Pro à 9 €/mois quand vous êtes
            prêt.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Free */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-400 mb-1">Gratuit</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">0 €</span>
                <span className="text-slate-500 text-sm">/mois</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Sans carte bancaire</p>
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
              href="/builder"
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
              <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3" /> Recommandé
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-indigo-400 mb-1">Pro</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">9 €</span>
                <span className="text-slate-400 text-sm">/mois · sans engagement</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">≈ 5 900 FCFA · Résiliable à tout moment</p>
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

        <p className="mt-8 text-xs text-slate-600 text-center">
          Paiement sécurisé · Carte bancaire &amp; Mobile Money (MTN / Orange) · Résiliable en un
          clic
        </p>
      </main>

      <FaqSection />
      <Footer />
    </div>
  );
}

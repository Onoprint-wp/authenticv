import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap, Sparkles,
  ShieldCheck, ArrowRight, ArrowLeft, MessageCircle, FileText, Award, Users, BookOpen
} from "lucide-react";

export const metadata: Metadata = {
  title: "Partenariats Universités & Campus CEMAC — AuthentiCV",
  description:
    "Programme officiel pour les universités, grandes écoles et BDE de la zone CEMAC. Équipez vos étudiants d'un coach CV propulsé par l'IA avec des tarifs préférentiels négociés.",
};

const PARTNER_UNIVERSITIES = [
  { name: "Université de Yaoundé I", code: "UY1", country: "🇨🇲 Cameroun", discount: "30%" },
  { name: "Université de Douala", code: "UDLA", country: "🇨🇲 Cameroun", discount: "30%" },
  { name: "University of Buea", code: "UBUEA", country: "🇨🇲 Cameroun", discount: "30%" },
  { name: "Université de Dschang", code: "UDSH", country: "🇨🇲 Cameroun", discount: "30%" },
  { name: "Université Omar Bongo", code: "UOB", country: "🇬🇦 Gabon", discount: "30%" },
  { name: "Université Marien Ngouabi", code: "UMNG", country: "🇨🇬 Congo", discount: "30%" },
];

const CAMPUS_BENEFITS = [
  {
    icon: Sparkles,
    title: "Coach IA Dédié pour Chaque Étudiant",
    desc: "Alex guide l'étudiant étape par étape pour valoriser ses projets académiques, stages et compétences même sans expérience professionnelle prolongée.",
  },
  {
    icon: ShieldCheck,
    title: "Formats ATS Homologués Recruteurs",
    desc: "Des modèles de CV conformes aux standards des multinationales et cabinets RH en zone CEMAC (MTN, Orange, TotalEnergies, SABC, banques).",
  },
  {
    icon: Award,
    title: "0 FCFA de Frais d'Infrastructure",
    desc: "Aucune intégration logicielle lourde requise. Déploiement instantané via code promo institutionnel ou lien de parrainage dédié.",
  },
  {
    icon: Users,
    title: "Modèle Hybride & Cashback BDE",
    desc: "Possibilité de ristourne ou commission reversée directement au Bureau Des Étudiants (BDE) pour financer la vie associative.",
  },
];

export default function CampusPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-bold text-white text-sm sm:text-base">
                AuthentiCV <span className="text-indigo-400">Campus</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
            >
              <span>Créer mon CV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 space-y-16">
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Programme Partenaire Académique · Zone CEMAC</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Propulsez l&apos;insertion professionnelle de{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
              vos étudiants &amp; diplômés
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Équipez vos promotions de la première plateforme IA de rédaction de CV &amp; Lettres de motivation conçue spécifiquement pour le marché de l&apos;emploi en Afrique francophone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/237699123456?text=Bonjour%2C%20je%20souhaite%20mettre%20en%20place%20un%20partenariat%20Campus%20AuthentiCV%20pour%20notre%20%C3%A9tablissement."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter l&apos;Équipe Partenariats (WhatsApp)</span>
            </a>

            <Link
              href="/tarifs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs py-3 px-6 rounded-xl border border-slate-800 transition-all"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Voir la Grille Tarifaire Étudiante</span>
            </Link>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Pourquoi les universités et écoles choisissent AuthentiCV ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Une solution clé en main pour maximiser le taux de recrutement des nouveaux diplômés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAMPUS_BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-6 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Partner Universities Section */}
        <section className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/40 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Codes Promo &amp; Conventions Actives</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Exemples d&apos;établissements bénéficiant de tarifs préférentiels en zone CEMAC.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
              Jusqu&apos;à -50% pour les étudiants
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTNER_UNIVERSITIES.map((uni, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{uni.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{uni.country}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    -{uni.discount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <h3 className="text-lg font-bold text-white">
            Vous êtes responsable de formation, doyen ou président de BDE ?
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Nous générons une convention cadre certifiée OHADA en moins de 24h avec un code promo exclusif pour votre établissement.
          </p>
          <div className="pt-2">
            <a
              href="mailto:campus@authenticv.app?subject=Demande%20de%20Partenariat%20Campus%20AuthentiCV"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-lg transition-all"
            >
              <span>Écrire à campus@authenticv.app</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        AuthentiCV Campus · Accélérateur d&apos;insertion professionnelle EdTech · Zone CEMAC
      </footer>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#081426] text-[#111827] dark:text-[#F8FAFC] flex flex-col selection:bg-[#3667F0] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#D1D5DB] dark:border-slate-800 bg-white/90 dark:bg-[#0F223D]/90 backdrop-blur sticky top-0 z-30 px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-slate-400 hover:text-[#111827] transition-colors font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Accueil</span>
            </Link>
            <span className="text-[#D1D5DB] dark:text-slate-700">|</span>
            <Image
              src="/images/logo/logo-campus.png"
              alt="AuthentiCV Campus"
              width={190}
              height={45}
              className="h-10 md:h-11 w-auto object-contain"
              priority
            />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#374151] dark:text-slate-300 hover:text-[#111827] px-3 py-1.5 rounded-[10px] transition-colors font-sans"
            >
              Connexion
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-1.5 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-semibold text-xs px-4 py-2 rounded-[12px] transition-all shadow-sm active:scale-95 font-sans"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#32D3E1]/10 border border-[#32D3E1]/30 text-[#008ba3] dark:text-[#32D3E1] text-xs font-semibold font-sans">
            <GraduationCap className="w-4 h-4 text-[#32D3E1]" />
            <span>Programme Partenaire Académique · Zone CEMAC</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#0F223D] dark:text-white tracking-tight leading-tight">
            Propulsez l&apos;insertion professionnelle de{" "}
            <span className="bg-gradient-to-r from-[#3667F0] via-[#32D3E1] to-[#7C5CFC] bg-clip-text text-transparent">
              vos étudiants &amp; diplômés
            </span>
          </h1>

          <p className="text-[#6B7280] dark:text-[#AAB8CB] font-sans text-sm sm:text-base leading-relaxed">
            Équipez vos promotions de la première plateforme IA de rédaction de CV &amp; Lettres de motivation conçue spécifiquement pour le marché de l&apos;emploi en Afrique francophone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/237699123456?text=Bonjour%2C%20je%20souhaite%20mettre%20en%20place%20un%20partenariat%20Campus%20AuthentiCV%20pour%20notre%20%C3%A9tablissement."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25C78A] hover:bg-[#25C78A]/90 text-white font-semibold text-xs py-3 px-6 rounded-[12px] transition-all shadow-sm active:scale-95 font-sans"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter l&apos;Équipe Partenariats (WhatsApp)</span>
            </a>

            <Link
              href="/pricing"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#0F223D] text-[#0F223D] dark:text-slate-100 hover:bg-[#F3F4F6] font-semibold text-xs py-3 px-6 rounded-[12px] border border-[#D1D5DB] dark:border-slate-700 transition-all font-sans shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#3667F0]" />
              <span>Voir la Grille Tarifaire Étudiante</span>
            </Link>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0F223D] dark:text-white">
              Pourquoi les universités et écoles choisissent AuthentiCV ?
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB8CB] font-sans">
              Une solution clé en main pour maximiser le taux de recrutement des nouveaux diplômés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAMPUS_BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 hover:border-[#3667F0]/30 rounded-[16px] p-6 transition-all space-y-3 elevation-1 hover:elevation-2"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-[#3667F0]/10 border border-[#3667F0]/30 flex items-center justify-center text-[#3667F0]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-heading text-[#0F223D] dark:text-white">{b.title}</h3>
                  <p className="text-xs text-[#6B7280] dark:text-slate-300 font-sans leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Partner Universities Section */}
        <section className="bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-8 space-y-6 elevation-1">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-[#0F223D] dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#3667F0]" />
                <span>Codes Promo &amp; Conventions Actives</span>
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 font-sans mt-1">
                Exemples d&apos;établissements bénéficiant de tarifs préférentiels en zone CEMAC.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#25C78A] bg-[#25C78A]/10 border border-[#25C78A]/30 px-3 py-1 rounded-full font-sans">
              Jusqu&apos;à -50% pour les étudiants
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTNER_UNIVERSITIES.map((uni, idx) => (
              <div
                key={idx}
                className="bg-[#FAFAFC] dark:bg-slate-900/60 border border-[#D1D5DB] dark:border-slate-800 rounded-[12px] p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold font-heading text-[#0F223D] dark:text-white">{uni.name}</div>
                  <div className="text-[11px] text-[#6B7280] dark:text-slate-400 font-sans mt-0.5">{uni.country}</div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xs font-semibold text-[#32D3E1] dark:text-[#32D3E1] bg-[#32D3E1]/10 px-2.5 py-1 rounded-full border border-[#32D3E1]/30">
                    -{uni.discount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="text-center bg-white dark:bg-[#0F223D] border border-[#E5E7EB] dark:border-slate-800 rounded-[16px] p-8 space-y-4 elevation-1">
          <h3 className="text-lg font-bold font-heading text-[#0F223D] dark:text-white">
            Vous êtes responsable de formation, doyen ou président de BDE ?
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-slate-300 font-sans max-w-xl mx-auto">
            Nous générons une convention cadre certifiée OHADA en moins de 24h avec un code promo exclusif pour votre établissement.
          </p>
          <div className="pt-2">
            <a
              href="mailto:campus@authenticv.app?subject=Demande%20de%20Partenariat%20Campus%20AuthentiCV"
              className="inline-flex items-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-semibold text-xs py-2.5 px-6 rounded-[12px] shadow-sm transition-all font-sans"
            >
              <span>Écrire à campus@authenticv.app</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#D1D5DB] dark:border-slate-800 py-6 text-center text-xs text-[#6B7280] dark:text-slate-400 font-sans">
        AuthentiCV Campus · Accélérateur d&apos;insertion professionnelle EdTech · Zone CEMAC
      </footer>
    </div>
  );
}

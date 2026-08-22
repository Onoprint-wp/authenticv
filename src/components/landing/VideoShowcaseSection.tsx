"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, GraduationCap, Building2, Play, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { VideoModal } from "./VideoModal";

interface UniverseTab {
  id: "candidat" | "campus" | "recruteur";
  title: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  benefits: string[];
  videoSrc: string;
  posterSrc: string;
  ctaText: string;
  ctaLink: string;
  statNumber: string;
  statLabel: string;
}

const TABS: UniverseTab[] = [
  {
    id: "candidat",
    title: "Candidats & Talents",
    badge: "POUR LES CANDIDATS",
    icon: User,
    headline: "Alex, votre coach IA personnel pour décrocher l'entretien",
    description: "Fini les candidatures sans réponse. Alex extrait vos forces réelles grâce à un dialogue guidé et génère un CV vectoriel 100% compatible ATS avec lettre de motivation sur-mesure.",
    benefits: [
      "Coaching maïeutique interactif pas-à-pas",
      "Job Match 87%+ calibré sur les offres locales",
      "Paiement sans carte via MTN MoMo & Orange Money (FCFA)",
    ],
    videoSrc: "/videos/authenticv_spot_candidat.mp4",
    posterSrc: "/images/candidate_jeanmarc.jpg",
    ctaText: "Créer mon CV avec Alex",
    ctaLink: "/builder",
    statNumber: "87%",
    statLabel: "Taux moyen de passage des filtres ATS",
  },
  {
    id: "campus",
    title: "Universités & Campus",
    badge: "ESPACE UNIVERSITAIRE",
    icon: GraduationCap,
    headline: "Accélérez l'insertion professionnelle de vos étudiants",
    description: "Offrez à chaque diplômé un Career Center IA à vos couleurs. Validez leurs compétences avec un domaine académique certifié sans aucun coût d'infrastructure.",
    benefits: [
      "Activation instantanée par email académique",
      "Tableau de bord de suivi d'insertion en temps réel",
      "Partenariat zéro coût d'infrastructure (0 FCFA)",
    ],
    videoSrc: "/videos/authenticv_spot_campus.mp4",
    posterSrc: "/images/campus_students.jpg",
    ctaText: "Découvrir l'offre Campus",
    ctaLink: "/campus",
    statNumber: "0 FCFA",
    statLabel: "Frais d'infrastructure pour votre université",
  },
  {
    id: "recruteur",
    title: "Entreprises & Recruteurs",
    badge: "TALENT SOURCING RH",
    icon: Building2,
    headline: "Sorcez les meilleurs profils vérifiés d'Afrique francophone",
    description: "Accédez directement à une CVthèque de profils structurés et pré-qualifiés à Douala, Yaoundé, Abidjan, Libreville et Brazzaville. Réduisez votre temps de sourcing de 60%.",
    benefits: [
      "Filtres précis par métropoles africaines & compétences",
      "Historiques de carrière vérifiés & formats standardisés",
      "Prise de contact directe et planification d'entretien",
    ],
    videoSrc: "/videos/authenticv_spot_recruteur.mp4",
    posterSrc: "/images/recruiter_hr.jpg",
    ctaText: "Accéder à la CVthèque",
    ctaLink: "/recruiter",
    statNumber: "3×",
    statLabel: "Plus rapide pour recruter les bons profils",
  },
];

export function VideoShowcaseSection() {
  const [activeTab, setActiveTab] = useState<"candidat" | "campus" | "recruteur">("candidat");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoSrc, setModalVideoSrc] = useState("/videos/authenticv_master_film.mp4");
  const [modalTitle, setModalTitle] = useState("AuthentiCV — Film de Marque Global");

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleOpenMasterFilm = () => {
    setModalVideoSrc("/videos/authenticv_master_film.mp4");
    setModalTitle("AuthentiCV — « Du CV à l'opportunité » (Film Master 100s)");
    setIsModalOpen(true);
  };

  const handleOpenCurrentSpot = () => {
    setModalVideoSrc(currentTab.videoSrc);
    setModalTitle(`AuthentiCV — Spot ${currentTab.title} (30s)`);
    setIsModalOpen(true);
  };

  return (
    <section className="relative py-16 md:py-20 bg-[#0F223D] border-t border-b border-slate-800 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold mb-4 tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            L&apos;Écosystème AuthentiCV en Action
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
            Un écosystème conçu pour{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              propulser chaque opportunité
            </span>
          </h2>
          <p className="text-slate-300 font-sans text-base md:text-lg leading-relaxed">
            Découvrez comment AuthentiCV transforme la recherche d&apos;emploi et le recrutement à travers nos trois piliers dédiés.
          </p>

          {/* Master film banner CTA */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleOpenMasterFilm}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-sm font-semibold shadow-[0_0_30px_rgba(34,211,238,0.15)] group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-slate-950 translate-x-0.5" />
              </div>
              <span>Regarder le Film Master de Marque (1 min 40)</span>
            </button>
          </div>
        </div>

        {/* Interactive Tabs Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#162B46] border border-slate-700/80 backdrop-blur-md max-w-full overflow-x-auto shadow-md">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display (Split Card with Video Teaser) */}
        <motion.div
          key={currentTab.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-12 gap-8 items-center bg-[#162B46] border border-slate-700/60 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm"
        >
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full mb-4">
              {currentTab.badge}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-white leading-snug mb-4">
              {currentTab.headline}
            </h3>
            <p className="text-slate-300 font-sans text-sm md:text-base leading-relaxed mb-6">
              {currentTab.description}
            </p>

            {/* Benefits List */}
            <div className="space-y-3 mb-8 w-full">
              {currentTab.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-sans text-sm">{b}</span>
                </div>
              ))}
            </div>

            {/* Stat Pill & Action Button */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-700/80 w-full">
              <div>
                <div className="text-2xl md:text-3xl font-black font-heading text-cyan-300">
                  {currentTab.statNumber}
                </div>
                <div className="text-xs text-slate-300 font-sans">{currentTab.statLabel}</div>
              </div>
              <Link
                href={currentTab.ctaLink}
                className="ml-auto inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/10 text-sm"
              >
                <span>{currentTab.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Cinematic Video Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-700/80 group shadow-2xl bg-slate-950">
              <video
                src={currentTab.videoSrc}
                poster={currentTab.posterSrc}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Big Interactive Play Button */}
              <button
                onClick={handleOpenCurrentSpot}
                className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
                aria-label={`Lire le spot ${currentTab.title}`}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600/90 text-white flex items-center justify-center border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(37,99,235,0.8)] group-hover/btn:scale-110 group-hover/btn:bg-blue-500 transition-all">
                  <Play className="w-7 h-7 md:w-8 md:h-8 fill-white translate-x-0.5" />
                </div>
              </button>

              {/* Bottom Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Spot Démo 30s • Audio Techno</span>
                </div>
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                  Cliquez pour agrandir
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoSrc={modalVideoSrc}
        title={modalTitle}
      />
    </section>
  );
}

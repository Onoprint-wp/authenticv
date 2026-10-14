import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MiniCvPreview } from "@/components/landing/MiniCvPreview";
import { fr } from "@/lib/i18n/landing";
import { SECTOR_TEMPLATES, getTheme } from "@/lib/themes";
import {
  Sparkles, ShieldCheck, ArrowRight, Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "10 Modèles de CV Professionnels ATS 2026 (1er PDF HD Offert) | AuthentiCV",
  description:
    "Découvrez nos 10 modèles de CV sectoriels 100 % compatibles ATS (Exécutif, Tech, Banque OHADA, BTP, Santé, Campus). 1er export PDF HD sans filigrane offert.",
  keywords: [
    "modèle cv gratuit",
    "modèles de cv professionnel",
    "cv ats modèle",
    "exemple cv cameroun",
    "modèle cv comptable ohada",
    "cv développeur",
    "cv commercial",
    "cv étudiant",
    "générateur cv ia",
  ],
  alternates: {
    canonical: "https://www.authenticv.app/modeles-cv",
  },
  openGraph: {
    title: "10 Modèles de CV Professionnels ATS 2026 — AuthentiCV",
    description:
      "Galerie de 10 modèles de CV sectoriels optimisés pour passer les filtres recruteurs (ATS). 1er PDF HD sans filigrane offert.",
    url: "https://www.authenticv.app/modeles-cv",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Galerie de Modèles de CV AuthentiCV" }],
  },
};

const TEMPLATES = [
  {
    id: "classic",
    name: "Classique ATS Standard",
    badge: "Recommandé Recruteurs",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Structure chronologique sobre et linéaire. Format plébiscité par les multinationales et les banques.",
    atsScore: "100%",
    color: "Indigo & Slate",
    idealFor: "Finance, Juridique, Administration, Grandes Entreprises",
    sampleTemplate: SECTOR_TEMPLATES[2], // Banque, Finance & OHADA (Classic)
  },
  {
    id: "modern",
    name: "Moderne Deux Colonnes",
    badge: "Le Plus Populaire 🔥",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "Sidebar gauche dédiée aux compétences et contact, corps droit axé sur les réalisations chiffrées.",
    atsScore: "99%",
    color: "Bleu Océan & Émeraude",
    idealFor: "Tech, Marketing, Vente, Management, Startups",
    sampleTemplate: SECTOR_TEMPLATES[1], // Tech, Cloud & Data (Modern)
  },
  {
    id: "minimal",
    name: "Minimaliste Épuré",
    badge: "Design Élégant",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Mise en page aérée sans éléments graphiques superflus. Focus absolu sur l'impact des mots.",
    atsScore: "100%",
    color: "Monochrome & Anthracite",
    idealFor: "Consultants, Cadres Dirigeants, Ingénieurs, ONG",
    sampleTemplate: SECTOR_TEMPLATES[8], // Standard ATS International (Minimal)
  },
];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "10 Modèles de CV Sectoriels ATS AuthentiCV",
  description: "Liste des 10 modèles de CV sectoriels ATS-compatibles disponibles sur AuthentiCV.",
  itemListElement: SECTOR_TEMPLATES.map((tpl, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${tpl.name} (${tpl.sector})`,
    description: tpl.description,
    url: `https://www.authenticv.app/builder?template=${tpl.id}`,
  })),
};

export default function ModelesCvPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <div className="min-h-screen bg-[#0F223D] text-slate-100 flex flex-col font-sans antialiased">
        <Navbar dict={fr.navbar} />

        <main className="flex-1 pt-28 pb-20 px-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#32D3E1] text-xs font-semibold mb-6 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> 10 Modèles Sectoriels ATS · 1er PDF HD Offert
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight mb-6 leading-tight">
              Des modèles de CV conçus pour <span className="text-[#32D3E1]">passer les filtres des recruteurs</span>
            </h1>
            <p className="text-slate-300 font-sans text-lg mb-8 leading-relaxed">
              75 % des CVs sont rejetés par les robots (ATS) à cause d&apos;une mauvaise mise en page. Tous nos modèles sont certifiés lisibles par machine, vérifiables via notre Radiographie ATS et votre 1er export PDF HD sans filigrane est offert.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/builder"
                className="flex items-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
              >
                <span>Créer mon CV (1er PDF HD Offert)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* 3 Base Architectures */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-gradient-to-b from-[#162B46] to-[#0C1A30] border border-slate-700/80 hover:border-[#32D3E1] rounded-3xl p-6 flex flex-col justify-between transition-all shadow-xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tpl.badgeColor}`}>
                      {tpl.badge}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
                      <ShieldCheck className="w-3.5 h-3.5" /> ATS {tpl.atsScore}
                    </span>
                  </div>

                  <Link href={`/builder?template=${tpl.id}`} className="block mb-5">
                    <MiniCvPreview template={tpl.sampleTemplate} />
                  </Link>

                  <h3 className="text-xl font-bold font-heading text-white mb-2 group-hover:text-[#32D3E1] transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{tpl.description}</p>

                  <div className="bg-[#081426]/90 rounded-xl p-3 mb-6 border border-slate-800">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#32D3E1] block mb-1">
                      Idéal pour :
                    </span>
                    <p className="text-xs text-slate-200 font-medium">{tpl.idealFor}</p>
                  </div>
                </div>

                <Link
                  href={`/builder?template=${tpl.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  <Zap className="w-4 h-4" />
                  <span>Utiliser cette architecture</span>
                </Link>
              </div>
            ))}
          </div>

          {/* 10 Sector Presets Hub */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8 mb-20">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-3">
                Les 10 Modèles de CV par Secteur d&apos;Activité
              </h2>
              <p className="text-slate-300 text-sm">
                Chaque modèle pré-configure la typographie, l&apos;espacement, la palette et la structure attendus par les recruteurs de votre secteur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SECTOR_TEMPLATES.map((tpl) => {
                const theme = getTheme(tpl.settings.colorTheme);
                return (
                  <div
                    key={tpl.id}
                    className="bg-gradient-to-b from-[#162B46] to-[#0C1A30] border border-slate-700/80 hover:border-[#32D3E1] p-5 rounded-2xl flex flex-col justify-between group transition-all shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span
                          className="text-[11px] font-bold px-3 py-1 rounded-full text-white"
                          style={{ background: theme.swatch }}
                        >
                          {tpl.badge}
                        </span>
                        <span className="text-[11px] font-bold text-[#25C78A] bg-[#25C78A]/10 border border-[#25C78A]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>ATS {tpl.atsScore}</span>
                        </span>
                      </div>

                      <Link href={`/builder?template=${tpl.id}`} className="block mb-4">
                        <MiniCvPreview template={tpl} />
                      </Link>

                      <h3 className="font-extrabold text-lg text-white group-hover:text-[#32D3E1] transition-colors mb-1">
                        {tpl.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#32D3E1] mb-2">{tpl.sector}</p>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">{tpl.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/90">
                      <div className="flex items-center gap-1.5 mb-3.5 overflow-hidden">
                        {tpl.recommendedFor.slice(0, 2).map((r) => (
                          <span key={r} className="text-[11px] text-slate-200 bg-[#081426] border border-slate-700 px-2.5 py-1 rounded-lg truncate">
                            {r}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/builder?template=${tpl.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3667F0]/20 hover:bg-[#3667F0] text-white border border-[#3667F0]/50 hover:border-[#32D3E1] text-xs font-bold transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#32D3E1] group-hover:text-white" />
                        <span>Choisir ce modèle (1er PDF Offert)</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className="bg-gradient-to-r from-blue-950/50 to-indigo-950/50 border border-blue-900/40 rounded-3xl p-8 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold font-heading text-white mb-3">
              Pas besoin de remplir des formulaires interminables
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
              Discutez simplement avec Coach Alex. Il structure votre expérience, calcule votre score via la Radiographie ATS et génère votre 1er PDF HD officiel gratuitement, sans carte bancaire requise.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/builder"
                className="bg-[#3667F0] hover:bg-[#3667F0]/90 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md text-sm"
              >
                Créer mon CV (1er PDF HD Offert)
              </Link>
              <Link
                href="/tarifs"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all text-sm border border-slate-700"
              >
                Voir les tarifs (1 000 FCFA à l&apos;acte)
              </Link>
            </div>
          </div>
        </main>

        <Footer dict={fr.footer} />
      </div>
    </>
  );
}

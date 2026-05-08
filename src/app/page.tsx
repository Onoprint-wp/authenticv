import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AuthentiCV",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Générateur de CV par IA conversationnelle. Créez un CV ATS-optimisé avec Alex, votre coach IA personnel. Sans formulaire, juste une conversation.",
  url: "https://authenticv.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Plan gratuit — 20 messages par mois, sans carte bancaire",
  },
  featureList: [
    "Coach IA conversationnel (Alex)",
    "CV optimisé ATS",
    "Export PDF",
    "Lettre de motivation IA",
    "Job Match",
    "Préparation entretien IA",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Dois-je entrer ma carte bancaire pour commencer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. Le plan gratuit est accessible sans carte bancaire. Vous pouvez créer votre CV, discuter avec Alex et prévisualiser le résultat immédiatement. Vous ne payez que si vous souhaitez passer au plan Pro.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si j'atteins les 20 messages gratuits ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le compteur se réinitialise chaque mois. Si vous avez besoin de plus de messages avant la fin du mois, vous pouvez passer au plan Pro pour des messages illimités. Votre CV reste accessible et sauvegardé même après la limite.",
      },
    },
    {
      "@type": "Question",
      name: "Mon CV est-il compatible avec les logiciels de recrutement (ATS) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Le format PDF généré suit les bonnes pratiques ATS : pas d'images dans le corps, police lisible, sections clairement balisées. Il est compatible avec les principaux outils utilisés par les recruteurs (Workday, Lever, Greenhouse, etc.).",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je résilier mon abonnement Pro à tout moment ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, sans condition ni frais. Votre abonnement reste actif jusqu'à la fin de la période payée, puis vous repassez automatiquement sur le plan gratuit. La résiliation se fait en un clic depuis le portail de facturation.",
      },
    },
    {
      "@type": "Question",
      name: "Mes données personnelles sont-elles sécurisées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vos données sont hébergées en Europe sur Supabase (PostgreSQL chiffré). Elles ne sont jamais vendues ni partagées avec des tiers. Chaque utilisateur n'a accès qu'à ses propres données grâce au système de sécurité Row-Level Security (RLS).",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne la fonctionnalité Job Match ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Collez le texte d'une offre d'emploi et Alex analyse les mots-clés, compétences et exigences du poste pour vous suggérer des améliorations ciblées de votre CV. Disponible sur le plan Pro.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <PricingSection />
        <FaqSection />
        <Footer />
      </main>
    </>
  );
}

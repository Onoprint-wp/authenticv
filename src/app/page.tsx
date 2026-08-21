import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VideoShowcaseSection } from "@/components/landing/VideoShowcaseSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { RecruiterCTASection } from "@/components/landing/RecruiterCTASection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { fr } from "@/lib/i18n/landing";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.authenticv.app",
    languages: {
      fr: "https://www.authenticv.app",
      en: "https://www.authenticv.app/en",
    },
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AuthentiCV",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Générateur de CV par IA conversationnelle. Créez un CV ATS-optimisé avec Alex, votre coach IA personnel. Compatible MTN MoMo & Orange Money.",
  url: "https://authenticv.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "XAF",
    description: "Plan gratuit — création de CV illimitée, paiement à l'acte (1 000 FCFA) ou Pro (5 000 FCFA/mois)",
  },
  featureList: [
    "Coach IA conversationnel (Alex)",
    "CV optimisé ATS",
    "Export PDF",
    "Lettre de motivation IA",
    "Job Match",
    "Préparation entretien IA",
    "Paiement Mobile Money (MTN MoMo & Orange Money)",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: fr.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-slate-950">
        <Navbar dict={fr.navbar} />
        <HeroSection dict={fr.hero} />
        <HowItWorks dict={fr.howItWorks} />
        <VideoShowcaseSection />
        <FeaturesSection dict={fr.features} />
        <PricingSection dict={fr.pricing} />
        <RecruiterCTASection />
        <FaqSection dict={fr.faq} />
        <Footer dict={fr.footer} />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { VideoShowcaseSection } from "@/components/landing/VideoShowcaseSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AtsAndTemplatesShowcase } from "@/components/landing/AtsAndTemplatesShowcase";
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
    "Générateur de CV par IA conversationnelle avec Radiographie ATS en temps réel et 10 modèles sectoriels. 1er téléchargement PDF HD sans filigrane offert. Compatible MTN MoMo & Orange Money (Cameroun & CEMAC).",
  url: "https://www.authenticv.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "XAF",
    description:
      "Plan gratuit avec 1er export PDF HD sans filigrane offert, Pass Candidature à 1 000 FCFA ou Pass Mensuel Pro à 5 000 FCFA/mois",
  },
  featureList: [
    "Coach IA conversationnel maïeutique (Alex)",
    "1er Export PDF HD sans filigrane offert",
    "Radiographie ATS en temps réel (Workday, Taleo, SAP)",
    "10 Modèles de CV sectoriels ATS-optimisés",
    "Lettre de motivation IA sur-mesure",
    "Job Match & ciblage d'offre d'emploi",
    "Simulateur d'entretien d'embauche IA",
    "Paiement Mobile Money (MTN MoMo, Orange Money, Moov Money)",
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
      <main className="min-h-screen bg-[#0F223D] text-slate-100 font-sans antialiased">
        <Navbar dict={fr.navbar} />
        <HeroSection dict={fr.hero} />
        <HowItWorks dict={fr.howItWorks} />
        <AtsAndTemplatesShowcase />
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

import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { en } from "@/lib/i18n/landing";

export const metadata: Metadata = {
  title: "AuthentiCV — AI-powered CV builder. Authentic, not robotic.",
  description:
    "Alex, your AI coach, guides you step by step to build an ATS-optimized CV that sounds like you — not a ChatGPT copy-paste. Free to start, no credit card required.",
  alternates: {
    canonical: "https://www.authenticv.app/en",
    languages: {
      fr: "https://www.authenticv.app",
      en: "https://www.authenticv.app/en",
    },
  },
  openGraph: {
    title: "AuthentiCV — AI CV builder",
    description: "Build your CV with AI — Authentic, not robotic.",
    locale: "en_US",
    alternateLocale: "fr_FR",
    url: "https://www.authenticv.app/en",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AuthentiCV",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered conversational CV builder. Create an ATS-optimized CV with Alex, your personal AI coach. No forms, just a conversation.",
  url: "https://authenticv.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Free plan — 20 messages per month, no credit card required",
  },
  featureList: [
    "Conversational AI coach (Alex)",
    "ATS-optimized CV",
    "PDF export",
    "AI cover letter",
    "Job Match",
    "Interview preparation AI",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: en.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function HomeEn() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-slate-950">
        <Navbar dict={en.navbar} />
        <HeroSection dict={en.hero} />
        <HowItWorks dict={en.howItWorks} />
        <FeaturesSection dict={en.features} />
        <PricingSection dict={en.pricing} />
        <FaqSection dict={en.faq} />
        <Footer dict={en.footer} />
      </main>
    </>
  );
}

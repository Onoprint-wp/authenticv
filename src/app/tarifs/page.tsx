import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { fr } from "@/lib/i18n/landing";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";
import { PricingSection } from "@/components/landing/PricingSection";

export const metadata: Metadata = {
  title: "Tarifs AuthentiCV — Gratuit, 1 000 FCFA ou Pro 5 000 FCFA | Générateur CV IA",
  description:
    "Créez votre CV avec l'IA gratuitement ou débloquez à l'acte (1 000 FCFA) ou passez Pro à 5 000 FCFA/mois. Accès au coach Alex, export PDF HD, lettre de motivation IA. Paiement Mobile Money MTN & Orange Money.",
  keywords: [
    "tarif cv ia",
    "prix générateur cv",
    "cv ia gratuit",
    "abonnement cv pro",
    "authenticv prix",
    "cv campay mtn orange",
  ],
  alternates: {
    canonical: "https://www.authenticv.app/tarifs",
  },
  openGraph: {
    title: "Tarifs AuthentiCV — Flexibles et sans surprise",
    description:
      "Gratuit, 1 000 FCFA à l'acte ou 5 000 FCFA/mois. Coach IA Alex, export PDF HD, lettre de motivation. Paiement MTN MoMo & Orange Money.",
    url: "https://www.authenticv.app/tarifs",
  },
};

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col pt-16">
      <Navbar dict={fr.navbar} />
      <main className="flex-1">
        <PricingSection dict={fr.pricing} />
      </main>
      <FaqSection dict={fr.faq} />
      <Footer dict={fr.footer} />
    </div>
  );
}

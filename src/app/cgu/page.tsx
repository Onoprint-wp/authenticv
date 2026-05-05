import Link from "next/link";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — AuthentiCV",
  robots: { index: false, follow: false },
};

export default function CguPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <header className="h-14 flex items-center px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">AuthentiCV</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <h1 className="text-3xl font-bold text-white">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-slate-500">Version en vigueur depuis le 1er mai 2026.</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Objet</h2>
          <p className="text-sm leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service AuthentiCV,
            plateforme de création de CV assistée par intelligence artificielle, accessible à l'adresse{" "}
            <a href="https://authenticv.vercel.app" className="text-indigo-400 underline">authenticv.vercel.app</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Acceptation</h2>
          <p className="text-sm leading-relaxed">
            La création d'un compte vaut acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions,
            vous devez cesser d'utiliser le service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Description du service</h2>
          <p className="text-sm leading-relaxed">AuthentiCV propose :</p>
          <ul className="text-sm space-y-1.5 pl-4 list-disc list-inside">
            <li>Un éditeur de CV avec aperçu en temps réel</li>
            <li>Un coach IA personnel (Alex) pour accompagner la rédaction</li>
            <li>Un score ATS et des recommandations d'optimisation</li>
            <li>La génération de lettres de motivation personnalisées (offre Pro)</li>
            <li>L'export PDF et le partage de CV via lien public</li>
            <li>La gestion de plusieurs CVs et le suivi de candidatures (offre Pro)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. Compte utilisateur</h2>
          <p className="text-sm leading-relaxed">
            L'accès au service nécessite la création d'un compte avec une adresse e-mail valide.
            L'utilisateur est responsable de la confidentialité de ses identifiants et de toutes les actions
            effectuées depuis son compte.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Offres et tarification</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 pr-4 text-slate-400 font-medium">Offre</th>
                  <th className="text-left py-2 pr-4 text-slate-400 font-medium">Prix</th>
                  <th className="text-left py-2 text-slate-400 font-medium">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr><td className="py-2 pr-4">Gratuit</td><td className="py-2 pr-4">0 €/mois</td><td className="py-2">Aucun</td></tr>
                <tr><td className="py-2 pr-4">Pro</td><td className="py-2 pr-4">9 €/mois TTC</td><td className="py-2">Sans engagement — résiliable à tout moment</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed">
            Le paiement est traité par Stripe. L'abonnement Pro est renouvelé automatiquement chaque mois.
            La résiliation prend effet à la fin de la période en cours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Droit de rétractation</h2>
          <p className="text-sm leading-relaxed">
            Conformément à l'article L.221-18 du Code de la consommation, l'utilisateur dispose d'un délai de 14 jours
            pour se rétracter à compter de la souscription à l'offre Pro, à condition de ne pas avoir utilisé le service.
            Pour exercer ce droit : <a href="mailto:contact@authenticv.fr" className="text-indigo-400 underline">contact@authenticv.fr</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Contenu utilisateur</h2>
          <p className="text-sm leading-relaxed">
            L'utilisateur reste propriétaire du contenu qu'il saisit (CV, informations personnelles).
            Il concède à AuthentiCV une licence limitée, non exclusive et révocable pour le traitement de ce contenu
            aux seules fins de fourniture du service (notamment le traitement IA).
          </p>
          <p className="text-sm leading-relaxed">
            L'utilisateur s'engage à ne pas saisir de contenu illicite, diffamatoire ou portant atteinte aux droits de tiers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Limitation de responsabilité</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV est un outil d'aide à la rédaction. Les suggestions générées par l'IA sont fournies
            à titre indicatif et ne constituent pas un conseil professionnel. AuthentiCV ne garantit pas
            les résultats obtenus lors de candidatures employant les CVs créés sur la plateforme.
          </p>
          <p className="text-sm leading-relaxed">
            AuthentiCV s'efforce d'assurer la disponibilité du service mais ne peut garantir une disponibilité
            ininterrompue. La responsabilité d'AuthentiCV est limitée au montant des sommes versées par l'utilisateur
            au cours des 12 derniers mois.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. Suspension et résiliation</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV se réserve le droit de suspendre ou résilier tout compte en cas de violation des présentes CGU,
            sans préavis ni remboursement. L'utilisateur peut supprimer son compte à tout moment depuis la page Compte.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Modification des CGU</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV se réserve le droit de modifier les présentes CGU. Les utilisateurs seront informés par e-mail
            30 jours avant l'entrée en vigueur des modifications. La poursuite de l'utilisation du service vaut acceptation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">11. Droit applicable</h2>
          <p className="text-sm leading-relaxed">
            Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence
            des tribunaux du ressort du siège social d'AuthentiCV.
          </p>
        </section>

        <p className="text-xs text-slate-600 pt-4 border-t border-slate-800">
          Dernière mise à jour : mai 2026
        </p>
      </main>
      <Footer />
    </div>
  );
}

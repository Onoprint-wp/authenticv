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
        <h1 className="text-3xl font-bold text-white">Conditions Générales d&apos;Utilisation</h1>
        <p className="text-sm text-slate-500">Version en vigueur depuis le 1er mai 2026.</p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Objet</h2>
          <p className="text-sm leading-relaxed">
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du service AuthentiCV,
            plateforme de création de CV assistée par intelligence artificielle, accessible à l&apos;adresse{" "}
            <a href="https://www.authenticv.app" className="text-indigo-400 underline">www.authenticv.app</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Acceptation</h2>
          <p className="text-sm leading-relaxed">
            La création d&apos;un compte vaut acceptation pleine et entière des présentes CGU. Si vous n&apos;acceptez pas ces conditions,
            vous devez cesser d&apos;utiliser le service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Description du service</h2>
          <p className="text-sm leading-relaxed">AuthentiCV propose :</p>
          <ul className="text-sm space-y-1.5 pl-4 list-disc list-inside">
            <li>Un éditeur de CV avec aperçu en temps réel</li>
            <li>Un coach IA personnel (Alex) pour accompagner la rédaction</li>
            <li>Un score ATS et des recommandations d&apos;optimisation</li>
            <li>La génération de lettres de motivation personnalisées (offre Pro)</li>
            <li>L&apos;export PDF et le partage de CV via lien public</li>
            <li>La gestion de plusieurs CVs et le suivi de candidatures (offre Pro)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. Compte utilisateur</h2>
          <p className="text-sm leading-relaxed">
            L&apos;accès au service nécessite la création d&apos;un compte avec une adresse e-mail valide.
            L&apos;utilisateur est responsable de la confidentialité de ses identifiants et de toutes les actions
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
                <tr><td className="py-2 pr-4">Gratuit</td><td className="py-2 pr-4">0 FCFA/mois</td><td className="py-2">Aucun</td></tr>
                <tr><td className="py-2 pr-4">Pro</td><td className="py-2 pr-4">5 000 FCFA/mois</td><td className="py-2">Sans engagement — résiliable à tout moment</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed">
            Le paiement est traité par CamPay (Mobile Money — MTN MoMo ou Orange Money). L&apos;abonnement Pro est valable 30 jours à compter du paiement.
            La résiliation prend effet à la fin de la période en cours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Droit de rétractation</h2>
          <p className="text-sm leading-relaxed">
            Conformément à l&apos;article L.221-18 du Code de la consommation, l&apos;utilisateur dispose d&apos;un délai de 14 jours
            pour se rétracter à compter de la souscription à l&apos;offre Pro, à condition de ne pas avoir utilisé le service.
            Pour exercer ce droit : <a href="mailto:info@onograph.online" className="text-indigo-400 underline">info@onograph.online</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Contenu utilisateur</h2>
          <p className="text-sm leading-relaxed">
            L&apos;utilisateur reste propriétaire du contenu qu&apos;il saisit (CV, informations personnelles).
            Il concède à AuthentiCV une licence limitée, non exclusive et révocable pour le traitement de ce contenu
            aux seules fins de fourniture du service (notamment le traitement IA).
          </p>
          <p className="text-sm leading-relaxed">
            L&apos;utilisateur s&apos;engage à ne pas saisir de contenu illicite, diffamatoire ou portant atteinte aux droits de tiers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Limitation de responsabilité</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV est un outil d&apos;aide à la rédaction. Les suggestions générées par l&apos;IA sont fournies
            à titre indicatif et ne constituent pas un conseil professionnel. AuthentiCV ne garantit pas
            les résultats obtenus lors de candidatures employant les CVs créés sur la plateforme.
          </p>
          <p className="text-sm leading-relaxed">
            AuthentiCV s&apos;efforce d&apos;assurer la disponibilité du service mais ne peut garantir une disponibilité
            ininterrompue. La responsabilité d&apos;AuthentiCV est limitée au montant des sommes versées par l&apos;utilisateur
            au cours des 12 derniers mois.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">9. Suspension et résiliation</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV se réserve le droit de suspendre ou résilier tout compte en cas de violation des présentes CGU,
            sans préavis ni remboursement. L&apos;utilisateur peut supprimer son compte à tout moment depuis la page Compte.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">10. Modification des CGU</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV se réserve le droit de modifier les présentes CGU. Les utilisateurs seront informés par e-mail
            30 jours avant l&apos;entrée en vigueur des modifications. La poursuite de l&apos;utilisation du service vaut acceptation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">11. Droit applicable</h2>
          <p className="text-sm leading-relaxed">
            Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence
            des tribunaux du ressort du siège social d&apos;AuthentiCV.
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

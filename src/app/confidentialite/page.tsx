import Link from "next/link";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité — AuthentiCV",
  robots: { index: false, follow: false },
};

export default function ConfidentialitePage() {
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
        <h1 className="text-3xl font-bold text-white">Politique de confidentialité</h1>
        <p className="text-sm text-slate-500">
          Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Responsable du traitement</h2>
          <p className="text-sm leading-relaxed">
            Le responsable du traitement des données personnelles collectées via AuthentiCV est :{" "}
            <span className="text-amber-400">[À COMPLÉTER — Raison sociale, adresse, email]</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Données collectées</h2>
          <p className="text-sm leading-relaxed">Dans le cadre de l'utilisation du service, nous collectons :</p>
          <ul className="text-sm space-y-1.5 pl-4 list-disc list-inside">
            <li><strong className="text-slate-200">Données de compte :</strong> adresse e-mail, mot de passe (haché)</li>
            <li><strong className="text-slate-200">Données du CV :</strong> nom, prénom, téléphone, adresse, expériences, formations, compétences, photo de profil</li>
            <li><strong className="text-slate-200">Données d'usage :</strong> score ATS, historique des modifications, vues du CV partagé</li>
            <li><strong className="text-slate-200">Données de paiement :</strong> gérées exclusivement par Stripe — AuthentiCV ne stocke pas vos coordonnées bancaires</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Finalités du traitement</h2>
          <ul className="text-sm space-y-1.5 pl-4 list-disc list-inside">
            <li>Fourniture du service de création et gestion de CV</li>
            <li>Personnalisation par l'IA (coach Alex)</li>
            <li>Gestion de l'abonnement Pro via Stripe</li>
            <li>Envoi de notifications par e-mail (nudges, confirmations)</li>
            <li>Amélioration du service (scores ATS, benchmark sectoriel anonymisé)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. Base légale</h2>
          <ul className="text-sm space-y-1.5 pl-4 list-disc list-inside">
            <li><strong className="text-slate-200">Exécution du contrat</strong> — fourniture du service après création de compte</li>
            <li><strong className="text-slate-200">Intérêt légitime</strong> — amélioration du service, sécurité</li>
            <li><strong className="text-slate-200">Consentement</strong> — e-mails de relance (désactivables depuis votre compte)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Sous-traitants</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 pr-4 text-slate-400 font-medium">Prestataire</th>
                  <th className="text-left py-2 pr-4 text-slate-400 font-medium">Rôle</th>
                  <th className="text-left py-2 text-slate-400 font-medium">Localisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr><td className="py-2 pr-4">Supabase</td><td className="py-2 pr-4">Base de données, authentification</td><td className="py-2">UE / États-Unis</td></tr>
                <tr><td className="py-2 pr-4">Vercel</td><td className="py-2 pr-4">Hébergement</td><td className="py-2">États-Unis</td></tr>
                <tr><td className="py-2 pr-4">Stripe</td><td className="py-2 pr-4">Paiement</td><td className="py-2">États-Unis</td></tr>
                <tr><td className="py-2 pr-4">Anthropic</td><td className="py-2 pr-4">IA (coach Alex)</td><td className="py-2">États-Unis</td></tr>
                <tr><td className="py-2 pr-4">Resend</td><td className="py-2 pr-4">Envoi d'e-mails</td><td className="py-2">États-Unis</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500">
            Les transferts hors UE sont encadrés par les clauses contractuelles types (CCT) de la Commission européenne.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Durée de conservation</h2>
          <p className="text-sm leading-relaxed">
            Vos données sont conservées pendant toute la durée de votre compte, puis supprimées dans un délai de 30 jours
            suivant la suppression de votre compte. Les données de facturation sont conservées 10 ans conformément aux
            obligations légales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Vos droits</h2>
          <p className="text-sm leading-relaxed">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="text-sm space-y-1.5 pl-4 list-disc list-inside">
            <li><strong className="text-slate-200">Accès</strong> — obtenir une copie de vos données</li>
            <li><strong className="text-slate-200">Rectification</strong> — corriger vos informations via votre compte</li>
            <li><strong className="text-slate-200">Suppression</strong> — supprimer votre compte depuis la page Compte</li>
            <li><strong className="text-slate-200">Portabilité</strong> — exporter vos données sur demande</li>
            <li><strong className="text-slate-200">Opposition</strong> — désactiver les e-mails de relance depuis votre compte</li>
          </ul>
          <p className="text-sm leading-relaxed">
            Pour exercer vos droits : <a href="mailto:contact@authenticv.fr" className="text-indigo-400 underline">contact@authenticv.fr</a>.
            En cas de litige, vous pouvez saisir la <a href="https://www.cnil.fr" className="text-indigo-400 underline">CNIL</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Cookies</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV utilise uniquement des cookies strictement nécessaires au fonctionnement du service
            (session d'authentification Supabase, préférences locales). Aucun cookie publicitaire ou de tracking tiers n'est déposé.
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

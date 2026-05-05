import Link from "next/link";
import { FileText } from "lucide-react";
import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Mentions légales — AuthentiCV",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
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
        <h1 className="text-3xl font-bold text-white">Mentions légales</h1>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Éditeur du site</h2>
          <p className="text-sm leading-relaxed">
            Le site <strong>AuthentiCV</strong> (accessible à l'adresse{" "}
            <a href="https://authenticv.vercel.app" className="text-indigo-400 underline">authenticv.vercel.app</a>)
            est édité par :
          </p>
          <ul className="text-sm space-y-1 pl-4 border-l border-slate-700">
            <li><span className="text-slate-500">Raison sociale :</span> <span className="text-amber-400">[À COMPLÉTER]</span></li>
            <li><span className="text-slate-500">Forme juridique :</span> <span className="text-amber-400">[À COMPLÉTER]</span></li>
            <li><span className="text-slate-500">Siège social :</span> <span className="text-amber-400">[À COMPLÉTER]</span></li>
            <li><span className="text-slate-500">SIRET :</span> <span className="text-amber-400">[À COMPLÉTER]</span></li>
            <li><span className="text-slate-500">Email :</span> contact@authenticv.fr</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Hébergement</h2>
          <p className="text-sm leading-relaxed">
            Le site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.
            Site web : <a href="https://vercel.com" className="text-indigo-400 underline">vercel.com</a>
          </p>
          <p className="text-sm leading-relaxed">
            Les données sont stockées par <strong>Supabase Inc.</strong>, service de base de données cloud.
            Site web : <a href="https://supabase.com" className="text-indigo-400 underline">supabase.com</a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Directeur de la publication</h2>
          <p className="text-sm leading-relaxed">
            Le directeur de la publication est <span className="text-amber-400">[À COMPLÉTER — Prénom Nom]</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. Propriété intellectuelle</h2>
          <p className="text-sm leading-relaxed">
            L'ensemble du contenu du site (textes, images, interface, code source) est protégé par le droit de la propriété intellectuelle.
            Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Responsabilité</h2>
          <p className="text-sm leading-relaxed">
            AuthentiCV s'efforce d'assurer l'exactitude des informations diffusées sur ce site.
            Toutefois, AuthentiCV ne saurait être tenu responsable des erreurs ou omissions, ni des dommages directs ou indirects
            résultant de l'utilisation du service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Droit applicable</h2>
          <p className="text-sm leading-relaxed">
            Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation du site
            sera soumis à la compétence exclusive des tribunaux français.
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

"use client";

import Link from "next/link";
import { setConsent, useCookieConsent } from "@/lib/consent";

export function CookieBanner() {
  const consent = useCookieConsent();

  if (consent !== "none") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <p className="text-xs text-slate-400 leading-relaxed flex-1">
          AuthentiCV utilise des cookies essentiels au fonctionnement du service (session d&apos;authentification).
          Avec votre accord, nous utilisons aussi des cookies de mesure d&apos;audience (PostHog) et publicitaires (Meta Pixel)
          pour améliorer le service et nos campagnes.{" "}
          <Link href="/confidentialite" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            En savoir plus
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setConsent("refused")}
            className="px-4 py-2 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={() => setConsent("accepted")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            J&apos;accepte
          </button>
        </div>
      </div>
    </div>
  );
}

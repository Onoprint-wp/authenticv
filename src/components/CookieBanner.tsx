"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <p className="text-xs text-slate-400 leading-relaxed flex-1">
          AuthentiCV utilise uniquement des cookies fonctionnels nécessaires au service (session d'authentification).
          Aucun cookie publicitaire.{" "}
          <Link href="/confidentialite" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            En savoir plus
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
        >
          J'accepte
        </button>
      </div>
    </div>
  );
}

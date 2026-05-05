"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getConsent() {
  if (typeof window === "undefined") return "pending";
  return localStorage.getItem(STORAGE_KEY) ?? "none";
}

function getServerConsent() {
  return "pending";
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribeToStorage, getConsent, getServerConsent);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    // Dispatch storage event so useSyncExternalStore picks up the change
    window.dispatchEvent(new Event("storage"));
  }

  if (consent !== "none") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <p className="text-xs text-slate-400 leading-relaxed flex-1">
          AuthentiCV utilise uniquement des cookies fonctionnels nécessaires au service (session d&apos;authentification).
          Aucun cookie publicitaire.{" "}
          <Link href="/confidentialite" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            En savoir plus
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
        >
          J&apos;accepte
        </button>
      </div>
    </div>
  );
}

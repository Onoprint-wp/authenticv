"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Link2, X, Loader2, Check, ChevronDown } from "lucide-react";

// Icônes SVG inline pour LinkedIn et WhatsApp (pas de dépendance externe)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function ShareCvButton() {
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/share-cv")
      .then((r) => r.json())
      .then((d) => { setIsPublic(d.isPublic); setSlug(d.slug); setViewCount(d.viewCount ?? 0); })
      .catch(() => setIsPublic(false));
  }, []);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const shareUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/cv/${slug}` : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setDropdownOpen(false);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=550"
    );
    setDropdownOpen(false);
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Voici mon CV : ${shareUrl}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setDropdownOpen(false);
  };

  const handleEnable = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/share-cv", { method: "POST" });
      const data = await res.json();
      setIsPublic(data.isPublic);
      setSlug(data.slug);
      if (data.slug) {
        await navigator.clipboard.writeText(`${window.location.origin}/cv/${data.slug}`).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    setDropdownOpen(false);
    try {
      await fetch("/api/share-cv", { method: "DELETE" });
      setIsPublic(false);
      setSlug(null);
      setViewCount(0);
    } finally {
      setLoading(false);
    }
  };

  if (isPublic === null) return null;

  // ── Actif — bouton principal + dropdown ──────────────────────────────────────
  if (isPublic && slug) {
    return (
      <div className="relative hidden sm:flex items-center gap-1" ref={dropdownRef}>
        {/* Bouton principal */}
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-all ${
            dropdownOpen
              ? "border-emerald-600/60 text-emerald-300 bg-emerald-950/50"
              : "border-emerald-700/50 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50"
          }`}
        >
          {copied
            ? <><Check className="w-3.5 h-3.5" /><span className="hidden lg:inline">Copié !</span></>
            : <><Link2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">
                  Partager{viewCount > 0 ? ` · ${viewCount} vue${viewCount > 1 ? "s" : ""}` : ""}
                </span>
                <ChevronDown className={`w-3 h-3 hidden lg:block transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </>}
        </button>

        {/* Désactiver */}
        <button
          onClick={handleDisable}
          disabled={loading}
          className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded"
          title="Désactiver le partage"
        >
          {loading
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : <X className="w-3 h-3" />}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-1.5 z-50 w-52 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Link2 className="w-4 h-4 text-slate-400" />
              Copier le lien
            </button>

            <div className="h-px bg-slate-800" />

            <button
              onClick={shareOnLinkedIn}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0A66C2] hover:bg-slate-800 transition-colors"
            >
              <LinkedInIcon />
              Partager sur LinkedIn
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#25D366] hover:bg-slate-800 transition-colors"
            >
              <WhatsAppIcon />
              Envoyer via WhatsApp
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Inactif ────────────────────────────────────────────────────────────────
  return (
    <button
      onClick={handleEnable}
      disabled={loading}
      className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md
        border border-slate-700/50 text-slate-400 hover:text-indigo-300
        hover:bg-indigo-950/40 hover:border-indigo-800/50 transition-all disabled:opacity-50"
      title="Partager le CV par lien"
    >
      {loading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <Share2 className="w-3.5 h-3.5" />}
      <span className="hidden lg:inline">Partager</span>
    </button>
  );
}

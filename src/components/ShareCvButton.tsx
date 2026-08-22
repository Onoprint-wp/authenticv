"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Link2, X, Loader2, Check, ChevronDown, Globe } from "lucide-react";

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

  const sendByEmail = async () => {
    setDropdownOpen(false);
    try {
      const res = await fetch("/api/resumes/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "CV envoyé par email avec succès !");
      } else {
        alert(data.error || "Erreur lors de l'envoi.");
      }
    } catch {
      alert("Erreur réseau lors de l'envoi de l'email.");
    }
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
      <div className="relative flex items-center gap-1" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-[10px] border transition-all font-medium shadow-xs ${
            dropdownOpen
              ? "border-emerald-400 text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60"
              : "border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
          }`}
          title="Lien public actif — cliquer pour voir les options"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partager</span>
          <span className="opacity-40">·</span>
          <span className="font-semibold">{viewCount} {viewCount > 1 ? "vues" : "vue"}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border text-card-foreground rounded-[16px] shadow-2xl z-[100] p-3.5 space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between px-1 pb-2 border-b border-border">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-heading">
                <Globe className="w-3.5 h-3.5" />
                Lien public actif
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                {viewCount} vue{viewCount > 1 ? "s" : ""}
              </span>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-[10px] transition-colors font-medium text-left"
            >
              <Link2 className="w-4 h-4 text-brand-blue" />
              {copied ? "Lien copié !" : "Copier le lien public"}
            </button>

            <button
              onClick={sendByEmail}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-[10px] transition-colors font-medium text-left"
            >
              <Share2 className="w-4 h-4 text-ai-violet" />
              Envoyer par Email
            </button>

            <button
              onClick={shareOnLinkedIn}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-[10px] transition-colors font-medium text-left"
            >
              <LinkedInIcon />
              Partager sur LinkedIn
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-[10px] transition-colors font-medium text-left"
            >
              <WhatsAppIcon />
              Envoyer via WhatsApp
            </button>

            <div className="pt-2 border-t border-border flex justify-end">
              <button
                onClick={handleDisable}
                disabled={loading}
                className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-1"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                Désactiver le lien
              </button>
            </div>
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
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-[10px]
        border border-border text-foreground hover:bg-muted font-medium transition-all bg-card shadow-xs disabled:opacity-50"
      title="Partager le CV par lien"
    >
      {loading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <Share2 className="w-3.5 h-3.5 text-brand-blue" />}
      <span className="hidden sm:inline">Partager</span>
    </button>
  );
}

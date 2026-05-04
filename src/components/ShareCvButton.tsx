"use client";

import { useState, useEffect } from "react";
import { Share2, Link2, X, Loader2, Check } from "lucide-react";

export function ShareCvButton() {
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/share-cv")
      .then((r) => r.json())
      .then((d) => { setIsPublic(d.isPublic); setSlug(d.slug); setViewCount(d.viewCount ?? 0); })
      .catch(() => setIsPublic(false));
  }, []);

  const shareUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/cv/${slug}` : "";

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
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
        await copyToClipboard(`${window.location.origin}/cv/${data.slug}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await fetch("/api/share-cv", { method: "DELETE" });
      setIsPublic(false);
      setSlug(null);
    } finally {
      setLoading(false);
    }
  };

  // Not yet fetched
  if (isPublic === null) return null;

  // Active — show link + disable button
  if (isPublic && slug) {
    return (
      <div className="hidden sm:flex items-center gap-1">
        <button
          onClick={() => copyToClipboard(shareUrl)}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-emerald-700/50 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/50 transition-all"
          title="Copier le lien public"
        >
          {copied
            ? <><Check className="w-3.5 h-3.5" /><span className="hidden lg:inline">Copié !</span></>
            : <><Link2 className="w-3.5 h-3.5" /><span className="hidden lg:inline">Lien actif{viewCount > 0 ? ` · ${viewCount} vue${viewCount > 1 ? "s" : ""}` : ""}</span></>}
        </button>
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
      </div>
    );
  }

  // Inactive
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

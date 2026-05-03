"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";

export function UpgradeButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className ?? `w-full flex items-center justify-center gap-2 py-3
        bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
        text-white text-sm font-semibold rounded-xl transition-all
        shadow-lg shadow-indigo-600/30 active:scale-95`}
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Redirection…</>
      ) : (
        <><Zap className="w-4 h-4" /> Passer à Pro</>
      )}
    </button>
  );
}

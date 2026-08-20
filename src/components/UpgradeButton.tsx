"use client";

import { useState } from "react";
import { Zap, Loader2 } from "lucide-react";

interface UpgradeButtonProps {
  tier?: "single" | "monthly" | "annual";
  className?: string;
  children?: React.ReactNode;
}

export function UpgradeButton({ tier = "monthly", className, children }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (res.status === 401) {
        window.location.href = `/login?next=/tarifs`;
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        `w-full flex items-center justify-center gap-2 py-3
        bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
        text-white text-sm font-semibold rounded-xl transition-all
        shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer`
      }
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Redirection…</>
      ) : (
        children ?? <><Zap className="w-4 h-4" /> Passer au Pro</>
      )}
    </button>
  );
}

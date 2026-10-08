"use client";

import { useState, useEffect } from "react";
import { Zap, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

interface UpgradeButtonProps {
  tier?: "single" | "monthly" | "annual";
  className?: string;
  children?: React.ReactNode;
}

export function UpgradeButton({ tier = "monthly", className, children }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "info" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleClick = async () => {
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch("/api/campay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (res.status === 401) {
        window.location.href = `/builder`;
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        if (data.error) {
          const isAlreadyPro = data.error.includes("Déjà abonné");
          setToast({
            message: isAlreadyPro
              ? "Vous bénéficiez déjà d'un compte Pro actif et illimité. Vos fonctionnalités sont toutes débloquées !"
              : data.error,
            type: isAlreadyPro ? "info" : "error",
          });
        }
      }
    } catch {
      setLoading(false);
      setToast({
        message: "Une erreur réseau est survenue lors de la préparation du paiement. Veuillez réessayer.",
        type: "error",
      });
    }
  };

  return (
    <>
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

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-sm w-full px-4 pointer-events-auto">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
              toast.type === "info"
                ? "bg-slate-900/95 border-cyan-500/50 text-slate-100 shadow-cyan-950/60"
                : "bg-red-950/95 border-red-500/50 text-red-100 shadow-red-950/60"
            }`}
          >
            {toast.type === "info" ? (
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <p className="font-bold text-white mb-0.5">
                {toast.type === "info" ? "Abonnement Pro Actif" : "Information Paiement"}
              </p>
              <p className="text-slate-300 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setToast(null);
              }}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Fermer la notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

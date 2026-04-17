"use client";

import { useCvStore, type SyncStatus } from "@/store/useCvStore";
import { Cloud, CloudOff, Loader2, CheckCircle2 } from "lucide-react";

const config: Record<
  SyncStatus,
  { icon: React.ReactNode; label: string; className: string }
> = {
  idle: {
    icon: <Cloud className="w-3.5 h-3.5" />,
    label: "Sauvegardé",
    className: "text-slate-400",
  },
  saving: {
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    label: "Sauvegarde…",
    className: "text-indigo-400",
  },
  saved: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: "Sauvegardé",
    className: "text-emerald-500",
  },
  error: {
    icon: <CloudOff className="w-3.5 h-3.5" />,
    label: "Erreur de sauvegarde",
    className: "text-rose-500",
  },
};

export function SyncIndicator() {
  const syncStatus = useCvStore((s) => s.syncStatus);
  const { icon, label, className } = config[syncStatus];

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300 ${className}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

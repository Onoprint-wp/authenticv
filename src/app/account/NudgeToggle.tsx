"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export function NudgeToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);

  const handleToggle = async () => {
    setSaving(true);
    const next = !enabled;
    setEnabled(next);
    try {
      await fetch("/api/resumes/nudge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nudge_enabled: next }),
      });
    } catch {
      setEnabled(!next); // rollback on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus:outline-none ${
        enabled ? "border-indigo-600 bg-indigo-600" : "border-slate-600 bg-slate-700"
      } disabled:opacity-50`}
      role="switch"
      aria-checked={enabled}
    >
      {saving ? (
        <Loader2 className="w-3 h-3 text-white animate-spin m-auto" />
      ) : (
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-3.5" : "translate-x-0"
          }`}
        />
      )}
    </button>
  );
}

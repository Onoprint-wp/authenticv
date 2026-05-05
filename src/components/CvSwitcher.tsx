"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Plus, Copy, Trash2, ChevronDown, Check, Pencil } from "lucide-react";
import { useCvStore } from "@/store/useCvStore";

interface CvSwitcherProps {
  onSwitch: (id: string) => void;
  onUpgradeRequired?: () => void;
}

export function CvSwitcher({ onSwitch, onUpgradeRequired }: CvSwitcherProps) {
  const resumeList = useCvStore((s) => s.resumeList);
  const setResumeList = useCvStore((s) => s.setResumeList);
  const currentResumeId = useCvStore((s) => s.currentResumeId);
  const setCurrentResumeId = useCvStore((s) => s.setCurrentResumeId);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = resumeList.find((r) => r.id === currentResumeId) ?? resumeList[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  async function refreshList() {
    const res = await fetch("/api/resumes/list");
    if (res.ok) {
      const data = await res.json();
      setResumeList(data.map((r: { id: string; title: string; updated_at: string; is_default: boolean }) => ({
        id: r.id,
        title: r.title,
        updatedAt: r.updated_at,
        isDefault: r.is_default,
      })));
    }
  }

  async function handleCreate() {
    setLoading("new");
    const count = resumeList.length + 1;
    const res = await fetch("/api/resumes/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `CV ${count}` }),
    });
    if (res.status === 402) { setLoading(null); setOpen(false); onUpgradeRequired?.(); return; }
    if (res.ok) {
      const item = await res.json();
      await refreshList();
      setCurrentResumeId(item.id);
      onSwitch(item.id);
      setOpen(false);
    }
    setLoading(null);
  }

  async function handleDuplicate(id: string) {
    setLoading(`dup-${id}`);
    const res = await fetch("/api/resumes/duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.status === 402) { setLoading(null); setOpen(false); onUpgradeRequired?.(); return; }
    if (res.ok) {
      const item = await res.json();
      await refreshList();
      setCurrentResumeId(item.id);
      onSwitch(item.id);
      setOpen(false);
    }
    setLoading(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce CV ?")) return;
    setLoading(`del-${id}`);
    const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    if (res.ok) {
      await refreshList();
      if (currentResumeId === id) {
        const remaining = resumeList.filter((r) => r.id !== id);
        if (remaining.length > 0) {
          setCurrentResumeId(remaining[0].id);
          onSwitch(remaining[0].id);
        }
      }
      setOpen(false);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Impossible de supprimer ce CV.");
    }
    setLoading(null);
  }

  async function handleSetDefault(id: string) {
    setLoading(`def-${id}`);
    await fetch(`/api/resumes/set-default?id=${id}`, { method: "PATCH" });
    await refreshList();
    setLoading(null);
  }

  function startEdit(id: string, title: string, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingId(id);
    setEditingTitle(title);
  }

  async function commitRename(id: string) {
    const trimmed = editingTitle.trim();
    setEditingId(null);
    if (!trimmed) return;
    const original = resumeList.find((r) => r.id === id)?.title;
    if (trimmed === original) return;

    // Mise à jour optimiste
    setResumeList(resumeList.map((r) => r.id === id ? { ...r, title: trimmed } : r));

    const res = await fetch(`/api/resumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    if (!res.ok) await refreshList(); // rollback si erreur
  }

  if (resumeList.length === 0) return null;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all bg-slate-900/50 max-w-[160px]"
      >
        <FileText className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{current?.title ?? "Mes CVs"}</span>
        <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="py-1">
            {resumeList.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-800 group transition-colors ${r.id === currentResumeId ? "bg-slate-800/60" : ""}`}
              >
                {/* Icône active */}
                {r.id === currentResumeId ? (
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}

                {/* Titre — éditable en double-clic, sinon clic = switch */}
                {editingId === r.id ? (
                  <input
                    ref={inputRef}
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => commitRename(r.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(r.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 min-w-0 text-xs bg-slate-700 text-slate-100 rounded px-1.5 py-0.5 outline-none border border-indigo-500/50 focus:border-indigo-400"
                  />
                ) : (
                  <button
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                    onClick={() => { setCurrentResumeId(r.id); onSwitch(r.id); setOpen(false); }}
                    onDoubleClick={(e) => startEdit(r.id, r.title, e)}
                  >
                    <span className={`text-xs truncate ${r.id === currentResumeId ? "text-slate-200" : "text-slate-400"}`}>
                      {r.title}
                    </span>
                    {r.isDefault && (
                      <span className="ml-auto text-[10px] text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 px-1.5 py-0.5 rounded-full shrink-0">
                        défaut
                      </span>
                    )}
                  </button>
                )}

                {/* Actions au survol */}
                {editingId !== r.id && (
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      title="Renommer"
                      onClick={(e) => startEdit(r.id, r.title, e)}
                      className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {!r.isDefault && (
                      <button
                        title="Définir par défaut"
                        onClick={() => handleSetDefault(r.id)}
                        disabled={loading === `def-${r.id}`}
                        className="p-1 text-slate-600 hover:text-indigo-400 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      title="Dupliquer"
                      onClick={() => handleDuplicate(r.id)}
                      disabled={loading === `dup-${r.id}`}
                      className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {!r.isDefault && (
                      <button
                        title="Supprimer"
                        onClick={() => handleDelete(r.id)}
                        disabled={loading === `del-${r.id}`}
                        className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 p-2">
            <button
              onClick={handleCreate}
              disabled={loading === "new"}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/30 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Nouveau CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

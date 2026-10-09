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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = resumeList.find((r) => r.id === currentResumeId) ?? resumeList[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingId(null);
        setConfirmDeleteId(null);
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
    setLoading(`del-${id}`);
    const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
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
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-[10px] border border-border text-foreground hover:bg-muted font-medium transition-all bg-card max-w-[160px] shadow-xs"
      >
        <FileText className="w-3.5 h-3.5 text-brand-blue shrink-0" />
        <span className="truncate">{current?.title ?? "Mes CVs"}</span>
        <ChevronDown className={`w-3 h-3 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-[min(300px,calc(100vw-2rem))] bg-card border border-border rounded-[14px] shadow-2xl z-50 overflow-hidden text-card-foreground backdrop-blur-md">
          <div className="py-1">
            {resumeList.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-muted group transition-colors ${r.id === currentResumeId ? "bg-muted/80 font-bold" : ""}`}
              >
                {/* Icône active */}
                {r.id === currentResumeId ? (
                  <Check className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
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
                    className="flex-1 min-w-0 text-xs bg-muted text-foreground rounded px-1.5 py-0.5 outline-none border border-brand-blue font-normal"
                  />
                ) : (
                  <button
                    className="flex-1 flex items-center gap-2 text-left min-w-0 cursor-pointer"
                    onClick={() => { setCurrentResumeId(r.id); onSwitch(r.id); setOpen(false); }}
                    onDoubleClick={(e) => startEdit(r.id, r.title, e)}
                  >
                    <span className={`text-xs truncate ${r.id === currentResumeId ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                      {r.title}
                    </span>
                    {r.isDefault && (
                      <span className="ml-auto text-[10px] text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-1.5 py-0.5 rounded-full shrink-0 font-medium">
                        défaut
                      </span>
                    )}
                  </button>
                )}

                {/* Confirmation suppression inline */}
                {confirmDeleteId === r.id ? (
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-red-500 mr-1 font-semibold">Supprimer ?</span>
                    <button
                      title="Confirmer"
                      onClick={() => handleDelete(r.id)}
                      disabled={loading === `del-${r.id}`}
                      className="p-1 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      title="Annuler"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 opacity-50" />
                    </button>
                  </div>
                ) : (
                  /* Actions : visibles sur mobile (pas de hover) et au survol sur desktop */
                  editingId !== r.id && (
                    <div className="flex sm:hidden sm:group-hover:flex items-center gap-1 shrink-0">
                      <button
                        title="Renommer"
                        onClick={(e) => startEdit(r.id, r.title, e)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {!r.isDefault && (
                        <button
                          title="Définir par défaut"
                          onClick={() => handleSetDefault(r.id)}
                          disabled={loading === `def-${r.id}`}
                          className="p-1 text-muted-foreground hover:text-brand-blue transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        title="Dupliquer"
                        onClick={() => handleDuplicate(r.id)}
                        disabled={loading === `dup-${r.id}`}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {!r.isDefault && (
                        <button
                          title="Supprimer"
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(r.id); }}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-border p-2 bg-muted/20">
            <button
              onClick={handleCreate}
              disabled={loading === "new"}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors cursor-pointer"
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

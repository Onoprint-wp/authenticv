"use client";

import { useState, useCallback } from "react";
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import {
  Plus, ExternalLink, Trash2, Loader2, FileText,
} from "lucide-react";

type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  job_url?: string | null;
  notes?: string | null;
  cover_letter_id?: string | null;
  created_at: string;
}

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: "saved",     label: "À postuler",  color: "text-slate-400 border-slate-700" },
  { id: "applied",   label: "Postulé",     color: "text-blue-400 border-blue-800/50" },
  { id: "interview", label: "Entretien",   color: "text-violet-400 border-violet-800/50" },
  { id: "offer",     label: "Offre / Refus", color: "text-emerald-400 border-emerald-800/50" },
];

// ── Draggable card ──────────────────────────────────────────────────────────
function AppCard({
  app, onDelete, isDragging,
}: { app: Application; onDelete: (id: string) => void; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: app.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, opacity: isDragging ? 0 : 1 }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{app.position}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{app.company}</p>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}
          className="text-slate-700 hover:text-red-400 transition-colors shrink-0 p-0.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {app.job_url && (
          <a
            href={app.job_url}
            target="_blank"
            rel="noopener noreferrer"
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />Offre
          </a>
        )}
        {app.cover_letter_id && (
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <FileText className="w-3 h-3" />Lettre
          </span>
        )}
      </div>
    </div>
  );
}

// ── Droppable column ────────────────────────────────────────────────────────
function Column({
  col, apps, onDelete, onAdd, activeId,
}: {
  col: typeof COLUMNS[number];
  apps: Application[];
  onDelete: (id: string) => void;
  onAdd: (status: ApplicationStatus) => void;
  activeId: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div className="flex flex-col gap-2 min-w-[220px] flex-1">
      <div className={`flex items-center justify-between px-1 pb-2 border-b ${col.color}`}>
        <span className="text-xs font-semibold uppercase tracking-wide">{col.label}</span>
        <span className="text-xs text-slate-600 bg-slate-800 rounded-full px-1.5">{apps.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[120px] rounded-lg p-1.5 transition-colors ${
          isOver ? "bg-slate-800/60 ring-1 ring-indigo-600/30" : ""
        }`}
      >
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onDelete={onDelete} isDragging={app.id === activeId} />
        ))}
      </div>
      <button
        onClick={() => onAdd(col.id)}
        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors px-1 py-1 rounded-md hover:bg-slate-800/50"
      >
        <Plus className="w-3.5 h-3.5" />Ajouter
      </button>
    </div>
  );
}

// ── Add modal ───────────────────────────────────────────────────────────────
function AddModal({
  defaultStatus, onClose, onAdd,
}: {
  defaultStatus: ApplicationStatus;
  onClose: () => void;
  onAdd: (app: Omit<Application, "id" | "created_at">) => Promise<void>;
}) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!company.trim() || !position.trim()) return;
    setSaving(true);
    await onAdd({ company, position, status: defaultStatus, job_url: jobUrl || null, notes: null, cover_letter_id: null });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-sm flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-sm font-semibold text-slate-200">Nouvelle candidature</h2>
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Entreprise *"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Poste *"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <input
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="Lien de l'offre (optionnel)"
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={saving || !company.trim() || !position.trim()}
            className="flex-1 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Ajouter
          </button>
          <button onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main board ──────────────────────────────────────────────────────────────
export function KanbanBoard({ initial }: { initial: Application[] }) {
  const [apps, setApps] = useState<Application[]>(initial);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addModal, setAddModal] = useState<ApplicationStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  }, []);

  const handleDragEnd = useCallback(async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const newStatus = over.id as ApplicationStatus;
    const appId = String(active.id);
    const app = apps.find((a) => a.id === appId);
    if (!app || app.status === newStatus) return;

    setApps((prev) => prev.map((a) => a.id === appId ? { ...a, status: newStatus } : a));
    await fetch(`/api/applications?id=${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }, [apps]);

  const handleDelete = useCallback(async (id: string) => {
    setApps((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
  }, []);

  const handleAdd = useCallback(async (app: Omit<Application, "id" | "created_at">) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(app),
    });
    const { id } = await res.json();
    setApps((prev) => [{ ...app, id, created_at: new Date().toISOString() }, ...prev]);
  }, []);

  const activeApp = apps.find((a) => a.id === activeId);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              apps={apps.filter((a) => a.status === col.id)}
              onDelete={handleDelete}
              onAdd={setAddModal}
              activeId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeApp && (
            <div className="bg-slate-800 border border-indigo-600/50 rounded-lg p-3 shadow-xl shadow-black/50 w-56 opacity-95">
              <p className="text-sm font-medium text-slate-200 truncate">{activeApp.position}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{activeApp.company}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {addModal && (
        <AddModal
          defaultStatus={addModal}
          onClose={() => setAddModal(null)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}

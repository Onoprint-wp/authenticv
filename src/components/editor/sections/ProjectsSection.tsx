"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Input, Label, Textarea } from "@/components/editor/ui/EditorPrimitives";
import { FolderTree, Trash2, Plus } from "lucide-react";

export const ProjectsSection = () => {
  const { cvData, addProject, updateProject, removeProject } = useCvStore();

  return (
    <SectionCard title="Projets" icon={FolderTree}>
      <div className="space-y-6">
        {cvData.projects.map((proj) => (
          <div key={proj.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 relative group">
            <button
              onClick={() => removeProject(proj.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <Label>Nom du projet</Label>
                  <Input value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label>Lien (Optionnel)</Label>
                  <Input value={proj.link || ''} onChange={(e) => updateProject(proj.id, { link: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="flex flex-col">
                <Label>Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                  placeholder="Décrivez le projet et votre rôle…"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => addProject({ name: '', description: '', link: '' })}
          className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Ajouter un projet
        </button>
      </div>
    </SectionCard>
  );
};

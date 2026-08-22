"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Input, Label, Textarea } from "@/components/editor/ui/EditorPrimitives";
import { Briefcase, Trash2, Plus } from "lucide-react";

export const ExperienceSection = () => {
  const { cvData, addExperience, updateExperience, removeExperience } = useCvStore();

  return (
    <SectionCard title="Expérience professionnelle" icon={Briefcase}>
      <div className="space-y-6">
        {cvData.experiences.map((exp) => (
          <div key={exp.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 relative group">
            <button 
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="flex flex-col">
                <Label>Entreprise</Label>
                <Input value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Poste</Label>
                <Input value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Date de début</Label>
                <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} placeholder="ex. 2020-01" />
              </div>
              <div className="flex flex-col">
                <Label>Date de fin</Label>
                <Input
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  placeholder="ex. Présent"
                  disabled={exp.current}
                  className={exp.current ? 'opacity-50' : ''}
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Présent' : exp.endDate })}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                />
                <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-300">Je travaille actuellement ici</label>
              </div>
            </div>

            <div className="flex flex-col">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                placeholder="Décrivez vos responsabilités et vos réalisations…"
                className="min-h-[120px]"
              />
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => addExperience({ company: '', position: '', startDate: '', endDate: '', current: true, description: '' })}
          className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Ajouter une expérience
        </button>
      </div>
    </SectionCard>
  );
};

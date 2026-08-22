"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Input, Label } from "@/components/editor/ui/EditorPrimitives";
import { GraduationCap, Trash2, Plus } from "lucide-react";

export const EducationSection = () => {
  const { cvData, addEducation, updateEducation, removeEducation } = useCvStore();

  return (
    <SectionCard title="Formation" icon={GraduationCap}>
      <div className="space-y-6">
        {cvData.education.map((edu) => (
          <div key={edu.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 relative group">
            <button 
              onClick={() => removeEducation(edu.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Label>Établissement</Label>
                <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Diplôme</Label>
                <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
              </div>
              <div className="flex flex-col md:col-span-2">
                <Label>Domaine d&apos;études</Label>
                <Input value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Date de début</Label>
                <Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} placeholder="AAAA" />
              </div>
              <div className="flex flex-col">
                <Label>Date de fin</Label>
                <Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} placeholder="AAAA" />
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => addEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '' })}
          className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Ajouter une formation
        </button>
      </div>
    </SectionCard>
  );
};

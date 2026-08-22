"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Input, Label } from "@/components/editor/ui/EditorPrimitives";
import { Globe, Trash2, Plus } from "lucide-react";

export const LanguagesSection = () => {
  const { cvData, addLanguage, updateLanguage, removeLanguage } = useCvStore();

  return (
    <SectionCard title="Langues" icon={Globe}>
      <div className="space-y-4">
        {cvData.languages.map((lang) => (
          <div key={lang.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 items-start sm:items-center">
            <div className="flex-1 flex flex-col w-full">
              <Label>Langue</Label>
              <Input value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} placeholder="ex. Anglais" />
            </div>
            <div className="flex-1 flex flex-col w-full">
              <Label>Niveau</Label>
              <Input value={lang.level} onChange={(e) => updateLanguage(lang.id, { level: e.target.value })} placeholder="ex. Natif, Courant, B2" />
            </div>
            <button 
              onClick={() => removeLanguage(lang.id)}
              className="mt-1 sm:mt-6 text-slate-500 hover:text-red-400 transition-colors p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        
        <button 
          onClick={() => addLanguage({ name: '', level: '' })}
          className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Ajouter une langue
        </button>
      </div>
    </SectionCard>
  );
};

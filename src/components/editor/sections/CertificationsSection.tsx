"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Input, Label } from "@/components/editor/ui/EditorPrimitives";
import { Award, Trash2, Plus } from "lucide-react";

export const CertificationsSection = () => {
  const { cvData, addCertification, updateCertification, removeCertification } = useCvStore();

  return (
    <SectionCard title="Certifications" icon={Award}>
      <div className="space-y-6">
        {cvData.certifications.map((cert) => (
          <div key={cert.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 relative group">
            <button
              onClick={() => removeCertification(cert.id)}
              className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col md:col-span-2">
                <Label>Nom de la certification</Label>
                <Input value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Organisme</Label>
                <Input value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <Label>Date</Label>
                <Input value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => addCertification({ name: '', issuer: '', date: '' })}
          className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Ajouter une certification
        </button>
      </div>
    </SectionCard>
  );
};

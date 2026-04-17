"use client";

import { useCvStore } from "@/store/useCvStore";
import { Plus, Trash2 } from "lucide-react";

export function CvEditorView() {
  const { cvData, setCvData } = useCvStore();

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvData({
      ...cvData,
      summary: e.target.value,
    });
  };

  const handleArrayItemChange = <T extends keyof typeof cvData>(
    field: T,
    id: string,
    key: string,
    value: string | boolean
  ) => {
    const list = cvData[field] as any[];
    setCvData({
      ...cvData,
      [field]: list.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    });
  };

  const handleRemoveArrayItem = <T extends keyof typeof cvData>(
    field: T,
    id: string
  ) => {
    const list = cvData[field] as any[];
    setCvData({
      ...cvData,
      [field]: list.filter((item) => item.id !== id),
    });
  };

  const handleAddExperience = () => {
    setCvData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
        {
          id: crypto.randomUUID(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const handleAddEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: crypto.randomUUID(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvData({
      ...cvData,
      skills: e.target.value.split(",").map((s) => s.trim()),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-900 border-l border-slate-800 custom-scrollbar">
      {/* Paramètres du document */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          Paramètres du document
        </h2>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400">Titre professionnel</label>
          <input
            type="text"
            name="documentTitle"
            value={cvData.documentTitle || ""}
            onChange={(e) => setCvData({ ...cvData, documentTitle: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            placeholder="Titre professionnel"
          />
        </div>
      </section>

      {/* Informations personnelles */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          Informations personnelles
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={cvData.personalInfo.firstName}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Nom</label>
            <input
              type="text"
              name="lastName"
              value={cvData.personalInfo.lastName}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Titre (Poste)</label>
            <input
              type="text"
              name="title"
              value={cvData.personalInfo.title}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Email</label>
            <input
              type="email"
              name="email"
              value={cvData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Téléphone</label>
            <input
              type="text"
              name="phone"
              value={cvData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Localisation</label>
            <input
              type="text"
              name="location"
              value={cvData.personalInfo.location}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="space-y-1 col-span-2">
            <label className="text-xs font-medium text-slate-400">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={cvData.personalInfo.linkedin}
              onChange={handlePersonalInfoChange}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
      </section>

      {/* Résumé */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          Résumé
        </h2>
        <textarea
          value={cvData.summary}
          onChange={handleSummaryChange}
          rows={4}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-y"
        />
      </section>

      {/* Compétences */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
          Compétences <span className="text-xs font-normal text-slate-500">(Séparées par des virgules)</span>
        </h2>
        <input
          type="text"
          value={cvData.skills.join(", ")}
          onChange={handleSkillsChange}
          placeholder="ex: React, Node.js, TypeScript"
          className="w-full bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
        />
      </section>

      {/* Expériences */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg font-semibold text-white">Expériences professionnelles</h2>
          <button
            onClick={handleAddExperience}
            className="p-1 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {cvData.experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-lg border border-slate-800/80 bg-slate-950/30 space-y-3 relative group">
              <button
                onClick={() => handleRemoveArrayItem("experiences", exp.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-3 pr-6">
                <input
                  type="text"
                  placeholder="Poste"
                  value={exp.position}
                  onChange={(e) => handleArrayItemChange("experiences", exp.id, "position", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Entreprise"
                  value={exp.company}
                  onChange={(e) => handleArrayItemChange("experiences", exp.id, "company", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Date de début (ex: Mars 2021)"
                  value={exp.startDate}
                  onChange={(e) => handleArrayItemChange("experiences", exp.id, "startDate", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Date de fin"
                    value={exp.endDate}
                    onChange={(e) => handleArrayItemChange("experiences", exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                    className="flex-1 bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 disabled:opacity-50"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleArrayItemChange("experiences", exp.id, "current", e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900"
                    />
                    En poste
                  </label>
                </div>
                <textarea
                  placeholder="Description..."
                  value={exp.description}
                  onChange={(e) => handleArrayItemChange("experiences", exp.id, "description", e.target.value)}
                  rows={3}
                  className="w-full col-span-2 bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-y"
                />
              </div>
            </div>
          ))}
          {cvData.experiences.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">Aucune expérience ajoutée.</p>
          )}
        </div>
      </section>

      {/* Formations */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg font-semibold text-white">Formations</h2>
          <button
            onClick={handleAddEducation}
            className="p-1 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {cvData.education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-lg border border-slate-800/80 bg-slate-950/30 space-y-3 relative group">
              <button
                onClick={() => handleRemoveArrayItem("education", edu.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-3 pr-6">
                <input
                  type="text"
                  placeholder="Diplôme"
                  value={edu.degree}
                  onChange={(e) => handleArrayItemChange("education", edu.id, "degree", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Domaine d'études"
                  value={edu.field}
                  onChange={(e) => handleArrayItemChange("education", edu.id, "field", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Établissement"
                  value={edu.institution}
                  onChange={(e) => handleArrayItemChange("education", edu.id, "institution", e.target.value)}
                  className="w-full col-span-2 bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Date de début"
                  value={edu.startDate}
                  onChange={(e) => handleArrayItemChange("education", edu.id, "startDate", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  placeholder="Date de fin"
                  value={edu.endDate}
                  onChange={(e) => handleArrayItemChange("education", edu.id, "endDate", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          ))}
          {cvData.education.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">Aucune formation ajoutée.</p>
          )}
        </div>
      </section>

      {/* You can add Languages, Projects, Certifications similarly if they are needed heavily */}
    </div>
  );
}

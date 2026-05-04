"use client";

import React, { useState, useRef } from "react";
import { useCvStore } from "@/store/useCvStore";
import {
  User, Briefcase, GraduationCap, Code,
  Globe, Award, FolderTree, Plus, Trash2,
  ChevronDown, ChevronUp, FileText, Camera, Loader2,
  type LucideIcon
} from "lucide-react";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-900/80 hover:border-slate-700 shadow-inner transition-all ${props.className || ''}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full rounded-xl bg-slate-950/60 border border-slate-800/80 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-900/80 hover:border-slate-700 shadow-inner transition-all min-h-[120px] resize-y ${props.className || ''}`}
  />
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-slate-300 ml-1 mb-2">
    {children}
  </label>
);

const SectionCard = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 overflow-hidden mb-6 shadow-sm backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-800/80 rounded-lg text-indigo-400 border border-slate-700/50 shadow-sm">
            <Icon size={18} />
          </div>
          <h3 className="font-semibold text-slate-200 tracking-wide">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-slate-800/50">
          {children}
        </div>
      )}
    </div>
  );
};

// ── Photo Upload Component ──────────────────────────────────────────────────
const PhotoUpload = () => {
  const { cvData, updatePersonalInfo } = useCvStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 2 Mo.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erreur lors de l'upload.");
        return;
      }

      const { photoUrl } = await res.json();
      updatePersonalInfo({ photoUrl });
    } catch {
      alert("Erreur réseau lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-800/50">
      {/* Photo circle */}
      <div
        className={`relative w-24 h-24 rounded-full shrink-0 overflow-hidden border-2 transition-all cursor-pointer group ${
          dragOver
            ? "border-indigo-400 bg-indigo-500/10 scale-105"
            : cvData.personalInfo.photoUrl
            ? "border-slate-700 hover:border-indigo-500/50"
            : "border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {cvData.personalInfo.photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cvData.personalInfo.photoUrl}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </>
        ) : uploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <Camera className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="text-[10px] text-slate-600">Photo</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Info text */}
      <div className="flex flex-col gap-1">
        <Label>Photo de profil</Label>
        <p className="text-xs text-slate-500 leading-relaxed">
          Cliquez ou glissez-déposez une photo.<br />
          JPG, PNG ou WebP · Max 2 Mo
        </p>
        {cvData.personalInfo.photoUrl && (
          <button
            onClick={() => updatePersonalInfo({ photoUrl: "" })}
            className="text-xs text-red-400 hover:text-red-300 mt-1 self-start transition-colors"
          >
            Supprimer la photo
          </button>
        )}
      </div>
    </div>
  );
};

export const CvEditorView = () => {
  const { 
    cvData, 
    updatePersonalInfo, 
    updateDocumentTitle, 
    updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    setSkills,
    addLanguage, updateLanguage, removeLanguage,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification
  } = useCvStore();

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setSkills(skillsArray);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar w-full max-w-2xl mx-auto py-6 px-4 pb-20">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-2">Éditeur de CV</h2>
        <p className="text-slate-400 text-sm">Modifiez vos informations et visualisez les changements en temps réel.</p>
      </div>

      <div className="mb-6 space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Titre du document</label>
        <Input
          value={cvData.documentTitle}
          onChange={(e) => updateDocumentTitle(e.target.value)}
          placeholder="ex. Développeur Frontend Senior"
          className="text-lg font-medium"
        />
      </div>

      <SectionCard title="Informations personnelles" icon={User} defaultOpen>
        {/* ── Photo Upload ── */}
        <PhotoUpload />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label>Prénom</Label>
            <Input value={cvData.personalInfo.firstName} onChange={(e) => updatePersonalInfo({ firstName: e.target.value })} />
          </div>
          <div className="flex flex-col">
            <Label>Nom</Label>
            <Input value={cvData.personalInfo.lastName} onChange={(e) => updatePersonalInfo({ lastName: e.target.value })} />
          </div>
          <div className="flex flex-col">
            <Label>Titre professionnel</Label>
            <Input value={cvData.personalInfo.title} onChange={(e) => updatePersonalInfo({ title: e.target.value })} />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input type="email" value={cvData.personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} />
          </div>
          <div className="flex flex-col">
            <Label>Téléphone</Label>
            <Input value={cvData.personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} />
          </div>
          <div className="flex flex-col">
            <Label>Localisation</Label>
            <Input value={cvData.personalInfo.location} onChange={(e) => updatePersonalInfo({ location: e.target.value })} />
          </div>
          <div className="flex flex-col md:col-span-2">
            <Label>LinkedIn / Site web (Optionnel)</Label>
            <Input value={cvData.personalInfo.linkedin || ''} onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Résumé professionnel" icon={FileText}>
        <div className="space-y-2">
          <Textarea
            value={cvData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Rédigez un résumé accrocheur qui met en valeur vos points forts..."
          />
        </div>
      </SectionCard>

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
                  <Label>Domaine d'études</Label>
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

      <SectionCard title="Compétences" icon={Code}>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 ml-1 mb-2">Entrez les compétences séparées par des virgules</p>
          <Textarea 
            value={cvData.skills.join(', ')} 
            onChange={handleSkillsChange}
            placeholder="React, TypeScript, Node.js, ..."
            className="min-h-[80px]"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {cvData.skills.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

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

    </div>
  );
};

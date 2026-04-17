"use client";

import React, { useState } from "react";
import { useCvStore } from "@/store/useCvStore";
import { 
  User, Briefcase, GraduationCap, Code, 
  Globe, Award, FolderTree, Plus, Trash2, 
  ChevronDown, ChevronUp, FileText 
} from "lucide-react";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-md bg-slate-900 border border-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all ${props.className || ''}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full rounded-md bg-slate-900 border border-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all min-h-[100px] ${props.className || ''}`}
  />
);

const SectionCard = ({ 
  title, 
  icon: Icon, 
  children,
  defaultOpen = false
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden mb-4 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-800/20 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
            <Icon size={18} />
          </div>
          <h3 className="font-medium text-slate-200">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-slate-800/50">
          {children}
        </div>
      )}
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
    <div className="h-full flex flex-col w-full max-w-2xl mx-auto py-6 px-4 pb-20">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-2">CV Editor</h2>
        <p className="text-slate-400 text-sm">Update your information and see the changes reflect instantly.</p>
      </div>

      <div className="mb-6 space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Document Title</label>
        <Input 
          value={cvData.documentTitle} 
          onChange={(e) => updateDocumentTitle(e.target.value)}
          placeholder="e.g. Senior Frontend Developer"
          className="text-lg font-medium"
        />
      </div>

      <SectionCard title="Personal Info" icon={User} defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">First Name</label>
            <Input value={cvData.personalInfo.firstName} onChange={(e) => updatePersonalInfo({ firstName: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">Last Name</label>
            <Input value={cvData.personalInfo.lastName} onChange={(e) => updatePersonalInfo({ lastName: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">Professional Title</label>
            <Input value={cvData.personalInfo.title} onChange={(e) => updatePersonalInfo({ title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">Email</label>
            <Input type="email" value={cvData.personalInfo.email} onChange={(e) => updatePersonalInfo({ email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">Phone</label>
            <Input value={cvData.personalInfo.phone} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 ml-1">Location</label>
            <Input value={cvData.personalInfo.location} onChange={(e) => updatePersonalInfo({ location: e.target.value })} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-slate-400 ml-1">LinkedIn / Website (Optional)</label>
            <Input value={cvData.personalInfo.linkedin || ''} onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Professional Summary" icon={FileText}>
        <div className="space-y-2">
          <Textarea 
            value={cvData.summary} 
            onChange={(e) => updateSummary(e.target.value)} 
            placeholder="Write a brief and impactful summary highlighting your core strengths..."
          />
        </div>
      </SectionCard>

      <SectionCard title="Experience" icon={Briefcase}>
        <div className="space-y-6">
          {cvData.experiences.map((exp, index) => (
            <div key={exp.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 relative group">
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Company</label>
                  <Input value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Position</label>
                  <Input value={exp.position} onChange={(e) => updateExperience(exp.id, { position: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Start Date</label>
                  <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} placeholder="e.g. 2020-01" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">End Date</label>
                  <Input 
                    value={exp.endDate} 
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} 
                    placeholder="e.g. Present" 
                    disabled={exp.current}
                    className={exp.current ? 'opacity-50' : ''}
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 mb-2">
                  <input 
                    type="checkbox" 
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : exp.endDate })}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-sm text-slate-300">I currently work here</label>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Description</label>
                <Textarea 
                  value={exp.description} 
                  onChange={(e) => updateExperience(exp.id, { description: e.target.value })} 
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => addExperience({ company: '', position: '', startDate: '', endDate: '', current: true, description: '' })}
            className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Education" icon={GraduationCap}>
        <div className="space-y-6">
          {cvData.education.map((edu) => (
            <div key={edu.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800 relative group">
              <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Institution</label>
                  <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Degree</label>
                  <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-slate-400 ml-1">Field of Study</label>
                  <Input value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Start Date</label>
                  <Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })} placeholder="YYYY" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">End Date</label>
                  <Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })} placeholder="YYYY" />
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => addEducation({ institution: '', degree: '', field: '', startDate: '', endDate: '' })}
            className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Skills" icon={Code}>
        <div className="space-y-2">
          <p className="text-xs text-slate-400 ml-1 mb-2">Enter skills separated by commas</p>
          <Textarea 
            value={cvData.skills.join(', ')} 
            onChange={handleSkillsChange}
            placeholder="React, TypeScript, Node.js, ..."
            className="min-h-[80px]"
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {cvData.skills.map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Languages" icon={Globe}>
        <div className="space-y-4">
          {cvData.languages.map((lang) => (
            <div key={lang.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800 items-start sm:items-center">
              <div className="flex-1 space-y-1 w-full">
                <label className="text-xs text-slate-400 ml-1 hidden sm:block">Language</label>
                <Input value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} placeholder="e.g. English" />
              </div>
              <div className="flex-1 space-y-1 w-full">
                <label className="text-xs text-slate-400 ml-1 hidden sm:block">Proficiency</label>
                <Input value={lang.level} onChange={(e) => updateLanguage(lang.id, { level: e.target.value })} placeholder="e.g. Native, Fluent" />
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
            className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add Language
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Projects" icon={FolderTree}>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Project Name</label>
                    <Input value={proj.name} onChange={(e) => updateProject(proj.id, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 ml-1">Link (Optional)</label>
                    <Input value={proj.link || ''} onChange={(e) => updateProject(proj.id, { link: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Description</label>
                  <Textarea 
                    value={proj.description} 
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })} 
                    placeholder="Describe the project and you role..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => addProject({ name: '', description: '', link: '' })}
            className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add Project
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-slate-400 ml-1">Certification Name</label>
                  <Input value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Issuer</label>
                  <Input value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 ml-1">Date</label>
                  <Input value={cert.date} onChange={(e) => updateCertification(cert.id, { date: e.target.value })} />
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => addCertification({ name: '', issuer: '', date: '' })}
            className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Add Certification
          </button>
        </div>
      </SectionCard>

    </div>
  );
};

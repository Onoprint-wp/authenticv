"use client";

import { useCvStore } from "@/store/useCvStore";
import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Languages, Award, FolderGit2 } from "lucide-react";

export function HtmlCvPreview() {
  const cvData = useCvStore((s) => s.cvData);
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects } = cvData;

  const hasContactInfo = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;
  const hasContent = summary || experiences.length > 0 || education.length > 0 || skills.length > 0 || languages.length > 0 || certifications.length > 0 || projects.length > 0 || hasContactInfo;

  if (!hasContent && !personalInfo.firstName && !personalInfo.lastName && !personalInfo.title) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50">
        <div className="text-slate-400 dark:text-slate-500 text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <p>Le CV est vide. Commencez par ajouter des informations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-900 p-4 sm:p-8 flex justify-center custom-scrollbar">
      {/* A4 Paper Container */}
      <div className="w-full max-w-[850px] min-h-[1100px] bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        
        {/* Header - Premium Gradient */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white px-10 py-12 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-10 -mb-20 w-48 h-48 rounded-full bg-white/5 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                {personalInfo.firstName} <span className="text-indigo-300">{personalInfo.lastName}</span>
              </h1>
              {personalInfo.title && (
                <h2 className="text-xl sm:text-2xl font-medium text-indigo-100 tracking-wide uppercase letter-spacing-2">
                  {personalInfo.title}
                </h2>
              )}
            </div>

            {hasContactInfo && (
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-2 text-sm text-indigo-100/90 font-medium">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-300" />
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-300" />
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-300" />
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-indigo-300" />
                    {personalInfo.linkedin}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Body Layout */}
        <div className="flex flex-col md:flex-row flex-1 bg-white text-slate-800">
          
          {/* Main Content (Left roughly 2/3) */}
          <div className="flex-1 px-10 py-10 flex flex-col gap-10 border-r border-slate-100">
            
            {/* Summary */}
            {summary && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">!</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Profil</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm text-justify whitespace-pre-wrap">
                  {summary}
                </p>
              </section>
            )}

            {/* Expériences */}
            {experiences.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Expérience Professionnelle</h3>
                </div>
                
                <div className="flex flex-col gap-8">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6 border-l border-slate-200">
                      {/* Timeline dot */}
                      <div className="absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-full -left-[6.5px] top-1.5 shadow-sm"></div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-y-1">
                          <h4 className="text-base font-bold text-slate-900">{exp.position}</h4>
                          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                            {exp.startDate} - {exp.current ? "Aujourd'hui" : exp.endDate}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-slate-500 mb-2">{exp.company}</div>
                        {exp.description && (
                          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projets */}
            {projects.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Projets</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  {projects.map((proj) => (
                    <div key={proj.id} className="group p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-base font-bold text-slate-900">{proj.name}</h4>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                            Voir le lien ↗
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar (Right roughly 1/3) */}
          <div className="w-full md:w-[280px] bg-slate-50/80 px-8 py-10 flex flex-col gap-10">
            
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase mb-5">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Éducation</h3>
                </div>
                <div className="flex flex-col gap-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex flex-col gap-0.5">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{edu.degree}</h4>
                      <div className="text-xs font-medium text-indigo-600 mt-1">{edu.field}</div>
                      <div className="text-xs text-slate-500 mt-1">{edu.institution}</div>
                      <div className="text-xs font-medium text-slate-400 mt-1">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Languages className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Langues</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-700">{lang.name}</span>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Certificats</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex flex-col gap-1 text-sm">
                      <span className="font-bold text-slate-900 leading-tight">{cert.name}</span>
                      <span className="text-xs text-slate-600">{cert.issuer}</span>
                      {cert.date && <span className="text-xs font-medium text-slate-400">{cert.date}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

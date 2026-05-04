import { Mail, Phone, MapPin, Link, Briefcase, GraduationCap, Languages, Award, FolderGit2 } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

export function CvRenderer({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";

  const hasContactInfo = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  return (
    <div className={`flex flex-col bg-white ${fontClass}`}>
      {/* Header */}
      <div className="text-white px-10 py-12 relative overflow-hidden" style={{ background: theme.headerGradient }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 -mb-20 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex items-center gap-8">
          {personalInfo.photoUrl && (
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 flex-1">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                {personalInfo.firstName}{" "}
                <span style={{ color: theme.accentLight }}>{personalInfo.lastName}</span>
              </h1>
              {personalInfo.title && (
                <h2 className="text-xl sm:text-2xl font-medium tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {personalInfo.title}
                </h2>
              )}
            </div>

            {hasContactInfo && (
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: theme.accentLight }} />
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: theme.accentLight }} />
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: theme.accentLight }} />
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" style={{ color: theme.accentLight }} />
                    {personalInfo.linkedin}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row flex-1 bg-white text-slate-800">

        {/* Main (2/3) */}
        <div className="flex-1 px-10 py-10 flex flex-col gap-10 border-r border-slate-100">

          {summary && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <span className="font-bold text-lg" style={{ color: theme.accentColor }}>!</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Profil</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm text-justify whitespace-pre-wrap">{summary}</p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <Briefcase className="w-4 h-4" style={{ color: theme.accentColor }} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Expérience Professionnelle</h3>
              </div>
              <div className="flex flex-col gap-8">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l border-slate-200">
                    <div className="absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-1.5 shadow-sm border-2" style={{ borderColor: theme.accentColor }} />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-y-1">
                        <h4 className="text-base font-bold text-slate-900">{exp.position}</h4>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: theme.accentColor, backgroundColor: theme.accentBg }}>
                          {exp.startDate} - {exp.current ? "Aujourd'hui" : exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-slate-500 mb-2">{exp.company}</div>
                      {exp.description && (
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <FolderGit2 className="w-4 h-4" style={{ color: theme.accentColor }} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Projets</h3>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-base font-bold text-slate-900">{proj.name}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: theme.accentColor }}>
                          Voir ↗
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

        {/* Sidebar (1/3) */}
        <div className="w-full md:w-[280px] bg-slate-50/80 px-8 py-10 flex flex-col gap-10">

          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase mb-5">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-5 h-5" style={{ color: theme.accentColor }} />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Éducation</h3>
              </div>
              <div className="flex flex-col gap-6">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-col gap-0.5">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{edu.degree}</h4>
                    {edu.field && <div className="text-xs font-medium mt-1" style={{ color: theme.accentColor }}>{edu.field}</div>}
                    <div className="text-xs text-slate-500 mt-1">{edu.institution}</div>
                    <div className="text-xs font-medium text-slate-400 mt-1">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ""}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Languages className="w-5 h-5" style={{ color: theme.accentColor }} />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Langues</h3>
              </div>
              <div className="flex flex-col gap-3">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">{lang.name}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-sm" style={{ color: theme.accentColor, backgroundColor: theme.accentBg }}>
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <Award className="w-5 h-5" style={{ color: theme.accentColor }} />
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
  );
}

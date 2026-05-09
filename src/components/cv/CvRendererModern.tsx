import { Mail, Phone, MapPin, Link, GraduationCap, Languages, Award, FolderGit2, Briefcase } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: accent }} />
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">{children}</h3>
    </div>
  );
}

const SPACING = {
  compact:  { sidebarPad: "px-5 py-6",  sidebarGap: "gap-4", mainPad: "px-6 py-6",  mainGap: "gap-5",  expGap: "gap-4" },
  normal:   { sidebarPad: "px-6 py-8",  sidebarGap: "gap-6", mainPad: "px-8 py-8",  mainGap: "gap-8",  expGap: "gap-6" },
  spacious: { sidebarPad: "px-8 py-10", sidebarGap: "gap-8", mainPad: "px-10 py-10", mainGap: "gap-12", expGap: "gap-8" },
} as const;

export function CvRendererModern({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SPACING[designSettings?.spacing ?? "normal"];

  return (
    <div className={`flex flex-row bg-white ${fontClass} min-h-full`}>

      {/* ── Left sidebar ── */}
      <div
        className={`w-[210px] shrink-0 flex flex-col ${sp.sidebarPad} ${sp.sidebarGap}`}
        style={{ background: theme.headerGradient }}
      >
        {/* Photo */}
        {personalInfo.photoUrl && (
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Name + title */}
        <div className="text-center">
          <h1 className="text-lg font-bold text-white leading-tight">
            {personalInfo.firstName}{" "}
            <span style={{ color: theme.accentLight }}>{personalInfo.lastName}</span>
          </h1>
          {personalInfo.title && (
            <p className="text-[10px] uppercase tracking-wider mt-1.5" style={{ color: "rgba(255,255,255,0.65)" }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact */}
        {(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin) && (
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-bold uppercase tracking-widest pb-1.5 border-b border-white/20" style={{ color: "rgba(255,255,255,0.5)" }}>Contact</p>
            {personalInfo.email && (
              <div className="flex items-start gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.8)" }}>
                <Mail className="w-3 h-3 mt-0.5 shrink-0" />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.8)" }}>
                <Phone className="w-3 h-3 shrink-0" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.8)" }}>
                <MapPin className="w-3 h-3 shrink-0" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-start gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.8)" }}>
                <Link className="w-3 h-3 mt-0.5 shrink-0" />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-white/20" style={{ color: "rgba(255,255,255,0.5)" }}>Compétences</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 rounded border border-white/25 font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-white/20" style={{ color: "rgba(255,255,255,0.5)" }}>Langues</p>
            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-white/90">{lang.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-white/20" style={{ color: "rgba(255,255,255,0.5)" }}>Certifications</p>
            <div className="flex flex-col gap-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <p className="text-[10px] font-semibold text-white/90 leading-tight">{cert.name}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{cert.issuer}</p>
                  {cert.date && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{cert.date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className={`flex-1 ${sp.mainPad} flex flex-col ${sp.mainGap} bg-white text-slate-800`}>

        {summary && (
          <section>
            <SectionTitle accent={theme.accentColor}>Profil</SectionTitle>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap text-justify">{summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>
              <Briefcase className="w-3.5 h-3.5 inline mr-1.5" style={{ color: theme.accentColor }} />
              Expérience Professionnelle
            </SectionTitle>
            <div className={`flex flex-col ${sp.expGap}`}>
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-5 border-l-2" style={{ borderColor: theme.accentBg }}>
                  <div
                    className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 bg-white border-2"
                    style={{ borderColor: theme.accentColor }}
                  />
                  <div className="flex flex-wrap justify-between items-baseline gap-1 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{exp.position}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ color: theme.accentColor, backgroundColor: theme.accentBg }}>
                      {exp.startDate}{exp.endDate || exp.current ? ` - ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{exp.company}</p>
                  {exp.description && <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>
              <GraduationCap className="w-3.5 h-3.5 inline mr-1.5" style={{ color: theme.accentColor }} />
              Formation
            </SectionTitle>
            <div className="flex flex-col gap-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                    <span className="text-xs text-slate-400">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ""}</span>
                  </div>
                  {edu.field && <p className="text-xs font-medium mt-0.5" style={{ color: theme.accentColor }}>{edu.field}</p>}
                  <p className="text-xs text-slate-500 mt-0.5">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>
              <FolderGit2 className="w-3.5 h-3.5 inline mr-1.5" style={{ color: theme.accentColor }} />
              Projets
            </SectionTitle>
            <div className="grid grid-cols-1 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-lg border" style={{ borderColor: theme.accentBg, backgroundColor: `${theme.accentBg}` }}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium ml-2 shrink-0" style={{ color: theme.accentColor }}>
                        Voir ↗
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

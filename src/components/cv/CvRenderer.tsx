import { Mail, Phone, MapPin, Link, Briefcase, GraduationCap, Languages, Award, FolderGit2 } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme, normalizeCvText } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

const SPACING = {
  compact: {
    headerPad: "px-10 py-6",
    mainPad: "pl-10 pr-7 py-7",
    mainGap: "gap-5",
    sidebarPad: "pl-6 pr-9 py-7",
    sidebarGap: "gap-5",
    expGap: "gap-4",
    nameSize: "text-2xl sm:text-3xl",
    titleSize: "text-sm sm:text-base",
    sectionSize: "text-sm",
    roleSize: "text-sm",
    bodySize: "text-[12.5px]",
    metaSize: "text-xs",
  },
  normal: {
    headerPad: "px-12 py-8",
    mainPad: "pl-12 pr-8 py-8",
    mainGap: "gap-7",
    sidebarPad: "pl-6 pr-10 py-8",
    sidebarGap: "gap-7",
    expGap: "gap-6",
    nameSize: "text-3xl sm:text-4xl",
    titleSize: "text-base sm:text-lg",
    sectionSize: "text-base",
    roleSize: "text-[15px]",
    bodySize: "text-[13.5px]",
    metaSize: "text-xs",
  },
  spacious: {
    headerPad: "px-14 py-9",
    mainPad: "pl-14 pr-9 py-10",
    mainGap: "gap-9",
    sidebarPad: "pl-7 pr-12 py-10",
    sidebarGap: "gap-9",
    expGap: "gap-7",
    nameSize: "text-4xl",
    titleSize: "text-lg sm:text-xl",
    sectionSize: "text-lg",
    roleSize: "text-base",
    bodySize: "text-[14.5px]",
    metaSize: "text-[13px]",
  },
} as const;

export function CvRenderer({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SPACING[designSettings?.spacing ?? "normal"];

  const hasContactInfo = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);

  return (
    <div className={`flex flex-col bg-white min-h-full ${fontClass}`}>
      {/* Header */}
      <div className={`text-white ${sp.headerPad} relative overflow-hidden`} style={{ background: theme.headerGradient }}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 -mb-20 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex items-center gap-7">
          {personalInfo.photoUrl && (
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/25 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 flex-1">
            <div>
              {hasName && (
                <h1 className={`${sp.nameSize} font-bold tracking-tight mb-1.5 leading-tight`}>
                  {personalInfo.firstName}{" "}
                  <span style={{ color: theme.accentLight }}>{personalInfo.lastName}</span>
                </h1>
              )}
              {personalInfo.title && (
                <h2
                  className={`${sp.titleSize} font-semibold tracking-wide uppercase`}
                  style={{ color: "rgba(255,255,255,0.92)" }}
                >
                  {personalInfo.title}
                </h2>
              )}
            </div>

            {hasContactInfo && (
              <div className={`flex flex-wrap gap-x-5 gap-y-2 ${sp.metaSize} font-medium`} style={{ color: "rgba(255,255,255,0.88)" }}>
                {personalInfo.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" style={{ color: theme.accentLight }} />
                    {personalInfo.email}
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" style={{ color: theme.accentLight }} />
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: theme.accentLight }} />
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5" style={{ color: theme.accentLight }} />
                    {personalInfo.linkedin}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row flex-1 bg-white text-slate-800">

        {/* Main (2/3) */}
        <div className={`flex-1 ${sp.mainPad} flex flex-col ${sp.mainGap} border-r border-slate-100`}>

          {summary && (
            <section>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <span className="font-bold text-sm" style={{ color: theme.accentColor }}>!</span>
                </div>
                <h3 className={`${sp.sectionSize} font-bold text-slate-900 tracking-tight uppercase`}>Profil</h3>
              </div>
              <p className={`text-slate-700 leading-relaxed ${sp.bodySize} text-justify whitespace-pre-line`}>
                {normalizeCvText(summary)}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <Briefcase className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                </div>
                <h3 className={`${sp.sectionSize} font-bold text-slate-900 tracking-tight uppercase`}>Expérience Professionnelle</h3>
              </div>
              <div className={`flex flex-col ${sp.expGap}`}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-5 border-l-2 border-slate-200 break-inside-avoid">
                    <div className="absolute w-3 h-3 bg-white rounded-full -left-[7px] top-1.5 shadow-xs border-2" style={{ borderColor: theme.accentColor }} />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-y-1">
                        <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{exp.position}</h4>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ color: theme.accentColor, backgroundColor: theme.accentBg }}>
                          {exp.startDate} - {exp.current ? "Aujourd'hui" : exp.endDate}
                        </span>
                      </div>
                      <div className={`${sp.metaSize} font-semibold text-slate-600 mb-1`} style={{ color: theme.accentColor }}>
                        {exp.company}
                      </div>
                      {exp.description && (
                        <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line`}>
                          {normalizeCvText(exp.description)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accentBg }}>
                  <FolderGit2 className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                </div>
                <h3 className={`${sp.sectionSize} font-bold text-slate-900 tracking-tight uppercase`}>Projets</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{proj.name}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: theme.accentColor }}>
                          Voir ↗
                        </a>
                      )}
                    </div>
                    <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line`}>
                      {normalizeCvText(proj.description)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className={`w-full md:w-[270px] bg-slate-50/90 ${sp.sidebarPad} flex flex-col ${sp.sidebarGap}`}>

          {skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase mb-3.5 pb-1.5 border-b border-slate-200">
                Compétences
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3.5 pb-1.5 border-b border-slate-200">
                <GraduationCap className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">Éducation</h3>
              </div>
              <div className="flex flex-col gap-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-col gap-0.5">
                    <h4 className="text-[13.5px] font-bold text-slate-900 leading-snug">{edu.degree}</h4>
                    {edu.field && <div className="text-xs font-semibold mt-0.5" style={{ color: theme.accentColor }}>{edu.field}</div>}
                    <div className="text-xs text-slate-600 mt-0.5">{edu.institution}</div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ""}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3.5 pb-1.5 border-b border-slate-200">
                <Languages className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">Langues</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-[13px]">
                    <span className="font-semibold text-slate-700">{lang.name}</span>
                    {lang.level && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ color: theme.accentColor, backgroundColor: theme.accentBg }}>
                        {lang.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3.5 pb-1.5 border-b border-slate-200">
                <Award className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">Certificats</h3>
              </div>
              <div className="flex flex-col gap-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex flex-col gap-0.5 text-[13px]">
                    <span className="font-bold text-slate-900 leading-snug">{cert.name}</span>
                    <span className="text-xs text-slate-600">{cert.issuer}</span>
                    {cert.date && <span className="text-[11px] font-medium text-slate-500">{cert.date}</span>}
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

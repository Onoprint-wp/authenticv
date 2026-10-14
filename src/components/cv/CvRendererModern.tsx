import { Mail, Phone, MapPin, Link, GraduationCap, FolderGit2, Briefcase } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme, normalizeCvText } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

function SectionTitle({ children, accent, sizeClass }: { children: React.ReactNode; accent: string; sizeClass: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: accent }} />
      <h3 className={`${sizeClass} font-bold uppercase tracking-widest text-slate-900`}>{children}</h3>
    </div>
  );
}

const SPACING = {
  compact: {
    sidebarPad: "px-5 py-6",
    sidebarGap: "gap-5",
    mainPad: "px-7 py-6",
    mainGap: "gap-5",
    expGap: "gap-4",
    nameSize: "text-lg",
    titleSize: "text-[11px]",
    sectionSize: "text-xs",
    roleSize: "text-sm",
    bodySize: "text-[12.5px]",
    metaSize: "text-xs",
    sideText: "text-[11.5px]",
  },
  normal: {
    sidebarPad: "px-6 py-8",
    sidebarGap: "gap-6",
    mainPad: "px-8 py-8",
    mainGap: "gap-7",
    expGap: "gap-5",
    nameSize: "text-xl",
    titleSize: "text-xs",
    sectionSize: "text-sm",
    roleSize: "text-[15px]",
    bodySize: "text-[13.5px]",
    metaSize: "text-xs",
    sideText: "text-xs",
  },
  spacious: {
    sidebarPad: "px-7 py-10",
    sidebarGap: "gap-7",
    mainPad: "px-10 py-10",
    mainGap: "gap-9",
    expGap: "gap-7",
    nameSize: "text-2xl",
    titleSize: "text-[13px]",
    sectionSize: "text-[15px]",
    roleSize: "text-base",
    bodySize: "text-[14.5px]",
    metaSize: "text-[13px]",
    sideText: "text-[13px]",
  },
} as const;

export function CvRendererModern({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SPACING[designSettings?.spacing ?? "normal"];
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);

  return (
    <div className={`flex flex-row bg-white ${fontClass} min-h-full`}>

      {/* ── Left sidebar ── */}
      <div
        className={`w-[235px] shrink-0 flex flex-col ${sp.sidebarPad} ${sp.sidebarGap}`}
        style={{ background: theme.headerGradient }}
      >
        {/* Photo */}
        {personalInfo.photoUrl && (
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/25 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Name + title */}
        <div className="text-center">
          {hasName && (
            <h1 className={`${sp.nameSize} font-bold text-white leading-snug`}>
              {personalInfo.firstName}{" "}
              <span style={{ color: theme.accentLight }}>{personalInfo.lastName}</span>
            </h1>
          )}
          {personalInfo.title && (
            <p
              className={`${hasName ? sp.titleSize : "text-sm"} font-semibold uppercase tracking-wider mt-1.5 leading-snug`}
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact */}
        {(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin) && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-widest pb-1.5 border-b border-white/25" style={{ color: "rgba(255,255,255,0.75)" }}>Contact</p>
            {personalInfo.email && (
              <div className={`flex items-start gap-2 ${sp.sideText}`} style={{ color: "rgba(255,255,255,0.92)" }}>
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: theme.accentLight }} />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className={`flex items-center gap-2 ${sp.sideText}`} style={{ color: "rgba(255,255,255,0.92)" }}>
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentLight }} />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className={`flex items-center gap-2 ${sp.sideText}`} style={{ color: "rgba(255,255,255,0.92)" }}>
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentLight }} />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedin && (
              <div className={`flex items-start gap-2 ${sp.sideText}`} style={{ color: "rgba(255,255,255,0.92)" }}>
                <Link className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: theme.accentLight }} />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-white/25" style={{ color: "rgba(255,255,255,0.75)" }}>Compétences</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-md border border-white/30 bg-white/10 font-medium" style={{ color: "#ffffff" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-white/25" style={{ color: "rgba(255,255,255,0.75)" }}>Langues</p>
            <div className="flex flex-col gap-2">
              {languages.map((lang) => (
                <div key={lang.id} className={`flex justify-between items-center ${sp.sideText}`}>
                  <span className="font-semibold text-white">{lang.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.78)" }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest pb-1.5 mb-3 border-b border-white/25" style={{ color: "rgba(255,255,255,0.75)" }}>Certifications</p>
            <div className="flex flex-col gap-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <p className={`${sp.sideText} font-semibold text-white leading-snug`}>{cert.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.78)" }}>{cert.issuer}</p>
                  {cert.date && <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.65)" }}>{cert.date}</p>}
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
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Profil</SectionTitle>
            <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line text-justify`}>
              {normalizeCvText(summary)}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>
              <Briefcase className="w-4 h-4 inline mr-1.5" style={{ color: theme.accentColor }} />
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
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{exp.position}</h4>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0" style={{ color: theme.accentColor, backgroundColor: theme.accentBg }}>
                      {exp.startDate}{exp.endDate || exp.current ? ` - ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </span>
                  </div>
                  <p className={`${sp.metaSize} font-semibold mb-1.5`} style={{ color: theme.accentColor }}>{exp.company}</p>
                  {exp.description && (
                    <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line`}>
                      {normalizeCvText(exp.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>
              <GraduationCap className="w-4 h-4 inline mr-1.5" style={{ color: theme.accentColor }} />
              Formation
            </SectionTitle>
            <div className="flex flex-col gap-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{edu.degree}</h4>
                    <span className="text-xs font-medium text-slate-500">{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ""}</span>
                  </div>
                  {edu.field && <p className={`${sp.metaSize} font-semibold mt-0.5`} style={{ color: theme.accentColor }}>{edu.field}</p>}
                  <p className={`${sp.metaSize} text-slate-600 mt-0.5`}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>
              <FolderGit2 className="w-4 h-4 inline mr-1.5" style={{ color: theme.accentColor }} />
              Projets
            </SectionTitle>
            <div className="grid grid-cols-1 gap-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-lg border" style={{ borderColor: theme.accentBg, backgroundColor: `${theme.accentBg}` }}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold ml-2 shrink-0" style={{ color: theme.accentColor }}>
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
    </div>
  );
}

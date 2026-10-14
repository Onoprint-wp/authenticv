import { Mail, Phone, MapPin, Link } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme, normalizeCvText } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

function SectionTitle({ children, accent, sizeClass }: { children: React.ReactNode; accent: string; sizeClass: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <h3 className={`${sizeClass} font-bold uppercase tracking-[0.15em] text-slate-700`}>{children}</h3>
    </div>
  );
}

const SPACING = {
  compact: {
    outerPad: "px-9 py-7",
    sectionGap: "gap-5",
    expGap: "gap-3.5",
    nameSize: "text-2xl sm:text-3xl",
    titleSize: "text-xs",
    sectionSize: "text-xs",
    roleSize: "text-sm",
    bodySize: "text-[12.5px]",
    metaSize: "text-xs",
  },
  normal: {
    outerPad: "px-12 py-10",
    sectionGap: "gap-7",
    expGap: "gap-5",
    nameSize: "text-3xl sm:text-4xl",
    titleSize: "text-sm",
    sectionSize: "text-[13px]",
    roleSize: "text-[15px]",
    bodySize: "text-[13.5px]",
    metaSize: "text-xs",
  },
  spacious: {
    outerPad: "px-14 py-12",
    sectionGap: "gap-9",
    expGap: "gap-6",
    nameSize: "text-4xl",
    titleSize: "text-base",
    sectionSize: "text-sm",
    roleSize: "text-base",
    bodySize: "text-[14.5px]",
    metaSize: "text-[13px]",
  },
} as const;

export function CvRendererMinimal({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SPACING[designSettings?.spacing ?? "normal"];

  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);

  return (
    <div className={`flex flex-col bg-white text-slate-800 min-h-full ${sp.outerPad} ${fontClass}`}>

      {/* ── Header ── */}
      <div className="flex items-start gap-6 mb-6">
        {personalInfo.photoUrl && (
          <div className="w-22 h-22 rounded-full overflow-hidden shrink-0 border-2 border-slate-200 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          {hasName && (
            <h1 className={`${sp.nameSize} font-bold tracking-tight text-slate-900 mb-1.5 leading-tight`}>
              {personalInfo.firstName}{" "}
              <span style={{ color: theme.accentColor }}>{personalInfo.lastName}</span>
            </h1>
          )}
          {personalInfo.title && (
            <p className={`${hasName ? sp.titleSize : sp.nameSize} font-semibold tracking-[0.12em] uppercase text-slate-600 mt-1`}>
              {personalInfo.title}
            </p>
          )}
          <div className="w-12 h-0.5 mt-3.5 mb-4 rounded-full" style={{ backgroundColor: theme.accentColor }} />

          {hasContact && (
            <div className={`flex flex-wrap gap-x-6 gap-y-1.5 ${sp.metaSize} text-slate-600`}>
              {personalInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                  {personalInfo.linkedin}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 mb-6" />

      {/* ── Sections ── */}
      <div className={`flex flex-col ${sp.sectionGap}`}>

        {summary && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Profil</SectionTitle>
            <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line`}>
              {normalizeCvText(summary)}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Expérience Professionnelle</SectionTitle>
            <div className={`flex flex-col ${sp.expGap}`}>
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{exp.position}</h4>
                    <span className="text-xs font-medium text-slate-500">
                      {exp.startDate}{exp.endDate || exp.current ? ` — ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </span>
                  </div>
                  <p className={`${sp.metaSize} font-semibold mt-0.5 mb-1.5`} style={{ color: theme.accentColor }}>{exp.company}</p>
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

        {skills.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Compétences</SectionTitle>
            <p className={`${sp.bodySize} text-slate-700 leading-relaxed font-medium`}>{skills.join("  ·  ")}</p>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Formation</SectionTitle>
            <div className="flex flex-col gap-3.5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>
                      {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                    </h4>
                    <span className="text-xs font-medium text-slate-500">{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ""}</span>
                  </div>
                  <p className={`${sp.metaSize} text-slate-600 mt-0.5`}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Langues</SectionTitle>
            <p className={`${sp.bodySize} text-slate-700`}>
              {languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("  ·  ")}
            </p>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Certifications</SectionTitle>
            <div className="flex flex-col gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={`${sp.bodySize} font-semibold text-slate-900`}>{cert.name}</span>
                  {cert.issuer && <span className={`${sp.metaSize} text-slate-600`}>— {cert.issuer}</span>}
                  {cert.date && <span className="text-xs text-slate-500">· {cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor} sizeClass={sp.sectionSize}>Projets</SectionTitle>
            <div className="flex flex-col gap-3.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline gap-2">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: theme.accentColor }}>
                        Voir ↗
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className={`${sp.bodySize} text-slate-700 leading-relaxed mt-0.5 whitespace-pre-line`}>
                      {normalizeCvText(proj.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

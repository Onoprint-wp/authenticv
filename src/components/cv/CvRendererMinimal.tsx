import { Mail, Phone, MapPin, Link } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-5 h-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{children}</h3>
    </div>
  );
}

const SPACING = {
  compact:  { outerPad: "px-10 py-8",  sectionGap: "gap-5",  expGap: "gap-3" },
  normal:   { outerPad: "px-14 py-12", sectionGap: "gap-8",  expGap: "gap-5" },
  spacious: { outerPad: "px-16 py-16", sectionGap: "gap-12", expGap: "gap-7" },
} as const;

export function CvRendererMinimal({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SPACING[designSettings?.spacing ?? "normal"];

  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  return (
    <div className={`flex flex-col bg-white text-slate-800 ${sp.outerPad} ${fontClass}`}>

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-2 leading-none">
          {personalInfo.firstName}{" "}
          <span style={{ color: theme.accentColor }}>{personalInfo.lastName}</span>
        </h1>
        {personalInfo.title && (
          <p className="text-sm font-medium tracking-[0.12em] uppercase text-slate-500 mt-2">{personalInfo.title}</p>
        )}
        <div className="w-12 h-0.5 mt-4 mb-5 rounded-full" style={{ backgroundColor: theme.accentColor }} />

        {hasContact && (
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-500">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" style={{ color: theme.accentColor }} />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" style={{ color: theme.accentColor }} />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" style={{ color: theme.accentColor }} />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1.5">
                <Link className="w-3 h-3" style={{ color: theme.accentColor }} />
                {personalInfo.linkedin}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 mb-8" />

      {/* ── Sections ── */}
      <div className={`flex flex-col ${sp.sectionGap}`}>

        {summary && (
          <section>
            <SectionTitle accent={theme.accentColor}>Profil</SectionTitle>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>Expérience</SectionTitle>
            <div className={`flex flex-col ${sp.expGap}`}>
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className="text-sm font-bold text-slate-900">{exp.position}</h4>
                    <span className="text-xs text-slate-400">
                      {exp.startDate}{exp.endDate || exp.current ? ` — ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 mb-1.5" style={{ color: theme.accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>Compétences</SectionTitle>
            <p className="text-sm text-slate-600 leading-relaxed">{skills.join("  ·  ")}</p>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>Formation</SectionTitle>
            <div className="flex flex-col gap-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                    </h4>
                    <span className="text-xs text-slate-400">{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ""}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>Langues</SectionTitle>
            <p className="text-sm text-slate-600">
              {languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("  ·  ")}
            </p>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>Certifications</SectionTitle>
            <div className="flex flex-col gap-2.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-slate-900">{cert.name}</span>
                  {cert.issuer && <span className="text-xs text-slate-500">— {cert.issuer}</span>}
                  {cert.date && <span className="text-xs text-slate-400">· {cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionTitle accent={theme.accentColor}>Projets</SectionTitle>
            <div className="flex flex-col gap-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: theme.accentColor }}>
                        Voir ↗
                      </a>
                    )}
                  </div>
                  {proj.description && <p className="text-sm text-slate-600 leading-relaxed mt-0.5 whitespace-pre-wrap">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

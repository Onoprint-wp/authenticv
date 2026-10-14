import { Mail, Phone, MapPin, Link, Briefcase, GraduationCap, Languages, Award, FolderGit2 } from "lucide-react";
import type { CvData } from "@/store/useCvStore";
import { getTheme, normalizeCvText } from "@/lib/themes";

interface Props {
  cvData: CvData;
}

const SCALE = {
  compact: {
    pad: "px-10 py-8",
    padH: "px-10",
    padV: "py-7",
    gap: "gap-4",
    expGap: "gap-3.5",
    nameSize: "text-2xl sm:text-3xl",
    titleSize: "text-xs sm:text-sm",
    sectionSize: "text-xs",
    roleSize: "text-sm",
    bodySize: "text-[12.5px]",
    metaSize: "text-xs",
  },
  normal: {
    pad: "px-12 py-9",
    padH: "px-12",
    padV: "py-9",
    gap: "gap-5",
    expGap: "gap-4",
    nameSize: "text-2xl sm:text-3xl",
    titleSize: "text-sm sm:text-base",
    sectionSize: "text-sm",
    roleSize: "text-[15px]",
    bodySize: "text-[13.5px]",
    metaSize: "text-xs",
  },
  spacious: {
    pad: "px-14 py-11",
    padH: "px-14",
    padV: "py-11",
    gap: "gap-7",
    expGap: "gap-5",
    nameSize: "text-3xl sm:text-4xl",
    titleSize: "text-base sm:text-lg",
    sectionSize: "text-[15px]",
    roleSize: "text-base",
    bodySize: "text-[14.5px]",
    metaSize: "text-[13px]",
  },
} as const;

/* ==========================================================================
   ARCHITECTURE 4 : EXECUTIVE (Harvard / Direction / Gouvernance)
   En-tête institutionnel centré à double filet + pleine largeur structurée
   ========================================================================== */
export function CvRendererExecutive({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "slate");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SCALE[designSettings?.spacing ?? "normal"];
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = Boolean(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin);

  return (
    <div className={`flex flex-col bg-white text-slate-800 min-h-full ${sp.pad} ${fontClass}`}>
      {/* Institutional Centered Header with Double Rule */}
      <header className="text-center pb-4 mb-5 border-b-2" style={{ borderColor: theme.pdfHeaderBg }}>
        {personalInfo.photoUrl && (
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 shadow-sm" style={{ borderColor: theme.accentColor }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        {hasName && (
          <h1 className={`${sp.nameSize} font-bold tracking-wide uppercase text-slate-900`}>
            {personalInfo.firstName}{" "}
            <span style={{ color: theme.accentColor }}>{personalInfo.lastName}</span>
          </h1>
        )}
        {personalInfo.title && (
          <p
            className={`${sp.titleSize} font-semibold uppercase tracking-[0.14em] mt-1.5`}
            style={{ color: theme.accentColor }}
          >
            {personalInfo.title}
          </p>
        )}
        {hasContact && (
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3 ${sp.metaSize} text-slate-600 font-medium`}>
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.email && <span>• {personalInfo.email}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        )}
        <div className="w-full h-px mt-3.5" style={{ backgroundColor: `${theme.accentColor}40` }} />
      </header>

      <div className={`flex flex-col ${sp.gap}`}>
        {/* Summary */}
        {summary && (
          <section>
            <h3
              className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-2.5 border-b`}
              style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
            >
              Synthèse Exécutive
            </h3>
            <p className={`${sp.bodySize} text-slate-700 leading-relaxed text-justify whitespace-pre-line`}>
              {normalizeCvText(summary)}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h3
              className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-3.5 border-b`}
              style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
            >
              Parcours Professionnel &amp; Mandats
            </h3>
            <div className={`flex flex-col ${sp.expGap}`}>
              {experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex flex-wrap justify-between items-baseline gap-2">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{exp.position}</h4>
                    <span className={`${sp.metaSize} font-bold`} style={{ color: theme.accentColor }}>
                      {exp.startDate}{exp.endDate || exp.current ? ` — ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </span>
                  </div>
                  <div className={`${sp.metaSize} font-semibold text-slate-600 italic mb-1`}>{exp.company}</div>
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

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h3
              className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-3 border-b`}
              style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
            >
              Formation Académique &amp; Diplômes
            </h3>
            <div className="flex flex-col gap-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-wrap justify-between items-baseline gap-2 break-inside-avoid">
                  <div>
                    <h4 className={`${sp.roleSize} font-bold text-slate-900 inline`}>
                      {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                    </h4>
                    <p className={`${sp.metaSize} text-slate-600 mt-0.5`}>{edu.institution}</p>
                  </div>
                  <span className={`${sp.metaSize} font-semibold text-slate-500`}>
                    {edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom 2-column grid for Skills + Languages/Certifications */}
        {(skills.length > 0 || languages.length > 0 || certifications.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1 break-inside-avoid">
            {skills.length > 0 && (
              <section>
                <h3
                  className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-3 border-b`}
                  style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
                >
                  Domaines d&apos;Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded border"
                      style={{ backgroundColor: theme.accentBg, borderColor: `${theme.accentColor}30`, color: "#1e293b" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {(languages.length > 0 || certifications.length > 0) && (
              <section className="flex flex-col gap-4">
                {languages.length > 0 && (
                  <div>
                    <h3
                      className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-2.5 border-b`}
                      style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
                    >
                      Langues
                    </h3>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      {languages.map((l) => (
                        <span key={l.id} className={`${sp.bodySize} text-slate-700`}>
                          <strong className="text-slate-900">{l.name}</strong>
                          {l.level ? ` (${l.level})` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {certifications.length > 0 && (
                  <div>
                    <h3
                      className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-2.5 border-b`}
                      style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
                    >
                      Certifications &amp; Accréditations
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {certifications.map((c) => (
                        <div key={c.id} className={`${sp.bodySize} text-slate-700`}>
                          <strong className="text-slate-900">{c.name}</strong>
                          {c.issuer ? ` · ${c.issuer}` : ""}
                          {c.date ? ` (${c.date})` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {projects.length > 0 && (
          <section>
            <h3
              className={`${sp.sectionSize} font-bold uppercase tracking-[0.14em] pb-1.5 mb-3 border-b`}
              style={{ color: theme.pdfHeaderBg, borderColor: `${theme.accentColor}45` }}
            >
              Projets &amp; Réalisations Clés
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: theme.accentColor }}>
                        Voir ↗
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line mt-0.5`}>
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

/* ==========================================================================
   ARCHITECTURE 5 : SPLIT (Bicolonne Inversé / Commercial B2B & Campus)
   En-tête asymétrique + Colonne principale à gauche + Sidebar encadrée à droite
   ========================================================================== */
export function CvRendererSplit({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "emerald");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SCALE[designSettings?.spacing ?? "normal"];
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = Boolean(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin);

  return (
    <div className={`flex flex-col bg-white text-slate-800 min-h-full ${fontClass}`}>
      {/* Asymmetric Split Header */}
      <div className="px-11 py-8 border-b-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6" style={{ borderColor: theme.accentColor }}>
        <div className="flex items-center gap-5 border-l-4 pl-4" style={{ borderColor: theme.accentColor }}>
          {personalInfo.photoUrl && (
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 shadow-sm" style={{ borderColor: theme.accentColor }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            {hasName && (
              <h1 className={`${sp.nameSize} font-bold text-slate-900 tracking-tight leading-tight`}>
                {personalInfo.firstName}{" "}
                <span style={{ color: theme.accentColor }}>{personalInfo.lastName}</span>
              </h1>
            )}
            {personalInfo.title && (
              <p className={`${sp.titleSize} font-bold uppercase tracking-wider mt-1`} style={{ color: theme.pdfHeaderBg }}>
                {personalInfo.title}
              </p>
            )}
          </div>
        </div>

        {hasContact && (
          <div className={`flex flex-col gap-1.5 px-4 py-3 rounded-xl border ${sp.metaSize} text-slate-700 shrink-0`} style={{ backgroundColor: theme.accentBg, borderColor: `${theme.accentColor}30` }}>
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentColor }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Link className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentColor }} />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2-Column Body (Main Left + Tinted Right Column) */}
      <div className="flex flex-col sm:flex-row flex-1">
        {/* Main Left */}
        <div className={`flex-1 pl-11 pr-7 py-8 flex flex-col ${sp.gap}`}>
          {summary && (
            <section>
              <h3 className={`${sp.sectionSize} font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2`} style={{ color: theme.pdfHeaderBg }}>
                <span className="w-2 h-4 rounded-xs inline-block" style={{ backgroundColor: theme.accentColor }} />
                Profil &amp; Proposition de Valeur
              </h3>
              <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line text-justify`}>
                {normalizeCvText(summary)}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h3 className={`${sp.sectionSize} font-bold uppercase tracking-wider mb-4 flex items-center gap-2`} style={{ color: theme.pdfHeaderBg }}>
                <span className="w-2 h-4 rounded-xs inline-block" style={{ backgroundColor: theme.accentColor }} />
                Expérience Professionnelle
              </h3>
              <div className={`flex flex-col ${sp.expGap}`}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 break-inside-avoid">
                    <div className="flex flex-wrap justify-between items-baseline gap-2">
                      <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{exp.position}</h4>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md" style={{ backgroundColor: theme.accentBg, color: theme.accentColor }}>
                        {exp.startDate}{exp.endDate || exp.current ? ` – ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                      </span>
                    </div>
                    <p className={`${sp.metaSize} font-semibold mt-0.5 mb-1.5`} style={{ color: theme.accentColor }}>
                      {exp.company}
                    </p>
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

          {projects.length > 0 && (
            <section>
              <h3 className={`${sp.sectionSize} font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2`} style={{ color: theme.pdfHeaderBg }}>
                <span className="w-2 h-4 rounded-xs inline-block" style={{ backgroundColor: theme.accentColor }} />
                Projets &amp; Réalisations
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className={`${sp.roleSize} font-bold text-slate-900`}>{proj.name}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: theme.accentColor }}>
                          Voir ↗
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line`}>
                        {normalizeCvText(proj.description)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Framed Right Sidebar */}
        <aside className="w-full sm:w-[260px] pl-6 pr-10 py-8 border-l border-slate-200 flex flex-col gap-6" style={{ backgroundColor: `${theme.accentBg}55` }}>
          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: `${theme.accentColor}35` }}>
                <GraduationCap className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Formation</h3>
              </div>
              <div className="flex flex-col gap-3.5">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs break-inside-avoid">
                    <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{edu.degree}</h4>
                    {edu.field && <p className="text-xs font-semibold mt-0.5" style={{ color: theme.accentColor }}>{edu.field}</p>}
                    <p className="text-xs text-slate-600 mt-0.5">{edu.institution}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: `${theme.accentColor}35` }}>
                <Briefcase className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Compétences Clés</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border shadow-2xs"
                    style={{ borderColor: `${theme.accentColor}40`, color: "#0f172a" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: `${theme.accentColor}35` }}>
                <Languages className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Langues</h3>
              </div>
              <div className="flex flex-col gap-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs bg-white px-2.5 py-1.5 rounded border border-slate-200/70">
                    <span className="font-semibold text-slate-800">{lang.name}</span>
                    {lang.level && <span className="font-bold" style={{ color: theme.accentColor }}>{lang.level}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 pb-1.5 border-b" style={{ borderColor: `${theme.accentColor}35` }}>
                <Award className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Certifications</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs bg-white p-2.5 rounded-lg border border-slate-200/70 break-inside-avoid">
                    <p className="font-bold text-slate-900">{cert.name}</p>
                    {cert.issuer && <p className="text-slate-600 mt-0.5">{cert.issuer}</p>}
                    {cert.date && <p className="text-[11px] text-slate-500 mt-0.5">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ==========================================================================
   ARCHITECTURE 6 : COMPACT-GRID (Ingénierie, BTP, HSE & Projets Techniques)
   Bandeau supérieur technique + Cartes d'expérience + Grille 2 colonnes basse
   ========================================================================== */
export function CvRendererCompactGrid({ cvData }: Props) {
  const { personalInfo, summary, experiences, education, skills, languages, certifications, projects, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "amber");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontClass = isSerif ? "font-serif" : "font-sans";
  const sp = SCALE[designSettings?.spacing ?? "normal"];
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = Boolean(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin);

  return (
    <div className={`flex flex-col bg-white text-slate-800 min-h-full ${fontClass}`}>
      {/* Top Technical Banner */}
      <header className={`${sp.padH} py-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4`} style={{ background: theme.pdfHeaderBg }}>
        <div className="flex items-center gap-4">
          {personalInfo.photoUrl && (
            <div className="w-18 h-18 rounded-xl overflow-hidden border-2 border-white/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            {hasName && (
              <h1 className={`${sp.nameSize} font-bold tracking-tight text-white leading-tight`}>
                {personalInfo.firstName}{" "}
                <span style={{ color: theme.accentLight }}>{personalInfo.lastName}</span>
              </h1>
            )}
            {personalInfo.title && (
              <p className={`${sp.titleSize} font-bold uppercase tracking-wider mt-1`} style={{ color: theme.accentLight }}>
                {personalInfo.title}
              </p>
            )}
          </div>
        </div>

        {hasContact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-1.5 text-xs text-white/90 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentLight }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentLight }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentLight }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentLight }} />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        )}
      </header>

      <div className={`${sp.padH} ${sp.padV} flex flex-col ${sp.gap} flex-1`}>
        {/* Summary Callout Box */}
        {summary && (
          <div className="p-4 rounded-xl border-l-4 break-inside-avoid" style={{ backgroundColor: theme.accentBg, borderColor: theme.accentColor }}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.pdfHeaderBg }}>
              Profil Technique &amp; Synthèse
            </h3>
            <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line`}>
              {normalizeCvText(summary)}
            </p>
          </div>
        )}

        {/* Skills Strip */}
        {skills.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5">
              Compétences &amp; Outils Techniques
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold px-3 py-1 rounded-md border"
                  style={{ backgroundColor: "#ffffff", borderColor: theme.accentColor, color: theme.pdfHeaderBg }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experiences Grid Cards */}
        {experiences.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3.5 pb-1.5 border-b-2 border-slate-200">
              <Briefcase className="w-4 h-4" style={{ color: theme.accentColor }} />
              <h3 className={`${sp.sectionSize} font-bold uppercase tracking-wider text-slate-900`}>
                Expériences &amp; Chantiers Réalisés
              </h3>
            </div>
            <div className="flex flex-col gap-3.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 break-inside-avoid">
                  <div className="flex flex-wrap justify-between items-baseline gap-2 mb-1">
                    <div>
                      <h4 className={`${sp.roleSize} font-bold text-slate-900 inline`}>{exp.position}</h4>
                      {exp.company && (
                        <span className={`${sp.metaSize} font-bold ml-2`} style={{ color: theme.accentColor }}>
                          · {exp.company}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {exp.startDate}{exp.endDate || exp.current ? ` – ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </span>
                  </div>
                  {exp.description && (
                    <p className={`${sp.bodySize} text-slate-700 leading-relaxed whitespace-pre-line mt-1.5`}>
                      {normalizeCvText(exp.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom 2-Column Technical Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3 pb-1 border-b-2 border-slate-200">
                <GraduationCap className="w-4 h-4" style={{ color: theme.accentColor }} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Formation &amp; Diplômes</h3>
              </div>
              <div className="flex flex-col gap-3">
                {education.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-lg border border-slate-200/80 bg-white break-inside-avoid">
                    <h4 className="text-[13.5px] font-bold text-slate-900">{edu.degree}</h4>
                    {edu.field && <p className="text-xs font-semibold mt-0.5" style={{ color: theme.accentColor }}>{edu.field}</p>}
                    <div className="flex justify-between items-center text-xs text-slate-600 mt-1">
                      <span>{edu.institution}</span>
                      <span className="text-slate-500 font-medium">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(certifications.length > 0 || languages.length > 0 || projects.length > 0) && (
            <section className="flex flex-col gap-4">
              {certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5 pb-1 border-b-2 border-slate-200">
                    <Award className="w-4 h-4" style={{ color: theme.accentColor }} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Habilitations &amp; Certifications</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-baseline text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 break-inside-avoid">
                        <div>
                          <span className="font-bold text-slate-900">{cert.name}</span>
                          {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                        </div>
                        {cert.date && <span className="text-slate-500 font-medium shrink-0 ml-2">{cert.date}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {languages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5 pb-1 border-b-2 border-slate-200">
                    <Languages className="w-4 h-4" style={{ color: theme.accentColor }} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Langues</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span key={lang.id} className="text-xs font-semibold px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-800">
                        {lang.name}{lang.level ? ` · ${lang.level}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {projects.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5 pb-1 border-b-2 border-slate-200">
                    <FolderGit2 className="w-4 h-4" style={{ color: theme.accentColor }} />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Projets</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 text-xs break-inside-avoid">
                        <div className="font-bold text-slate-900">{proj.name}</div>
                        {proj.description && <div className="text-slate-600 mt-0.5 whitespace-pre-line">{normalizeCvText(proj.description)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

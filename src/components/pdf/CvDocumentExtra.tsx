import {
  Document, Page, Text, View, Image, StyleSheet, Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme, PDF_SPACING, normalizeCvText } from "@/lib/themes";

interface Props {
  cvData: CvData;
  showWatermark?: boolean;
}

/* ==========================================================================
   ARCHITECTURE 4 : EXECUTIVE PDF (Harvard / Direction / Gouvernance)
   ========================================================================== */
export function CvDocumentExecutive({ cvData, showWatermark = false }: Props) {
  const {
    personalInfo, summary, experiences, education,
    skills, projects, languages, certifications, designSettings,
  } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "slate");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";
  const sp = PDF_SPACING[designSettings?.spacing ?? "normal"];
  const s = (pt: number) => Number((pt * sp.scale).toFixed(2));

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      fontFamily: fontBase,
      fontSize: s(10),
      color: "#1e293b",
      paddingHorizontal: sp.pagePadH,
      paddingVertical: sp.pagePadV,
    },
    header: {
      alignItems: "center",
      paddingBottom: 12,
      marginBottom: 14,
      borderBottomWidth: 2,
      borderBottomColor: theme.pdfHeaderBg,
    },
    photo: {
      width: 58,
      height: 58,
      borderRadius: 29,
      objectFit: "cover",
      borderWidth: 2,
      borderColor: theme.pdfAccentColor,
      marginBottom: 8,
    },
    nameRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 6,
    },
    firstName: { fontSize: s(22), fontFamily: fontBold, color: "#0f172a", textTransform: "uppercase", letterSpacing: 1 },
    lastName: { fontSize: s(22), fontFamily: fontBold, color: theme.pdfAccentColor, textTransform: "uppercase", letterSpacing: 1 },
    jobTitle: {
      fontSize: s(10.5),
      fontFamily: fontBold,
      color: theme.pdfAccentColor,
      textTransform: "uppercase",
      letterSpacing: 1.4,
      marginTop: 4,
      textAlign: "center",
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
      marginTop: 8,
    },
    contactItem: { fontSize: s(9.2), color: "#475569" },
    section: { marginBottom: sp.sectionMb },
    sectionTitle: {
      fontSize: s(10.5),
      fontFamily: fontBold,
      color: theme.pdfHeaderBg,
      textTransform: "uppercase",
      letterSpacing: 1.3,
      paddingBottom: 4,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#cbd5e1",
    },
    summaryText: { fontSize: s(10), lineHeight: 1.58, color: "#334155" },
    expItem: { marginBottom: sp.itemMb },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    expPosition: { fontSize: s(11), fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    expDate: { fontSize: s(9), fontFamily: fontBold, color: theme.pdfAccentColor },
    expCompany: { fontSize: s(9.5), fontFamily: fontBold, color: "#475569", marginTop: 1.5, marginBottom: 3 },
    expDesc: { fontSize: s(9.8), lineHeight: 1.54, color: "#334155" },
    eduItem: { marginBottom: 9, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
    eduLeft: { flex: 1, marginRight: 8 },
    eduDegree: { fontSize: s(10.5), fontFamily: fontBold, color: "#0f172a" },
    eduInstitution: { fontSize: s(9.2), color: "#475569", marginTop: 1.5 },
    eduDate: { fontSize: s(9), fontFamily: fontBold, color: "#64748b" },
    gridRow: { flexDirection: "row", gap: 20 },
    gridCol: { flex: 1 },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    skillChip: {
      fontSize: s(8.8),
      fontFamily: fontBold,
      color: "#1e293b",
      backgroundColor: theme.accentBg,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 3,
    },
    metaLine: { fontSize: s(9.5), color: "#334155", marginBottom: 4, lineHeight: 1.4 },
    metaBold: { fontFamily: fontBold, color: "#0f172a" },
    watermarkFooter: {
      position: "absolute",
      bottom: 6,
      left: 0,
      right: 0,
      paddingVertical: 3,
      backgroundColor: "#ffffff",
      borderTopWidth: 0.5,
      borderTopColor: "#e2e8f0",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    watermarkText: { fontSize: 7.5, color: "#94a3b8", fontFamily: fontBase, textAlign: "center" },
    watermarkBrand: { fontFamily: fontBold, color: "#6366f1" },
  });

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = Boolean(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin);

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {personalInfo.photoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={personalInfo.photoUrl} style={styles.photo} />
          ) : null}
          {hasName && (
            <View style={styles.nameRow}>
              {personalInfo.firstName ? <Text style={styles.firstName}>{personalInfo.firstName}</Text> : null}
              {personalInfo.lastName ? <Text style={styles.lastName}>{personalInfo.lastName}</Text> : null}
            </View>
          )}
          {personalInfo.title ? (
            <Text style={hasName ? styles.jobTitle : styles.firstName}>{personalInfo.title}</Text>
          ) : null}
          {hasContact && (
            <View style={styles.contactRow}>
              {personalInfo.location ? <Text style={styles.contactItem}>{personalInfo.location}</Text> : null}
              {personalInfo.phone ? <Text style={styles.contactItem}>• {personalInfo.phone}</Text> : null}
              {personalInfo.email ? <Text style={styles.contactItem}>• {personalInfo.email}</Text> : null}
              {personalInfo.linkedin ? <Text style={styles.contactItem}>• {personalInfo.linkedin}</Text> : null}
            </View>
          )}
        </View>

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synthèse Exécutive</Text>
            <Text style={styles.summaryText}>{normalizeCvText(summary)}</Text>
          </View>
        ) : null}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={25}>Parcours Professionnel &amp; Mandats</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.expItem} wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expPosition}>{exp.position}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate}{exp.endDate || exp.current ? ` — ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                  </Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.description ? <Text style={styles.expDesc}>{normalizeCvText(exp.description)}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={20}>Formation Académique &amp; Diplômes</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.eduItem} wrap={false}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduDegree}>
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
                </View>
                <Text style={styles.eduDate}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {(skills.length > 0 || languages.length > 0 || certifications.length > 0) && (
          <View style={styles.gridRow} wrap={false}>
            {skills.length > 0 && (
              <View style={styles.gridCol}>
                <Text style={styles.sectionTitle}>Domaines d&apos;Expertise</Text>
                <View style={styles.skillsWrap}>
                  {skills.map((sk, i) => (
                    <Text key={i} style={styles.skillChip}>{sk}</Text>
                  ))}
                </View>
              </View>
            )}
            {(languages.length > 0 || certifications.length > 0) && (
              <View style={styles.gridCol}>
                {languages.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.sectionTitle}>Langues</Text>
                    <Text style={styles.metaLine}>
                      {languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("   ·   ")}
                    </Text>
                  </View>
                )}
                {certifications.length > 0 && (
                  <View>
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {certifications.map((c) => (
                      <Text key={c.id} style={styles.metaLine}>
                        <Text style={styles.metaBold}>{c.name}</Text>
                        {c.issuer ? ` · ${c.issuer}` : ""}
                        {c.date ? ` (${c.date})` : ""}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={[styles.section, { marginTop: 12 }]}>
            <Text style={styles.sectionTitle}>Projets &amp; Réalisations</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 8 }} wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.eduDegree}>{proj.name}</Text>
                  {proj.link ? <Link src={proj.link} style={{ fontSize: s(8.8), color: theme.pdfAccentColor }}>Voir ↗</Link> : null}
                </View>
                {proj.description ? <Text style={styles.expDesc}>{normalizeCvText(proj.description)}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {showWatermark && (
          <View style={styles.watermarkFooter} fixed>
            <Text style={styles.watermarkText}>
              Créé avec <Text style={styles.watermarkBrand}>AuthentiCV.app</Text> • Créez votre CV gratuitement sur www.authenticv.app
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

/* ==========================================================================
   ARCHITECTURE 5 : SPLIT PDF (Bicolonne Inversé / Commercial B2B & Campus)
   ========================================================================== */
export function CvDocumentSplit({ cvData, showWatermark = false }: Props) {
  const {
    personalInfo, summary, experiences, education,
    skills, projects, languages, certifications, designSettings,
  } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "emerald");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";
  const sp = PDF_SPACING[designSettings?.spacing ?? "normal"];
  const s = (pt: number) => Number((pt * sp.scale).toFixed(2));

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      fontFamily: fontBase,
      fontSize: s(10),
      color: "#1e293b",
      paddingHorizontal: sp.pagePadH,
      paddingTop: sp.pagePadV,
      paddingBottom: sp.pagePadV,
    },
    header: {
      paddingBottom: 14,
      marginBottom: 14,
      borderBottomWidth: 2,
      borderBottomColor: theme.pdfAccentColor,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
    },
    headerLeft: {
      flex: 1,
      borderLeftWidth: 4,
      borderLeftColor: theme.pdfAccentColor,
      paddingLeft: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    photo: {
      width: 58,
      height: 58,
      borderRadius: 10,
      objectFit: "cover",
      borderWidth: 1.5,
      borderColor: theme.pdfAccentColor,
    },
    nameRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    firstName: { fontSize: s(21), fontFamily: fontBold, color: "#0f172a" },
    lastName: { fontSize: s(21), fontFamily: fontBold, color: theme.pdfAccentColor },
    jobTitle: {
      fontSize: s(10.5),
      fontFamily: fontBold,
      color: theme.pdfHeaderBg,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      marginTop: 3,
    },
    contactCard: {
      backgroundColor: theme.accentBg,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 7,
      minWidth: 160,
    },
    contactItem: { fontSize: s(8.8), color: "#334155", marginBottom: 2.5 },
    body: { flexDirection: "row", flex: 1, gap: 16 },
    main: {
      flex: 1,
      paddingTop: 2,
      paddingBottom: 4,
    },
    section: { marginBottom: sp.sectionMb },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 9 },
    sectionBar: { width: 4, height: 12, backgroundColor: theme.pdfAccentColor, borderRadius: 1 },
    sectionTitle: {
      fontSize: s(10.8),
      fontFamily: fontBold,
      color: theme.pdfHeaderBg,
      textTransform: "uppercase",
      letterSpacing: 0.9,
    },
    summaryText: { fontSize: s(10), lineHeight: 1.58, color: "#334155" },
    expItem: {
      marginBottom: sp.itemMb,
      paddingBottom: 8,
      borderBottomWidth: 0.75,
      borderBottomColor: "#f1f5f9",
    },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expPosition: { fontSize: s(11), fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 6 },
    expDateBadge: {
      fontSize: s(8.5),
      fontFamily: fontBold,
      color: theme.pdfAccentColor,
      backgroundColor: theme.accentBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    expCompany: { fontSize: s(9.5), fontFamily: fontBold, color: theme.pdfAccentColor, marginTop: 2, marginBottom: 3.5 },
    expDesc: { fontSize: s(9.8), lineHeight: 1.52, color: "#334155" },
    rightSidebar: {
      width: 178,
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 6,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    sideSection: { marginBottom: sp.sectionMb },
    sideTitle: {
      fontSize: s(9.5),
      fontFamily: fontBold,
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: 0.9,
      paddingBottom: 4,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#cbd5e1",
    },
    eduCard: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 5,
      padding: 7,
      marginBottom: 7,
    },
    eduDegree: { fontSize: s(9.8), fontFamily: fontBold, color: "#0f172a", lineHeight: 1.3 },
    eduField: { fontSize: s(8.8), fontFamily: fontBold, color: theme.pdfAccentColor, marginTop: 1.5 },
    eduInst: { fontSize: s(8.8), color: "#475569", marginTop: 1.5 },
    eduDate: { fontSize: s(8.2), color: "#64748b", marginTop: 2 },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4.5 },
    skillChip: {
      fontSize: s(8.8),
      fontFamily: fontBold,
      color: "#0f172a",
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#cbd5e1",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
    },
    langRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 4,
      paddingHorizontal: 7,
      paddingVertical: 4,
      marginBottom: 5,
    },
    langName: { fontSize: s(9.2), fontFamily: fontBold, color: "#1e293b" },
    langLevel: { fontSize: s(8.8), fontFamily: fontBold, color: theme.pdfAccentColor },
    watermarkFooter: {
      position: "absolute",
      bottom: 6,
      left: 0,
      right: 0,
      paddingVertical: 3,
      backgroundColor: "#ffffff",
      borderTopWidth: 0.5,
      borderTopColor: "#e2e8f0",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    watermarkText: { fontSize: 7.5, color: "#94a3b8", fontFamily: fontBase, textAlign: "center" },
    watermarkBrand: { fontFamily: fontBold, color: "#6366f1" },
  });

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = Boolean(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin);

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {personalInfo.photoUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            ) : null}
            <View style={{ flex: 1 }}>
              {hasName && (
                <View style={styles.nameRow}>
                  {personalInfo.firstName ? <Text style={styles.firstName}>{personalInfo.firstName}</Text> : null}
                  {personalInfo.lastName ? <Text style={styles.lastName}>{personalInfo.lastName}</Text> : null}
                </View>
              )}
              {personalInfo.title ? (
                <Text style={hasName ? styles.jobTitle : styles.firstName}>{personalInfo.title}</Text>
              ) : null}
            </View>
          </View>
          {hasContact && (
            <View style={styles.contactCard}>
              {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
              {personalInfo.phone ? <Text style={styles.contactItem}>{personalInfo.phone}</Text> : null}
              {personalInfo.location ? <Text style={styles.contactItem}>{personalInfo.location}</Text> : null}
              {personalInfo.linkedin ? <Text style={styles.contactItem}>{personalInfo.linkedin}</Text> : null}
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.main}>
            {summary ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionBar} />
                  <Text style={styles.sectionTitle}>Profil &amp; Proposition de Valeur</Text>
                </View>
                <Text style={styles.summaryText}>{normalizeCvText(summary)}</Text>
              </View>
            ) : null}

            {experiences.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader} minPresenceAhead={25}>
                  <View style={styles.sectionBar} />
                  <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                </View>
                {experiences.map((exp) => (
                  <View key={exp.id} style={styles.expItem} wrap={false}>
                    <View style={styles.expHeaderRow}>
                      <Text style={styles.expPosition}>{exp.position}</Text>
                      <Text style={styles.expDateBadge}>
                        {exp.startDate}{exp.endDate || exp.current ? ` – ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                      </Text>
                    </View>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                    {exp.description ? <Text style={styles.expDesc}>{normalizeCvText(exp.description)}</Text> : null}
                  </View>
                ))}
              </View>
            )}

            {projects && projects.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader} minPresenceAhead={20}>
                  <View style={styles.sectionBar} />
                  <Text style={styles.sectionTitle}>Projets &amp; Réalisations</Text>
                </View>
                {projects.map((proj) => (
                  <View key={proj.id} style={styles.eduCard} wrap={false}>
                    <View style={styles.expHeaderRow}>
                      <Text style={styles.eduDegree}>{proj.name}</Text>
                      {proj.link ? <Link src={proj.link} style={{ fontSize: s(8.5), color: theme.pdfAccentColor }}>Voir ↗</Link> : null}
                    </View>
                    {proj.description ? <Text style={[styles.expDesc, { marginTop: 3 }]}>{normalizeCvText(proj.description)}</Text> : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.rightSidebar}>
            {education.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideTitle}>Formation</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={styles.eduCard} wrap={false}>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    {edu.field ? <Text style={styles.eduField}>{edu.field}</Text> : null}
                    <Text style={styles.eduInst}>{edu.institution}</Text>
                    <Text style={styles.eduDate}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</Text>
                  </View>
                ))}
              </View>
            )}

            {skills.length > 0 && (
              <View style={styles.sideSection} wrap={false}>
                <Text style={styles.sideTitle}>Compétences Clés</Text>
                <View style={styles.skillsWrap}>
                  {skills.map((skill, i) => (
                    <Text key={i} style={styles.skillChip}>{skill}</Text>
                  ))}
                </View>
              </View>
            )}

            {languages && languages.length > 0 && (
              <View style={styles.sideSection} wrap={false}>
                <Text style={styles.sideTitle}>Langues</Text>
                {languages.map((lang) => (
                  <View key={lang.id} style={styles.langRow}>
                    <Text style={styles.langName}>{lang.name}</Text>
                    {lang.level ? <Text style={styles.langLevel}>{lang.level}</Text> : null}
                  </View>
                ))}
              </View>
            )}

            {certifications && certifications.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideTitle}>Certifications</Text>
                {certifications.map((cert) => (
                  <View key={cert.id} style={styles.eduCard} wrap={false}>
                    <Text style={styles.eduDegree}>{cert.name}</Text>
                    {cert.issuer ? <Text style={styles.eduInst}>{cert.issuer}</Text> : null}
                    {cert.date ? <Text style={styles.eduDate}>{cert.date}</Text> : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {showWatermark && (
          <View style={styles.watermarkFooter} fixed>
            <Text style={styles.watermarkText}>
              Créé avec <Text style={styles.watermarkBrand}>AuthentiCV.app</Text> • Créez votre CV gratuitement sur www.authenticv.app
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

/* ==========================================================================
   ARCHITECTURE 6 : COMPACT-GRID PDF (Ingénierie, BTP, HSE & Projets)
   ========================================================================== */
export function CvDocumentCompactGrid({ cvData, showWatermark = false }: Props) {
  const {
    personalInfo, summary, experiences, education,
    skills, projects, languages, certifications, designSettings,
  } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "amber");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";
  const sp = PDF_SPACING[designSettings?.spacing ?? "normal"];
  const s = (pt: number) => Number((pt * sp.scale).toFixed(2));

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      fontFamily: fontBase,
      fontSize: s(10),
      color: "#1e293b",
      paddingTop: sp.pagePadV,
      paddingBottom: sp.pagePadV,
    },
    header: {
      backgroundColor: theme.pdfHeaderBg,
      marginTop: -sp.pagePadV,
      paddingTop: sp.pagePadV,
      paddingBottom: sp.headerPadV - 2,
      paddingHorizontal: sp.pagePadH,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
    photo: {
      width: 58,
      height: 58,
      borderRadius: 10,
      objectFit: "cover",
      borderWidth: 2,
      borderColor: "rgba(255,255,255,0.3)",
    },
    nameRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    firstName: { fontSize: s(21), fontFamily: fontBold, color: "#ffffff" },
    lastName: { fontSize: s(21), fontFamily: fontBold, color: theme.accentLight },
    jobTitle: {
      fontSize: s(10.5),
      fontFamily: fontBold,
      color: theme.accentLight,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      marginTop: 3,
    },
    contactBox: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 7,
      minWidth: 165,
    },
    contactItem: { fontSize: s(8.8), color: "rgba(255,255,255,0.92)", marginBottom: 2.5 },
    body: {
      paddingHorizontal: sp.pagePadH,
      paddingTop: sp.mainPadV,
      paddingBottom: 6,
      flex: 1,
    },
    callout: {
      backgroundColor: theme.accentBg,
      borderLeftWidth: 3.5,
      borderLeftColor: theme.pdfAccentColor,
      borderRadius: 5,
      padding: 10,
      marginBottom: sp.sectionMb,
    },
    calloutTitle: {
      fontSize: s(9),
      fontFamily: fontBold,
      color: theme.pdfHeaderBg,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 3,
    },
    summaryText: { fontSize: s(9.8), lineHeight: 1.54, color: "#334155" },
    section: { marginBottom: sp.sectionMb },
    sectionTitle: {
      fontSize: s(10.5),
      fontFamily: fontBold,
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: 1,
      paddingBottom: 4,
      marginBottom: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: "#e2e8f0",
    },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    skillChip: {
      fontSize: s(8.8),
      fontFamily: fontBold,
      color: theme.pdfHeaderBg,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: theme.pdfAccentColor,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 4,
    },
    expCard: {
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 6,
      padding: 10,
      marginBottom: 8,
    },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 },
    expPosition: { fontSize: s(10.8), fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    expCompany: { fontSize: s(9.5), fontFamily: fontBold, color: theme.pdfAccentColor, marginBottom: 3 },
    expDateBadge: {
      fontSize: s(8.5),
      fontFamily: fontBold,
      color: "#334155",
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#cbd5e1",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    expDesc: { fontSize: s(9.6), lineHeight: 1.52, color: "#334155" },
    gridRow: { flexDirection: "row", gap: 18 },
    gridCol: { flex: 1 },
    eduCard: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 5,
      padding: 8,
      marginBottom: 7,
    },
    eduDegree: { fontSize: s(10), fontFamily: fontBold, color: "#0f172a" },
    eduField: { fontSize: s(9), fontFamily: fontBold, color: theme.pdfAccentColor, marginTop: 1.5 },
    eduMetaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 3 },
    eduInst: { fontSize: s(8.8), color: "#475569" },
    eduDate: { fontSize: s(8.5), color: "#64748b" },
    watermarkFooter: {
      position: "absolute",
      bottom: 6,
      left: 0,
      right: 0,
      paddingVertical: 3,
      backgroundColor: "#ffffff",
      borderTopWidth: 0.5,
      borderTopColor: "#e2e8f0",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    watermarkText: { fontSize: 7.5, color: "#94a3b8", fontFamily: fontBase, textAlign: "center" },
    watermarkBrand: { fontFamily: fontBold, color: "#6366f1" },
  });

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = Boolean(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin);

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {personalInfo.photoUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            ) : null}
            <View style={{ flex: 1 }}>
              {hasName && (
                <View style={styles.nameRow}>
                  {personalInfo.firstName ? <Text style={styles.firstName}>{personalInfo.firstName}</Text> : null}
                  {personalInfo.lastName ? <Text style={styles.lastName}>{personalInfo.lastName}</Text> : null}
                </View>
              )}
              {personalInfo.title ? (
                <Text style={hasName ? styles.jobTitle : styles.firstName}>{personalInfo.title}</Text>
              ) : null}
            </View>
          </View>
          {hasContact && (
            <View style={styles.contactBox}>
              {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
              {personalInfo.phone ? <Text style={styles.contactItem}>{personalInfo.phone}</Text> : null}
              {personalInfo.location ? <Text style={styles.contactItem}>{personalInfo.location}</Text> : null}
              {personalInfo.linkedin ? <Text style={styles.contactItem}>{personalInfo.linkedin}</Text> : null}
            </View>
          )}
        </View>

        <View style={styles.body}>
          {summary ? (
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>Profil Technique &amp; Synthèse</Text>
              <Text style={styles.summaryText}>{normalizeCvText(summary)}</Text>
            </View>
          ) : null}

          {skills.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Compétences &amp; Outils Techniques</Text>
              <View style={styles.skillsWrap}>
                {skills.map((skill, i) => (
                  <Text key={i} style={styles.skillChip}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {experiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} minPresenceAhead={25}>Expériences &amp; Chantiers Réalisés</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={styles.expCard} wrap={false}>
                  <View style={styles.expHeaderRow}>
                    <Text style={styles.expPosition}>{exp.position}</Text>
                    <Text style={styles.expDateBadge}>
                      {exp.startDate}{exp.endDate || exp.current ? ` – ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                    </Text>
                  </View>
                  {exp.company ? <Text style={styles.expCompany}>{exp.company}</Text> : null}
                  {exp.description ? <Text style={styles.expDesc}>{normalizeCvText(exp.description)}</Text> : null}
                </View>
              ))}
            </View>
          )}

          <View style={styles.gridRow} wrap={false}>
            {education.length > 0 && (
              <View style={styles.gridCol}>
                <Text style={styles.sectionTitle}>Formation &amp; Diplômes</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={styles.eduCard}>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    {edu.field ? <Text style={styles.eduField}>{edu.field}</Text> : null}
                    <View style={styles.eduMetaRow}>
                      <Text style={styles.eduInst}>{edu.institution}</Text>
                      <Text style={styles.eduDate}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {(certifications.length > 0 || languages.length > 0 || projects.length > 0) && (
              <View style={styles.gridCol}>
                {certifications.length > 0 && (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.sectionTitle}>Habilitations &amp; Certifications</Text>
                    {certifications.map((cert) => (
                      <View key={cert.id} style={styles.eduCard}>
                        <Text style={styles.eduDegree}>{cert.name}</Text>
                        <View style={styles.eduMetaRow}>
                          {cert.issuer ? <Text style={styles.eduInst}>{cert.issuer}</Text> : null}
                          {cert.date ? <Text style={styles.eduDate}>{cert.date}</Text> : null}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {languages.length > 0 && (
                  <View>
                    <Text style={styles.sectionTitle}>Langues</Text>
                    <View style={styles.skillsWrap}>
                      {languages.map((lang) => (
                        <Text key={lang.id} style={styles.expDateBadge}>
                          {lang.name}{lang.level ? ` · ${lang.level}` : ""}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {showWatermark && (
          <View style={styles.watermarkFooter} fixed>
            <Text style={styles.watermarkText}>
              Créé avec <Text style={styles.watermarkBrand}>AuthentiCV.app</Text> • Créez votre CV gratuitement sur www.authenticv.app
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

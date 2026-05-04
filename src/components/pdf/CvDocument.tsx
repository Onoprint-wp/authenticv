"use client";

import {
  Document, Page, Text, View, Image, StyleSheet, Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

// ─── Dynamic styles ───────────────────────────────────────────────────────────

function createStyles(
  accent: string,
  accentLight: string,
  accentBg: string,
  headerBg: string,
  fontBase: string,
  fontBold: string,
) {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      fontFamily: fontBase,
      fontSize: 10,
      color: "#1e293b",
    },

    // ── Header ───────────────────────────────────────────────
    header: {
      backgroundColor: headerBg,
      paddingHorizontal: 36,
      paddingVertical: 28,
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    photo: {
      width: 74,
      height: 74,
      borderRadius: 37,
      objectFit: "cover",
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.25)",
    },
    headerInfo: { flex: 1 },
    nameRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 5 },
    firstName: { fontSize: 24, fontFamily: fontBold, color: "#ffffff" },
    lastName: { fontSize: 24, fontFamily: fontBold, color: accentLight },
    jobTitle: {
      fontSize: 11,
      color: "rgba(255,255,255,0.82)",
      marginTop: 4,
      letterSpacing: 0.5,
      fontFamily: fontBase,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10 },
    contactItem: { fontSize: 8.5, color: "rgba(255,255,255,0.78)" },

    // ── Body (2 columns) ──────────────────────────────────────
    body: { flexDirection: "row", flex: 1 },

    // ── Main column ───────────────────────────────────────────
    main: {
      flex: 1,
      paddingHorizontal: 26,
      paddingVertical: 24,
      borderRightWidth: 1,
      borderRightColor: "#f1f5f9",
    },
    mainSection: { marginBottom: 20 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 10 },
    sectionDot: { width: 8, height: 8, borderRadius: 2, backgroundColor: accent },
    sectionTitle: {
      fontSize: 10.5,
      fontFamily: fontBold,
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    summaryText: { fontSize: 9.5, lineHeight: 1.6, color: "#475569" },

    // ── Experience timeline ───────────────────────────────────
    expItem: { flexDirection: "row", gap: 10, marginBottom: 10 },
    timelineCol: { width: 14, alignItems: "center", paddingTop: 3 },
    timelineDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: accent,
      backgroundColor: "#ffffff",
    },
    timelineLine: { flex: 1, width: 1, backgroundColor: "#e2e8f0", marginTop: 3 },
    expContent: { flex: 1, paddingBottom: 4 },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expPosition: { fontSize: 10.5, fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    expDateBadge: {
      fontSize: 7.5,
      color: accent,
      backgroundColor: accentBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
    },
    expCompany: { fontSize: 9, color: "#64748b", marginTop: 2, marginBottom: 3 },
    expDesc: { fontSize: 9, lineHeight: 1.5, color: "#475569" },

    // ── Projects ──────────────────────────────────────────────
    projItem: {
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#f1f5f9",
      borderRadius: 5,
      padding: 9,
      marginBottom: 8,
    },
    projHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 },
    projName: { fontSize: 10, fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 6 },
    projLink: { fontSize: 8, color: accent, textDecoration: "none" },
    projDesc: { fontSize: 9, lineHeight: 1.5, color: "#475569" },

    // ── Sidebar ───────────────────────────────────────────────
    sidebar: {
      width: 166,
      backgroundColor: "#f8fafc",
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    sideSection: { marginBottom: 18 },
    sideSectionTitle: {
      fontSize: 9.5,
      fontFamily: fontBold,
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 9,
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
    },

    // Skills
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    skillChip: {
      fontSize: 8,
      color: "#334155",
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
    },

    // Education
    eduItem: { marginBottom: 11 },
    eduDegree: { fontSize: 9.5, fontFamily: fontBold, color: "#0f172a", lineHeight: 1.3 },
    eduField: { fontSize: 8.5, color: accent, marginTop: 2 },
    eduInstitution: { fontSize: 8.5, color: "#64748b", marginTop: 1 },
    eduDate: { fontSize: 8, color: "#94a3b8", marginTop: 2 },

    // Languages
    langItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 7,
    },
    langName: { fontSize: 9.5, fontFamily: fontBold, color: "#334155" },
    langBadge: {
      fontSize: 7.5,
      color: accent,
      backgroundColor: accentBg,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
    },

    // Certifications
    certItem: { marginBottom: 10 },
    certName: { fontSize: 9.5, fontFamily: fontBold, color: "#0f172a", lineHeight: 1.3 },
    certIssuer: { fontSize: 8.5, color: "#64748b", marginTop: 1 },
    certDate: { fontSize: 8, color: "#94a3b8", marginTop: 2 },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CvDocumentProps {
  cvData: CvData;
}

export function CvDocument({ cvData }: CvDocumentProps) {
  const {
    personalInfo, summary, experiences, education,
    skills, projects, languages, certifications, designSettings,
  } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";

  const styles = createStyles(
    theme.pdfAccentColor,
    theme.accentLight,
    theme.accentBg,
    theme.pdfHeaderBg,
    fontBase,
    fontBold,
  );

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          {personalInfo.photoUrl
            // eslint-disable-next-line jsx-a11y/alt-text
            ? <Image src={personalInfo.photoUrl} style={styles.photo} />
            : null}

          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.firstName}>{personalInfo.firstName}</Text>
              <Text style={styles.lastName}>{personalInfo.lastName}</Text>
            </View>
            {personalInfo.title
              ? <Text style={styles.jobTitle}>{personalInfo.title.toUpperCase()}</Text>
              : null}
            {hasContact && (
              <View style={styles.contactRow}>
                {personalInfo.email
                  ? <Text style={styles.contactItem}>{personalInfo.email}</Text>
                  : null}
                {personalInfo.phone
                  ? <Text style={styles.contactItem}>· {personalInfo.phone}</Text>
                  : null}
                {personalInfo.location
                  ? <Text style={styles.contactItem}>· {personalInfo.location}</Text>
                  : null}
                {personalInfo.linkedin
                  ? <Text style={styles.contactItem}>· {personalInfo.linkedin}</Text>
                  : null}
              </View>
            )}
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>

          {/* Main column */}
          <View style={styles.main}>

            {summary ? (
              <View style={styles.mainSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Profil</Text>
                </View>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            ) : null}

            {experiences.length > 0 && (
              <View style={styles.mainSection}>
                <View style={styles.sectionHeader} minPresenceAhead={30}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                </View>
                {experiences.map((exp) => (
                  <View key={exp.id} style={styles.expItem} wrap={false}>
                    <View style={styles.timelineCol}>
                      <View style={styles.timelineDot} />
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.expContent}>
                      <View style={styles.expHeaderRow}>
                        <Text style={styles.expPosition}>{exp.position}</Text>
                        <Text style={styles.expDateBadge}>
                          {exp.startDate}{exp.endDate || exp.current ? ` - ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                        </Text>
                      </View>
                      <Text style={styles.expCompany}>{exp.company}</Text>
                      {exp.description
                        ? <Text style={styles.expDesc}>{exp.description}</Text>
                        : null}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {projects && projects.length > 0 && (
              <View style={styles.mainSection}>
                <View style={styles.sectionHeader} minPresenceAhead={30}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Projets</Text>
                </View>
                {projects.map((proj) => (
                  <View key={proj.id} style={styles.projItem} wrap={false}>
                    <View style={styles.projHeaderRow}>
                      <Text style={styles.projName}>{proj.name}</Text>
                      {proj.link
                        ? <Link src={proj.link} style={styles.projLink}>Voir ↗</Link>
                        : null}
                    </View>
                    {proj.description
                      ? <Text style={styles.projDesc}>{proj.description}</Text>
                      : null}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Sidebar */}
          <View style={styles.sidebar}>

            {skills.length > 0 && (
              <View style={styles.sideSection} wrap={false}>
                <Text style={styles.sideSectionTitle}>Compétences</Text>
                <View style={styles.skillsWrap}>
                  {skills.map((skill, i) => (
                    <Text key={i} style={styles.skillChip}>{skill}</Text>
                  ))}
                </View>
              </View>
            )}

            {education.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideSectionTitle} minPresenceAhead={20}>Éducation</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={styles.eduItem} wrap={false}>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    {edu.field
                      ? <Text style={styles.eduField}>{edu.field}</Text>
                      : null}
                    <Text style={styles.eduInstitution}>{edu.institution}</Text>
                    <Text style={styles.eduDate}>
                      {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {languages && languages.length > 0 && (
              <View style={styles.sideSection} wrap={false}>
                <Text style={styles.sideSectionTitle}>Langues</Text>
                {languages.map((lang) => (
                  <View key={lang.id} style={styles.langItem}>
                    <Text style={styles.langName}>{lang.name}</Text>
                    {lang.level
                      ? <Text style={styles.langBadge}>{lang.level}</Text>
                      : null}
                  </View>
                ))}
              </View>
            )}

            {certifications && certifications.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideSectionTitle} minPresenceAhead={20}>Certifications</Text>
                {certifications.map((cert) => (
                  <View key={cert.id} style={styles.certItem} wrap={false}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certIssuer}>{cert.issuer}</Text>
                    {cert.date
                      ? <Text style={styles.certDate}>{cert.date}</Text>
                      : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

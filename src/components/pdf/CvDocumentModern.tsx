import {
  Document, Page, Text, View, Image, StyleSheet, Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

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
      flexDirection: "row",
      backgroundColor: "#ffffff",
      fontFamily: fontBase,
      fontSize: 10,
      color: "#1e293b",
    },

    // ── Sidebar ───────────────────────────────────────────────
    sidebar: {
      width: 175,
      backgroundColor: headerBg,
      paddingHorizontal: 16,
      paddingVertical: 24,
      flexDirection: "column",
      gap: 16,
    },
    photoWrap: { alignItems: "center", marginBottom: 4 },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      objectFit: "cover",
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.2)",
    },
    nameBlock: { alignItems: "center" },
    firstName: { fontSize: 13, fontFamily: fontBold, color: "#ffffff", textAlign: "center" },
    lastName: { fontSize: 13, fontFamily: fontBold, color: accentLight, textAlign: "center" },
    jobTitle: {
      fontSize: 8,
      color: "rgba(255,255,255,0.6)",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 3,
    },

    sideLabel: {
      fontSize: 7.5,
      fontFamily: fontBold,
      color: "rgba(255,255,255,0.45)",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      paddingBottom: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: "rgba(255,255,255,0.2)",
      marginBottom: 6,
    },
    contactItem: {
      fontSize: 8.5,
      color: "rgba(255,255,255,0.8)",
      marginBottom: 4,
    },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    skillChip: {
      fontSize: 7.5,
      color: "rgba(255,255,255,0.85)",
      borderWidth: 0.5,
      borderColor: "rgba(255,255,255,0.25)",
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
    },
    langItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    langName: { fontSize: 8.5, fontFamily: fontBold, color: "rgba(255,255,255,0.9)" },
    langLevel: { fontSize: 8, color: "rgba(255,255,255,0.5)" },
    certItem: { marginBottom: 8 },
    certName: { fontSize: 8.5, fontFamily: fontBold, color: "rgba(255,255,255,0.9)", lineHeight: 1.3 },
    certIssuer: { fontSize: 7.5, color: "rgba(255,255,255,0.55)", marginTop: 1 },
    certDate: { fontSize: 7, color: "rgba(255,255,255,0.4)", marginTop: 1 },

    // ── Main content ──────────────────────────────────────────
    main: {
      flex: 1,
      paddingHorizontal: 22,
      paddingVertical: 24,
    },
    mainSection: { marginBottom: 18 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
    sectionDot: { width: 7, height: 7, borderRadius: 1, backgroundColor: accent },
    sectionTitle: {
      fontSize: 9.5,
      fontFamily: fontBold,
      color: "#0f172a",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    summaryText: { fontSize: 9.5, lineHeight: 1.6, color: "#475569" },

    expItem: { flexDirection: "row", gap: 8, marginBottom: 10 },
    timelineCol: { width: 12, alignItems: "center", paddingTop: 3 },
    timelineDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      borderWidth: 2,
      borderColor: accent,
      backgroundColor: "#ffffff",
    },
    timelineLine: { flex: 1, width: 1, backgroundColor: "#e2e8f0", marginTop: 2 },
    expContent: { flex: 1 },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expPosition: { fontSize: 10, fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 6 },
    expDateBadge: {
      fontSize: 7.5,
      color: accent,
      backgroundColor: accentBg,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 8,
    },
    expCompany: { fontSize: 8.5, color: accent, marginTop: 2, marginBottom: 2 },
    expDesc: { fontSize: 8.5, lineHeight: 1.5, color: "#475569" },

    eduItem: { marginBottom: 10 },
    eduHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    eduDegree: { fontSize: 9.5, fontFamily: fontBold, color: "#0f172a", flex: 1 },
    eduDate: { fontSize: 8, color: "#94a3b8" },
    eduField: { fontSize: 8.5, color: accent, marginTop: 1 },
    eduInstitution: { fontSize: 8.5, color: "#64748b", marginTop: 1 },

    projItem: {
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#f1f5f9",
      borderRadius: 4,
      padding: 8,
      marginBottom: 7,
    },
    projHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 },
    projName: { fontSize: 9.5, fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 5 },
    projLink: { fontSize: 8, color: accent, textDecoration: "none" },
    projDesc: { fontSize: 8.5, lineHeight: 1.5, color: "#475569" },
  });
}

interface Props {
  cvData: CvData;
}

export function CvDocumentModern({ cvData }: Props) {
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

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>

        {/* ── Sidebar ── */}
        <View style={styles.sidebar}>
          {personalInfo.photoUrl && (
            <View style={styles.photoWrap}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            </View>
          )}

          <View style={styles.nameBlock}>
            <Text style={styles.firstName}>{personalInfo.firstName}</Text>
            <Text style={styles.lastName}>{personalInfo.lastName}</Text>
            {personalInfo.title
              ? <Text style={styles.jobTitle}>{personalInfo.title}</Text>
              : null}
          </View>

          {(personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin) && (
            <View>
              <Text style={styles.sideLabel}>Contact</Text>
              {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
              {personalInfo.phone ? <Text style={styles.contactItem}>{personalInfo.phone}</Text> : null}
              {personalInfo.location ? <Text style={styles.contactItem}>{personalInfo.location}</Text> : null}
              {personalInfo.linkedin ? <Text style={styles.contactItem}>{personalInfo.linkedin}</Text> : null}
            </View>
          )}

          {skills.length > 0 && (
            <View>
              <Text style={styles.sideLabel}>Compétences</Text>
              <View style={styles.skillsWrap}>
                {skills.map((skill, i) => (
                  <Text key={i} style={styles.skillChip}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {languages && languages.length > 0 && (
            <View>
              <Text style={styles.sideLabel}>Langues</Text>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.langItem}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {lang.level ? <Text style={styles.langLevel}>{lang.level}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {certifications && certifications.length > 0 && (
            <View>
              <Text style={styles.sideLabel}>Certifications</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>{cert.issuer}</Text>
                  {cert.date ? <Text style={styles.certDate}>{cert.date}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Main ── */}
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
                    {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
                  </View>
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={styles.mainSection}>
              <View style={styles.sectionHeader} minPresenceAhead={30}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Formation</Text>
              </View>
              {education.map((edu) => (
                <View key={edu.id} style={styles.eduItem} wrap={false}>
                  <View style={styles.eduHeaderRow}>
                    <Text style={styles.eduDegree}>{edu.degree}</Text>
                    <Text style={styles.eduDate}>{edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ""}</Text>
                  </View>
                  {edu.field ? <Text style={styles.eduField}>{edu.field}</Text> : null}
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
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
                    {proj.link ? <Link src={proj.link} style={styles.projLink}>Voir ↗</Link> : null}
                  </View>
                  {proj.description ? <Text style={styles.projDesc}>{proj.description}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

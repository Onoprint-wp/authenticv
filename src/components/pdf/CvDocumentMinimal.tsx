import {
  Document, Page, Text, View, StyleSheet, Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

function createStyles(
  accent: string,
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
      paddingHorizontal: 44,
      paddingVertical: 40,
    },

    // ── Header ────────────────────────────────────────────────
    headerName: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "baseline",
      gap: 6,
      marginBottom: 4,
    },
    firstName: { fontSize: 26, fontFamily: fontBold, color: "#0f172a" },
    lastName: { fontSize: 26, fontFamily: fontBold, color: accent },
    jobTitle: {
      fontSize: 10,
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 4,
      marginBottom: 10,
    },
    accentBar: {
      width: 36,
      height: 2,
      backgroundColor: accent,
      borderRadius: 1,
      marginBottom: 10,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 4 },
    contactItem: { fontSize: 8.5, color: "#64748b" },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
      marginTop: 14,
      marginBottom: 20,
    },

    // ── Sections ──────────────────────────────────────────────
    section: { marginBottom: 18 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
    sectionBar: { width: 14, height: 1.5, backgroundColor: accent, borderRadius: 1 },
    sectionTitle: {
      fontSize: 8.5,
      fontFamily: fontBold,
      color: "#64748b",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    summaryText: { fontSize: 9.5, lineHeight: 1.7, color: "#475569" },

    // ── Experience ────────────────────────────────────────────
    expItem: { marginBottom: 12 },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expPosition: { fontSize: 10.5, fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    expDate: { fontSize: 8.5, color: "#94a3b8" },
    expCompany: { fontSize: 9, color: accent, marginTop: 2, marginBottom: 3 },
    expDesc: { fontSize: 9, lineHeight: 1.6, color: "#475569" },

    // ── Education ─────────────────────────────────────────────
    eduItem: { marginBottom: 10 },
    eduHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    eduDegree: { fontSize: 10, fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    eduDate: { fontSize: 8.5, color: "#94a3b8" },
    eduInstitution: { fontSize: 9, color: "#64748b", marginTop: 2 },

    // ── Skills ────────────────────────────────────────────────
    skillsText: { fontSize: 9.5, color: "#475569", lineHeight: 1.6 },

    // ── Languages ─────────────────────────────────────────────
    langText: { fontSize: 9.5, color: "#475569" },

    // ── Certifications ────────────────────────────────────────
    certRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 4, marginBottom: 6 },
    certName: { fontSize: 9.5, fontFamily: fontBold, color: "#0f172a" },
    certIssuer: { fontSize: 8.5, color: "#64748b" },
    certDate: { fontSize: 8, color: "#94a3b8" },

    // ── Projects ──────────────────────────────────────────────
    projItem: { marginBottom: 10 },
    projHeaderRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 3 },
    projName: { fontSize: 10, fontFamily: fontBold, color: "#0f172a" },
    projLink: { fontSize: 8, color: accent, textDecoration: "none" },
    projDesc: { fontSize: 9, lineHeight: 1.6, color: "#475569" },
  });
}

interface Props {
  cvData: CvData;
}

export function CvDocumentMinimal({ cvData }: Props) {
  const {
    personalInfo, summary, experiences, education,
    skills, projects, languages, certifications, designSettings,
  } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";

  const styles = createStyles(theme.pdfAccentColor, fontBase, fontBold);

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.headerName}>
          <Text style={styles.firstName}>{personalInfo.firstName}</Text>
          <Text style={styles.lastName}>{personalInfo.lastName}</Text>
        </View>

        {personalInfo.title
          ? <Text style={styles.jobTitle}>{personalInfo.title.toUpperCase()}</Text>
          : null}

        <View style={styles.accentBar} />

        {hasContact && (
          <View style={styles.contactRow}>
            {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
            {personalInfo.phone ? <Text style={styles.contactItem}>{personalInfo.phone}</Text> : null}
            {personalInfo.location ? <Text style={styles.contactItem}>{personalInfo.location}</Text> : null}
            {personalInfo.linkedin ? <Text style={styles.contactItem}>{personalInfo.linkedin}</Text> : null}
          </View>
        )}

        <View style={styles.divider} />

        {/* ── Sections ── */}

        {summary ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Profil</Text>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader} minPresenceAhead={20}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Expérience</Text>
            </View>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.expItem} wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expPosition}>{exp.position}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate}{exp.endDate || exp.current ? ` — ${exp.current ? "Aujourd'hui" : exp.endDate}` : ""}
                  </Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.description ? <Text style={styles.expDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Compétences</Text>
            </View>
            <Text style={styles.skillsText}>{skills.join("  ·  ")}</Text>
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader} minPresenceAhead={20}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Formation</Text>
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.eduItem} wrap={false}>
                <View style={styles.eduHeaderRow}>
                  <Text style={styles.eduDegree}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.eduDate}>{edu.startDate}{edu.endDate ? ` — ${edu.endDate}` : ""}</Text>
                </View>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Langues</Text>
            </View>
            <Text style={styles.langText}>
              {languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("  ·  ")}
            </Text>
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader} minPresenceAhead={20}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certRow} wrap={false}>
                <Text style={styles.certName}>{cert.name}</Text>
                {cert.issuer ? <Text style={styles.certIssuer}>— {cert.issuer}</Text> : null}
                {cert.date ? <Text style={styles.certDate}>· {cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader} minPresenceAhead={20}>
              <View style={styles.sectionBar} />
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
      </Page>
    </Document>
  );
}

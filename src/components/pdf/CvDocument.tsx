"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

// ─── Dynamic styles based on theme ───────────────────────────────────────────

function createStyles(accentColor: string, accentBg: string, fontBase: string, fontBold: string) {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      paddingTop: 40,
      paddingBottom: 40,
      paddingHorizontal: 48,
      fontFamily: fontBase,
      fontSize: 10,
      color: "#1a1a2e",
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: accentColor,
      paddingBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    profilePhoto: {
      width: 70,
      height: 70,
      borderRadius: 35,
      objectFit: "cover",
      borderWidth: 2,
      borderColor: accentBg,
    },
    headerContent: { flex: 1 },
    name: {
      fontSize: 28,
      fontFamily: fontBold,
      color: "#1a1a2e",
      letterSpacing: 1,
    },
    jobTitle: {
      fontSize: 13,
      color: accentColor,
      marginTop: 3,
      fontFamily: fontBase,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      gap: 12,
    },
    contactItem: { fontSize: 9, color: "#555" },
    section: { marginBottom: 16 },
    sectionTitle: {
      fontSize: 11,
      fontFamily: fontBold,
      color: accentColor,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 6,
      paddingBottom: 3,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    summaryText: { fontSize: 10, lineHeight: 1.6, color: "#374151" },
    expItem: { marginBottom: 10 },
    expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expPosition: { fontSize: 11, fontFamily: fontBold, color: "#1a1a2e" },
    expCompany: { fontSize: 10, color: accentColor, marginTop: 1 },
    expDate: { fontSize: 9, color: "#888", textAlign: "right" },
    expDescription: { fontSize: 9.5, lineHeight: 1.5, color: "#374151", marginTop: 4 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    skillChip: {
      backgroundColor: accentBg,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      fontSize: 9,
      color: accentColor,
      borderWidth: 1,
      borderColor: accentBg,
    },
    eduItem: { marginBottom: 8 },
    eduDegree: { fontSize: 10.5, fontFamily: fontBold, color: "#1a1a2e" },
    eduInstitution: { fontSize: 10, color: accentColor, marginTop: 1 },
    eduDate: { fontSize: 9, color: "#888", marginTop: 1 },
    projItem: { marginBottom: 10 },
    projName: { fontSize: 11, fontFamily: fontBold, color: "#1a1a2e" },
    projDesc: { fontSize: 9.5, lineHeight: 1.5, color: "#374151", marginTop: 4 },
    projLink: { fontSize: 9, color: accentColor, marginTop: 3, textDecoration: "none" },
    langRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    langItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    langName: { fontSize: 10, fontFamily: fontBold, color: "#1a1a2e" },
    langLevel: { fontSize: 9, color: accentColor, marginLeft: 4 },
    certItem: { marginBottom: 8 },
    certName: { fontSize: 10.5, fontFamily: fontBold, color: "#1a1a2e" },
    certIssuer: { fontSize: 10, color: accentColor, marginTop: 2 },
    certDate: { fontSize: 9, color: "#888", marginTop: 2 },
    emptyText: { fontSize: 10, color: "#9ca3af", fontStyle: "italic" },
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

interface CvDocumentProps {
  cvData: CvData;
}

export function CvDocument({ cvData }: CvDocumentProps) {
  const { personalInfo, summary, experiences, education, skills, projects, languages, certifications, designSettings } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";
  const styles = createStyles(theme.pdfAccentColor, theme.accentBg, fontBase, fontBold);

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom Complet";
  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {personalInfo.photoUrl ? <Image src={personalInfo.photoUrl} style={styles.profilePhoto} /> : null}
          <View style={styles.headerContent}>
            <Text style={styles.name}>{fullName}</Text>
            {personalInfo.title ? <Text style={styles.jobTitle}>{personalInfo.title}</Text> : null}
            {hasContact && (
              <View style={styles.contactRow}>
                {personalInfo.email ? <Text style={styles.contactItem}>{personalInfo.email}</Text> : null}
                {personalInfo.phone ? <Text style={styles.contactItem}>· {personalInfo.phone}</Text> : null}
                {personalInfo.location ? <Text style={styles.contactItem}>· {personalInfo.location}</Text> : null}
                {personalInfo.linkedin ? <Text style={styles.contactItem}>· {personalInfo.linkedin}</Text> : null}
              </View>
            )}
          </View>
        </View>

        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expériences Professionnelles</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <View>
                    <Text style={styles.expPosition}>{exp.position}</Text>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                  </View>
                  <Text style={styles.expDate}>
                    {exp.startDate}{exp.endDate || exp.current ? ` – ${exp.current ? "Présent" : exp.endDate}` : ""}
                  </Text>
                </View>
                {exp.description ? <Text style={styles.expDescription}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formation</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.eduItem}>
                <Text style={styles.eduDegree}>{edu.degree}{edu.field ? ` en ${edu.field}` : ""}</Text>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                <Text style={styles.eduDate}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences</Text>
            <View style={styles.skillsRow}>
              {skills.map((skill, i) => <Text key={i} style={styles.skillChip}>{skill}</Text>)}
            </View>
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projets</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projItem}>
                <Text style={styles.projName}>{proj.name}</Text>
                {proj.description ? <Text style={styles.projDesc}>{proj.description}</Text> : null}
                {proj.link ? <Link src={proj.link} style={styles.projLink}>{proj.link}</Link> : null}
              </View>
            ))}
          </View>
        )}

        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Langues</Text>
            <View style={styles.langRow}>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.langItem}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {lang.level ? <Text style={styles.langLevel}>({lang.level})</Text> : null}
                </View>
              ))}
            </View>
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
                {cert.date ? <Text style={styles.certDate}>{cert.date}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}

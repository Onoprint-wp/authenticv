"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a2e",
  },
  // Header
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#6366f1",
    paddingBottom: 14,
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 13,
    color: "#6366f1",
    marginTop: 3,
    fontFamily: "Helvetica",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 12,
  },
  contactItem: {
    fontSize: 9,
    color: "#555",
  },
  // Sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  // Summary
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#374151",
  },
  // Experience
  expItem: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expPosition: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  expCompany: {
    fontSize: 10,
    color: "#6366f1",
    marginTop: 1,
  },
  expDate: {
    fontSize: 9,
    color: "#888",
    textAlign: "right",
  },
  expDescription: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#374151",
    marginTop: 4,
  },
  // Skills
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillChip: {
    backgroundColor: "#eef2ff",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 9,
    color: "#4338ca",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  // Education
  eduItem: {
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  eduInstitution: {
    fontSize: 10,
    color: "#6366f1",
    marginTop: 1,
  },
  eduDate: {
    fontSize: 9,
    color: "#888",
    marginTop: 1,
  },
  // Projects
  projItem: {
    marginBottom: 10,
  },
  projName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  projDesc: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#374151",
    marginTop: 4,
  },
  projLink: {
    fontSize: 9,
    color: "#6366f1",
    marginTop: 3,
    textDecoration: "none",
  },
  // Languages
  langRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  langName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  langLevel: {
    fontSize: 9,
    color: "#6366f1",
    marginLeft: 4,
  },
  // Certifications
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  certIssuer: {
    fontSize: 10,
    color: "#6366f1",
    marginTop: 2,
  },
  certDate: {
    fontSize: 9,
    color: "#888",
    marginTop: 2,
  },
  // Empty state
  emptyText: {
    fontSize: 10,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});

// ─── Component ───────────────────────────────────────────────────────────────

interface CvDocumentProps {
  cvData: CvData;
}

export function CvDocument({ cvData }: CvDocumentProps) {
  const {
    personalInfo,
    summary,
    experiences,
    education,
    skills,
    projects,
    languages,
    certifications,
  } = cvData;

  const fullName =
    `${personalInfo.firstName} ${personalInfo.lastName}`.trim() ||
    "Votre Nom Complet";

  const hasContact =
    personalInfo.email ||
    personalInfo.phone ||
    personalInfo.location ||
    personalInfo.linkedin;

  return (
    <Document
      title={fullName}
      author={fullName}
      subject="Curriculum Vitae"
      creator="AuthentiCV"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          {personalInfo.title ? (
            <Text style={styles.jobTitle}>{personalInfo.title}</Text>
          ) : null}
          {hasContact && (
            <View style={styles.contactRow}>
              {personalInfo.email ? (
                <Text style={styles.contactItem}>{personalInfo.email}</Text>
              ) : null}
              {personalInfo.phone ? (
                <Text style={styles.contactItem}>· {personalInfo.phone}</Text>
              ) : null}
              {personalInfo.location ? (
                <Text style={styles.contactItem}>
                  · {personalInfo.location}
                </Text>
              ) : null}
              {personalInfo.linkedin ? (
                <Text style={styles.contactItem}>
                  · {personalInfo.linkedin}
                </Text>
              ) : null}
            </View>
          )}
        </View>

        {/* ── Summary ── */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profil</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* ── Experience ── */}
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
                    {exp.startDate}
                    {exp.endDate || exp.current
                      ? ` – ${exp.current ? "Présent" : exp.endDate}`
                      : ""}
                  </Text>
                </View>
                {exp.description ? (
                  <Text style={styles.expDescription}>{exp.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formation</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.eduItem}>
                <Text style={styles.eduDegree}>
                  {edu.degree} {edu.field ? `en ${edu.field}` : ""}
                </Text>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                <Text style={styles.eduDate}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences</Text>
            <View style={styles.skillsRow}>
              {skills.map((skill, i) => (
                <Text key={i} style={styles.skillChip}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ── Projects ── */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projets</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projItem}>
                <Text style={styles.projName}>{proj.name}</Text>
                {proj.description ? (
                  <Text style={styles.projDesc}>{proj.description}</Text>
                ) : null}
                {proj.link ? (
                  <Link src={proj.link} style={styles.projLink}>
                    {proj.link}
                  </Link>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* ── Languages ── */}
        {languages && languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Langues</Text>
            <View style={styles.langRow}>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.langItem}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {lang.level ? (
                    <Text style={styles.langLevel}>({lang.level})</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Certifications ── */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
                {cert.date ? (
                  <Text style={styles.certDate}>{cert.date}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {!summary &&
          experiences.length === 0 &&
          education.length === 0 &&
          skills.length === 0 &&
          (!projects || projects.length === 0) &&
          (!languages || languages.length === 0) &&
          (!certifications || certifications.length === 0) &&
          !personalInfo.firstName && (
            <View style={{ marginTop: 40, alignItems: "center" }}>
              <Text style={styles.emptyText}>
                Commencez à discuter avec votre coach IA pour construire votre CV...
              </Text>
            </View>
          )}
      </Page>
    </Document>
  );
}

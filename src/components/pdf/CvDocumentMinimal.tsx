import {
  Document, Page, Text, View, Image, StyleSheet, Link,
} from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme, PDF_SPACING, normalizeCvText } from "@/lib/themes";

function createStyles(
  accent: string,
  fontBase: string,
  fontBold: string,
  sp: (typeof PDF_SPACING)[keyof typeof PDF_SPACING],
) {
  const s = (pt: number) => Number((pt * sp.scale).toFixed(2));

  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      fontFamily: fontBase,
      fontSize: s(10),
      color: "#1e293b",
      paddingHorizontal: sp.pagePadH,
      paddingVertical: sp.pagePadV,
    },

    // ── Header ────────────────────────────────────────────────
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 16,
      marginBottom: 4,
    },
    headerTextCol: {
      flex: 1,
    },
    photo: {
      width: 62,
      height: 62,
      borderRadius: 31,
      objectFit: "cover",
      borderWidth: 1.5,
      borderColor: "#cbd5e1",
    },
    headerName: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "baseline",
      gap: 6,
      marginBottom: 4,
    },
    firstName: { fontSize: s(22), fontFamily: fontBold, color: "#0f172a" },
    lastName: { fontSize: s(22), fontFamily: fontBold, color: accent },
    jobTitle: {
      fontSize: s(10.5),
      fontFamily: fontBold,
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 3,
      marginBottom: 8,
    },
    accentBar: {
      width: 36,
      height: 2,
      backgroundColor: accent,
      borderRadius: 1,
      marginBottom: 10,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 4 },
    contactItem: { fontSize: s(9.2), color: "#475569" },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
      marginTop: 12,
      marginBottom: 16,
    },

    // ── Sections ──────────────────────────────────────────────
    section: { marginBottom: sp.sectionMb },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 9 },
    sectionBar: { width: 14, height: 1.5, backgroundColor: accent, borderRadius: 1 },
    sectionTitle: {
      fontSize: s(10),
      fontFamily: fontBold,
      color: "#334155",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    summaryText: { fontSize: s(10), lineHeight: 1.6, color: "#334155" },

    // ── Experience ────────────────────────────────────────────
    expItem: { marginBottom: sp.itemMb },
    expHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    expPosition: { fontSize: s(11), fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    expDate: { fontSize: s(9), fontFamily: fontBold, color: "#64748b" },
    expCompany: { fontSize: s(9.5), fontFamily: fontBold, color: accent, marginTop: 2, marginBottom: 3.5 },
    expDesc: { fontSize: s(9.8), lineHeight: 1.55, color: "#334155" },

    // ── Education ─────────────────────────────────────────────
    eduItem: { marginBottom: 10 },
    eduHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    eduDegree: { fontSize: s(10.5), fontFamily: fontBold, color: "#0f172a", flex: 1, marginRight: 8 },
    eduDate: { fontSize: s(9), color: "#64748b" },
    eduInstitution: { fontSize: s(9.5), color: "#475569", marginTop: 2 },

    // ── Skills ────────────────────────────────────────────────
    skillsText: { fontSize: s(9.8), color: "#334155", lineHeight: 1.58 },

    // ── Languages ─────────────────────────────────────────────
    langText: { fontSize: s(9.8), color: "#334155" },

    // ── Certifications ────────────────────────────────────────
    certRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", gap: 4, marginBottom: 6 },
    certName: { fontSize: s(10), fontFamily: fontBold, color: "#0f172a" },
    certIssuer: { fontSize: s(9.2), color: "#475569" },
    certDate: { fontSize: s(8.8), color: "#64748b" },

    // ── Projects ──────────────────────────────────────────────
    projItem: { marginBottom: 10 },
    projHeaderRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 3 },
    projName: { fontSize: s(10.5), fontFamily: fontBold, color: "#0f172a" },
    projLink: { fontSize: s(8.8), color: accent, textDecoration: "none" },
    projDesc: { fontSize: s(9.6), lineHeight: 1.55, color: "#334155" },

    // Watermark
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
    watermarkText: {
      fontSize: 7.5,
      color: "#94a3b8",
      fontFamily: fontBase,
      textAlign: "center",
    },
    watermarkBrand: {
      fontFamily: fontBold,
      color: "#6366f1",
    },
  });
}

interface Props {
  cvData: CvData;
  showWatermark?: boolean;
}

export function CvDocumentMinimal({ cvData, showWatermark = false }: Props) {
  const {
    personalInfo, summary, experiences, education,
    skills, projects, languages, certifications, designSettings,
  } = cvData;

  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";

  const sp = PDF_SPACING[designSettings?.spacing ?? "normal"];

  const styles = createStyles(theme.pdfAccentColor, fontBase, fontBold, sp);

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Votre Nom";
  const hasName = Boolean(personalInfo.firstName || personalInfo.lastName);
  const hasContact = personalInfo.email || personalInfo.phone || personalInfo.location || personalInfo.linkedin;

  return (
    <Document title={fullName} author={fullName} subject="Curriculum Vitae" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.headerRow}>
          {personalInfo.photoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={personalInfo.photoUrl} style={styles.photo} />
          ) : null}
          <View style={styles.headerTextCol}>
            {hasName && (
              <View style={styles.headerName}>
                {personalInfo.firstName ? <Text style={styles.firstName}>{personalInfo.firstName}</Text> : null}
                {personalInfo.lastName ? <Text style={styles.lastName}>{personalInfo.lastName}</Text> : null}
              </View>
            )}

            {personalInfo.title
              ? <Text style={hasName ? styles.jobTitle : styles.firstName}>{personalInfo.title.toUpperCase()}</Text>
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
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Sections ── */}

        {summary ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Profil</Text>
            </View>
            <Text style={styles.summaryText}>{normalizeCvText(summary)}</Text>
          </View>
        ) : null}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader} minPresenceAhead={20}>
              <View style={styles.sectionBar} />
              <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
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
                {exp.description ? <Text style={styles.expDesc}>{normalizeCvText(exp.description)}</Text> : null}
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
                {proj.description ? <Text style={styles.projDesc}>{normalizeCvText(proj.description)}</Text> : null}
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

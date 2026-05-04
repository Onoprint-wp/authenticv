"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CvData } from "@/store/useCvStore";
import { getTheme } from "@/lib/themes";

function createStyles(accentColor: string, fontBase: string, fontBold: string) {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      paddingTop: 52,
      paddingBottom: 52,
      paddingHorizontal: 60,
      fontFamily: fontBase,
      fontSize: 10.5,
      color: "#1a1a2e",
      lineHeight: 1.6,
    },
    senderName: {
      fontSize: 15,
      fontFamily: fontBold,
      color: "#1a1a2e",
      marginBottom: 3,
    },
    senderInfo: {
      fontSize: 9.5,
      color: "#666",
    },
    accentLine: {
      height: 2,
      backgroundColor: accentColor,
      marginTop: 14,
      marginBottom: 22,
    },
    body: {
      fontSize: 10.5,
      lineHeight: 1.75,
      color: "#1a1a2e",
    },
  });
}

interface Props {
  letterText: string;
  cvData: CvData;
}

export function CoverLetterDocument({ letterText, cvData }: Props) {
  const { personalInfo, designSettings } = cvData;
  const theme = getTheme(designSettings?.colorTheme ?? "indigo");
  const isSerif = designSettings?.fontFamily === "serif";
  const fontBase = isSerif ? "Times-Roman" : "Helvetica";
  const fontBold = isSerif ? "Times-Bold" : "Helvetica-Bold";
  const styles = createStyles(theme.pdfAccentColor, fontBase, fontBold);

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || "Candidat";
  const senderInfo = [personalInfo.location, personalInfo.phone, personalInfo.email]
    .filter(Boolean)
    .join(" · ");

  return (
    <Document title={`Lettre_${fullName}`} author={fullName} subject="Lettre de motivation" creator="AuthentiCV">
      <Page size="A4" style={styles.page}>
        <Text style={styles.senderName}>{fullName}</Text>
        {senderInfo ? <Text style={styles.senderInfo}>{senderInfo}</Text> : null}
        <View style={styles.accentLine} />
        <Text style={styles.body}>{letterText}</Text>
      </Page>
    </Document>
  );
}

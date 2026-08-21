import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getCemacConfig } from "@/lib/cemac-regulatory";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#4F46E5",
    borderBottomStyle: "solid",
    paddingBottom: 10,
  },
  brand: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#4F46E5",
  },
  brandSub: {
    fontSize: 8,
    color: "#64748B",
    marginTop: 2,
  },
  titleBlock: {
    textAlign: "center",
    marginVertical: 14,
    padding: 8,
    backgroundColor: "#EEF2FF",
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#3730A3",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderBottomStyle: "solid",
    paddingBottom: 3,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.4,
    marginBottom: 6,
    textAlign: "justify",
  },
  bulletItem: {
    fontSize: 8.5,
    color: "#334155",
    marginLeft: 12,
    marginBottom: 3,
  },
  partiesTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  partyBox: {
    width: "48%",
    padding: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "solid",
    borderRadius: 4,
  },
  partyTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#4F46E5",
    marginBottom: 4,
  },
  partyText: {
    fontSize: 8,
    color: "#475569",
    marginBottom: 2,
  },
  signaturesBlock: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sigBox: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "solid",
    borderRadius: 4,
    padding: 8,
    minHeight: 70,
  },
  sigTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 7.5,
    color: "#94A3B8",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    borderTopStyle: "solid",
    paddingTop: 6,
  },
});

export interface CampusContractProps {
  universityName: string;
  countryCode: string;
  representativeName: string;
  promoCode: string;
  discountPercent: number;
  dateStr?: string;
}

export function CampusCemacContractDocument({
  universityName,
  countryCode,
  representativeName,
  promoCode,
  discountPercent,
  dateStr = new Date().toLocaleDateString("fr-FR"),
}: CampusContractProps) {
  const config = getCemacConfig(countryCode);

  return (
    <Document title={`Convention_Campus_${universityName.replace(/\s+/g, "_")}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>AuthentiCV.app</Text>
            <Text style={styles.brandSub}>Plateforme EdTech &amp; Recrutement IA | Zone CEMAC</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0F172A" }}>CONVENTION CADRE CAMPUS</Text>
            <Text style={{ fontSize: 8, color: "#64748B" }}>Réf: CONV-CAMPUS-{promoCode}</Text>
            <Text style={{ fontSize: 8, color: "#64748B" }}>Date: {dateStr}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{"CONVENTION CADRE DE PARTENARIAT CAMPUS & INSERTION PROFESSIONNELLE"}</Text>
          <Text style={styles.subtitle}>
            Cadre Réglementaire : {config.higherEduMinistry} — {config.name}
          </Text>
        </View>

        {/* Parties */}
        <View style={styles.partiesTable}>
          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>ENTRE LES SOUSSIGNÉS :</Text>
            <Text style={[styles.partyText, { fontFamily: "Helvetica-Bold" }]}>AuthentiCV.app</Text>
            <Text style={styles.partyText}>Plateforme RH &amp; CV IA en Afrique Centrale</Text>
            <Text style={styles.partyText}>Représentée par sa Direction Commerciale</Text>
            <Text style={styles.partyText}>Siège: Zone CEMAC ({config.name})</Text>
          </View>

          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>{"ET L'ÉTABLISSEMENT PARTENAIRE :"}</Text>
            <Text style={[styles.partyText, { fontFamily: "Helvetica-Bold" }]}>{universityName}</Text>
            <Text style={styles.partyText}>Représenté(e) par : {representativeName}</Text>
            <Text style={styles.partyText}>{"Pays d'Implantation :"} {config.name}</Text>
          </View>
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 1 : OBJET DE LA CONVENTION</Text>
          <Text style={styles.paragraph}>
            {"La présente convention a pour objet de définir les modalités de partenariat entre AuthentiCV.app et "}
            {universityName}
            {" afin de favoriser l'insertion professionnelle des étudiants et jeunes diplômés de l'établissement grâce au coach CV IA conversationnel et aux formats normés ATS."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 2 : AVANTAGES ÉTUDIANTS &amp; TARIFICATION PRÉFÉRENTIELLE</Text>
          <Text style={styles.paragraph}>
            {"AuthentiCV.app s'engage à accorder une remise systématique de "}
            {discountPercent}
            {"% sur l'ensemble de ses tarifs publics (Pass 1 Candidature, Pass Mensuel Pro, Pass Annuel) à tous les étudiants régulièrement inscrits au sein de "}
            {universityName}.
          </Text>
          <Text style={styles.bulletItem}>• Code Promo Officiel attribué : {promoCode}</Text>
          <Text style={styles.bulletItem}>• Monnaie de règlement : {config.currency} via MTN MoMo / Orange Money / Airtel Money</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"ARTICLE 3 : ENGAGEMENT DE GRATUITÉ POUR L'ÉTABLISSEMENT"}</Text>
          <Text style={styles.paragraph}>
            {"Le présent partenariat est conclu à titre gracieux pour "}
            {universityName}
            {". Aucun budget, frais d'installation ou redevance logicielle ne sera facturé à l'établissement d'enseignement supérieur."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 4 : PROTECTION DES DONNÉES &amp; PROTECTION JURIDIQUE</Text>
          <Text style={styles.paragraph}>
            {"Les parties s'engagent au strict respect de la réglementation sur la protection des données personnelles à caractère personnel en vigueur en Zone CEMAC ("}
            {config.dataProtectionLaw}
            {"). Aucune donnée personnelle d'étudiant n'est cédée à des tiers à des fins publicitaires."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 5 : JURIDICTION COMPÉTENTE</Text>
          <Text style={styles.paragraph}>
            {"En cas de litige relatif à l'interprétation de la présente convention, les parties s'engagent à rechercher une résolution à l'amiable. À défaut, attribution expresse de juridiction est faite au "}
            {config.jurisdiction}.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signaturesBlock}>
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>Pour AuthentiCV.app :</Text>
            <Text style={{ fontSize: 7.5, color: "#64748B" }}>[Tampon &amp; Signature Électronique Certifiée]</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>Pour {universityName} :</Text>
            <Text style={{ fontSize: 7.5, color: "#64748B" }}>Nom : {representativeName}</Text>
            <Text style={{ fontSize: 7.5, color: "#64748B", marginTop: 2 }}>{"[Signature & Cachet de l'Établissement]"}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {"Convention officielle d'insertion professionnelle enregistrée sur AuthentiCV.app | Conforme aux directives CEMAC ("}
            {config.name}
            {")"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

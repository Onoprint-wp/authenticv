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
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#059669",
    borderBottomStyle: "solid",
    paddingBottom: 8,
  },
  brand: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  brandSub: {
    fontSize: 8,
    color: "#64748B",
    marginTop: 2,
  },
  titleBlock: {
    textAlign: "center",
    marginVertical: 10,
    padding: 8,
    backgroundColor: "#ECFDF5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#065F46",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 8,
    color: "#047857",
    marginTop: 2,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 4,
  },
  text: {
    fontSize: 8,
    lineHeight: 1.35,
    color: "#334155",
    marginBottom: 3,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  card: {
    flex: 1,
    padding: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
  },
  signBox: {
    width: "45%",
  },
  signTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  signSubtitle: {
    fontSize: 7,
    color: "#64748B",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 6.5,
    color: "#94A3B8",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 4,
  },
});

interface Props {
  directorName: string;
  countryCode: string;
  phone: string;
  email: string;
  promoCode: string;
  monthlyQuotaXaf?: number;
  commissionDirectPercent?: number;
  overridePercent?: number;
  dateStr?: string;
}

export function CountryDirectorMandateContractDocument({
  directorName,
  countryCode,
  phone,
  email,
  promoCode,
  monthlyQuotaXaf = 3500000,
  commissionDirectPercent = 10,
  overridePercent = 2.5,
  dateStr = "2026",
}: Props) {
  const cemac = getCemacConfig(countryCode);

  return (
    <Document title={`Mandat_Directeur_Pays_${directorName.replace(/\s+/g, "_")}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>AUTHENTICV TECHNOLOGIES</Text>
            <Text style={styles.brandSub}>Hub RH &amp; IA Conversationnelle — Zone CEMAC</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#059669" }}>
              CONVENTION DE MANDAT COMMERCIAL
            </Text>
            <Text style={{ fontSize: 7, color: "#64748B" }}>
              Réf : DIR-{countryCode}-{promoCode}
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            CONVENTION DE DIRECTION COMMERCIALE NATIONALE &amp; MANDAT OHADA
          </Text>
          <Text style={styles.subtitle}>
            Territoire : {cemac.name} ({cemac.currency}) · Droit Commercial Général OHADA
          </Text>
        </View>

        {/* Parties */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#059669", marginBottom: 2 }}>
              LE MANDANT (LA PLATEFORME)
            </Text>
            <Text style={styles.text}><Text style={styles.bold}>AUTHENTICV TECHNOLOGIES S.A.S</Text></Text>
            <Text style={styles.text}>Siège Régional : Douala / Libreville / Brazzaville</Text>
            <Text style={styles.text}>Représenté par la Direction Générale</Text>
          </View>

          <View style={styles.card}>
            <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#059669", marginBottom: 2 }}>
              LE MANDATAIRE (DIRECTEUR PAYS)
            </Text>
            <Text style={styles.text}><Text style={styles.bold}>{directorName}</Text></Text>
            <Text style={styles.text}>Pays assigné : {cemac.name}</Text>
            <Text style={styles.text}>Contact : {phone} · {email}</Text>
            <Text style={styles.text}>Code Promo Officiel : {promoCode}</Text>
          </View>
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article 1 — Objet du Mandat &amp; Exclusivité Territoriale</Text>
          <Text style={styles.text}>
            Le Mandant confie au Mandataire, qui l&apos;accepte, la direction du développement commercial, l&apos;animation de l&apos;équipe commerciale locale et la négociation des partenariats stratégiques d&apos;AuthentiCV sur le territoire de <Text style={styles.bold}>{cemac.name}</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article 2 — Missions &amp; Prérogatives Managériales</Text>
          <Text style={styles.text}>
            Le Directeur Commercial Pays est chargé de : (i) Recruter, former et encadrer les délégués commerciaux locaux ; (ii) Négocier les conventions partenariats universitaires et grands comptes B2B ; (iii) Superviser la distribution des opportunités (leads) dans sa circonscription ; (iv) Veiller au strict respect de la charte éthique et des tarifs officiels AuthentiCV.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article 3 — Objectif &amp; Quota National Dynamique</Text>
          <Text style={styles.text}>
            L&apos;objectif mensuel de référence pour le territoire est fixé à <Text style={styles.bold}>{monthlyQuotaXaf.toLocaleString("fr-FR")} {cemac.currency}</Text>. Cet objectif s&apos;agrège dynamiquement en fonction de la taille de l&apos;équipe commerciale sous sa supervision.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article 4 — Rémunération &amp; Modalités de Paiement</Text>
          <Text style={styles.text}>
            Le Directeur Commercial Pays perçoit une double rémunération 100% automatisée :
          </Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>{commissionDirectPercent}% Net</Text> sur chaque vente directe conclue sous son code promo ({promoCode}) ou par son entremise directe.
          </Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>{overridePercent}% Net d&apos;Over-Riding Managérial</Text> sur l&apos;intégralité du chiffre d&apos;affaires généré par les délégués commerciaux rattachés à son pays.
          </Text>
          <Text style={styles.text}>
            Les commissions sont liquidées et versées par Mobile Money ({phone}) ou virement bancaire de manière hebdomadaire (chaque vendredi) ou bimensuelle (le 1er et le 15 de chaque mois).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article 5 — Confidentialité &amp; Secret des Affaires</Text>
          <Text style={styles.text}>
            Le Mandataire s&apos;engage à la confidentialité absolue concernant les données des candidats, les algorithmes de la plateforme et les informations financières de l&apos;entreprise, pendant toute la durée du mandat et 24 mois après son terme.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Article 6 — Durée, Évaluation &amp; Droit Applicable (OHADA)</Text>
          <Text style={styles.text}>
            La présente convention est conclue pour une durée de 12 mois renouvelable par tacite reconduction. Elle est régie par l&apos;Acte Uniforme OHADA relatif au Droit Commercial Général. En cas de différend non résolu à l&apos;amiable, compétence expresse est attribuée au Tribunal de Commerce du ressort du siège du Mandant ou à la CCJA.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signBox}>
            <Text style={styles.signTitle}>Pour AUTHENTICV TECHNOLOGIES</Text>
            <Text style={styles.signSubtitle}>La Direction Générale</Text>
            <Text style={{ fontSize: 6.5, color: "#059669", marginTop: 4 }}>Fait à Douala, le {dateStr}</Text>
          </View>

          <View style={styles.signBox}>
            <Text style={styles.signTitle}>Le Directeur Commercial Pays</Text>
            <Text style={styles.signSubtitle}>{directorName} (Bon pour accord et mandat)</Text>
            <Text style={{ fontSize: 6.5, color: "#059669", marginTop: 4 }}>Signature certifiée &amp; validation</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          AuthentiCV Technologies — Plateforme IA de Recrutement &amp; Carrières · Document contractuel certifié OHADA / BEAC · Page 1/1
        </Text>
      </Page>
    </Document>
  );
}

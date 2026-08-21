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
    marginVertical: 12,
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
  },
  title: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 8.5,
    color: "#475569",
    marginTop: 2,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.35,
    marginBottom: 4,
    textAlign: "justify",
  },
  partiesTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
    fontSize: 8.5,
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
    marginTop: 14,
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
    minHeight: 65,
  },
  sigTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
    marginBottom: 16,
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

export interface RecruiterContractProps {
  companyName: string;
  rccm: string;
  niu: string;
  countryCode: string;
  representativeName: string;
  creditsPurchased: number;
  totalPriceFcfa: string;
  dateStr?: string;
}

export function RecruiterB2BCemacContractDocument({
  companyName,
  rccm,
  niu,
  countryCode,
  representativeName,
  creditsPurchased,
  totalPriceFcfa,
  dateStr = new Date().toLocaleDateString("fr-FR"),
}: RecruiterContractProps) {
  const config = getCemacConfig(countryCode);

  return (
    <Document title={`Contrat_Recruteur_B2B_${companyName.replace(/\s+/g, "_")}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>AuthentiCV.app</Text>
            <Text style={styles.brandSub}>Services B2B &amp; CVthèque IA en Afrique Centrale</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0F172A" }}>CONTRAT COMMERCIAL B2B</Text>
            <Text style={{ fontSize: 8, color: "#64748B" }}>N° B2B-{Date.now().toString().slice(-6)}</Text>
            <Text style={{ fontSize: 8, color: "#64748B" }}>Date: {dateStr}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{"CONTRAT D'ACCÈS À LA CVTHÈQUE IA & CONDITIONS DE VENTE B2B"}</Text>
          <Text style={styles.subtitle}>Conforme au {config.businessLaw} — Zone CEMAC</Text>
        </View>

        {/* Parties */}
        <View style={styles.partiesTable}>
          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>LE PRESTATAIRE :</Text>
            <Text style={[styles.partyText, { fontFamily: "Helvetica-Bold" }]}>AuthentiCV.app</Text>
            <Text style={styles.partyText}>Plateforme RH &amp; CVthèque IA</Text>
            <Text style={styles.partyText}>Zone CEMAC ({config.name})</Text>
          </View>

          <View style={styles.partyBox}>
            <Text style={styles.partyTitle}>{"L'ENTREPRISE CLIENTE B2B :"}</Text>
            <Text style={[styles.partyText, { fontFamily: "Helvetica-Bold" }]}>{companyName}</Text>
            <Text style={styles.partyText}>RCCM : {rccm || "En cours"}</Text>
            <Text style={styles.partyText}>NIU / IFU : {niu || "En cours"}</Text>
            <Text style={styles.partyText}>Représentée par : {representativeName}</Text>
            <Text style={styles.partyText}>Pays : {config.name}</Text>
          </View>
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 1 : OBJET ET SERVICE ACCORDÉ</Text>
          <Text style={styles.paragraph}>
            {"Le Prestataire accorde à l'Entreprise Cliente un droit d'accès au moteur de recherche de candidatures pré-qualifiées sur la CVthèque AuthentiCV.app et un volume de "}
            {creditsPurchased}
            {" Crédit(s) RH pour le déblocage des coordonnées complètes des candidats (Photo, Nom, Téléphone, Email)."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 2 : CONDITIONS FINANCIÈRES ET FACTURATION</Text>
          <Text style={styles.paragraph}>
            {"Le montant total de la commande s'élève à "}
            {totalPriceFcfa}
            {" "}
            {config.currency}
            {", réglé de manière sécurisée par Mobile Money (MTN MoMo / Orange Money) ou virement. Une facture officielle certifiée au format PDF est mise à disposition de l'Entreprise Cliente dans son espace `/account`."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 3 : USAGE CONFORME DES DONNÉES CANDIDATS</Text>
          <Text style={styles.paragraph}>
            {"Conformément à la réglementation sur la protection des données à caractère personnel ("}
            {config.dataProtectionLaw}
            {"), l'Entreprise Cliente s'engage à utiliser les coordonnées débloquées exclusivement dans le cadre d'un processus de recrutement professionnel. Toute revente ou sollicitation commerciale abusive est strictement interdite."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ARTICLE 4 : DROIT ET JURIDICTION COMPÉTENTE</Text>
          <Text style={styles.paragraph}>
            {"Le présent contrat est régi par le Droit Harmonisé des Affaires OHADA. Tout litige relatif à l'exécution ou l'interprétation du présent contrat relève de la compétence exclusive du "}
            {config.jurisdiction}.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signaturesBlock}>
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>Pour AuthentiCV.app :</Text>
            <Text style={{ fontSize: 7.5, color: "#64748B" }}>[Signature &amp; Tampon Certifié PDF]</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigTitle}>Pour {companyName} :</Text>
            <Text style={{ fontSize: 7.5, color: "#64748B" }}>Représentant : {representativeName}</Text>
            <Text style={{ fontSize: 7.5, color: "#64748B", marginTop: 2 }}>[Signature &amp; Cachet Société]</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Contrat Commercial B2B certifié par AuthentiCV.app | Droit OHADA — {config.name}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

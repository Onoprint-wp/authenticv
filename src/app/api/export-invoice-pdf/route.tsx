import { renderToStream, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#4F46E5",
    borderBottomStyle: "solid",
    paddingBottom: 12,
  },
  brand: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#4F46E5",
  },
  brandSub: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 2,
  },
  invoiceTitleBlock: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
  },
  invoiceMeta: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "solid",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    borderBottomStyle: "solid",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    borderBottomStyle: "solid",
  },
  colDesc: {
    width: "70%",
    fontSize: 10,
    color: "#1E293B",
  },
  colPrice: {
    width: "30%",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#0F172A",
  },
  totalBlock: {
    alignSelf: "flex-end",
    width: "45%",
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#475569",
  },
  totalVal: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#4F46E5",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 8,
    color: "#94A3B8",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    borderTopStyle: "solid",
    paddingTop: 8,
  },
});

function InvoiceDocument({
  invoiceNo,
  dateStr,
  clientEmail,
  description,
  amount,
  paymentMethod,
}: {
  invoiceNo: string;
  dateStr: string;
  clientEmail: string;
  description: string;
  amount: string;
  paymentMethod: string;
}) {
  return (
    <Document title={`Facture-${invoiceNo}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>AuthentiCV.app</Text>
            <Text style={styles.brandSub}>Plateforme RH & CV IA en Afrique Centrale</Text>
            <Text style={styles.brandSub}>Support: contact@authenticv.app | Douala & Yaoundé, Cameroun</Text>
          </View>
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceTitle}>FACTURE / REÇU</Text>
            <Text style={styles.invoiceMeta}>N° {invoiceNo}</Text>
            <Text style={styles.invoiceMeta}>Date : {dateStr}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS CLIENT</Text>
          <Text style={{ fontSize: 10, color: "#334155" }}>Email Client : {clientEmail}</Text>
          <Text style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>Moyen de paiement : {paymentMethod}</Text>
        </View>

        {/* Invoice Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, { fontFamily: "Helvetica-Bold" }]}>Description de la prestation</Text>
            <Text style={[styles.colPrice, { fontFamily: "Helvetica-Bold" }]}>Montant (FCFA)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colDesc}>{description}</Text>
            <Text style={styles.colPrice}>{amount}</Text>
          </View>
        </View>

        {/* Total Summary */}
        <View style={styles.totalBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total :</Text>
            <Text style={styles.totalLabel}>{amount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (0%) :</Text>
            <Text style={styles.totalLabel}>0 FCFA*</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 4 }]}>
            <Text style={styles.totalVal}>TOTAL RÉGLÉ :</Text>
            <Text style={styles.totalVal}>{amount}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 7.5, color: "#475569", marginBottom: 4, fontFamily: "Helvetica-Bold" }}>
            *TVA non applicable — Régime d&apos;exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC (Droit Harmonisé OHADA).
          </Text>
          <Text>
            Document officiel généré automatiquement par AuthentiCV.app — Numéro de transaction certifié CamPay MoMo/Orange Money.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customDesc = searchParams.get("desc");
    const customAmount = searchParams.get("amount");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const clientEmail = user?.email || "client@authenticv.app";
    const dateStr = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;
    const description = customDesc || "Abonnement Plan Pro Mensuel AuthentiCV";
    const amount = customAmount || "5 000 FCFA";
    const paymentMethod = "Mobile Money (MTN MoMo / Orange Money)";

    const stream = await renderToStream(
      <InvoiceDocument
        invoiceNo={invoiceNo}
        dateStr={dateStr}
        clientEmail={clientEmail}
        description={description}
        amount={amount}
        paymentMethod={paymentMethod}
      />
    );

    return new Response(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Facture_${invoiceNo}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[Invoice PDF GET Error]:", err);
    return new Response("Erreur lors de la génération de la facture PDF", { status: 500 });
  }
}

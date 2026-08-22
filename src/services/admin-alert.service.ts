import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "onoprint25@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "AuthentiCV <noreply@authenticv.app>";

export interface PaymentAlertData {
  event: "SUCCESSFUL" | "FAILED" | "PENDING";
  provider: "campay" | "moov" | "cinetpay" | "manual";
  amount: number;
  currency?: string;
  operator: string;
  userId: string;
  userPhone?: string;
  reference: string;
  reason?: string;
  isB2B?: boolean;
  pack?: string;
}

export class AdminAlertService {
  private static resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

  /**
   * Envoie une notification de paiement par email à l'administrateur.
   * Appel non-bloquant (fire-and-forget) pour ne pas ralentir le webhook.
   */
  static notifyPayment(data: PaymentAlertData): void {
    // Fire-and-forget : on ne bloque pas le webhook
    this._sendAlert(data).catch((err) => {
      console.warn("[AdminAlertService] Failed to send alert:", err);
    });
  }

  private static async _sendAlert(data: PaymentAlertData): Promise<void> {
    if (!this.resend) {
      console.log(`[AdminAlertService] (dev mode) ${data.event} — ${data.amount} ${data.currency || "XAF"} via ${data.operator}`);
      return;
    }

    const isSuccess = data.event === "SUCCESSFUL";
    const emoji = isSuccess ? "💰" : data.event === "FAILED" ? "⚠️" : "⏳";
    const statusLabel = isSuccess ? "Paiement Réussi" : data.event === "FAILED" ? "Paiement Échoué" : "Paiement En Attente";
    const statusColor = isSuccess ? "#22c55e" : data.event === "FAILED" ? "#ef4444" : "#f59e0b";
    const segment = data.isB2B ? "B2B Recruteur" : "B2C Candidat";

    const subject = `${emoji} ${statusLabel} — ${data.amount.toLocaleString("fr-FR")} ${data.currency || "XAF"} via ${data.operator}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1e293b;">
        <div style="background: ${statusColor}; padding: 16px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #fff; margin: 0; font-size: 18px;">${emoji} ${statusLabel}</h2>
        </div>
        <div style="background: #fff; padding: 20px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #64748b;">Montant</td><td style="padding: 6px 0; font-weight: bold;">${data.amount.toLocaleString("fr-FR")} ${data.currency || "XAF"}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Opérateur</td><td style="padding: 6px 0;">${data.operator}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Provider</td><td style="padding: 6px 0;">${data.provider.toUpperCase()}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Segment</td><td style="padding: 6px 0;">${segment}${data.pack ? ` (${data.pack})` : ""}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Référence</td><td style="padding: 6px 0; font-family: monospace; font-size: 12px;">${data.reference}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">User ID</td><td style="padding: 6px 0; font-family: monospace; font-size: 12px;">${data.userId}</td></tr>
            ${data.userPhone ? `<tr><td style="padding: 6px 0; color: #64748b;">Téléphone</td><td style="padding: 6px 0;">${data.userPhone}</td></tr>` : ""}
            ${data.reason ? `<tr><td style="padding: 6px 0; color: #64748b;">Raison</td><td style="padding: 6px 0; color: #ef4444;">${data.reason}</td></tr>` : ""}
          </table>
          <p style="margin-top: 16px; font-size: 11px; color: #94a3b8; text-align: center;">
            AuthentiCV Admin Alert — ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Douala" })}
          </p>
        </div>
      </div>
    `;

    try {
      await this.resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject,
        html,
      });
    } catch (err) {
      console.error("[AdminAlertService] Resend error:", err);
    }
  }
}

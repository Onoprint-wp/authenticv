import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "AuthentiCV <noreply@authenticv.app>";

export interface SendCvEmailParams {
  to: string;
  candidateName: string;
  cvTitle: string;
  pdfBase64?: string;
  shareUrl?: string;
}

export class EmailService {
  private static resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

  /**
   * Envoie le CV du candidat directement dans sa boîte mail.
   */
  static async sendCandidateCvEmail(params: SendCvEmailParams): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.warn("[EmailService] RESEND_API_KEY non configurée — envoi simulé en environnement de développement");
      return { success: true };
    }

    try {
      const attachments = params.pdfBase64
        ? [
            {
              filename: `CV_${params.candidateName.replace(/\s+/g, "_")}.pdf`,
              content: Buffer.from(params.pdfBase64, "base64"),
            },
          ]
        : [];

      const shareLinkHtml = params.shareUrl
        ? `<p style="margin-top: 16px;">Vous pouvez également consulter votre CV en ligne et le partager : <br><a href="${params.shareUrl}" style="color: #6366f1; font-weight: bold;">Consulter mon CV en ligne</a></p>`
        : "";

      const { error } = await this.resend.emails.send({
        from: FROM_EMAIL,
        to: [params.to],
        subject: `📄 Votre CV AuthentiCV est prêt — ${params.cvTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">AuthentiCV</h1>
              <p style="color: #a5b4fc; margin: 4px 0 0 0; font-size: 14px;">Votre coach CV propulsé par l'IA</p>
            </div>
            <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <h2 style="color: #0f172a; margin-top: 0;">Bonjour ${params.candidateName},</h2>
              <p>Félicitations ! Votre CV professionnel <strong>${params.cvTitle}</strong> a été généré et optimisé avec succès par votre coach Alex.</p>
              ${params.pdfBase64 ? "<p>Votre fichier PDF Haute Définition est disponible en pièce jointe de cet email.</p>" : ""}
              ${shareLinkHtml}
              <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">
                <p style="margin: 0; font-size: 13px; color: #475569;">
                  💡 <strong>Conseil d'Alex :</strong> Pensez à adapter les mots-clés de votre CV pour chaque offre d'emploi ciblée afin d'obtenir un score ATS maximal.
                </p>
              </div>
              <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                © ${new Date().getFullYear()} AuthentiCV — Tous droits réservés.
              </p>
            </div>
          </div>
        `,
        attachments,
      });

      if (error) {
        console.error("[EmailService.sendCandidateCvEmail] Resend Error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[EmailService.sendCandidateCvEmail] Unhandled Error:", err);
      return { success: false, error: err instanceof Error ? err.message : "Erreur envoi email" };
    }
  }

  /**
   * Envoie un email de relance de panier abandonné avec réduction spéciale.
   */
  static async sendRecoveryEmail(params: {
    to: string;
    candidateName: string;
    jobTitle: string;
    discountCode?: string;
    discountPercent?: number;
  }): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      console.warn("[EmailService] RESEND_API_KEY non configurée — envoi simulé");
      return { success: true };
    }

    const code = params.discountCode || "BOOST20";
    const discount = params.discountPercent || 20;
    const finalPrice = Math.round(1000 * (1 - discount / 100));

    try {
      const { error } = await this.resend.emails.send({
        from: FROM_EMAIL,
        to: [params.to],
        subject: `📄 ${params.candidateName}, votre CV "${params.jobTitle}" vous attend (-${discount}%)`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #0F223D 0%, #3667F0 100%); padding: 28px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">AuthentiCV</h1>
              <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 14px;">Votre CV certifié au standard international</p>
            </div>
            <div style="background: #ffffff; padding: 28px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Bonjour ${params.candidateName},</h2>
              <p>Votre CV professionnel <strong>${params.jobTitle}</strong> est structuré et optimisé par Alex IA dans votre espace personnel.</p>
              
              <div style="margin: 20px 0; padding: 20px; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #166534; font-weight: bold;">
                  🎁 Offre exclusive de relance : -${discount}% de réduction
                </p>
                <div style="display: inline-block; background: #ffffff; border: 2px dashed #22c55e; padding: 8px 18px; border-radius: 8px; font-size: 18px; font-weight: bold; color: #15803d; letter-spacing: 1px;">
                  ${code}
                </div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #166534;">
                  Téléchargez votre PDF Haute Définition certifié pour seulement <strong>${finalPrice} FCFA</strong> au lieu de 1 000 FCFA (Orange / MTN / Moov Money).
                </p>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="https://www.authenticv.app/builder?promo=${code}" style="display: inline-block; background: #3667F0; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(54, 103, 240, 0.3);">
                  🚀 Finaliser & Télécharger mon CV (-${discount}%)
                </a>
              </div>

              <div style="padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3667F0; margin-top: 20px;">
                <p style="margin: 0; font-size: 12px; color: #475569;">
                  💡 <strong>Rappel :</strong> Les recruteurs privilégient les CVs au format PDF certifié sans filigrane respectant les normes de lecture automatique ATS.
                </p>
              </div>

              <p style="margin-top: 28px; font-size: 11px; color: #94a3b8; text-align: center;">
                Une question ? Répondez directement à cet email ou contactez notre équipe sur <a href="mailto:contact@authenticv.app" style="color: #3667F0;">contact@authenticv.app</a>.<br>
                © ${new Date().getFullYear()} AuthentiCV — Douala, Cameroun.
              </p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error("[EmailService.sendRecoveryEmail] Resend Error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("[EmailService.sendRecoveryEmail] Error:", err);
      return { success: false, error: err instanceof Error ? err.message : "Erreur envoi email" };
    }
  }
}

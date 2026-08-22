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
}

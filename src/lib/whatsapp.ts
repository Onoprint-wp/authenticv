/**
 * Helper pour générer des liens de partage WhatsApp pour les candidats et commerciaux.
 */

export interface WhatsAppShareOptions {
  fullName?: string;
  cvUrl: string;
  documentTitle?: string;
  phone?: string;
}

/**
 * Génère un lien direct WhatsApp pour partager son CV à un recruteur ou se l'envoyer.
 */
export function buildWhatsAppShareUrl({
  fullName = "Candidat",
  cvUrl,
  documentTitle = "Mon CV Professionnel",
  phone,
}: WhatsAppShareOptions): string {
  const message = `Bonjour,\n\nVeuillez trouver mon CV optimisé (${documentTitle}) via AuthentiCV :\n🔗 ${cvUrl}\n\nCordialement,\n${fullName}`;
  const encodedText = encodeURIComponent(message);

  if (phone) {
    // Nettoie le numéro de téléphone (retire +, espaces, tirets)
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }

  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

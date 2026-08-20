"use client";

import { useState } from "react";
import { Gift, Copy, Check, Share2 } from "lucide-react";

interface ReferralBannerProps {
  userId: string;
}

export function ReferralBanner({ userId }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/builder?ref=${userId}`
    : `https://www.authenticv.app/builder?ref=${userId}`;

  const message = `Salut ! Crée ton CV professionnel gratuitement avec Alex, l'IA d'AuthenticV. C'est ultra rapide et optimisé ATS : ${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOnWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-xl text-white my-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
              Offrez AuthenticV et gagnez 1 Mois Pro Gratuit ! 🎁
            </h3>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Partagez votre lien unique à vos camarades et amis. Dès qu&apos;un ami génère son premier CV, vous recevez automatiquement <strong>30 jours Pro offerts</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={copyToClipboard}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Lien copié !" : "Copier le lien"}</span>
          </button>

          <button
            onClick={shareOnWhatsApp}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Partager WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}

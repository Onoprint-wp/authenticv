"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Check, Share2, Users, Award } from "lucide-react";

interface ReferralBannerProps {
  userId: string;
}

export function ReferralBanner({ userId }: ReferralBannerProps) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ totalReferrals: number; rewardedCount: number }>({
    totalReferrals: 0,
    rewardedCount: 0,
  });

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/builder?ref=${userId}`
    : `https://www.authenticv.app/builder?ref=${userId}`;

  const message = `Salut ! Crée ton CV professionnel gratuitement avec Alex, l'IA d'AuthenticV. C'est ultra rapide et optimisé ATS : ${shareUrl}`;

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch("/api/referrals/stats");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStats({
              totalReferrals: data.totalReferrals ?? 0,
              rewardedCount: data.rewardedCount ?? 0,
            });
          }
        }
      } catch {
        // Fallback
      }
    }
    loadStats();
    return () => { isMounted = false; };
  }, []);

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
    <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-xl text-white my-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-base md:text-lg text-white">
                Offrez AuthenticV et gagnez 1 Mois Pro Gratuit ! 🎁
              </h3>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" />
                <span>{stats.rewardedCount > 0 ? `${stats.rewardedCount} Mois Pro Gagné(s)` : "Programme Parrainage"}</span>
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Partagez votre lien unique. Dès qu&apos;un ami génère son premier CV, vous recevez automatiquement <strong>30 jours Pro offerts</strong>.
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{stats.totalReferrals} ami(s) invité(s)</span>
              </span>
              <span>•</span>
              {stats.rewardedCount > 0 ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{stats.rewardedCount} mois Pro gagné(s) ✓</span>
                </span>
              ) : (
                <span className="text-amber-400/90 font-medium">
                  Partagez votre lien pour gagner 30j Pro !
                </span>
              )}
            </div>
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

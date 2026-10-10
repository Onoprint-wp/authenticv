"use client";

import React from "react";
import { Sparkles, Building2, Zap, ArrowRight, MessageSquareCheck, FileCheck2 } from "lucide-react";

interface Props {
  creditsBalance: number;
  onOpenBuyModal: () => void;
  isEn?: boolean;
}

export function RecruiterUpsellCard({
  creditsBalance,
  onOpenBuyModal,
  isEn = false,
}: Props) {
  if (creditsBalance === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-5 border border-blue-700/40 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
            {isEn ? "Special Offer" : "Offre Entreprise"}
          </span>
          <span className="text-xs text-blue-200">
            {isEn ? "-20% on Pack 10" : "-20% sur Pack 10"}
          </span>
        </div>

        <h4 className="text-sm font-bold leading-snug mb-1">
          {isEn
            ? "Recruit faster with Enterprise Packs"
            : "Recrutez au meilleur tarif"}
        </h4>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {isEn
            ? "Unlock 10 qualified talents for 40,000 FCFA instead of 50,000 FCFA with dedicated fiscal invoices."
            : "Débloquez 10 talents vérifiés pour 40 000 FCFA (au lieu de 50 000 FCFA) avec factures fiscales certifiées."}
        </p>

        <button
          onClick={onOpenBuyModal}
          className="w-full flex items-center justify-center gap-2 bg-[#3667F0] hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>{isEn ? "View Enterprise Packs" : "Voir les Packs Entreprise"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-5 border border-slate-700/60 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-[#3667F0]/30 text-[#5D82FF] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold text-slate-200">
          {isEn ? "Executive Sourcing Alex IA" : "Chasse de Tête Alex IA"}
        </span>
      </div>

      <h4 className="text-sm font-bold leading-snug mb-1">
        {isEn ? "Need a rare or urgent hire?" : "Un profil très spécifique ?"}
      </h4>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        {isEn
          ? "Our AI Headhunters pre-interview and deliver a qualified top 3 shortlist within 48h."
          : "Notre équipe de chasseurs IA pré-qualifie et vous livre les 3 meilleurs profils sous 48h."}
      </p>

      <a
        href={`https://wa.me/237699001122?text=${encodeURIComponent(
          isEn
            ? "Hello, I am interested in custom talent sourcing with Alex IA on AuthentiCV."
            : "Bonjour, je souhaite des informations sur le service de chasse sur-mesure Alex IA pour mon entreprise."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        <MessageSquareCheck className="w-3.5 h-3.5" />
        <span>{isEn ? "Contact Headhunter Team" : "Contacter l'équipe Chasse"}</span>
      </a>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import {
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import type { CandidateProfile } from "@/types/recruiter";
import { useRecruiterStore } from "@/store/useRecruiterStore";

interface Props {
  profile: CandidateProfile;
  onUnlock: (id: string) => void;
  isUnlocking: boolean;
  isEn?: boolean;
}

export function RecruiterTalentCard({
  profile,
  onUnlock,
  isUnlocking,
  isEn = false,
}: Props) {
  const { isInShortlist, toggleShortlist } = useRecruiterStore();
  const isSelected = isInShortlist(profile.id);

  const handleToggleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleShortlist({
      id: profile.id,
      jobTitle: profile.jobTitle,
      location: profile.location,
      experienceYears: profile.experienceYears,
      matchScore: profile.matchScore,
      skills: profile.skills,
    });
  };

  const getWhatsAppUrl = () => {
    if (!profile.contact?.phone) return "#";
    const clean = profile.contact.phone.replace(/[^\d+]/g, "");
    const full = clean.startsWith("+") ? clean.replace("+", "") : `237${clean}`;
    const text = isEn
      ? `Hello, I reviewed your verified profile on AuthentiCV and would like to discuss a job opportunity with you.`
      : `Bonjour, j'ai découvert votre profil qualifié sur AuthentiCV et je souhaite échanger avec vous au sujet d'une opportunité professionnelle.`;
    return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      className={`relative bg-card text-card-foreground border rounded-2xl p-6 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-[#3667F0] ring-1 ring-[#3667F0]/30 shadow-sm"
          : "border-border hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Top badges & Shortlist selector */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-foreground tracking-tight">
            {profile.isUnlocked && profile.contact?.name
              ? profile.contact.name
              : profile.jobTitle}
          </h3>

          {/* Match IA Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3667F0] bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>{profile.matchScore}% Match IA</span>
          </span>

          {/* Freshness Badge */}
          {profile.freshnessBadge && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.freshnessBadge}</span>
            </span>
          )}
        </div>

        {/* Shortlist Toggle Bookmark Button */}
        <button
          onClick={handleToggleSelect}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            isSelected
              ? "bg-[#3667F0] text-white shadow-sm"
              : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title={
            isSelected
              ? isEn
                ? "Remove from Shortlist"
                : "Retirer de ma sélection"
              : isEn
              ? "Add to Shortlist"
              : "Ajouter à ma sélection"
          }
        >
          {isSelected ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isEn ? "Selected" : "Sélectionné"}
              </span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isEn ? "Select" : "Sélectionner"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Subtitle / Location & Experience */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{profile.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {profile.experienceYears}{" "}
            {isEn ? "years experience" : "ans d'expérience"}
          </span>
        </div>
        {profile.isUnlocked && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isEn ? "Unlocked Talent" : "Talent Débloqué"}</span>
          </div>
        )}
      </div>

      {/* Pitch Summary */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
        {profile.summary}
      </p>

      {/* Skills Badges */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {profile.skills.map((skill, i) => (
          <span
            key={i}
            className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Action / Contact Zone */}
      {profile.isUnlocked && profile.contact ? (
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {profile.contact.photoUrl ? (
                <Image
                  src={profile.contact.photoUrl}
                  alt={profile.contact.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 flex items-center justify-center font-bold text-sm">
                  {profile.contact.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {profile.contact.name}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{profile.contact.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                title={isEn ? "Chat on WhatsApp" : "Discuter sur WhatsApp"}
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${profile.contact.phone}`}
                className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{profile.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isEn
                ? "Direct contacts & full CV masked"
                : "Coordonnées directes masquées"}
            </span>
          </div>

          <button
            onClick={() => onUnlock(profile.id)}
            disabled={isUnlocking}
            className="flex items-center justify-center gap-2 bg-[#3667F0] hover:bg-[#3667F0]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isUnlocking ? (
              <span className="animate-pulse">
                {isEn ? "Unlocking..." : "Déblocage en cours..."}
              </span>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? "Unlock (5,000 FCFA / 1 Credit)"
                    : "Débloquer (5 000 FCFA / 1 Crédit)"}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

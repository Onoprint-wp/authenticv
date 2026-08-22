"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { CvCompletenessBar } from "@/components/cv/CvCompletenessBar";
import { Input } from "@/components/editor/ui/EditorPrimitives";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { SummarySection } from "./sections/SummarySection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { CertificationsSection } from "./sections/CertificationsSection";

export const CvEditorView = () => {
  const { cvData, updateDocumentTitle } = useCvStore();

  return (
    <div className="h-full overflow-y-auto custom-scrollbar w-full max-w-2xl mx-auto py-6 px-4 pb-20">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-2">Éditeur de CV</h2>
        <p className="text-slate-400 text-sm">Modifiez vos informations et visualisez les changements en temps réel.</p>
      </div>

      <div className="mb-6 space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Titre du document</label>
        <Input
          value={cvData.documentTitle}
          onChange={(e) => updateDocumentTitle(e.target.value)}
          placeholder="ex. Développeur Frontend Senior"
          className="text-lg font-medium"
        />
      </div>

      <CvCompletenessBar cvData={cvData} />

      <PersonalInfoSection />
      <SummarySection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <LanguagesSection />
      <ProjectsSection />
      <CertificationsSection />

    </div>
  );
};

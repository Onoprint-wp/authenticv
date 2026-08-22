"use client";

import React from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Textarea } from "@/components/editor/ui/EditorPrimitives";
import { FileText } from "lucide-react";

export const SummarySection = () => {
  const { cvData, updateSummary } = useCvStore();

  return (
    <SectionCard title="Résumé professionnel" icon={FileText}>
      <div className="space-y-2">
        <Textarea
          value={cvData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Rédigez un résumé accrocheur qui met en valeur vos points forts..."
        />
      </div>
    </SectionCard>
  );
};

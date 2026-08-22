"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCvStore } from "@/store/useCvStore";
import { SectionCard, Textarea } from "@/components/editor/ui/EditorPrimitives";
import { Code } from "lucide-react";

export const SkillsSection = () => {
  const { cvData, setSkills } = useCvStore();
  const [localSkillsText, setLocalSkillsText] = useState(() => cvData.skills.join(', '));
  const isSkillsFocused = useRef(false);

  useEffect(() => {
    if (!isSkillsFocused.current) {
      setLocalSkillsText(cvData.skills.join(', '));
    }
  }, [cvData.skills]);

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalSkillsText(e.target.value);
  };

  const handleSkillsBlur = () => {
    isSkillsFocused.current = false;
    const skillsArray = localSkillsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setSkills(skillsArray);
    setLocalSkillsText(skillsArray.join(', '));
  };

  return (
    <SectionCard title="Compétences" icon={Code}>
      <div className="space-y-2">
        <p className="text-xs text-slate-400 ml-1 mb-2">Entrez les compétences séparées par des virgules</p>
        <Textarea
          value={localSkillsText}
          onChange={handleSkillsChange}
          onFocus={() => { isSkillsFocused.current = true; }}
          onBlur={handleSkillsBlur}
          placeholder="React, TypeScript, Node.js, ..."
          className="min-h-[80px]"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {cvData.skills.map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useCvStore } from "@/store/useCvStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatInputArea } from "@/components/chat/ChatInputArea";
import { computeAtsScore } from "@/lib/ats-score";
import { useCvUpload } from "@/hooks/useCvUpload";

// Applies a single AI tool call directly to the Zustand store for immediate re-render,
// before the background Supabase refetch confirms the canonical data.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyOptimisticUpdate(toolName: string, args: Record<string, any>) {
  const store = useCvStore.getState();
  switch (toolName) {
    case "updatePersonalInfo":  store.updatePersonalInfo(args); break;
    case "updateSummary":       store.updateSummary(args.summary); break;
    case "setSkills":           store.setSkills(args.skills); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addExperience":       store.addExperience(args as any); break;
    case "updateExperience":    store.updateExperience(args.id, args.data); break;
    case "removeExperience":    store.removeExperience(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addEducation":        store.addEducation(args as any); break;
    case "updateEducation":     store.updateEducation(args.id, args.data); break;
    case "removeEducation":     store.removeEducation(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addLanguage":         store.addLanguage(args as any); break;
    case "updateLanguage":      store.updateLanguage(args.id, args.data); break;
    case "removeLanguage":      store.removeLanguage(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addCertification":    store.addCertification(args as any); break;
    case "updateCertification": store.updateCertification(args.id, args.data); break;
    case "removeCertification": store.removeCertification(args.id); break;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    case "addProject":          store.addProject(args as any); break;
    case "updateProject":       store.updateProject(args.id, args.data); break;
    case "removeProject":       store.removeProject(args.id); break;
    case "removeSkill": {
      const skill = args.skill as string;
      store.setSkills(store.cvData.skills.filter((s) => s.toLowerCase() !== skill.toLowerCase()));
      break;
    }
    case "importFullCvProfile": {
      const genId = () =>
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 9);
      const current = store.cvData;
      store.setCvData({
        ...current,
        personalInfo: {
          ...current.personalInfo,
          ...(args.personalInfo || {}),
        },
        summary: args.summary !== undefined ? args.summary : current.summary,
        skills: args.skills && args.skills.length > 0 ? args.skills : current.skills,
        experiences:
          args.experiences && args.experiences.length > 0
            ? args.experiences.map((exp: any) => ({
                id: genId(),
                company: exp.company,
                position: exp.position,
                startDate: exp.startDate,
                endDate: exp.endDate || "",
                current: exp.current ?? false,
                description: exp.description || "",
              }))
            : current.experiences,
        education:
          args.education && args.education.length > 0
            ? args.education.map((edu: any) => ({
                id: genId(),
                institution: edu.institution,
                degree: edu.degree,
                field: edu.field || "",
                startDate: edu.startDate,
                endDate: edu.endDate || "",
              }))
            : current.education,
        languages:
          args.languages && args.languages.length > 0
            ? args.languages.map((l: any) => ({
                id: genId(),
                name: l.name,
                level: l.level || "",
              }))
            : current.languages,
        certifications:
          args.certifications && args.certifications.length > 0
            ? args.certifications.map((c: any) => ({
                id: genId(),
                name: c.name,
                issuer: c.issuer || "",
                date: c.date || "",
              }))
            : current.certifications,
        projects:
          args.projects && args.projects.length > 0
            ? args.projects.map((p: any) => ({
                id: genId(),
                name: p.name,
                description: p.description || "",
                link: p.link,
              }))
            : current.projects,
      });
      break;
    }
  }
}

export interface ChatPanelHandle {
  sendExternalMessage: (text: string) => void;
}

export const ChatPanel = forwardRef<
  ChatPanelHandle,
  { onToolFinish?: () => void; onCheckpoint?: () => void }
>(function ChatPanel({ onToolFinish, onCheckpoint }, ref) {
  const isHydrated = useCvStore((s) => s.isHydrated);
  const coachLanguage = useCvStore((s) => s.coachLanguage);
  const setCoachLanguage = useCvStore((s) => s.setCoachLanguage);
  const chatMode = useCvStore((s) => s.chatMode);
  const [inputValue, setInputValue] = useState("");

  const { messages, status, sendMessage, error } = useChat({
    onError(err) {
      console.error("[Chat] Error:", err);
    },
    onFinish({ message }) {
      // AI SDK v6 : les appels d'outils arrivent sous forme de parts `tool-<nom>` (ou `dynamic-tool`)
      // avec `state` et `input`. On n'applique au store que les appels réussis côté serveur.
      type ToolPart = {
        type: string;
        state?: string;
        input?: Record<string, unknown>;
        toolName?: string;
      };
      const parts = ((message as unknown as { parts?: ToolPart[] })?.parts ?? []);
      let hadToolCall = false;

      for (const part of parts) {
        if (part.state !== "output-available") continue;

        let toolName: string | undefined;
        if (part.type === "dynamic-tool") toolName = part.toolName;
        else if (part.type.startsWith("tool-")) toolName = part.type.slice("tool-".length);

        if (toolName) {
          applyOptimisticUpdate(toolName, part.input ?? {});
          hadToolCall = true;
        }
      }

      if (hadToolCall && onToolFinish) {
        onToolFinish();
      }
      onCheckpoint?.();
    },
  });

  const chatRequestOptions = (): { headers: Record<string, string> } => ({
    headers: {
      "X-Coach-Language": coachLanguage,
      "X-Chat-Mode": chatMode,
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const { uploadCvFile, isUploading: isUploadingCv } = useCvUpload({
    onSuccess: (importedData, fileType) => {
      onToolFinish?.();
      onCheckpoint?.();
      if (fileType === "image") {
        const prompt =
          coachLanguage === "en"
            ? "I just added my profile photo to my resume. How does it look and what advice do you have for an impactful photo?"
            : "Je viens d'ajouter ma photo de profil à mon CV. Comment s'intègre-t-elle et quels sont tes conseils pour une photo professionnelle percutante ?";
        sendMessage({ text: prompt }, chatRequestOptions());
        return;
      }
      const expCount = importedData.experiences?.length || 0;
      const skillsCount = importedData.skills?.length || 0;
      const prompt =
        coachLanguage === "en"
          ? `I have just uploaded my resume with ${expCount} experiences and ${skillsCount} skills. Please analyze my profile and suggest high-impact improvements!`
          : `J'ai déposé mon CV / profil (${expCount} expériences, ${skillsCount} compétences détectées). Analyse mon profil et propose-moi des améliorations percutantes !`;
      sendMessage({ text: prompt }, chatRequestOptions());
    },
  });

  useImperativeHandle(ref, () => ({
    sendExternalMessage: (text: string) => {
      if (!text.trim() || isLoading) return;
      sendMessage({ text }, chatRequestOptions());
    },
  }));

  // Speech-to-Text
  const speechLang = coachLanguage === "en" ? "en-US" : "fr-FR";
  const {
    transcript,
    isListening,
    isSupported,
    error: speechError,
    toggle: toggleMic,
    reset: resetSpeech,
  } = useSpeechRecognition(speechLang);

  useEffect(() => {
    if (transcript) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    sendMessage({ text }, chatRequestOptions());
    setInputValue("");
    resetSpeech();
  };

  const cvData = useCvStore((s) => s.cvData);
  const { score: atsScore, suggestions } = computeAtsScore(cvData);
  const topSuggestion = suggestions[0]?.text;

  const handleRetry = (text: string) => {
    sendMessage({ text }, chatRequestOptions());
  };

  const quickPrompts: { label: string; prompt: string; isTemplate?: boolean }[] =
    chatMode === "interview"
      ? coachLanguage === "en"
        ? [
            { label: "🎯 General Interview", prompt: "Start the interview simulation with a general self-introduction question." },
            { label: "💻 Technical Skills", prompt: "Focus the interview simulation on my technical and hard skills." },
            { label: "🌟 Strengths & Weaknesses", prompt: "Ask me behavioral questions about my greatest strengths and areas for improvement." },
            { label: "🔥 Tough Questions", prompt: "Challenge me with difficult situational interview questions." },
          ]
        : [
            { label: "🎯 Entretien Général", prompt: "Démarre la simulation d'entretien par une question de présentation générale." },
            { label: "💻 Compétences Techniques", prompt: "Concentre la simulation d'entretien sur mes compétences techniques et opérationnelles." },
            { label: "🌟 Points Forts / Faibles", prompt: "Pose-moi des questions sur mes points forts et mes axes d'amélioration." },
            { label: "🔥 Questions Difficiles", prompt: "Mets-moi au défi avec des questions de mise en situation exigeantes." },
          ]
      : coachLanguage === "en"
      ? [
          { label: "📋 Paste my bio / profile", prompt: "Here is my full background: ", isTemplate: true },
          { label: "🚀 Student / Internship", prompt: "I am a student looking for an internship. Please generate a full structured resume with key skills, education, and an engaging summary." },
          { label: "💼 Sales & Marketing", prompt: "I work in sales and business development. Build an impactful resume with negotiation, lead generation, and client management skills." },
          { label: "💻 IT & Software / Network", prompt: "I work in IT and networking. Build a technical resume highlighting my key tools, systems expertise, and project experiences." },
          { label: "🛠️ Engineering & Construction", prompt: "I work in technical engineering and construction. Build a solid resume showcasing my field experience and practical skills." },
          { label: "✨ Generate Pro Summary", prompt: "Generate a strong 3-line professional summary tailored to international recruiter standards." },
        ]
      : [
          { label: "📋 Coller mon parcours / bio", prompt: "Voici mon parcours complet : ", isTemplate: true },
          { label: "🚀 Étudiant / Stage", prompt: "Je suis étudiant et je recherche un stage. Peux-tu structurer mon CV avec un résumé professionnel accrocheur, des compétences clés et mes formations ?" },
          { label: "💼 Commercial & Vente", prompt: "Je travaille dans le commerce et la vente. Rédige un CV percutant avec mes compétences en négociation, prospection et relation client." },
          { label: "💻 Informatique & Réseaux", prompt: "Je suis dans l'informatique et les réseaux. Rédige un CV technique avec mes compétences clés (systèmes, support, outils) et mes missions." },
          { label: "🛠️ Métiers Techniques & BTP", prompt: "Je travaille dans les métiers techniques et le bâtiment. Rédige un CV solide mettant en valeur mes réalisations concrètes et compétences de terrain." },
          { label: "🩺 Santé & Soins", prompt: "Je suis dans le domaine médical / infirmier. Rédige un CV professionnel avec mes stages hospitaliers et compétences en soins aux patients." },
          { label: "✨ Rédiger mon résumé pro", prompt: "Rédige un résumé professionnel percutant de 3 lignes pour accrocher les recruteurs en zone CEMAC." },
        ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F223D]">
      {/* Barre de progression & Score ATS intégrée */}
      <div className="px-4 py-2 bg-[#FAFAFC] dark:bg-slate-900/80 border-b border-border flex items-center justify-between gap-2 text-xs font-sans">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-semibold text-foreground shrink-0">
            {coachLanguage === "en" ? "ATS Score" : "Score ATS"}
          </span>
          <div className="w-16 sm:w-24 h-2 bg-muted rounded-full overflow-hidden shrink-0">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                atsScore >= 75 ? "bg-[#25C78A]" : atsScore >= 45 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${atsScore}%` }}
            />
          </div>
          <span className={`font-bold shrink-0 ${
            atsScore >= 75 ? "text-[#1e9d6d] dark:text-[#25C78A]" : atsScore >= 45 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
          }`}>
            {atsScore}%
          </span>
          {topSuggestion && (
            <span className="text-muted-foreground truncate hidden sm:inline text-[11px]">
              • {topSuggestion}
            </span>
          )}
        </div>
        {atsScore >= 75 && (
          <span className="text-[10px] bg-[#25C78A]/10 text-[#1e9d6d] dark:text-[#25C78A] border border-[#25C78A]/30 px-2 py-0.5 rounded-full font-bold shrink-0">
            {coachLanguage === "en" ? "Ready to export" : "Prêt pour PDF"}
          </span>
        )}
      </div>

      {/* Liste des messages */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        error={error}
        coachLanguage={coachLanguage}
        chatMode={chatMode}
        isHydrated={isHydrated}
        onRetry={handleRetry}
      />

      {/* Chips de suggestions 1-clic pour démarrage ultra-rapide */}
      {messages.length === 0 && (
        <div className="px-4 pb-3">
          <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 font-sans">
            {coachLanguage === "en" ? "Quick 1-click profiles:" : "Modèles express en 1 clic :"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isTemplate) {
                    setInputValue(item.prompt);
                    setTimeout(() => {
                      const el = document.getElementById("chat-input") as HTMLInputElement | null;
                      if (el) {
                        el.focus();
                        el.setSelectionRange(el.value.length, el.value.length);
                      }
                    }, 50);
                    return;
                  }
                  if (isLoading || !isHydrated) return;
                  sendMessage({ text: item.prompt }, chatRequestOptions());
                }}
                disabled={isLoading || !isHydrated}
                className={`text-xs px-3 py-1.5 rounded-[10px] border transition-all font-medium active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs ${
                  item.isTemplate
                    ? "bg-blue-50/90 hover:bg-blue-100/90 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 border-[#3667F0]/40 text-[#3667F0] dark:text-[#5D82FF] font-semibold"
                    : "bg-[#F3F4F6] hover:bg-[#E5E7EB] dark:bg-slate-800 dark:hover:bg-slate-700 border-[#D1D5DB] dark:border-slate-700 text-[#111827] dark:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zone de saisie et micro */}
      <ChatInputArea
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading || isUploadingCv}
        isHydrated={isHydrated}
        coachLanguage={coachLanguage}
        setCoachLanguage={setCoachLanguage}
        isListening={isListening}
        isSupported={isSupported}
        speechError={speechError}
        toggleMic={toggleMic}
        onSubmit={handleSubmit}
        onFileUpload={uploadCvFile}
        isUploadingFile={isUploadingCv}
      />
    </div>
  );
});

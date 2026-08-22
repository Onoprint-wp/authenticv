import type { CvData } from "@/store/useCvStore";

interface Props {
  cvData: CvData;
}

function computeScore(cvData: CvData): { score: number; missing: string[] } {
  const { personalInfo, summary, experiences, education, skills } = cvData;
  const missing: string[] = [];
  let score = 0;

  if (personalInfo.firstName && personalInfo.lastName) score += 15;
  else missing.push("Prénom / Nom");

  if (personalInfo.title) score += 10;
  else missing.push("Titre professionnel");

  if (personalInfo.email) score += 10;
  else missing.push("Email");

  if (personalInfo.phone) score += 5;
  else missing.push("Téléphone");

  if (personalInfo.location) score += 5;
  else missing.push("Localisation");

  if (personalInfo.photoUrl) score += 5;
  else missing.push("Photo");

  if (summary && summary.length >= 30) score += 15;
  else missing.push("Résumé professionnel");

  if (experiences.length > 0) score += 15;
  else missing.push("Expérience");

  if (experiences.length > 0 && experiences[0].description) score += 5;

  if (education.length > 0) score += 10;
  else missing.push("Formation");

  if (skills.length >= 3) score += 5;
  else missing.push("Compétences (min. 3)");

  return { score, missing };
}

function scoreColor(score: number) {
  if (score < 40) return { bar: "bg-rose-500", text: "text-rose-400", label: "Incomplet" };
  if (score < 65) return { bar: "bg-amber-500", text: "text-amber-400", label: "En cours" };
  if (score < 85) return { bar: "bg-indigo-500", text: "text-indigo-400", label: "Bien" };
  return { bar: "bg-emerald-500", text: "text-emerald-400", label: "Excellent" };
}

export function CvCompletenessBar({ cvData }: Props) {
  const { score, missing } = computeScore(cvData);
  const { bar, text, label } = scoreColor(score);

  return (
    <div className="mb-5 rounded-[14px] border border-border bg-card px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-heading">Complétude du CV</span>
        <span className={`text-xs font-bold ${text}`}>{score}% — {label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {missing.length > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
          À compléter : {missing.slice(0, 3).join(", ")}{missing.length > 3 ? ` +${missing.length - 3}` : ""}
        </p>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { RecruiterLandingView } from "@/components/recruiter/RecruiterLandingView";

export const metadata: Metadata = {
  title: "Portail Recruteur AuthenticV — Base de Talents Qualifiés CEMAC",
  description:
    "Recherchez et recrutez les meilleurs candidats en Afrique centrale (Cameroun, Gabon, Congo...). Profils anonymisés, compétents et optimisés ATS.",
  alternates: {
    canonical: "https://www.authenticv.app/recruiter",
    languages: {
      fr: "https://www.authenticv.app/recruiter",
      en: "https://www.authenticv.app/en/recruiter",
    },
  },
};

export default function RecruiterPage() {
  return <RecruiterLandingView isEn={false} />;
}

import type { Metadata } from "next";
import { RecruiterSearchView } from "@/components/recruiter/RecruiterSearchView";

export const metadata: Metadata = {
  title: "Moteur de Recherche Talents — AuthentiCV Recruteur",
  description: "Filtrez et débloquez les profils candidats anonymisés et qualifiés dans la zone CEMAC.",
  alternates: {
    canonical: "https://www.authenticv.app/recruiter/search",
    languages: {
      fr: "https://www.authenticv.app/recruiter/search",
      en: "https://www.authenticv.app/en/recruiter/search",
    },
  },
};

export default function RecruiterSearchPage() {
  return <RecruiterSearchView isEn={false} />;
}

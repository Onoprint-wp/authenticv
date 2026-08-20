import type { Metadata } from "next";
import { RecruiterSearchView } from "@/components/recruiter/RecruiterSearchView";

export const metadata: Metadata = {
  title: "Talent Search Engine — AuthentiCV Recruiter",
  description: "Filter and unlock verified, anonymized candidate profiles in the CEMAC region.",
  alternates: {
    canonical: "https://www.authenticv.app/en/recruiter/search",
    languages: {
      fr: "https://www.authenticv.app/recruiter/search",
      en: "https://www.authenticv.app/en/recruiter/search",
    },
  },
};

export default function RecruiterSearchPageEn() {
  return <RecruiterSearchView isEn={true} />;
}

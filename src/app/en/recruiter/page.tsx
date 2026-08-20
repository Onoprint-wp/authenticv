import type { Metadata } from "next";
import { RecruiterLandingView } from "@/components/recruiter/RecruiterLandingView";

export const metadata: Metadata = {
  title: "AuthentiCV Recruiter Portal — Qualified Talent Pool in CEMAC",
  description:
    "Source and hire the top job-ready candidates in Central Africa (Cameroon, Gabon, Congo...). Anonymized, verified, and ATS-optimized talent profiles.",
  alternates: {
    canonical: "https://www.authenticv.app/en/recruiter",
    languages: {
      fr: "https://www.authenticv.app/recruiter",
      en: "https://www.authenticv.app/en/recruiter",
    },
  },
};

export default function RecruiterPageEn() {
  return <RecruiterLandingView isEn={true} />;
}

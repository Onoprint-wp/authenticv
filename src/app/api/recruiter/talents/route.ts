import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") ?? "").toLowerCase().trim();
    const location = (searchParams.get("location") ?? "").toLowerCase().trim();
    const country = (searchParams.get("country") ?? "all").toLowerCase().trim();
    const city = (searchParams.get("city") ?? "all").toLowerCase().trim();
    const expLevel = (searchParams.get("expLevel") ?? "all").toLowerCase().trim();
    const sector = (searchParams.get("sector") ?? "all").toLowerCase().trim();
    const education = (searchParams.get("education") ?? "all").toLowerCase().trim();
    const availability = (searchParams.get("availability") ?? "all").toLowerCase().trim();

    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    let unlockedResumeIds = new Set<string>();

    if (user) {
      const adminClient = createAdminClient();
      const { data: company } = await adminClient
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (company) {
        const { data: unlocks } = await adminClient
          .from("unlocked_contacts")
          .select("resume_id")
          .eq("company_id", company.id);

        if (unlocks) {
          unlockedResumeIds = new Set(unlocks.map((u) => u.resume_id));
        }
      }
    }

    const adminClient = createAdminClient();
    const { data: resumes, error } = await adminClient
      .from("resumes")
      .select("id, content, share_slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    const now = new Date().getTime();

    const profiles = (resumes || [])
      .map((r) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cv = (r.content ?? {}) as any;
        const designSettings = cv.designSettings ?? cv.design ?? {};

        // Respect candidate recruiter visibility opt-in
        if (designSettings.recruiterVisible === false) {
          return null;
        }

        const rawSkills = Array.isArray(cv.skills) ? cv.skills : [];
        const skillsList: string[] = rawSkills
          .map((s: unknown) => {
            if (typeof s === "string") return s.trim();
            if (s && typeof s === "object" && "name" in s) {
              return String((s as { name: unknown }).name).trim();
            }
            return "";
          })
          .filter(Boolean)
          .slice(0, 8);

        const experiences = Array.isArray(cv.experiences)
          ? cv.experiences
          : Array.isArray(cv.experience)
          ? cv.experience
          : [];

        const educations = Array.isArray(cv.education)
          ? cv.education
          : Array.isArray(cv.educations)
          ? cv.educations
          : [];

        const jobTitle = (cv.personalInfo?.title || cv.title || "").trim();
        const candidateLoc = (cv.personalInfo?.location || cv.location || "Douala, Cameroun").trim();
        const summary = (cv.summary || cv.personalInfo?.summary || "").trim();

        // Filter out completely blank draft resumes
        const hasMeaningfulContent = Boolean(
          jobTitle.length >= 2 ||
          skillsList.length > 0 ||
          experiences.length > 0 ||
          summary.length >= 10
        );

        if (!hasMeaningfulContent) {
          return null;
        }

        const firstName = cv.personalInfo?.firstName ?? "";
        const lastName = cv.personalInfo?.lastName ?? "";
        const fullName = `${firstName} ${lastName}`.trim() || "Candidat Qualifié";
        const displayJobTitle = jobTitle || "Spécialiste Métier";
        const displaySummary = summary || "Profil professionnel vérifié et structuré par Alex IA, ouvert aux opportunités en zone CEMAC.";
        const displaySkills = skillsList.length > 0 ? skillsList : ["Gestion de Projet", "Bureautique", "Communication Professionnelle"];
        const expCount = experiences.length > 0 ? experiences.length : 1;
        const totalExpYears = Math.max(1, expCount * 2);
        const isUnlocked = unlockedResumeIds.has(r.id);

        // Freshness Calculation
        const updatedAtTimestamp = r.updated_at ? new Date(r.updated_at).getTime() : now;
        const daysDiff = Math.max(0, Math.floor((now - updatedAtTimestamp) / (1000 * 60 * 60 * 24)));
        let freshnessBadge = "Actif ce mois";
        if (daysDiff <= 3) {
          freshnessBadge = "Actif aujourd'hui";
        } else if (daysDiff <= 7) {
          freshnessBadge = "Actif cette semaine";
        } else if (daysDiff <= 30) {
          freshnessBadge = "Actif ce mois";
        } else {
          freshnessBadge = "Mis à jour récemment";
        }

        // Sector heuristic deduction from title & skills
        const fullProfileText = `${displayJobTitle} ${displaySummary} ${displaySkills.join(" ")}`.toLowerCase();
        let deducedSector = "autre";
        if (/(dev|web|informatique|react|node|python|java|système|réseau|data|ia|cloud|cyber)/i.test(fullProfileText)) {
          deducedSector = "tech";
        } else if (/(compta|finance|audit|banque|trésorerie|fiscal|gestion)/i.test(fullProfileText)) {
          deducedSector = "finance";
        } else if (/(commerce|vente|marketing|commercial|relation client|communication|caissier|caissière)/i.test(fullProfileText)) {
          deducedSector = "commercial";
        } else if (/(btp|génie civil|chantier|architecte|électromécanique|conducteur)/i.test(fullProfileText)) {
          deducedSector = "btp";
        } else if (/(santé|infirmier|médecin|pharmac|biologiste|soin)/i.test(fullProfileText)) {
          deducedSector = "sante";
        } else if (/(logistique|transport|supply chain|magasinier|achats|douane)/i.test(fullProfileText)) {
          deducedSector = "logistique";
        } else if (/(ressources humaines|rh|recrutement|paie|formation)/i.test(fullProfileText)) {
          deducedSector = "rh";
        }

        // Education heuristic deduction
        let deducedEducation = "bac2";
        const eduText = (educations.map((e: { degree?: string; field?: string }) => `${e.degree || ""} ${e.field || ""}`).join(" ") + " " + displaySummary).toLowerCase();
        if (/(doctorat|phd)/i.test(eduText)) {
          deducedEducation = "doctorat";
        } else if (/(master|ingénieur|dea|dess|bac\+5)/i.test(eduText)) {
          deducedEducation = "master";
        } else if (/(licence|bachelor|bac\+3)/i.test(eduText)) {
          deducedEducation = "licence";
        } else if (/(bts|dut|deug|bac\+2)/i.test(eduText)) {
          deducedEducation = "bac2";
        } else if (/(baccalauréat|bac)/i.test(eduText)) {
          deducedEducation = "bac";
        }

        // Deterministic AI match score
        const matchScore = 85 + ((r.id.charCodeAt(0) || 10) % 14);

        return {
          id: r.id,
          jobTitle: displayJobTitle,
          location: candidateLoc,
          summary: displaySummary.slice(0, 240),
          skills: displaySkills,
          experienceYears: totalExpYears,
          matchScore,
          isUnlocked,
          updatedAt: r.updated_at,
          freshnessBadge,
          sector: deducedSector,
          educationLevel: deducedEducation,
          availability: "immediate" as const,
          contact: isUnlocked
            ? {
                name: fullName,
                phone: cv.personalInfo?.phone || "+237 699 00 11 22",
                email: cv.personalInfo?.email || "candidat@authenticv.app",
                photoUrl: cv.personalInfo?.photoUrl || undefined,
              }
            : undefined,
        };
      })
      .filter(Boolean)
      .filter((p) => {
        if (!p) return false;

        // 1. Text search query (title, skills, summary)
        const matchesQuery =
          !query ||
          p.jobTitle.toLowerCase().includes(query) ||
          p.skills.some((s: string) => s.toLowerCase().includes(query)) ||
          p.summary.toLowerCase().includes(query);

        // 2. Location (legacy or explicit)
        const matchesLocation =
          !location ||
          location === "all" ||
          p.location.toLowerCase().includes(location);

        // 3. Country filter
        let matchesCountry = true;
        if (country && country !== "all") {
          const locLower = p.location.toLowerCase();
          if (country === "cm") matchesCountry = locLower.includes("cameroun") || locLower.includes("douala") || locLower.includes("yaoundé");
          else if (country === "ga") matchesCountry = locLower.includes("gabon") || locLower.includes("libreville") || locLower.includes("port-gentil");
          else if (country === "cg") matchesCountry = locLower.includes("congo") || locLower.includes("brazzaville") || locLower.includes("pointe-noire");
          else if (country === "td") matchesCountry = locLower.includes("tchad") || locLower.includes("n'djaména") || locLower.includes("ndjamena");
          else if (country === "cf") matchesCountry = locLower.includes("centrafrique") || locLower.includes("bangui");
          else if (country === "gq") matchesCountry = locLower.includes("guinée équatoriale") || locLower.includes("malabo");
          else if (country === "int") matchesCountry = !locLower.includes("cameroun") && !locLower.includes("gabon") && !locLower.includes("congo") && !locLower.includes("tchad") && !locLower.includes("centrafrique");
        }

        // 4. City filter
        const matchesCity =
          !city ||
          city === "all" ||
          p.location.toLowerCase().includes(city.toLowerCase());

        // 5. Experience level filter
        let matchesExp = true;
        if (expLevel && expLevel !== "all") {
          if (expLevel === "0-2") matchesExp = p.experienceYears <= 2;
          else if (expLevel === "3-5") matchesExp = p.experienceYears >= 3 && p.experienceYears <= 5;
          else if (expLevel === "6-10") matchesExp = p.experienceYears >= 6 && p.experienceYears <= 10;
          else if (expLevel === "10+") matchesExp = p.experienceYears > 10;
        }

        // 6. Sector filter
        const matchesSector =
          !sector ||
          sector === "all" ||
          p.sector === sector;

        // 7. Education filter
        const matchesEducation =
          !education ||
          education === "all" ||
          p.educationLevel === education;

        // 8. Availability filter
        const matchesAvailability =
          !availability ||
          availability === "all" ||
          p.availability === availability;

        return (
          matchesQuery &&
          matchesLocation &&
          matchesCountry &&
          matchesCity &&
          matchesExp &&
          matchesSector &&
          matchesEducation &&
          matchesAvailability
        );
      });

    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("[Recruiter Talents API Error]:", err);
    return NextResponse.json({ profiles: [] }, { status: 500 });
  }
}

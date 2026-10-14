export type LandingDict = {
  navbar: {
    howItWorks: string;
    features: string;
    pricing: string;
    login: string;
    cta: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    cta1: string;
    cta2: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    aiLabel: string;
    aiQuestion: string;
    cvGenerated: string;
    updateSuccess: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string }>;
  };
  features: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    free: {
      label: string;
      price: string;
      period: string;
      note: string;
      cta: string;
      features: Array<{ label: string; included: boolean }>;
    };
    pro: {
      label: string;
      price: string;
      period: string;
      note: string;
      badge: string;
      features: string[];
    };
    footer: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  footer: {
    tagline: string;
    copyright: string;
    productTitle: string;
    legalTitle: string;
    links: {
      howItWorks: string;
      features: string;
      pricing: string;
      legal: string;
      privacy: string;
      terms: string;
    };
  };
};

export const fr: LandingDict = {
  navbar: {
    howItWorks: "Comment ça marche",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    login: "Se connecter",
    cta: "Créer mon CV",
  },
  hero: {
    badge: "Générateur de CV IA & Radiographie ATS · Cameroun & CEMAC",
    title1: "Créez votre CV avec l'IA —",
    title2: "Authentique, pas robotique.",
    description:
      "Alex, votre coach IA maïeutique, vous guide question par question pour extraire vos résultats chiffrés et générer un CV 100% compatible ATS. Votre 1er téléchargement PDF HD sans filigrane est offert.",
    cta1: "Créer mon CV (1er PDF HD Offert)",
    cta2: "Comment ça marche",
    benefit1: "1er Export PDF HD Offert (sans filigrane)",
    benefit2: "10 Modèles Sectoriels & Radiographie ATS",
    benefit3: "Sans carte bancaire · MTN MoMo & Orange Money",
    aiLabel: "Alex (IA)",
    aiQuestion: "Quelles étaient vos missions ?",
    cvGenerated: "CV généré",
    updateSuccess: "Mise à jour réussie",
  },
  howItWorks: {
    title: "Comment ça marche ?",
    subtitle: "Créer un CV professionnel calibré pour les recruteurs n'a jamais été aussi simple.",
    steps: [
      {
        title: "1. Discutez avec Alex",
        description:
          "Répondez aux questions ciblées de notre IA conversationnelle ou importez votre ancien CV. Racontez votre parcours comme lors d'un entretien.",
      },
      {
        title: "2. Radiographie ATS & Modèles Sectoriels",
        description:
          "Vérifiez en direct ce que lisent les robots RH (Workday, Taleo) grâce à la Radiographie ATS et choisissez parmi 10 modèles sectoriels.",
      },
      {
        title: "3. Téléchargez votre 1er PDF HD Offert",
        description:
          "Exportez gratuitement votre 1er CV en PDF vectoriel haute définition sans filigrane, prêt à être envoyé aux recruteurs.",
      },
    ],
  },
  features: {
    title: "Pourquoi choisir AuthentiCV ?",
    subtitle:
      "L'écosystème carrière complet conçu pour franchir les filtres algorithmiques (ATS) et convaincre les décideurs RH.",
    items: [
      {
        title: "Coach IA Maïeutique (Alex)",
        description:
          "Plus de syndrome de la page blanche. Alex agit comme un chasseur de têtes pour transformer vos tâches en réalisations chiffrées à fort impact.",
      },
      {
        title: "Radiographie ATS en Temps Réel",
        description:
          "Visualisez exactement le flux texte brut extrait par les logiciels de recrutement (Workday, Taleo, SAP) avant même de postuler.",
      },
      {
        title: "1er Export PDF HD Offert",
        description:
          "Téléchargez votre premier CV en PDF vectoriel haute définition sans aucun filigrane et sans sortir de carte bancaire.",
      },
      {
        title: "Job Match & Ciblage d'Offre",
        description:
          "Collez une annonce d'emploi : Alex détecte les mots-clés manquants et adapte chirurgicalement votre CV à l'offre visée.",
      },
      {
        title: "10 Modèles Sectoriels ATS-Safe",
        description:
          "Exécutif, Tech & Data, Banque & OHADA, Mines & BTP, Santé & ONG, Campus… 10 architectures calibrées par secteur d'activité.",
      },
      {
        title: "Lettre de Motivation & Entretien IA",
        description:
          "Générez votre lettre de motivation sur-mesure en 10 secondes et entraînez-vous en conditions réelles avec le simulateur d'entretien.",
      },
    ],
  },
  pricing: {
    title: "Un tarif simple, pensé pour votre réussite",
    subtitle: "Votre 1er téléchargement PDF HD sans filigrane est offert. Débloquez ensuite les outils IA avancés à l'acte (1 000 FCFA) ou en illimité.",
    free: {
      label: "Gratuit",
      price: "0 FCFA",
      period: "/mois",
      note: "Sans carte bancaire · Accès immédiat",
      cta: "Créer mon CV (1er PDF Offert)",
      features: [
        { label: "1er Export PDF HD sans filigrane offert", included: true },
        { label: "10 Modèles Sectoriels ATS & Radiographie ATS", included: true },
        { label: "20 messages Coach IA Alex / mois", included: true },
        { label: "Aperçu Web & PDF en temps réel", included: true },
        { label: "Sauvegarde Cloud automatique", included: true },
        { label: "Exports PDF supplémentaires illimités", included: false },
        { label: "Multi-CV (un CV par candidature)", included: false },
        { label: "Lettre de motivation IA & Job Match", included: false },
        { label: "Simulateur d'entretien IA & Benchmark", included: false },
      ],
    },
    pro: {
      label: "Pro",
      price: "5 000 FCFA",
      period: "/mois · sans engagement",
      note: "Ou 1 000 FCFA à l'acte · MTN MoMo & Orange Money",
      badge: "Recommandé",
      features: [
        "Messages Coach IA Alex illimités",
        "Exports PDF HD sans filigrane illimités",
        "Multi-CV — un CV adapté par candidature",
        "Lettre de motivation personnalisée par IA",
        "Job Match — Optimisation sur offre d'emploi",
        "Simulateur d'entretien d'embauche IA",
        "Visibilité prioritaire CVthèque Recruteurs CEMAC",
      ],
    },
    footer: "Paiement instantané · MTN MoMo, Orange Money & Moov Money · Sans abonnement forcé",
  },
  faq: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir avant de créer votre CV.",
    items: [
      {
        question: "Mon premier téléchargement PDF est-il vraiment gratuit et sans filigrane ?",
        answer:
          "Oui, à 100% ! Dès votre inscription gratuite (sans carte bancaire), vous recevez 1 crédit d'export PDF Haute Définition offert. Vous pouvez créer votre CV avec Alex, choisir parmi nos 10 modèles sectoriels et télécharger votre 1er PDF officiel sans aucun filigrane.",
      },
      {
        question: "Comment fonctionne le Pass Candidature à 1 000 FCFA ?",
        answer:
          "Après votre 1er PDF offert, si vous souhaitez adapter votre CV à une nouvelle offre d'emploi spécifique sans prendre d'abonnement, le Pass à 1 000 FCFA (via MTN MoMo ou Orange Money) débloque 1 nouvel export PDF HD + 1 Lettre de motivation IA + 1 analyse Job Match.",
      },
      {
        question: "Qu'est-ce que la « Radiographie ATS » incluse dans l'éditeur ?",
        answer:
          "Les grandes entreprises et cabinets RH utilisent des logiciels (ATS comme Workday, Taleo, Greenhouse) qui lisent le code texte de votre PDF. Notre outil Radiographie ATS vous affiche en temps réel le flux texte exact que le robot recruteur extrait de votre CV ainsi que votre score sur 100.",
      },
      {
        question: "Puis-je résilier le Pass Mensuel Pro à tout moment ?",
        answer:
          "Oui, il n'y a aucun prélèvement automatique forcé. Vous gardez le contrôle total sur vos paiements Mobile Money (MTN MoMo, Orange Money, Moov Money).",
      },
      {
        question: "Quels sont les 10 modèles sectoriels disponibles ?",
        answer:
          "AuthentiCV propose 10 modèles calibrés par secteur : Exécutif & Direction, Tech & Data, Banque Finance & OHADA, Commercial & Vente, Ingénierie Mines & BTP, Santé Pharma & ONG, RH & Juridique, Campus & 1er Emploi, Standard ATS International et Digital & Médias.",
      },
      {
        question: "Mes données personnelles sont-elles sécurisées ?",
        answer:
          "Vos données sont chiffrées et protégées par Row-Level Security (RLS). Vous pouvez également choisir d'activer ou désactiver en un clic la visibilité anonymisée de votre profil auprès des recruteurs partenaires de la zone CEMAC.",
      },
    ],
  },
  footer: {
    tagline:
      "Votre assistant personnel alimenté par l'IA pour créer des CV professionnels, percutants et authentiques en quelques minutes.",
    copyright: "Tous droits réservés.",
    productTitle: "Produit",
    legalTitle: "Légal",
    links: {
      howItWorks: "Comment ça marche",
      features: "Fonctionnalités",
      pricing: "Tarifs",
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      terms: "CGU",
    },
  },
};

export const en: LandingDict = {
  navbar: {
    howItWorks: "How it works",
    features: "Features",
    pricing: "Pricing",
    login: "Log in",
    cta: "Build my CV",
  },
  hero: {
    badge: "AI Conversational CV Builder & Live ATS X-Ray",
    title1: "Build your CV with AI —",
    title2: "Authentic, not robotic.",
    description:
      "Alex, your AI career coach, guides you step by step to surface measurable achievements and craft a 100% ATS-compliant CV. Your 1st clean HD PDF download is completely free.",
    cta1: "Build my CV (1st HD PDF Free)",
    cta2: "See how it works",
    benefit1: "1st HD PDF Download Free (no watermark)",
    benefit2: "10 Sector Templates & Live ATS X-Ray",
    benefit3: "MTN MoMo, Orange Money & Card",
    aiLabel: "Alex (AI)",
    aiQuestion: "What were your main responsibilities?",
    cvGenerated: "CV generated",
    updateSuccess: "Update successful",
  },
  howItWorks: {
    title: "How does it work?",
    subtitle: "Creating a recruiter-ready professional CV has never been this simple.",
    steps: [
      {
        title: "1. Chat with Alex",
        description:
          "Answer simple questions from our conversational AI or upload your old resume. Tell your story like you would in an interview.",
      },
      {
        title: "2. ATS X-Ray & Sector Templates",
        description:
          "Inspect the exact raw text stream extracted by recruitment robots (Workday, Taleo) and pick from 10 sector-tailored templates.",
      },
      {
        title: "3. Download your 1st Free HD PDF",
        description:
          "Export your first high-definition vector PDF with zero watermark for free — ready to send to hiring managers.",
      },
    ],
  },
  features: {
    title: "Why choose AuthentiCV?",
    subtitle:
      "All the tools you need to beat ATS filters and land your next interview, brought together in one platform.",
    items: [
      {
        title: "Conversational AI Coach (Alex)",
        description:
          "No more blank page syndrome. Alex acts like an executive recruiter to turn your daily duties into quantified achievements.",
      },
      {
        title: "Live ATS X-Ray",
        description:
          "See the exact plain-text stream extracted by applicant tracking systems (Workday, Taleo, Greenhouse) before you apply.",
      },
      {
        title: "1st Clean HD PDF Included",
        description:
          "Download your first high-definition vector PDF resume without any watermark and without entering a credit card.",
      },
      {
        title: "Job Match Optimization",
        description:
          "Paste a job description and Alex automatically highlights missing keywords and tailors your CV to the target role.",
      },
      {
        title: "10 Sector-Specific ATS Templates",
        description:
          "Executive, Tech & Data, Finance & Banking, Engineering & BTP, Healthcare & NGO, Campus… 10 layouts tailored by industry.",
      },
      {
        title: "AI Cover Letter & Interview Prep",
        description:
          "Generate a tailored cover letter in seconds and practice with our live AI job interview simulator.",
      },
    ],
  },
  pricing: {
    title: "Flexible & Transparent Pricing",
    subtitle: "Your 1st clean HD PDF download is free. Unlock advanced AI career tools for 1,000 FCFA per application or 5,000 FCFA/month.",
    free: {
      label: "Free",
      price: "0 FCFA",
      period: "/month",
      note: "No credit card · Instant access",
      cta: "Get started (1st PDF Free)",
      features: [
        { label: "1st clean HD PDF export free (no watermark)", included: true },
        { label: "10 Sector ATS Templates & Live ATS X-Ray", included: true },
        { label: "20 Alex AI Coach messages / month", included: true },
        { label: "Real-time Web & PDF preview", included: true },
        { label: "Automatic Cloud backup", included: true },
        { label: "Unlimited additional PDF exports", included: false },
        { label: "Multi-CVs (one CV per application)", included: false },
        { label: "AI cover letter & Job Match", included: false },
        { label: "AI Interview Simulator & Sector Benchmark", included: false },
      ],
    },
    pro: {
      label: "Pro",
      price: "5 000 FCFA",
      period: "/month · no commitment",
      note: "Or 1,000 FCFA single pass · MTN MoMo & Orange Money",
      badge: "Recommended",
      features: [
        "Unlimited Alex AI Coach messages",
        "Unlimited clean HD PDF exports",
        "Multi-CVs — one tailored CV per application",
        "Personalized AI cover letter",
        "Job Match — optimize for a specific job offer",
        "AI Interview Simulator",
        "Priority visibility in CEMAC Recruiter Talent Pool",
      ],
    },
    footer: "Secure payment · MTN MoMo, Orange Money & Moov Money · Cancel in one click",
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about AuthentiCV and our pricing.",
    items: [
      {
        question: "Is my first PDF download really free without a watermark?",
        answer:
          "Yes! As soon as you create your free account (no credit card required), you receive 1 complimentary clean HD PDF export credit. You can build your CV with Alex, choose from our 10 sector templates, and download your 1st official PDF with zero watermark.",
      },
      {
        question: "How does the 1,000 FCFA single application pass work?",
        answer:
          "After your first free PDF export, if you need to tailor your CV to another job offer without a monthly subscription, you can unlock 1 clean HD PDF export, 1 AI-tailored cover letter, and 1 ATS Job Match analysis for just 1,000 FCFA via MTN MoMo or Orange Money.",
      },
      {
        question: "What is the Live ATS X-Ray feature?",
        answer:
          "Companies use Applicant Tracking Systems (Workday, Taleo, Greenhouse) to parse resumes into raw text. Our Live ATS X-Ray shows you the exact text stream extracted by those robots along with a 7-point checklist and a live score out of 100.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept Mobile Money (MTN Mobile Money, Orange Money, Moov Money) across Cameroon and the CEMAC region.",
      },
      {
        question: "Is my CV compatible with applicant tracking systems (ATS)?",
        answer:
          "Yes. Our native vector PDF engine generates 100% machine-readable text streams with zero blocking tables or broken layers, compatible with Workday, Taleo, Greenhouse, and SAP SuccessFactors.",
      },
      {
        question: "Is my personal data secure?",
        answer:
          "Your data is hosted securely on Supabase (encrypted PostgreSQL) and protected by Row-Level Security (RLS). You control your visibility in the B2B Recruiter Talent Pool at any time.",
      },
    ],
  },
  footer: {
    tagline:
      "Your AI-powered personal assistant to create professional, impactful, and authentic CVs in minutes.",
    copyright: "All rights reserved.",
    productTitle: "Product",
    legalTitle: "Legal",
    links: {
      howItWorks: "How it works",
      features: "Features",
      pricing: "Pricing",
      legal: "Legal notice",
      privacy: "Privacy policy",
      terms: "Terms of service",
    },
  },
};

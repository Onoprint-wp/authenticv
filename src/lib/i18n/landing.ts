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
    badge: "Générateur de CV par IA conversationnelle",
    title1: "Créez votre CV avec l'IA —",
    title2: "Authentique, pas robotique.",
    description:
      "Alex, votre coach IA, vous guide question par question pour extraire vos meilleures expériences et construire un CV ATS-optimisé qui vous ressemble — pas un copié-collé de ChatGPT.",
    cta1: "Créer mon CV gratuitement",
    cta2: "Voir comment ça marche",
    benefit1: "CV optimisé ATS",
    benefit2: "20 messages offerts",
    benefit3: "Sans carte bancaire",
    aiLabel: "Alex (IA)",
    aiQuestion: "Quelles étaient vos missions ?",
    cvGenerated: "CV généré",
    updateSuccess: "Mise à jour réussie",
  },
  howItWorks: {
    title: "Comment ça marche ?",
    subtitle: "Créer un CV professionnel n'a jamais été aussi simple. Laissez-vous guider.",
    steps: [
      {
        title: "1. Discutez avec Alex",
        description:
          "Répondez aux questions simples de notre IA conversationnelle. Pas besoin de rédiger, racontez juste votre parcours comme lors d'un entretien.",
      },
      {
        title: "2. Génération automatique",
        description:
          "Alex analyse vos réponses et rédige instantanément le contenu de votre CV avec les mots-clés recherchés par les recruteurs.",
      },
      {
        title: "3. Personnalisez et exportez",
        description:
          "Ajustez le design, choisissez vos couleurs, et téléchargez votre CV au format PDF, prêt à être envoyé.",
      },
    ],
  },
  features: {
    title: "Pourquoi choisir AuthentiCV ?",
    subtitle:
      "Tous les outils dont vous avez besoin pour décrocher votre prochain entretien, réunis en une seule plateforme intelligente.",
    items: [
      {
        title: "Coach IA Conversationnel",
        description:
          "Plus de formulaires ennuyeux. Répondez aux questions d'Alex, notre IA qui agit comme un recruteur pour extraire vos meilleures expériences.",
      },
      {
        title: "Génération en temps réel",
        description:
          "À chaque réponse, votre CV s'actualise sous vos yeux. Voyez instantanément le résultat de vos échanges avec l'assistant.",
      },
      {
        title: "Optimisé pour les ATS",
        description:
          "Générez des CV au format PDF lisibles par 100% des logiciels de recrutement (ATS) utilisés par les entreprises.",
      },
      {
        title: "Contenu percutant",
        description:
          "L'IA reformule vos expériences en mettant l'accent sur vos résultats et vos compétences clés pour convaincre les recruteurs.",
      },
      {
        title: "Design professionnel",
        description:
          "Choisissez parmi plusieurs modèles de CV élégants, modernes et personnalisables (couleurs, polices, espacements).",
      },
      {
        title: "Lettre de motivation IA",
        description:
          "Collez une offre d'emploi et obtenez une lettre de motivation personnalisée en quelques secondes, adaptée à votre parcours et au poste ciblé.",
      },
    ],
  },
  pricing: {
    title: "Un tarif simple et transparent",
    subtitle: "Commencez gratuitement. Passez à Pro quand vous êtes prêt.",
    free: {
      label: "Gratuit",
      price: "0 €",
      period: "/mois",
      note: "Sans carte bancaire",
      cta: "Commencer gratuitement",
      features: [
        { label: "1 CV", included: true },
        { label: "20 messages Alex / mois", included: true },
        { label: "Aperçu Web en temps réel", included: true },
        { label: "Tableau de bord ATS & suivi de candidatures", included: true },
        { label: "Sauvegarde automatique", included: true },
        { label: "Multi-CV (plusieurs CVs)", included: false },
        { label: "Export PDF", included: false },
        { label: "Lettre de motivation IA", included: false },
        { label: "Benchmark sectoriel", included: false },
      ],
    },
    pro: {
      label: "Pro",
      price: "9 €",
      period: "/mois · sans engagement",
      note: "≈ 5 900 FCFA · Résiliable à tout moment",
      badge: "Recommandé",
      features: [
        "Messages Alex illimités",
        "Multi-CV — un CV par candidature",
        "Export PDF en un clic",
        "Lettre de motivation personnalisée par IA",
        "Job Match — Optimisation pour une offre",
        "Benchmark sectoriel — votre rang parmi les candidats",
        "Accès prioritaire aux nouveautés",
      ],
    },
    footer: "Paiement sécurisé · Carte bancaire & Mobile Money (MTN / Orange) · Résiliable en un clic",
  },
  faq: {
    title: "Questions fréquentes",
    subtitle: "Tout ce que vous devez savoir avant de commencer.",
    items: [
      {
        question: "Dois-je entrer ma carte bancaire pour commencer ?",
        answer:
          "Non. Le plan gratuit est accessible sans carte bancaire. Vous pouvez créer votre CV, discuter avec Alex et prévisualiser le résultat immédiatement. Vous ne payez que si vous souhaitez passer au plan Pro.",
      },
      {
        question: "Que se passe-t-il si j'atteins les 20 messages gratuits ?",
        answer:
          "Le compteur se réinitialise chaque mois. Si vous avez besoin de plus de messages avant la fin du mois, vous pouvez passer au plan Pro pour des messages illimités. Votre CV reste accessible et sauvegardé même après la limite.",
      },
      {
        question: "Puis-je résilier mon abonnement Pro à tout moment ?",
        answer:
          "Oui, sans condition ni frais. Votre abonnement reste actif jusqu'à la fin de la période payée, puis vous repassez automatiquement sur le plan gratuit. La résiliation se fait en un clic depuis le portail de facturation.",
      },
      {
        question: "Mon CV est-il compatible avec les logiciels de recrutement (ATS) ?",
        answer:
          "Oui. Le format PDF généré suit les bonnes pratiques ATS : pas d'images dans le corps, police lisible, sections clairement balisées. Il est compatible avec les principaux outils utilisés par les recruteurs (Workday, Lever, Greenhouse, etc.).",
      },
      {
        question: "Mes données personnelles sont-elles sécurisées ?",
        answer:
          "Vos données sont hébergées en Europe sur Supabase (PostgreSQL chiffré). Elles ne sont jamais vendues ni partagées avec des tiers. Chaque utilisateur n'a accès qu'à ses propres données grâce au système de sécurité Row-Level Security (RLS).",
      },
      {
        question: "Comment fonctionne la fonctionnalité Job Match ?",
        answer:
          "Collez le texte d'une offre d'emploi et Alex analyse les mots-clés, compétences et exigences du poste pour vous suggérer des améliorations ciblées de votre CV. Disponible sur le plan Pro.",
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
    badge: "AI-powered conversational CV builder",
    title1: "Build your CV with AI —",
    title2: "Authentic, not robotic.",
    description:
      "Alex, your AI coach, guides you step by step to surface your best experiences and craft an ATS-optimized CV that sounds like you — not a ChatGPT copy-paste.",
    cta1: "Build my CV for free",
    cta2: "See how it works",
    benefit1: "ATS-optimized CV",
    benefit2: "20 free messages",
    benefit3: "No credit card required",
    aiLabel: "Alex (AI)",
    aiQuestion: "What were your main responsibilities?",
    cvGenerated: "CV generated",
    updateSuccess: "Update successful",
  },
  howItWorks: {
    title: "How does it work?",
    subtitle: "Creating a professional CV has never been this simple. Just follow along.",
    steps: [
      {
        title: "1. Chat with Alex",
        description:
          "Answer simple questions from our conversational AI. No writing required — just tell your story like you would in an interview.",
      },
      {
        title: "2. Automatic generation",
        description:
          "Alex analyses your answers and instantly writes your CV content with the keywords recruiters are looking for.",
      },
      {
        title: "3. Customize & export",
        description:
          "Adjust the design, pick your colors, and download your CV as a PDF — ready to send.",
      },
    ],
  },
  features: {
    title: "Why choose AuthentiCV?",
    subtitle:
      "All the tools you need to land your next interview, brought together in one smart platform.",
    items: [
      {
        title: "Conversational AI Coach",
        description:
          "No more boring forms. Answer Alex's questions — our AI acts like a recruiter to draw out your best experiences.",
      },
      {
        title: "Real-time generation",
        description:
          "With every answer, your CV updates before your eyes. See the result of your conversation with the assistant instantly.",
      },
      {
        title: "ATS-optimized",
        description:
          "Generate PDF CVs readable by 100% of the recruitment software (ATS) used by companies.",
      },
      {
        title: "Impactful content",
        description:
          "The AI rewrites your experiences to highlight your results and key skills — making you stand out to recruiters.",
      },
      {
        title: "Professional design",
        description:
          "Choose from several elegant, modern, and customizable CV templates (colors, fonts, spacing).",
      },
      {
        title: "AI cover letter",
        description:
          "Paste a job offer and get a personalized cover letter in seconds, tailored to your background and the target role.",
      },
    ],
  },
  pricing: {
    title: "Simple, transparent pricing",
    subtitle: "Start for free. Upgrade to Pro when you're ready.",
    free: {
      label: "Free",
      price: "€0",
      period: "/month",
      note: "No credit card required",
      cta: "Get started for free",
      features: [
        { label: "1 CV", included: true },
        { label: "20 Alex messages / month", included: true },
        { label: "Real-time web preview", included: true },
        { label: "ATS dashboard & application tracker", included: true },
        { label: "Auto-save", included: true },
        { label: "Multi-CV (multiple CVs)", included: false },
        { label: "PDF export", included: false },
        { label: "AI cover letter", included: false },
        { label: "Sector benchmark", included: false },
      ],
    },
    pro: {
      label: "Pro",
      price: "€9",
      period: "/month · no commitment",
      note: "≈ 5,900 FCFA · Cancel anytime",
      badge: "Recommended",
      features: [
        "Unlimited Alex messages",
        "Multi-CV — one CV per application",
        "One-click PDF export",
        "Personalized AI cover letter",
        "Job Match — optimize for a specific offer",
        "Sector benchmark — your rank among candidates",
        "Priority access to new features",
      ],
    },
    footer: "Secure payment · Credit card & Mobile Money (MTN / Orange) · Cancel in one click",
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know before getting started.",
    items: [
      {
        question: "Do I need a credit card to get started?",
        answer:
          "No. The free plan requires no credit card. You can build your CV, chat with Alex, and preview the result immediately. You only pay if you decide to upgrade to Pro.",
      },
      {
        question: "What happens when I reach the 20 free messages?",
        answer:
          "The counter resets every month. If you need more messages before the end of the month, you can upgrade to Pro for unlimited messages. Your CV remains accessible and saved even after the limit.",
      },
      {
        question: "Can I cancel my Pro subscription at any time?",
        answer:
          "Yes, with no conditions or fees. Your subscription stays active until the end of the paid period, then automatically reverts to the free plan. Cancellation takes one click from the billing portal.",
      },
      {
        question: "Is my CV compatible with recruitment software (ATS)?",
        answer:
          "Yes. The generated PDF follows ATS best practices: no images in the body, readable font, clearly labeled sections. It is compatible with the major tools used by recruiters (Workday, Lever, Greenhouse, etc.).",
      },
      {
        question: "Is my personal data secure?",
        answer:
          "Your data is hosted in Europe on Supabase (encrypted PostgreSQL). It is never sold or shared with third parties. Each user only has access to their own data through Row-Level Security (RLS).",
      },
      {
        question: "How does the Job Match feature work?",
        answer:
          "Paste a job offer and Alex analyses the keywords, skills, and requirements of the role to suggest targeted improvements to your CV. Available on the Pro plan.",
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

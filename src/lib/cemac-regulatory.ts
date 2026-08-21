export interface CemacCountryConfig {
  code: string;
  name: string;
  currency: string;
  jurisdiction: string;
  dataProtectionLaw: string;
  higherEduMinistry: string;
  businessLaw: string;
  taxExemptionClause: string;
}

export const CEMAC_COUNTRIES: Record<string, CemacCountryConfig> = {
  CM: {
    code: "CM",
    name: "Cameroun",
    currency: "FCFA (XAF)",
    jurisdiction: "Tribunal de Première Instance de Douala / Yaoundé",
    dataProtectionLaw: "Loi N° 2010/012 du 21 décembre 2010 relative à la cybersécurité et à la protection des données au Cameroun",
    higherEduMinistry: "Ministère de l'Enseignement Supérieur (MINESUP Cameroun)",
    businessLaw: "Droit Harmonisé des Affaires OHADA & Code Général des Impôts du Cameroun",
    taxExemptionClause: "TVA non applicable — Régime d'exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC.",
  },
  GA: {
    code: "GA",
    name: "Gabon",
    currency: "FCFA (XAF)",
    jurisdiction: "Tribunal de Commerce de Libreville",
    dataProtectionLaw: "Loi N° 001/2011 relative à la protection des données à caractère personnel au Gabon",
    higherEduMinistry: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (Gabon)",
    businessLaw: "Droit Harmonisé des Affaires OHADA & Code des Impôts du Gabon",
    taxExemptionClause: "TVA non applicable — Régime d'exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC.",
  },
  CG: {
    code: "CG",
    name: "Congo-Brazzaville",
    currency: "FCFA (XAF)",
    jurisdiction: "Tribunal de Commerce de Brazzaville / Pointe-Noire",
    dataProtectionLaw: "Loi N° 29-2019 relative à la protection des données à caractère personnel en République du Congo",
    higherEduMinistry: "Ministère de l'Enseignement Supérieur et de l'Innovation (Congo)",
    businessLaw: "Droit Harmonisé des Affaires OHADA & Code des Impôts du Congo",
    taxExemptionClause: "TVA non applicable — Régime d'exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC.",
  },
  TD: {
    code: "TD",
    name: "Tchad",
    currency: "FCFA (XAF)",
    jurisdiction: "Tribunal de Grande Instance de N'Djamena",
    dataProtectionLaw: "Loi N° 007/PR/2015 portant protection des données à caractère personnel au Tchad",
    higherEduMinistry: "Ministère de l'Enseignement Supérieur (Tchad)",
    businessLaw: "Droit Harmonisé des Affaires OHADA",
    taxExemptionClause: "TVA non applicable — Régime d'exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC.",
  },
  CF: {
    code: "CF",
    name: "République Centrafricaine",
    currency: "FCFA (XAF)",
    jurisdiction: "Tribunal de Grande Instance de Bangui",
    dataProtectionLaw: "Directives CEEAC/CEMAC sur la protection des données numériques",
    higherEduMinistry: "Ministère de l'Enseignement Supérieur (RCA)",
    businessLaw: "Droit Harmonisé des Affaires OHADA",
    taxExemptionClause: "TVA non applicable — Régime d'exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC.",
  },
  GQ: {
    code: "GQ",
    name: "Guinée Équatoriale",
    currency: "FCFA (XAF)",
    jurisdiction: "Juzgado de Primera Instancia de Malabo / Bata",
    dataProtectionLaw: "Reglamento CEMAC sobre la protección de datos personales",
    higherEduMinistry: "Ministerio de Educación, Enseñanza Universitaria y Deportes",
    businessLaw: "Derecho Armonizado de Negocios OHADA",
    taxExemptionClause: "TVA non applicable — Régime d'exonération des prestations de services numériques dématérialisés EdTech en Zone CEMAC.",
  },
};

export function getCemacConfig(countryCode?: string): CemacCountryConfig {
  const code = (countryCode || "CM").toUpperCase();
  return CEMAC_COUNTRIES[code] || CEMAC_COUNTRIES.CM;
}

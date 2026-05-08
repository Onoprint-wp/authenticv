# Stratégie SEA — AuthentiCV (Google Ads)

---

## 1. Objectifs et KPIs

| Objectif | KPI | Cible (mois 3) |
|---|---|---|
| Signups | CPL (coût par lead) | < 3 € |
| Activations | Coût par activation (1er CV généré) | < 8 € |
| Conversions Pro | CPA (coût par souscription) | < 40 € |
| Rentabilité | LTV/CAC | > 3 |

**Conversion principale** : Signup + 1ère conversation Alex complétée (activation)
**Conversion secondaire** : Plan Pro souscrit

---

## 2. Budget Recommandé

| Phase | Durée | Budget mensuel | Objectif |
|---|---|---|---|
| Test & Learn | Mois 1-2 | 300 – 500 € | Valider CPL, tester audiences |
| Scale progressif | Mois 3-4 | 500 – 1 000 € | Optimiser CPA, étendre keywords |
| Scale | Mois 5-6 | 1 000 – 2 000 € | Performance Max, remarketing |
| Saison forte | Sep, Jan | +50 à +100 % | Exploiter les pics |

**Saisonnalité à exploiter :**
- Août-Septembre : rentrée, alternance, jeunes diplômés
- Décembre-Janvier : résolutions, mobilité professionnelle
- Mai-Juin : diplômés, stage to job

---

## 3. Architecture du Compte Google Ads

```
Compte AuthentiCV
│
├── 🏷️ CAMPAGNE 1 — Brand Protection
│   ├── Budget : 50 €/mois
│   ├── Stratégie : CPC manuel (max 0,30 €)
│   └── Groupes d'annonces :
│       └── [Brand] authenticv | authenti cv | authenticv app
│
├── 🏷️ CAMPAGNE 2 — Search Création CV (cœur)
│   ├── Budget : 150 – 400 €/mois
│   ├── Stratégie : Maximiser les conversions → tCPA
│   └── Groupes d'annonces :
│       ├── [Création CV] créer cv en ligne / faire un cv gratuit
│       ├── [Générateur CV] générateur cv / créateur cv gratuit
│       └── [CV IA] cv avec ia / cv chatgpt / cv intelligence artificielle
│
├── 🏷️ CAMPAGNE 3 — Search Modèles CV (volume)
│   ├── Budget : 100 – 200 €/mois
│   ├── Stratégie : Maximiser les conversions
│   └── Groupes d'annonces :
│       ├── [Modèles génériques] modèle cv / exemple cv
│       ├── [Modèles métiers] cv developpeur / cv infirmier / cv commercial
│       └── [Modèles situations] cv etudiant / cv sans experience
│
├── 🏷️ CAMPAGNE 4 — Search Lettre Motivation
│   ├── Budget : 80 – 150 €/mois
│   ├── Stratégie : Maximiser les conversions
│   └── Groupes d'annonces :
│       └── [LM] générateur lettre motivation / lettre motivation ia
│
├── 🏷️ CAMPAGNE 5 — Concurrents (optionnel, mois 3+)
│   ├── Budget : 80 €/mois
│   ├── Stratégie : CPC manuel (prudence, CPC élevé)
│   └── Groupes d'annonces :
│       └── cvdesignr / canva cv / zety / resume.io [attention légal]
│
├── 🏷️ CAMPAGNE 6 — Performance Max (mois 4+)
│   ├── Budget : 200 – 500 €/mois
│   ├── Assets : textes + images + vidéo démo Alex
│   └── Signal d'audience : visiteurs non convertis + clients Pro
│
└── 🏷️ CAMPAGNE 7 — Remarketing
    ├── Budget : 80 – 150 €/mois
    ├── Audiences :
    │   ├── Visiteurs landing non inscrits (7 jours)
    │   ├── Inscrits Free non activés (3 jours)
    │   └── Free users (30 jours, objectif upgrade Pro)
    └── Formats : Display + RLSA (search avec audience)
```

---

## 4. Mots-Clés par Groupe d'Annonces

### Campagne 2 — Création CV

**Groupe : CV IA** (commencer par ici — KD et CPC faibles)
```
[cv ia] — exact
[cv avec ia] — exact
"cv intelligence artificielle" — expression
"cv chatgpt" — expression
"créer cv ia gratuit" — expression
+cv +ia +gratuit — large modifié (si dispo)

Négatifs : emploi, offre, poste, recrutement, annonce, formation
```

**Groupe : Création CV**
```
[créer un cv en ligne] — exact
[faire un cv gratuit] — exact
"créer mon cv" — expression
"faire son cv" — expression
"cv en ligne gratuit" — expression

Négatifs : word, canva [si budget limité], exemple [renvoyer sur autre groupe]
```

### Stratégie des mots-clés négatifs (liste de base)
```
emploi, offre d'emploi, recrutement, annonce, poste, recruter
université, formation, cours, apprendre
wikipedia, forum, reddit
pdf converter, word converter
logiciel, télécharger, application mobile
```

---

## 5. Annonces Responsive Search Ads (RSA)

### Campagne "CV IA" — exemple

**Titres (15 max, en utiliser au moins 5 variés) :**
```
1. Créez votre CV avec l'IA — Gratuit
2. Coach IA Alex — CV en 5 minutes
3. CV ATS-optimisé par intelligence artificielle
4. Testez AuthentiCV gratuitement
5. 20 messages gratuits, puis 9 €/mois
6. CV professionnel sans formulaire ennuyeux
7. L'IA qui écrit votre CV avec vous
8. Votre CV authentique, pas robotique
9. CV optimisé ATS dès la première version
10. Générateur de CV IA — Résultat immédiat
```

**Descriptions (4 max) :**
```
1. Alex, votre coach IA, vous guide question par question pour créer un CV percutant et adapté aux recruteurs ATS. Gratuit.
2. Plus qu'un générateur : une conversation. Discutez avec Alex, votre CV se construit en temps réel. Export PDF inclus en Pro.
3. 20 messages gratuits pour créer votre CV. Obtenez un CV professionnel optimisé pour passer les filtres ATS en quelques minutes.
4. AuthentiCV c'est l'IA qui préserve votre style. Pas de CV générique : un CV qui vous ressemble. Essayez gratuitement.
```

**URL d'affichage :**
```
authenticv.app/cv-ia
authenticv.app/coach-alex
```

---

## 6. Extensions d'Annonces

### Liens annexes
| Titre | Description | URL |
|---|---|---|
| Voir les modèles | 20+ modèles de CV | /modeles-cv |
| Lettre de motivation | Générez votre LM par IA | /lettre-de-motivation |
| Tarifs | Gratuit ou Pro à 9 €/mois | /tarifs |
| Comment ça marche | Démo en vidéo | /#comment-ca-marche |

### Accroches (Callouts)
- Gratuit jusqu'à 20 messages
- ATS-optimisé
- Export PDF en Pro
- Données sécurisées

### Extraits structurés
- **Type** : Services
- **Valeurs** : Coach IA conversationnel · CV ATS · Lettre de motivation · Job Match · Préparation entretien

---

## 7. Landing Pages

### Règle fondamentale
**Message annonce = message landing**. Si l'annonce parle de "CV IA gratuit", la landing doit parler de "CV IA gratuit" dans le H1.

### Landing pages à créer par campagne

| Campagne | Landing actuelle | Landing idéale |
|---|---|---|
| CV IA | `/` (landing générique) | `/cv-ia` (focus IA + Alex) |
| Modèles CV | `/` | `/modeles-cv` |
| Lettre de motivation | `/` | `/lettre-de-motivation` |
| Concurrents | `/` | `/authenticv-vs-cvdesignr` |

---

## 8. Tracking des Conversions

### Événements à tracker dans Google Ads (via GA4 + GTM)

| Événement | Valeur | Type |
|---|---|---|
| `signup_completed` | 0,50 € | Micro-conversion |
| `first_message_sent` | 1 € | Micro-conversion |
| `cv_generated` | 2 € | Macro-conversion |
| `subscribed_pro` | 9 € | Macro-conversion (LTV à affiner) |

### Configuration
1. Définir ces événements dans GA4 comme conversions
2. Importer les conversions dans Google Ads
3. Activer les **Enhanced Conversions** (adresse email hachée)
4. Mettre en place le **tracking server-side** via Vercel Edge ou Stape

---

## 9. Stratégies d'Enchères par Phase

| Phase | Campagne | Stratégie | Objectif |
|---|---|---|---|
| Lancement (M1) | Toutes | CPC manuel ou Max clics | Générer du trafic, récolter data |
| Apprentissage (M2) | Search | Maximiser les conversions | Laisser l'IA apprendre |
| Optimisation (M3+) | Search | tCPA (CPA cible) | Contrôler les coûts |
| Scale (M4+) | PMax | tROAS ou Max conv. | Élargir les audiences |

**Règle des 30 conversions** : Ne passer en stratégie automatique qu'avec au moins 30 conversions sur 30 jours. En dessous, rester en Max clics ou CPC manuel.

---

## 10. Checklist Lancement

- [ ] Compte Google Ads créé + facturation configurée
- [ ] Liaison GA4 ↔ Google Ads
- [ ] Conversion `cv_generated` importée dans Google Ads
- [ ] Enhanced Conversions activées
- [ ] Campagne Brand créée (protéger la marque en priorité)
- [ ] Campagne "CV IA" créée avec groupes + annonces + extensions
- [ ] Mots-clés négatifs de base ajoutés au niveau campagne
- [ ] Lien annexes configurés
- [ ] Budget journalier défini (budget mensuel / 30,4)
- [ ] Ciblage géographique : France + Belgique + Suisse (+ Afrique à évaluer)
- [ ] Langues : Français uniquement
- [ ] Suivi hebdomadaire planifié (voir `07_reporting_sea.md`)

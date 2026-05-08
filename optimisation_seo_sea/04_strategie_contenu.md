# Stratégie de Contenu — AuthentiCV

---

## 1. Architecture du Site (cible 12 mois)

```
authenticv.app/
├── (landing — déjà existante)
├── tarifs/                          ← À créer (SEO + conversion)
├── modeles-cv/                      ← Galerie hub — PRIORITAIRE
│   ├── moderne/
│   ├── simple/
│   ├── creatif/
│   ├── etudiant/
│   ├── sans-experience/
│   ├── reconversion/
│   ├── developpeur/
│   ├── commercial/
│   ├── infirmier/
│   ├── comptable/
│   └── [metier]/                    ← Programmatique (100+ pages)
├── lettre-de-motivation/            ← Feature existante, page dédiée à créer
├── blog/                            ← Hub éducatif
│   ├── cv-ats-guide/
│   ├── preparer-entretien/
│   ├── cv-etudiant/
│   ├── questions-entretien/
│   └── ...
└── ressources/                      ← Outils gratuits (lead magnets)
    ├── analyseur-cv/                ← Upload PDF → score ATS (viral)
    └── checklist-cv/
```

---

## 2. Galerie de Modèles `/modeles-cv` — Priorité 1

C'est **le levier SEO n°1 du secteur**. CVDesignR et Canva dominent grâce à leurs galeries.

### Structure d'une page modèle

```
/modeles-cv/developpeur
```

**Contenu de la page :**
- H1 : "Modèle de CV Développeur — Exemple et conseils 2026"
- Visuel du CV rendu (screenshot ou PDF embed)
- CTA : "Utiliser ce modèle avec Alex" → redirige vers `/builder`
- Section : "Que mettre dans un CV de développeur ?"
  - Compétences techniques à lister
  - Structure recommandée
  - Erreurs à éviter
- FAQ schématisée (schema FAQPage)
- Maillage interne vers articles blog connexes

### Liste des 20 premières pages modèles à créer

| URL | Mot-clé principal | Vol/mois | Priorité |
|---|---|---|---|
| `/modeles-cv` | modèle cv gratuit | 22 000 | 🔴 |
| `/modeles-cv/etudiant` | modele cv etudiant | 2 900 | 🔴 |
| `/modeles-cv/sans-experience` | cv sans experience | 2 100 | 🔴 |
| `/modeles-cv/moderne` | cv moderne | 4 400 | 🔴 |
| `/modeles-cv/simple` | cv simple gratuit | 3 600 | 🔴 |
| `/modeles-cv/developpeur` | exemple cv developpeur | 1 200 | 🟠 |
| `/modeles-cv/commercial` | exemple cv commercial | 720 | 🟠 |
| `/modeles-cv/infirmier` | cv infirmier | 880 | 🟠 |
| `/modeles-cv/reconversion` | cv reconversion | 1 300 | 🟠 |
| `/modeles-cv/premier-emploi` | cv premier emploi | 1 600 | 🟠 |
| `/modeles-cv/manager` | cv manager | 480 | 🟡 |
| `/modeles-cv/comptable` | exemple cv comptable | 640 | 🟡 |
| `/modeles-cv/ingenieur` | cv ingenieur | 590 | 🟡 |
| `/modeles-cv/marketing` | cv marketing | 480 | 🟡 |
| `/modeles-cv/rh` | cv ressources humaines | 390 | 🟡 |

---

## 3. Blog `/blog` — Stratégie Éditoriale

### Ligne éditoriale
- **Angle** : "Coach carrière" — pas juste "CV", mais tout le parcours emploi
- **Ton** : Bienveillant, expert, concret (même que le Coach Alex)
- **Longueur cible** : 1 500 à 2 500 mots par article
- **Fréquence réaliste** : 2 à 4 articles par mois
- **IA augmentée** : Utiliser Claude pour les brouillons, retravailler l'angle humain

### Calendrier éditorial — 6 premiers mois

| Mois | Titre | Mot-clé | Vol | KD | Statut |
|---|---|---|---|---|---|
| M2 | Comment faire un CV ATS en 2026 | cv ats | 1 600 | 22 | À rédiger |
| M2 | Les 10 erreurs qui font rejeter un CV | erreurs cv | 880 | 18 | À rédiger |
| M2 | CV étudiant : modèle et conseils | modele cv etudiant | 2 900 | 25 | À rédiger |
| M3 | Comment rédiger une lettre de motivation | rédiger lettre motivation | 6 600 | 35 | À rédiger |
| M3 | CV sans expérience : comment le valoriser | cv sans experience | 2 100 | 22 | À rédiger |
| M3 | Préparer un entretien d'embauche : le guide | préparer entretien | 4 400 | 30 | À rédiger |
| M4 | CV de développeur : exemple et conseils | exemple cv developpeur | 1 200 | 22 | À rédiger |
| M4 | Questions classiques en entretien | questions entretien | 8 100 | 40 | À rédiger |
| M4 | AuthentiCV vs CVDesignR : comparatif | alternative cvdesignr | 320 | 12 | À rédiger |
| M5 | CV de reconversion : comment l'aborder | cv reconversion | 1 300 | 20 | À rédiger |
| M5 | Score ATS : comment vérifier son CV | score ats | 480 | 15 | À rédiger |
| M6 | Optimiser son profil LinkedIn en 2026 | optimiser linkedin | 3 200 | 28 | À rédiger |

---

## 4. Brief Type d'Article

Utiliser ce template pour chaque article :

```markdown
## Brief SEO — [Titre]

**Mot-clé principal** : [mot-clé]
**Volume mensuel** : [N req/mois]
**Difficulté (KD)** : [N/100]
**Intention** : [informationnelle / transactionnelle]

**Title SEO** : [60 caractères max, mot-clé en début]
**Meta description** : [155 caractères max, avec CTA]

**Plan proposé** :
- H1 : [titre exact]
- H2 : Introduction (problème + promesse)
- H2 : [Section 1]
  - H3 : [Sous-section]
- H2 : [Section 2]
- H2 : [Section 3]
- H2 : FAQ (3-5 questions, schema FAQPage)
- H2 : Conclusion + CTA

**Longueur cible** : [N mots]
**Champ lexical à couvrir** : [10-15 mots liés]
**Liens internes suggérés** : [3-5 pages]
**Liens externes suggérés** : [1-2 sources autorités]
**CTA final** : "Créer mon CV avec AuthentiCV →"
```

---

## 5. Ressources Gratuites (Lead Magnets)

### Analyseur de CV (outil gratuit)
- **URL** : `/ressources/analyseur-cv`
- **Fonctionnement** : Upload PDF → score ATS + recommandations
- **Avantage** : La feature ATS existe déjà dans l'app ! À exposer publiquement
- **Impact SEO** : Aimant à backlinks + viral sur LinkedIn
- **Conversion** : "Améliorez votre CV avec Alex" après le scan

### Checklist CV téléchargeable
- **URL** : `/ressources/checklist-cv`
- **Format** : PDF à télécharger (lead magnet email)
- **Trafic** : Faible mais conversion élevée

---

## 6. Pages Programmatiques (mois 6-12)

Générer automatiquement des pages SEO à partir d'une base de données métiers.

**Exemple de template :**
```
/modeles-cv/[metier]
→ Titre : "CV [Métier] — Modèle, exemple et conseils 2026"
→ Description générée depuis une base de données
→ Screenshot du modèle AuthentiCV adapté
→ CTA contextuel
→ FAQ auto-générée avec schema
```

**Sources de données :**
- Référentiel ROME (France Travail) — 531 métiers
- ONISEP — métiers par secteur
- Intégration dans Next.js via `generateStaticParams`

**Impact potentiel** : +200 à +500 pages indexées, 10 000 à 100 000 visites/mois en 12-18 mois.

---

## 7. Page Tarifs `/tarifs`

À créer rapidement — haut potentiel SEO transactionnel + conversion.

**Contenu :**
- Tableau comparatif Free vs Pro
- FAQ pricing (schema FAQPage)
- Témoignages utilisateurs
- CTA A/B testés
- Mots-clés : "authenticv prix", "authenticv pro", "générateur cv prix"

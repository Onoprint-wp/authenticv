# AuthentiCV App — Design System & UI Rules
> **ACV Continuous** · [authenticv.app](https://authenticv.app)  
> Source de vérité Design & Tokens UI/UX pour l'écosystème AuthentiCV.

---

## 1. Principe directeur

L’application doit exprimer :

**Clarté · Confiance · Intelligence · Progression · Signal**

La direction visuelle est :

**ACV Continuous UI**

L’interface doit paraître :
* professionnelle ;
* moderne ;
* premium mais accessible ;
* technologique sans être futuriste ;
* humaine sans devenir ludique ;
* suffisamment sobre pour un produit RH ;
* suffisamment distinctive pour être immédiatement associée à AuthentiCV.

La priorité n’est pas de « décorer » l’interface.

La priorité est : **information → compréhension → décision → action.**

---

## 2. Règles non négociables

### Couleurs

**INTERDICTION d’inventer des couleurs supplémentaires pour les éléments fonctionnels.**

Palette principale autorisée :

| Token | Valeur | Fonction |
| :--- | :--- | :--- |
| `brand.navy` | `#0F223D` | identité, navigation, titres |
| `brand.blue` | `#3667F0` | CTA, sélection, interactions |
| `brand.cyan` | `#32D3E1` | signal, Campus, data secondaire |
| `brand.violet` | `#7C5CFC` | fonctions IA / Alex uniquement |
| `semantic.success` | `#25C78A` | validation, succès, ATS positif |

Neutres :

| Token | Valeur |
| :--- | :--- |
| `neutral.900` | `#111827` |
| `neutral.700` | `#374151` |
| `neutral.500` | `#6B7280` |
| `neutral.300` | `#D1D5DB` |
| `neutral.100` | `#F3F4F6` |
| `neutral.50` | `#FAFAFC` |
| `white` | `#FFFFFF` |

---

## 3. Restrictions strictes de couleur

### Bleu (`#3667F0`)
C’est **la couleur interactive principale**.

Elle est utilisée pour :
* bouton primaire ;
* liens ;
* onglet actif ;
* sélection ;
* focus ;
* progression principale ;
* navigation active ;
* actions importantes.

Elle ne doit pas servir à colorer arbitrairement de grandes surfaces.

---

### Cyan (`#32D3E1`)
Utilisation :
* signal secondaire ;
* Campus ;
* visualisation de données ;
* accents de progression ;
* éléments graphiques dérivés du logo.

Le cyan ne remplace pas le Brand Blue pour les CTA principaux.

---

### Violet (`#7C5CFC`)
**Réservé à l’intelligence artificielle.**

Utilisation autorisée :
* Alex AI Coach ;
* génération IA ;
* suggestions IA ;
* analyse IA ;
* fonctionnalités explicitement assistées par IA.

Ne pas utiliser le violet pour :
* navigation normale ;
* CTA classiques ;
* décoration ;
* formulaires ;
* succès ;
* Campus ;
* Recruiter.

Cette restriction est importante : elle permet au violet de devenir un **signal sémantique IA** plutôt qu’une simple couleur décorative. 

---

### Vert (`#25C78A`)
Réservé aux états positifs :
* ATS Compatible ;
* réussite ;
* validation ;
* amélioration ;
* état terminé ;
* score favorable.

Ne pas utiliser le vert comme couleur de marque générale.

---

## 4. Gradients

Gradient de marque autorisé :

```css
background: linear-gradient(
  135deg,
  #3667F0 0%,
  #32D3E1 100%
);
```

Usage limité à :
* logo ;
* onboarding ;
* illustrations de marque ;
* grands éléments de communication ;
* accent de signal ;
* quelques éléments premium.

### Interdit
Ne pas appliquer ce gradient :
* à tous les boutons ;
* à toutes les cards ;
* aux formulaires ;
* à la sidebar ;
* à chaque titre ;
* aux backgrounds génériques.

Pour Alex uniquement :

```css
background: linear-gradient(
  135deg,
  #3667F0 0%,
  #7C5CFC 100%
);
```

---

## 5. Typographie

Le système doit utiliser exclusivement :

### Branding et grands titres
**Montserrat**

### Interface et contenu fonctionnel
**Inter**

Le choix Montserrat / Inter appartient déjà à la logique du système AuthentiCV. 

---

### Échelle typographique

#### H1
```text
Montserrat Bold
32px / 40px
letter-spacing: -0.005em
```

#### H2
```text
Montserrat SemiBold
24px / 32px
letter-spacing: -0.0025em
```

#### H3 / Subtitle
```text
Montserrat Medium
18px / 28px
```

#### Body
```text
Inter Regular
16px / 24px
```

#### Small
```text
Inter Regular
14px / 20px
```

#### Caption
```text
Inter Regular
12px / 16px
```

#### Button
```text
Inter SemiBold
14px / 20px
letter-spacing: 0.0025em
```

---

## 6. Restrictions sur la typographie

Ne jamais utiliser :
* une troisième police ;
* une police manuscrite ;
* une police futuriste ;
* du texte en majuscules sur de longs paragraphes ;
* des titres artificiellement énormes dans les interfaces métier ;
* des contrastes de graisse excessifs.

Ne pas utiliser Montserrat pour les longs paragraphes ou tableaux.

---

## 7. Règles éditoriales

L’interface AuthentiCV doit parler comme un **assistant professionnel**, pas comme une publicité.

### Préférer
* Optimiser mon CV
* Analyser mon CV
* Comparer avec l’offre
* Voir les recommandations
* Ajouter une expérience
* Télécharger mon CV
* Rechercher des candidats

### Éviter
* Boostez votre carrière maintenant !!!
* Votre CV est incroyable 🚀🔥
* La magie de l’IA
* Révolutionnez votre vie
* L’IA ultime

---

## 8. Ton des textes

Ton recommandé : **clair + précis + utile + rassurant + actionnable**

Les phrases doivent être courtes.

Une interface doit expliquer :
1. ce qui se passe ;
2. pourquoi ;
3. ce que l’utilisateur peut faire ensuite.

---

## 9. Règle fondamentale pour les scores

Un score **ne doit jamais apparaître seul**.

Exemple interdit :
> 86/100

Exemple correct :
> **86/100 — Très bon match**

Puis :
* Compétences : 90 %
* Expérience : 82 %
* Mots-clés : 88 %

Cette règle est déjà définie pour le Job Match dans le système source. 

---

## 10. ATS Score

Présentation recommandée :

**Analyse ATS**  
**92 %**  
**Excellent**

Puis des explications :
* Structure claire
* Mots-clés détectés
* Sections reconnues
* Format compatible

Le vert indique le résultat positif.  
Le bleu indique une information ou une action.  
Le rouge/orange éventuel ne doit être introduit que comme **couleur sémantique d’alerte**, jamais comme nouvelle couleur de marque.

---

## 11. Boutons

### Primary
```text
height: 44–48px
padding-inline: 20px
border-radius: 12px
background: #3667F0
text: #FFFFFF
font: Inter SemiBold 14px
```
Un écran ne devrait généralement contenir qu’**une action primaire dominante par zone fonctionnelle**.

---

### Secondary
```text
background: #FFFFFF
border: 1px solid #D1D5DB
color: #0F223D
```

---

### Outline Brand
```text
background: transparent
border: 1px solid #3667F0
color: #3667F0
```

---

### Ghost
Aucune surface lourde.
Usage :
* navigation ;
* actions tertiaires ;
* menu contextuel.

---

### AI Action
Exemple :
> ✦ Demander à Alex

Traitement :
```text
Blue → Violet (linear-gradient(135deg, #3667F0 0%, #7C5CFC 100%))
```
Le gradient IA ne doit apparaître que lorsqu’Alex ou l’IA intervient réellement.

---

## 12. Formulaires

### Inputs
```text
min-height: 44px
border-radius: 10px
border: #D1D5DB
background: #FFFFFF
```

Focus :
```css
border-color: #3667F0;
box-shadow: 0 0 0 3px rgba(54, 103, 240, 0.15);
```

---

### Labels
Toujours afficher un label permanent quand le contenu peut être ambigu.  
Exemple :  
**Poste recherché**  
`Product Designer`

Ne jamais compter uniquement sur le placeholder.

---

## 13. Placeholder

Un placeholder :
* donne un exemple ;
* ne remplace jamais le label ;
* utilise Neutral 500 (`#6B7280`) ;
* ne doit pas contenir une instruction longue.

Correct :
> Ex. Product Designer

Incorrect :
> Veuillez saisir ici le poste correspondant exactement au métier que vous souhaitez rechercher…

---

## 14. Cards

Cards produit :
```text
background: #FFFFFF
border: 1px solid #E5E7EB
border-radius: 16px
```

Éviter les grosses ombres.

Elevation par défaut :
```css
box-shadow: 0 1px 2px rgba(15, 34, 61, 0.06);
```

Hover :
```css
box-shadow: 0 4px 12px rgba(15, 34, 61, 0.08);
```

L’interface doit reposer principalement sur :  
**espacement + bordures + contraste**  
et non sur une accumulation d’ombres. 

---

## 15. Grid

Desktop :
```text
12 columns
max-width: 1280px
gutter: 24px
```

Tablet :
```text
8 columns
```

Mobile :
```text
4 columns
```

---

## 16. Spacing

Base : **8 px**

Tokens :
```text
4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 128
```

Dans environ 80 % de l’interface, privilégier :
```text
16, 24, 32
```

---

## 17. Radius

```text
4px   micro controls
8px   compact UI
12px  buttons / inputs
16px  cards
24px  modal / hero surface
999px pills
```

Standard visuel : **12–16 px**

Éviter le style « tout en pilules ».

---

## 18. Icônes

Style obligatoire : **Outline / Linear**  
Stroke : **1.75–2px**

Les icônes doivent appartenir à une seule famille visuelle.

### Interdit
Mélanger :
* emojis ;
* icônes filled ;
* pictogrammes 3D ;
* Line Icons ;
* illustrations cartoon.

Les emojis éventuellement présents dans des exemples marketing ne doivent pas devenir le langage iconographique de l’application.

---

## 19. Navigation Candidate

Structure recommandée :

```text
AuthentiCV

Tableau de bord
Mon CV
Job Match
Lettres
Candidatures
Alex

────────

Compte
Paramètres
```

La navigation sélectionnée utilise :
* texte Brand Blue (`#3667F0`) ;
* icon Brand Blue (`#3667F0`) ;
* surface très légèrement teintée.

Pas de gradient dans la sidebar.

---

## 20. Navigation Recruiter

```text
AuthentiCV Recruiter

Recherche
CVthèque
Shortlist
Messages
Analyses
Crédits
Équipe

────────

Compte entreprise
Paramètres
```

Les fonctionnalités Recruiter doivent rester dominées par :  
**Navy + Blue**  
et non Cyan/Violet.

Le produit Recruiter correspond à la recherche, au filtrage et au sourcing de profils déjà structurés. 

---

## 21. Campus

Campus conserve exactement la même architecture UI.  
Il ne faut pas créer une « interface scolaire ».  
L’accent Cyan sert uniquement à identifier certaines zones Campus.  
Le produit Campus est centré sur l’accompagnement à l’employabilité et l’accès étudiant, pas sur un LMS ou une plateforme de cours. 

---

## 22. Alex AI Coach

Alex doit être identifiable sans prendre le contrôle de toute l’expérience.

### Alex utilise
* Violet (`#7C5CFC`) ;
* Blue → Violet (`linear-gradient(135deg, #3667F0 0%, #7C5CFC 100%)`) ;
* avatar propriétaire ;
* Sparkle spécifique ✦ ;
* micro-animation ;
* surfaces légèrement teintées.

### Alex ne doit pas
* transformer chaque page en chat ;
* interrompre l’utilisateur ;
* apparaître dans toutes les cards ;
* utiliser un robot générique ;
* utiliser le violet sur toute l’application.

---

## 23. Architecture des fonctionnalités IA

L’IA doit être montrée **dans son contexte**.

Exemple :

### CV
> ✦ Alex recommande 3 améliorations

### Job Match
> ✦ Alex explique votre score

### Lettre
> ✦ Générer avec Alex

### Recruiter
> ✦ Résumer ce profil

Cette approche renforce la distinction entre **produit AuthentiCV** et **assistant Alex**.

---

## 24. Logo dans l’application

Le monogramme **ACV Continuous** reste constant.  
Il ne doit jamais être redessiné selon la section.

Architecture :
* AuthentiCV → monogramme principal ;
* Recruiter → même monogramme + descriptor ;
* Campus → même monogramme + descriptor ;
* Alex → même famille géométrique.

C’est cohérent avec la stratégie consistant à développer un actif propriétaire unique plutôt qu’une multiplication de logos. 

---

## 25. Light Mode

```text
app.background      #FAFAFC
surface.primary     #FFFFFF
surface.secondary   #F3F4F6
text.primary        #111827
text.secondary      #6B7280
brand.primary       #3667F0
border.default      #D1D5DB
```

---

## 26. Dark Mode

```text
app.background      #081426
surface.primary     #0F223D
surface.elevated    #162B46

text.primary        #F8FAFC
text.secondary      #AAB8CB

brand.blue          #5D82FF
brand.cyan          #45D9E5
ai.violet           #967BFF
```

Règle particulière :  
**L’aperçu du CV reste blanc (`#FFFFFF`)**, car il représente le document exporté, même lorsque l’application est en Dark Mode. 

---

## 27. Responsive

### Desktop
Sidebar persistante possible.

### Tablet
Sidebar compressée ou drawer.

### Mobile
Navigation inférieure ou drawer selon la profondeur de l’application.

Les informations secondaires doivent s’empiler.  
Les fonctionnalités ne doivent pas être supprimées pour obtenir artificiellement un design mobile minimal.

---

## 28. Tables

Sur Recruiter :
* en-tête discret ;
* lignes 48–56 px ;
* alignements cohérents ;
* hover très léger ;
* aucune couleur décorative ;
* statut via badge ;
* actions secondaires dans menu contextuel.

Les tableaux ne doivent pas devenir une succession de cards.

---

## 29. Badges

Exemples :

### ATS
`✓ ATS Compatible` (Success Green `#25C78A`)

### Premium
`Premium` (Violet `#7C5CFC` uniquement si lié à une fonctionnalité premium/IA définie)

### Campus
`Campus` (Cyan `#32D3E1`)

### Recruiter
`Recruiter` (Blue `#3667F0`)

### Nouveau
`Nouveau` (Blue `#3667F0`)

Pills compactes, jamais surdimensionnées.

---

## 30. Visualisation de données

Les graphiques doivent utiliser en priorité :
1. Blue (`#3667F0`) ;
2. Cyan (`#32D3E1`) ;
3. Violet si IA (`#7C5CFC`) ;
4. Green si succès (`#25C78A`).

Ne pas produire automatiquement une palette multicolore type dashboard SaaS.  
Une donnée sans fonction sémantique ne justifie pas une nouvelle couleur.

---

## 31. États

Chaque composant interactif doit prévoir :
```text
default
hover
focus
active
selected
disabled
loading
success
error
```

Les différences ne doivent pas reposer exclusivement sur la couleur.

Utiliser également :
* icône ;
* texte ;
* changement de bordure ;
* changement de graisse ;
* motif ou position.

---

## 32. Accessibilité

Minimum :
* contraste WCAG AA pour les textes fonctionnels ;
* cible tactile ≥ `44 × 44 px` ;
* focus visible ;
* pas de couleur seule pour transmettre une information ;
* labels explicites ;
* navigation clavier ;
* `aria-label` pour les icônes seules ;
* `aria-live` pour les résultats d’analyse dynamiques.

---

## 33. Motion

Le mouvement prolonge le concept **Continuous**.

Durées recommandées :
```text
micro interaction      150–200ms
state transition       200–300ms
panel / drawer         250–350ms
score animation        500–600ms
logo drawing           500–800ms
```

Éviter :
* bounce ;
* elastic ;
* animations décoratives permanentes ;
* particules ;
* effets lumineux futuristes.

---

## 34. Pattern propriétaire ACV

L’identité peut être renforcée grâce à trois caractéristiques extraites du monogramme :
* **courbe du C**
* **angle du V**
* **trajectoire continue A → C → V**

Ces formes peuvent produire :
* progress bars ;
* graphiques ;
* séparateurs ;
* loaders ;
* onboarding ;
* background patterns ;
* transitions ;
* indicateurs Job Match.

C’est plus distinctif qu’un design SaaS générique. 

---

## 35. Restrictions UI absolues

Le générateur d’interface **NE DOIT PAS** :
* inventer une palette ;
* utiliser du rose ou du violet comme accent général ;
* transformer tous les boutons en gradients ;
* multiplier les glassmorphism cards ;
* créer des glow effects ;
* utiliser du néon ;
* utiliser de gros blobs gradients ;
* utiliser des robots génériques pour représenter Alex ;
* utiliser des emojis comme iconographie ;
* créer des illustrations crypto/futuristes ;
* arrondir excessivement chaque composant ;
* transformer tous les composants en cards ;
* utiliser 5 couleurs dans un même graphique sans nécessité ;
* surcharger les dashboards ;
* créer des textes marketing non fournis ;
* inventer des statistiques ;
* inventer des témoignages ;
* inventer des noms d’entreprises clientes ;
* promettre qu’un utilisateur obtiendra un emploi ;
* présenter un score IA comme une vérité absolue.

Cette dernière partie est particulièrement importante pour AuthentiCV : plusieurs chiffres et références commerciales figurant dans les supports existants sont explicitement indiqués comme **à documenter avant diffusion publique**.   

---

## 36. Règle concernant le contenu généré

Lorsque le contenu définitif n’existe pas, utiliser des placeholders neutres du type :
* Exemple de poste
* Nom du candidat
* Entreprise
* 00 %

et non inventer des données présentées comme réelles.

Pour une maquette, préférer clairement :
> Données de démonstration

si une confusion est possible.

---

## 37. Architecture globale

```text
AuthentiCV
│
├── Candidate
│   ├── Dashboard
│   ├── Profile
│   ├── CV Builder
│   ├── ATS Analysis
│   ├── Job Match
│   ├── Cover Letters
│   ├── Applications
│   └── Alex
│
├── Recruiter
│   ├── Dashboard
│   ├── Search
│   ├── Talent Database
│   ├── Candidate Profile
│   ├── Shortlist
│   ├── Messages
│   ├── Credits
│   └── Team
│
└── Campus
    ├── Student experience
    ├── Campus eligibility
    ├── Campus plan
    └── Campus activation
```

---

## 38. Design tokens de référence

```css
:root {
  /* Brand */
  --acv-navy: #0F223D;
  --acv-blue: #3667F0;
  --acv-cyan: #32D3E1;
  --acv-violet: #7C5CFC;
  --acv-green: #25C78A;

  /* Neutral */
  --neutral-900: #111827;
  --neutral-700: #374151;
  --neutral-500: #6B7280;
  --neutral-300: #D1D5DB;
  --neutral-100: #F3F4F6;
  --neutral-50: #FAFAFC;
  --white: #FFFFFF;

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 999px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Shadows */
  --shadow-1: 0 1px 2px rgba(15,34,61,.06);
  --shadow-2: 0 4px 12px rgba(15,34,61,.08);
  --shadow-3: 0 12px 24px rgba(15,34,61,.12);
}
```

---

## 39. Instruction maître pour un générateur d’application

> **Treat the AuthentiCV Design System as a hard constraint, not as visual inspiration. Do not invent alternative brand colors, fonts, typography scales, gradients, border radii, icon styles, terminology or marketing claims. Reuse the defined design tokens and component patterns consistently across Candidate, Recruiter, Campus and Alex. Product differentiation must come from controlled semantic accents, not from creating separate visual identities. When information or copy is missing, use explicit neutral placeholders instead of inventing business facts.**

> **Blue = interaction. Cyan = signal/Campus. Violet = AI/Alex. Green = success/validation. Navy = trust/structure. Neutral colors = interface.**

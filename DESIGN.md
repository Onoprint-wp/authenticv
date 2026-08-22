# AuthentiCV — Design System v1.0

> **ACV Continuous** · [authenticv.app](https://authenticv.app)  
> Source de vérité Design & Tokens UI/UX pour l'écosystème AuthentiCV.

---

## 1. Fondation de marque

### Logo principal & Symbolique

Le système de marque repose sur le monogramme **ACV Continuous**, qui fusionne visuellement :

* **A** → AuthentiCV / Architecture de marque
* **C** → Candidat / Connexion / Carrière
* **V** → Valeur / Validation / Opportunité

Le symbole reste identique dans tout l’écosystème.

**Wordmark :**
* `Authenti` → Deep Navy (`#0F223D`)
* `CV` → Brand Blue (`#3667F0`)

### Architecture de marque par produit

Le monogramme **ACV** demeure l’actif distinctif principal. Les sous-produits se déclinent via leur ligne d'accentuation et couleur secondaire :

| Produit | Couleur dominante / Accent | Traitement visuel |
| :--- | :--- | :--- |
| **AuthentiCV Candidate** | Blue + Cyan | `linear-gradient(135deg, #3667F0 0%, #32D3E1 100%)` |
| **AuthentiCV Recruiter** | Deep Navy + Brand Blue | Ligne d'accent `#3667F0` + texte Recruiter |
| **AuthentiCV Campus** | Cyan | Ligne d'accent `#32D3E1` + badge `🎓 Campus` |
| **Alex AI Coach** | AI Violet | Ligne d'accent `#7C5CFC` + icône d'étincelles ✦ |

---

## 2. Color System & Tokens

### Brand Colors

| Token Name | HEX | Usage & Sémantique |
| :--- | :--- | :--- |
| `primary-navy` | `#0F223D` | Navigation, titres majeurs, arrière-plans dark mode |
| `brand-blue` | `#3667F0` | CTA principaux, liens, états actifs, sélection |
| `brand-cyan` | `#32D3E1` | Produit Campus, badges signaux, graphiques data |
| `ai-violet` | `#7C5CFC` | Assistant Alex, actions IA, badges IA |
| `success-green` | `#25C78A` | Compatibilité ATS, validations, statuts positifs |

### Gradient principal

```css
background: linear-gradient(135deg, #3667F0 0%, #32D3E1 100%);
```

**Règles d'utilisation :**
* Monogramme ACV principal.
* Éléments majeurs de marque & onboarding.
* Badges ou cartes Premium.
* **⚠️ Restriction :** Ne PAS appliquer le dégradé sur tous les boutons UI standards.

### Neutral Colors

| Token Name | HEX | Usage UI |
| :--- | :--- | :--- |
| `neutral-900` | `#111827` | Texte principal en Mode Clair |
| `neutral-700` | `#374151` | Texte secondaire, sous-titres |
| `neutral-500` | `#6B7280` | Placeholders, métadonnées, onglets inactifs |
| `neutral-300` | `#D1D5DB` | Bordures de composants, diviseurs |
| `neutral-100` | `#F3F4F6` | Fonds de cartes secondaires, hover states |
| `neutral-50` | `#FAFAFC` | Arrière-plan principal de l'application (Light Mode) |
| `white` | `#FFFFFF` | Cartes, modals, aperçu du document CV |

---

## 3. Typographie

### Règle d'or
* **Montserrat** = Personnalité de marque & structure (Titre & Headings)
* **Inter** = Efficacité produit, lisibilité & composants UI (Body, Controls, Captions)

### Échelle Typographique

| Style | Police | Taille / Line Height | Tracking |
| :--- | :--- | :--- | :--- |
| **Heading 1** | Montserrat Bold | 32 px / 40 px | -0.5% |
| **Heading 2** | Montserrat SemiBold | 24 px / 32 px | -0.25% |
| **Sous-titre** | Montserrat Medium | 18 px / 28 px | 0% |
| **Body** | Inter Regular | 16 px / 24 px | 0% |
| **Small** | Inter Regular | 14 px / 20 px | 0% |
| **Caption** | Inter Regular | 12 px / 16 px | 0% |
| **Button** | Inter SemiBold | 14 px / 20 px | +0.25% |

---

## 4. Composants UI & Boutons

### Types de Boutons

1. **Primary Button**
   * Background: `#3667F0` (Hover: `#2855D9`)
   * Text: `#FFFFFF` | Height: 44–48 px | Radius: 10–12 px | Padding: 16px horizontal
2. **Secondary Button**
   * Background: `#FFFFFF` ou `#FAFAFC` | Border: `1px solid #D1D5DB` | Text: `#0F223D`
3. **Outline Button**
   * Border: `1px solid #3667F0` | Text: `#3667F0`
4. **Ghost Button**
   * Border: `none` | Background: `transparent` | Text: `#374151`
5. **AI Button (✦ Demander à Alex)**
   * Background: `linear-gradient(135deg, #3667F0 0%, #7C5CFC 100%)` | Text: `#FFFFFF`
   * **⚠️ Restriction :** Réservé exclusivement aux fonctionnalités d'assistance IA.

### Formulaires & Contrôles

* **Input Text** : Hauteur 44–48px, Rayon 10px, Bordure `#D1D5DB`.
  * *Focus state* : Border `#3667F0`, Ring `rgba(54,103,240, 0.15)`.
* **Checkbox** : Coché = Fond `#3667F0` avec coche blanche.
* **Toggle Switch** : Desactivé = `#D1D5DB`, Activé = `#3667F0`.
* **Tabs** : Onglet actif = Texte `#3667F0` + soulignement `#3667F0` (2px). Onglet inactif = `#6B7280`.

### Iconographie

* **Style :** Linear / Outline avec épaisseur régulière (1.75px – 2px).
* **Consistance :** Ne jamais mélanger le style Outline avec des icônes remplies (*filled*) ou des émojis au sein d'une même interface.

---

## 5. Composants Métier Produit

### Alex AI Coach Widget
* **Rôle :** Assistance IA contextuelle.
* **Structure :** En-tête avec statut `● En ligne`, avatar d'Alex, bulle de message explicite et bouton d'action direct.

### Job Match Widget (Score 0-100)
* **Principe d'explicabilité :** Un score ne doit **jamais** être affiché seul.
* **Composants :** Grand chiffre (ex: `86/100`), mention qualitative (`Très bon match`), barre de progression Brand Blue, puis ventilation détaillée (Compétences, Expérience, Mots-clés).

### Analyse ATS Widget
* **Couleur dominante :** `success-green` (`#25C78A`) lorsque le résultat est optimal (> 80%).
* **Structure :** Jauge circulaire %, statut (`Excellent`), et liste à puces des validations de compatibilité ATS.

### CV Preview Card
* **Règle d'or :** L'aperçu du document CV reste **toujours sur fond blanc (`#FFFFFF`)**, y compris en Dark Mode, pour refléter fidèlement le document exportable.

---

## 6. Layout, Spacing & Shadows

### Grille
* **Desktop (≥ 1024px)** : 12 colonnes, max-width 1200px–1280px, gouttière 24px.
* **Tablette (768px - 1023px)** : 8 colonnes.
* **Mobile (< 768px)** : 4 colonnes.

### Échelle d'espacement (Base 8px)
`4px` · `8px` · `12px` · `16px` · `24px` · `32px` · `40px` · `48px` · `56px` · `64px` · `72px` · `80px` · `96px` · `128px`

### Border Radius
* `4 px` : Micro-contrôles, badges compacts
* `8 px` : Contrôles compacts
* `12 px` : Inputs, boutons standards (recommandé)
* `16 px` : Cartes et widgets
* `24 px` : Modals et sections Hero

### Élévation & Ombres
```css
/* Elevation 1 - Contrôles légers */
box-shadow: 0 1px 2px rgba(15, 34, 61, 0.06);

/* Elevation 2 - Cartes & Dropdowns */
box-shadow: 0 4px 12px rgba(15, 34, 61, 0.08);

/* Elevation 3 - Modals & Floating UI */
box-shadow: 0 12px 24px rgba(15, 34, 61, 0.12);
```

---

## 7. Configuration Thèmes Light & Dark

| Élement | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Arrière-plan global** | `#FAFAFC` (`neutral-50`) | `#081426` (Navy très sombre) |
| **Surface de carte** | `#FFFFFF` | `#0F223D` (Primary Navy) |
| **Surface élevée** | `#F3F4F6` | `#162B46` |
| **Texte principal** | `#111827` (`neutral-900`) | `#F8FAFC` |
| **Texte secondaire** | `#374151` (`neutral-700`) | `#AAB8CB` |
| **Accent Bleu** | `#3667F0` | `#5D82FF` (Bleu ajusté pour contraste sombre) |
| **Aperçu du CV** | `#FFFFFF` | `#FFFFFF` *(Invariable)* |

---

## 8. Motion & Micro-interactions

* **Logo ACV Continuous** : Tracé animé séquentiel (A → C → V) en `500ms – 800ms`.
* **Barre de Match / Gauges** : Animation progressive de 0 à la valeur cible (`600ms`).
* **Alex IA** : Apparition douce ou légère pulsation du voyant d'activité.
* **Valideur ATS** : Animation de checkmark en `200ms – 300ms`.
* **Philosophie** : Mouvements subtils et continus sans rebonds excessifs.

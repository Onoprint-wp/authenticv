# AuthentiCV — Design System v1.0

> **ACV Continuous** · [authenticv.app](https://authenticv.app)  
> Source de vérité Design & Tokens UI/UX pour l'écosystème AuthentiCV (Focus Version Light Mode & Multi-Espaces).

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

## 2. Color System & Tokens (Spécification Version Light Mode)

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

### Palette Neutres (Rendu Light Mode)

| Token Name | HEX | Rendu dans la Version Light |
| :--- | :--- | :--- |
| `neutral-900` | `#111827` | Texte principal en Light Mode (Contraste AAA) |
| `neutral-700` | `#374151` | Texte secondaire, sous-titres |
| `neutral-500` | `#6B7280` | Placeholders, métadonnées, onglets inactifs |
| `neutral-300` | `#D1D5DB` | Bordures de cartes et composants |
| `neutral-100` | `#F3F4F6` | Fonds de cartes secondaires, hover states |
| `neutral-50` | `#FAFAFC` | **Arrière-plan global (Canvas) en Light Mode** |
| `white` | `#FFFFFF` | **Surface de cartes & conteneurs principaux en Light Mode** |

---

## 3. Spécifications Visuelles par Espace applicatif (Version Light Mode)

### 👑 1. Administrateur Central (`/admin`)
* **Arrière-plan :** `#FAFAFC` avec conteneurs blancs `#FFFFFF` et bordure `1px solid #D1D5DB`.
* **Titres & Onglets :** Titres en **Montserrat Bold** (`2 450 000 FCFA`), 7 onglets opérationnels en **Inter** avec soulignement Brand Blue (`#3667F0`).
* **Indicateurs Financiers :** Badges de croissance en `success-green` (`#25C78A`) (`+18.5%`).

### 👨‍🎓 2. Candidat B2C Studio Builder (`/builder`)
* **Coach Alex IA :** Fenêtre d'assistance avec en-tête `ai-violet` (`#7C5CFC`) et bouton `Demander à Alex`.
* **Score ATS :** Jauge circulaire verte à **94%** (`#25C78A`).
* **CV Preview Sheet :** Feuille de travail CV maintenue sur fond blanc pur (`#FFFFFF`) avec ombrage `elevation-2` et fenêtre d'upgrade des Pass MoMo (1k / 5k / 18k FCFA).

### 🏢 3. Recruteur B2B Moteur de Recherche (`/recruiter/search`)
* **Filtres Villes CEMAC :** Filtres latéraux (Douala, Yaoundé, Libreville, Brazzaville, N'Djamena).
* **Cartes Candidats :** Badges d'adéquation IA (96%, 92%, 87%), badges `ATS Compatible` et boutons `Débloquer le profil` en Brand Blue (`#3667F0`).

### 💼 4. Délégué Commercial Hub (`/commercial`)
* **Commissions FCFA :** Suivi en direct (10% agent = `3 450 000 FCFA`, 2.5% override = `487 500 FCFA`).
* **Widget d'Affiliation :** Lien personnel et code promo `DIRCM10`.
* **Réseau & Ventes :** Arborescence d'équipe et graphiques de performance en dégradé bleu/cyan.

---

## 4. Typographie (Montserrat & Inter)

* **Montserrat** = Personnalité de marque & structure (Headings H1, H2, H3)
* **Inter** = Efficacité produit, lisibilité & composants UI (Body, Formulaires, Boutons)

---

## 5. Isolation Immuable de la Feuille CV (`.cv-preview-sheet`)

> **Règle d'or :** L'aperçu du document CV reste **toujours sur fond blanc (`#FFFFFF`) avec texte sombre (`#111827`)**, y compris en Dark Mode, pour refléter fidèlement le document PDF exportable.

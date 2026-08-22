# AuthentiCV App — Design System & UI Rules (ACV Continuous)

> **HARD CONSTRAINT**: All AI agents (Google Antigravity, subagents, code generators) working on the `authenticv` repository MUST treat this specification as a hard, non-negotiable constraint. Do NOT invent alternative brand colors, fonts, typography scales, gradients, border radii, icon styles, terminology, or marketing claims. Reuse the defined design tokens and component patterns consistently across Candidate, Recruiter, Campus, and Alex.

---

## Master Instruction

> **Treat the AuthentiCV Design System as a hard constraint, not as visual inspiration. Do not invent alternative brand colors, fonts, typography scales, gradients, border radii, icon styles, terminology or marketing claims. Reuse the defined design tokens and component patterns consistently across Candidate, Recruiter, Campus and Alex. Product differentiation must come from controlled semantic accents, not from creating separate visual identities. When information or copy is missing, use explicit neutral placeholders instead of inventing business facts.**

> **Blue = interaction (`#3667F0`). Cyan = signal/Campus (`#32D3E1`). Violet = AI/Alex (`#7C5CFC`). Green = success/validation (`#25C78A`). Navy = trust/structure (`#0F223D`). Neutral colors = interface.**

---

## 1. Technical Stack & Architecture
- **Framework**: Next.js 16 (App Router)
- **UI Components**: React 19 Server Components by default, `@base-ui/react`, `shadcn/ui`, `cva`
- **Styling**: Tailwind CSS v4 (`src/app/globals.css`)
- **Design Tokens Source**: `DESIGN.md` & `src/app/globals.css`

---

## 2. Core Tokens & Color Rules

### Allowed Brand Tokens
| Token | HEX | Sémantique & Usage |
| :--- | :--- | :--- |
| `brand.navy` | `#0F223D` | Identité, navigation, titres majeurs, arrière-plans dark |
| `brand.blue` | `#3667F0` | **Couleur interactive principale** (CTA primaire, sélection, onglets actifs, focus, liens) |
| `brand.cyan` | `#32D3E1` | Signal secondaire, produit Campus, data viz, progression |
| `brand.violet` | `#7C5CFC` | **Réservé exclusivement à l'IA / Alex** (Coach, suggestions IA, analyse IA) |
| `semantic.success` | `#25C78A` | ATS Compatible, validations, succès, état terminé, score favorable |

### Neutrals
- `neutral.900`: `#111827` (Texte principal light mode)
- `neutral.700`: `#374151` (Texte secondaire)
- `neutral.500`: `#6B7280` (Placeholders, métadonnées, onglets inactifs)
- `neutral.300`: `#D1D5DB` (Bordures)
- `neutral.100`: `#F3F4F6` (Surfaces secondaires, hover)
- `neutral.50`: `#FAFAFC` (Fond de page global light mode)
- `white`: `#FFFFFF` (Surfaces de cartes & preview CV)

---

## 3. Typography Scale (Montserrat & Inter)
- **Branding & Headings**: Montserrat
  - **H1**: Montserrat Bold `32px / 40px`, tracking `-0.005em`
  - **H2**: Montserrat SemiBold `24px / 32px`, tracking `-0.0025em`
  - **H3 / Subtitle**: Montserrat Medium `18px / 28px`
- **Interface & Functional Content**: Inter
  - **Body**: Inter Regular `16px / 24px`
  - **Small**: Inter Regular `14px / 20px`
  - **Caption**: Inter Regular `12px / 16px`
  - **Button**: Inter SemiBold `14px / 20px`, tracking `0.0025em`

---

## 4. Component Rules

### Buttons
- **Primary**: `height: 44–48px`, `padding-inline: 20px`, `border-radius: 12px`, `background: #3667F0`, `text: #FFFFFF`, `font: Inter SemiBold 14px`. (Only ONE dominant primary CTA per functional zone).
- **Secondary**: `background: #FFFFFF`, `border: 1px solid #D1D5DB`, `color: #0F223D`.
- **Outline Brand**: `background: transparent`, `border: 1px solid #3667F0`, `color: #3667F0`.
- **Ghost**: Minimalist background for tertiary actions & contextual menus.
- **AI Action**: `linear-gradient(135deg, #3667F0 0%, #7C5CFC 100%)` used ONLY when Alex or AI features are active.

### Forms & Inputs
- `min-height: 44px`, `border-radius: 10px`, `border: 1px solid #D1D5DB`, `background: #FFFFFF`.
- Focus: `border-color: #3667F0`, `box-shadow: 0 0 0 3px rgba(54, 103, 240, 0.15)`.
- Permanent labels are MANDATORY when content is ambiguous. Placeholders show examples (e.g. `Ex. Product Designer`) using `neutral-500` (`#6B7280`).

### Cards & Surfaces
- `background: #FFFFFF`, `border: 1px solid #E5E7EB`, `border-radius: 16px`.
- Default Elevation: `box-shadow: 0 1px 2px rgba(15, 34, 61, 0.06)`. Hover Elevation: `0 4px 12px rgba(15, 34, 61, 0.08)`.
- UI relies on spacing + borders + contrast, NOT big heavy shadows.

### Icons
- Style: **Outline / Linear** only. Stroke: `1.75–2px`.
- Interdictions: NO emojis as interface icons, NO 3D pictograms, NO filled icons mixed in.

### CV Preview Sheet Rule
- **`cv-preview-sheet`**: Always remains pure white (`#FFFFFF`) with dark text (`#111827`) in both Light and Dark modes to accurately mirror the exported PDF document.

### Scores & ATS Display
- Score rule: NEVER display a bare score (e.g. `86/100`). Always pair with interpretation: `86/100 — Très bon match` followed by sub-breakdowns (Compétences 90%, Expérience 82%, Mots-clés 88%).

---

## 5. Absolute UI Restrictions
UI generators & agents MUST NOT:
- Invent new functional colors or use pink/purple as general accents.
- Turn all buttons into gradients or apply gradients to background/cards/forms/sidebars.
- Use glassmorphism cards, glow effects, neon, or big gradient blobs.
- Use generic 3D robots for Alex AI Coach.
- Round components excessively or convert everything into cards.
- Invent client stats, testimonials, or marketing claims not present in source content.

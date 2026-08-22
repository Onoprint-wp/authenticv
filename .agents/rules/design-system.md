# AuthentiCV Design System Rule & Specification (ACV Continuous)

> **Context**: All AI agents (Google Antigravity, subagents) working on the `authenticv` repository must follow this specification strictly when creating or modifying UI components, layouts, pages, and styles.

---

## 1. Stack & Architecture Standards
- **Framework**: Next.js 16 (App Router)
- **UI Components**: React 19 Server Components by default, `@base-ui/react`, `shadcn/ui`, `cva`
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` with `@theme inline` in `src/app/globals.css`)
- **Design Tokens**: Standardized CSS variables defined in `src/app/globals.css` and documented in `DESIGN.md`.

---

## 2. Core Tokens & Semantics

### Brand Colors
- `--color-primary-navy` / `primary-navy`: `#0F223D` (Logo, headers, dark surface)
- `--color-brand-blue` / `brand-blue`: `#3667F0` (Primary CTA, active states, links)
- `--color-brand-cyan` / `brand-cyan`: `#32D3E1` (Campus product, data badges)
- `--color-ai-violet` / `ai-violet`: `#7C5CFC` (Alex AI Coach, AI actions, AI badges)
- `--color-success-green` / `success-green`: `#25C78A` (ATS score, validations, success states)

### Neutral Palette
- `neutral-900`: `#111827` (Primary text light mode)
- `neutral-700`: `#374151` (Secondary text light mode)
- `neutral-500`: `#6B7280` (Muted text / inactive tabs)
- `neutral-300`: `#D1D5DB` (Borders / dividers)
- `neutral-100`: `#F3F4F6` (Hover surfaces)
- `neutral-50`: `#FAFAFC` (Light page background)
- `white`: `#FFFFFF` (Card surfaces, CV preview)

### Typography
- **Heading Font**: Montserrat (`var(--font-montserrat)`)
- **Interface Font**: Inter (`var(--font-inter)`)
- Heading 1: Montserrat Bold 32px / 40px (-0.5% tracking)
- Heading 2: Montserrat SemiBold 24px / 32px (-0.25% tracking)
- Subtitle: Montserrat Medium 18px / 28px
- Body: Inter Regular 16px / 24px
- Button: Inter SemiBold 14px / 20px

---

## 3. UI Component Constraints & Variants

### Button API (`src/components/ui/button.tsx`)
- Variants: `default` (Primary Blue), `secondary`, `outline`, `ghost`, `destructive`, `ai` (`gradient-ai` with sparkles)
- Sizes: `xs`, `sm`, `default`, `lg`, `icon`
- Rule: Do not apply gradients to standard primary buttons. Use `gradient-ai` ONLY for Alex / AI actions.

### Badge Variants (`src/components/ui/badge.tsx` or Badges)
- `ATS Compatible`: Success Green badge (`#25C78A`)
- `Premium` / `AI`: Violet badge (`#7C5CFC`)
- `Nouveau` / `Primary`: Brand Blue badge (`#3667F0`)
- `Campus`: Cyan badge (`#32D3E1`)
- `Recruiter`: Primary Navy / Brand Blue badge

### CV Preview Rule
- **`cv-preview-sheet`**: CV previews and PDF renderers MUST remain `#FFFFFF` background with `#111827` text in both Light and Dark themes to reflect exported documents.

### Score Widgets (Job Match & ATS)
- Never display a bare number without interpretation (e.g. `86/100` + `Très bon match` + breakdown of Compétences, Expérience, Mots-clés).
- ATS score circular gauges must include textual fallback and status descriptions.

---

## 4. Verification Workflow
Before declaring any task completed:
1. `npx tsc --noEmit` (TypeScript check)
2. `npm run lint` or `eslint`
3. `npm run build`
4. Inspect UI rendering across Light and Dark themes.

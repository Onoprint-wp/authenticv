# Agent Intelligence System

Welcome to the AuthenticV Agent ecosystem. This file provides critical context for AI agents working on this codebase.

## 🚀 Next.js 16.2.4 Architecture
This project uses the latest Next.js 16 (Turbopack). 
- **Conventions**: We use `src/proxy.ts` instead of `middleware.ts` for edge logic.
- **Components**: React 19 Server Components are the default. Use `'use client'` only where necessary.
- **Styling**: Tailwind CSS v4 is used with `@base-ui/react` and `shadcn/ui`.

## 🤖 AI Coach Integration
The core value proposition is the AI Coach Alex. 
- Integration point: `src/app/builder/`
- Logic: Handled via Vercel AI SDK with Anthropic.

## 🛠️ Contribution Rules for Agents
1. **Consistency**: Follow the design system in `src/styles/`.
2. **Safety**: Do not commit secrets. Use `.env.example` as a reference.
3. **Refactor**: Before implementing complex logic, check if it can be abstracted into a reusable hook or specialized component.
4. **Proxy**: Never create `middleware.ts`. Use or update `src/proxy.ts`.

## ⚠️ Patterns critiques — à respecter impérativement

### API Key Anthropic
Toujours instancier le provider avec la clé sanitisée. Ne jamais utiliser le singleton global.
```typescript
const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");
const provider = createAnthropic({ apiKey: sanitizedApiKey });
```

### Modèles Anthropic
Utiliser uniquement les constantes définies en tête de chaque route :
- `DEFAULT_MODEL` dans `src/app/api/chat/route.ts`
- `DEFAULT_OPTIMIZE_MODEL` dans `src/app/api/optimize/route.ts`
- `DEFAULT_UPLOAD_MODEL` dans `src/app/api/upload/route.ts`

Ne jamais hardcoder un ID de modèle avec une date (ex: `claude-3-5-haiku-20241022`).
Consulter `CLAUDE.md` pour la liste des modèles interdits.

### Rate Limiting
Tout endpoint appelant un LLM **doit** avoir un guard rate limit.
1. Importer le limiteur depuis `src/lib/rate-limit.ts`
2. Appeler `.limit(user.id)` immédiatement après le guard auth
3. Retourner `{ status: 429 }` si `!success`

Référence : `src/app/api/chat/route.ts` (pattern complet).

### Prisma vs Supabase JS
`lib/prisma.ts` existe pour les migrations uniquement (`prisma generate`, `prisma db push`).
Ne jamais l'importer dans les routes API. Utiliser `@/utils/supabase/server` pour les données.

### Checkpoints de version
`saveCheckpoint()` du store Zustand est déclenché via la prop `onCheckpoint` du `ChatPanel`,
après chaque réponse complète du coach. Ne pas l'appeler dans la boucle de sauvegarde auto
(`useSyncCv`) — les 10 slots seraient épuisés en 20 secondes d'édition.

### Tests Playwright
`tests/.auth/` contient des tokens de session Supabase — présent dans `.gitignore`.
Ne jamais forcer son commit (`git add -f`).

### Fichiers clés à lire avant toute modification
| Zone | Fichier |
|---|---|
| Coach IA | `src/app/api/chat/route.ts` |
| Sync auto-save | `src/hooks/useSyncCv.ts` |
| État global CV | `src/store/useCvStore.ts` |
| Rate limiting | `src/lib/rate-limit.ts` |
| Auth middleware | `src/proxy.ts` + `src/utils/supabase/middleware.ts` |
| Schéma DB | `prisma/schema.prisma` (table `Resume` dans `public`) |

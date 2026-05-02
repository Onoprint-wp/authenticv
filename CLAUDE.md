# Claude Environment Config

## 🔑 Permissions
- Claude est autorisé à faire des refactors structurels et des améliorations de style.
- Claude DOIT vérifier l'intégrité serveur avant de finaliser des changements UI.

## 📦 Dépendances clés
- **Next.js** : 16.2.4 (Turbopack)
- **React** : 19.2.4
- **Supabase** : SSR flows (auth + data — PAS de Prisma dans les routes API)
- **AI SDK** : Vercel AI SDK v6 (`ai@^6`, `@ai-sdk/anthropic@^3`, `@ai-sdk/react@^3`)
- **Zustand** : gestion d'état client (`zustand@^5`)
- **Zod** : validation des schemas (`zod@^4`)

## 🤖 Modèles Anthropic actifs (mai 2026)
- Chat principal  : `claude-sonnet-4-6`  → `DEFAULT_MODEL` dans `chat/route.ts`
- Optimize        : `claude-haiku-4-5`   → `DEFAULT_OPTIMIZE_MODEL` dans `optimize/route.ts`
- Upload parsing  : `claude-haiku-4-5`   → `DEFAULT_UPLOAD_MODEL` dans `upload/route.ts`
- Override via env : `ANTHROPIC_MODEL`, `ANTHROPIC_OPTIMIZE_MODEL`, `ANTHROPIC_UPLOAD_MODEL`

**Modèles INTERDITS (retirés / dépréciés) :**
- `claude-3-5-sonnet-20241022` — retraité oct 2025
- `claude-3-5-haiku-20241022` — retraité fév 2026
- `claude-3-haiku-20240307`   — très vieux
- `claude-sonnet-4-20250514`  — déprécié, retraite juin 2026
Vérifier la liste officielle Anthropic avant d'ajouter tout nouveau modèle.

## 🔐 Sécurité — règles non négociables
1. **API Key** : toujours utiliser `createAnthropic({ apiKey: sanitizedApiKey })`.
   Ne jamais utiliser le singleton `anthropic()` global importé depuis `@ai-sdk/anthropic`.
   `const sanitizedApiKey = (process.env.ANTHROPIC_API_KEY ?? "").replace(/[\r\n\s]+/g, "");`

2. **Auth** : toutes les routes API doivent vérifier `supabase.auth.getUser()` côté serveur.

3. **Rate limiting** : tout endpoint appelant un LLM doit utiliser un limiteur de
   `src/lib/rate-limit.ts`. Pattern : importer le limiteur, appeler `.limit(user.id)` après le
   guard auth, retourner 429 si `!success`. Voir `chat/route.ts` comme référence.
   - Chat : 15 req/min  (`chatRateLimit`)
   - Upload : 5 req/min (`uploadRateLimit`)
   - Optimize : 10 req/min (`optimizeRateLimit`)

4. **Tokens de session** : `tests/.auth/` contient des cookies Supabase — ne jamais committer
   (déjà dans `.gitignore`).

## 🏗️ Architecture — décisions structurelles
- **Un seul CV par utilisateur** : `.limit(1)` intentionnel dans toutes les requêtes résumé.
  Toute feature multi-CV nécessite une discussion d'architecture préalable.

- **Prisma = migrations uniquement** : ne pas importer `lib/prisma.ts` dans les routes API.
  Utiliser `@/utils/supabase/server` (`createClient`) pour toutes les opérations de données.

- **Middleware** : utiliser/modifier `src/proxy.ts`. Ne JAMAIS créer `middleware.ts` à la racine.

- **Double-write pattern** : le chat route écrit en DB via `applyUpdate` (avec `localContent` en
  mémoire pour éviter les race conditions), puis le client refetch via `onToolFinish → refetch`.
  Ne pas modifier ce flux sans comprendre la race condition potentielle entre le debounce de
  `useSyncCv` et le refetch.

- **Checkpoints** : `saveCheckpoint()` doit être appelé uniquement après chaque réponse complète
  du coach IA (dans `ChatPanel.onFinish` via prop `onCheckpoint`). Ne pas l'appeler dans la
  boucle de sauvegarde auto — les 10 slots seraient consommés en 20 secondes.

## 🎨 Design
- Glassmorphism dark : base `slate-950`, accents `indigo-600` / `violet`.
- Animations : `tw-animate-css` pour les micro-interactions.
- Composants : Shadcn/ui + Base UI (`@base-ui/react`).

## 🚀 Performance
- Turbopack : éviter les barrel exports excessifs.
- PDF viewer : lazy-loadé côté client uniquement (`DynamicPdfViewer` avec import dynamique).
- Chat : historique tronqué à 12 messages (`MAX_HISTORY = 12`) pour contrôler les coûts tokens.
- Upload : texte extrait tronqué à 12 000 caractères avant envoi au LLM.

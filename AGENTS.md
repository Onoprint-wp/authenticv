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

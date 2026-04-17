# Claude Environment Config

This file details the specific configurations for Claude (and other LLMs) to operate efficiently within AuthenticV.

## 🔑 Permissions
- Claude is authorized to perform structural refactors and style improvements.
- Claude MUST verify server integrity before finalizing UI changes.

## 📦 Key Dependencies
- **Next.js**: 16.2.4 (Turbopack)
- **React**: 19.2.4
- **Supabase**: SSR flows
- **AI SDK**: Vercel AI SDK (Anthropic)

## 🎨 Design Principles
- **Aesthetics**: Premium, high-end, glassmorphism-friendly.
- **Animations**: Use `tw-animate-css` for micro-interactions.
- **Componentry**: Shadcn/ui + Base UI.

## 🚀 Performance
- Ensure Turbopack remains fast by avoiding excessive barrel exports.
- Lazy load complex PDF rendering components.

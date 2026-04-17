# 📄 AuthenticV

> **Revolutionize your CV creation with AI-driven intelligence.**

AuthenticV is a premium, high-performance web application built with Next.js 16 and React 19, designed to help candidates build impactful, professionally verified resumes. Powered by **Alex**, our integrated AI Coach, AuthenticV guides you through every step of the resume-building process.

![AuthenticV Builder Hero](./docs/screenshot_hero.png)

## ✨ Features

- 🤖 **AI Coach (Alex)**: Real-time, interactive guidance to optimize your content.
- 🎨 **Premium Builder**: A sleek, modern interface with real-time PDF preview.
- 🚀 **Modern Tech Stack**: Built with Next.js 16 (Turbopack), React 19, and Tailwind CSS v4.
- 🔒 **Secure Data**: Powered by Supabase for authentication and real-time synchronization.
- 📄 **Export Perfection**: High-quality PDF generation and printing out of the box.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack)
- **Frontend**: [React 19](https://react.dev/), [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Logic & AI**: [Vercel AI SDK](https://sdk.vercel.ai/), [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm / pnpm / yarn
- A Supabase project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/authenticv.git
   cd authenticv
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

We welcome contributions! Please check out [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md) for specific development guidelines and environment context.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

Built with ❤️ by the AuthenticV Team.

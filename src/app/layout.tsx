import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://authenticv.app"),
  title: {
    default: "AuthentiCV — Créer un CV avec l'IA | Coach Alex gratuit",
    template: "%s | AuthentiCV",
  },
  description:
    "Créez votre CV ATS-optimisé en quelques minutes avec Alex, votre coach IA conversationnel. Pas de formulaire ennuyeux — une vraie conversation. Essai gratuit, sans carte bancaire.",
  keywords: [
    "cv ia",
    "créer cv ia",
    "générateur cv ia",
    "cv intelligence artificielle",
    "cv ats gratuit",
    "créer cv en ligne",
    "coach cv ia",
  ],
  authors: [{ name: "AuthentiCV", url: "https://authenticv.app" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://authenticv.app",
    siteName: "AuthentiCV",
    title: "AuthentiCV — Créer un CV avec l'IA | Coach Alex gratuit",
    description:
      "Créez votre CV ATS-optimisé en quelques minutes avec Alex, votre coach IA. Pas de formulaire, une vraie conversation. Gratuit, sans carte bancaire.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AuthentiCV — Générateur de CV par IA conversationnelle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuthentiCV — Créer un CV avec l'IA | Coach Alex gratuit",
    description:
      "Créez votre CV ATS-optimisé en quelques minutes avec Alex, votre coach IA. Essai gratuit, sans carte bancaire.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://authenticv.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full bg-slate-950">
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}

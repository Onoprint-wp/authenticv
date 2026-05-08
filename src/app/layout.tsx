import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/PostHogProvider";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.authenticv.app"),
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
  authors: [{ name: "AuthentiCV", url: "https://www.authenticv.app" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.authenticv.app",
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
    canonical: "https://www.authenticv.app",
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
      <head>
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className="h-full bg-slate-950">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}

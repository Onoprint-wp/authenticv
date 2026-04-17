import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuthentiCV — Créez votre CV avec l'IA",
  description:
    "Construisez un CV ATS-optimisé grâce à votre coach IA personnel. Rapide, intelligent, authentique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full bg-slate-950">{children}</body>
    </html>
  );
}

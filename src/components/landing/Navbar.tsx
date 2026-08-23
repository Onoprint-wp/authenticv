"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { LandingDict } from "@/lib/i18n/landing";

interface Props {
  dict: LandingDict["navbar"];
}

function LocaleSwitcher() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  const toggleLocale = (newLocale: "fr" | "en") => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "fr") {
      segments.shift();
    }
    const newPath = newLocale === "fr" 
      ? `/${segments.join("/")}` 
      : `/en${segments.length ? `/${segments.join("/")}` : ""}`;
    window.location.href = newPath || "/";
  };

  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
      <button
        onClick={() => toggleLocale("fr")}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
          !isEn 
            ? "bg-background text-foreground shadow-xs" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
      <button
        onClick={() => toggleLocale("en")}
        className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
          isEn 
            ? "bg-background text-foreground shadow-xs" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}

export function Navbar({ dict }: Props) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/logo/logo-landing-page.png"
            alt="AuthentiCV Logo"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link href="#comment-ca-marche" className="text-sm font-medium font-sans text-muted-foreground hover:text-foreground transition-colors">
            {dict.howItWorks}
          </Link>
          <Link href="#fonctionnalites" className="text-sm font-medium font-sans text-muted-foreground hover:text-foreground transition-colors">
            {dict.features}
          </Link>
          <Link href="#tarifs" className="text-sm font-medium font-sans text-muted-foreground hover:text-foreground transition-colors">
            {dict.pricing}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link href="/login" className="text-sm font-medium font-sans text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {dict.login}
          </Link>
          <Link
            href="/builder"
            className="text-sm font-bold bg-brand-blue text-white hover:bg-brand-blue/90 px-4 py-2 rounded-xl transition-all shadow-md active:scale-95"
          >
            {dict.cta}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

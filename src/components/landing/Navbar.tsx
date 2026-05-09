"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { LandingDict } from "@/lib/i18n/landing";

interface Props {
  dict: LandingDict["navbar"];
}

function LocaleSwitcher() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");

  return (
    <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-lg p-0.5 text-xs font-semibold">
      <Link
        href="/"
        className={`px-2 py-1 rounded-md transition-colors ${
          !isEn ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
        }`}
      >
        FR
      </Link>
      <Link
        href="/en"
        className={`px-2 py-1 rounded-md transition-colors ${
          isEn ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
        }`}
      >
        EN
      </Link>
    </div>
  );
}

export function Navbar({ dict }: Props) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:bg-indigo-500 transition-colors">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AuthentiCV</span>
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link href="#comment-ca-marche" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {dict.howItWorks}
          </Link>
          <Link href="#fonctionnalites" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {dict.features}
          </Link>
          <Link href="#tarifs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            {dict.pricing}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
            {dict.login}
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
          >
            {dict.cta}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

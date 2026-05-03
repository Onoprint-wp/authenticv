"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
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
            Comment ça marche
          </Link>
          <Link href="#fonctionnalites" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#tarifs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
            Se connecter
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
          >
            Créer mon CV
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

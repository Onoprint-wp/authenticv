import Link from "next/link";
import { FileText } from "lucide-react";
import type { LandingDict } from "@/lib/i18n/landing";

interface Props {
  dict: LandingDict["footer"];
}

export function Footer({ dict }: Props) {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AuthentiCV</span>
          </Link>
          <p className="text-slate-500 text-sm max-w-sm mb-6">{dict.tagline}</p>
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} AuthentiCV. {dict.copyright}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{dict.productTitle}</h4>
          <ul className="space-y-2">
            <li><Link href="#comment-ca-marche" className="text-slate-400 hover:text-white text-sm transition-colors">{dict.links.howItWorks}</Link></li>
            <li><Link href="#fonctionnalites" className="text-slate-400 hover:text-white text-sm transition-colors">{dict.links.features}</Link></li>
            <li><Link href="#tarifs" className="text-slate-400 hover:text-white text-sm transition-colors">{dict.links.pricing}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{dict.legalTitle}</h4>
          <ul className="space-y-2">
            <li><Link href="/mentions-legales" className="text-slate-400 hover:text-white text-sm transition-colors">{dict.links.legal}</Link></li>
            <li><Link href="/confidentialite" className="text-slate-400 hover:text-white text-sm transition-colors">{dict.links.privacy}</Link></li>
            <li><Link href="/cgu" className="text-slate-400 hover:text-white text-sm transition-colors">{dict.links.terms}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

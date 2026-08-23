import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import type { LandingDict } from "@/lib/i18n/landing";

interface Props {
  dict: LandingDict["footer"];
}

export function Footer({ dict }: Props) {
  return (
    <footer className="bg-[#081426] py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/images/logo/logo-fond-bleu-renforce.png"
              alt="AuthentiCV Logo Footer"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="text-slate-300 text-sm max-w-sm mb-6 font-sans">{dict.tagline}</p>
          <p className="text-slate-400 text-sm font-sans">
            © {new Date().getFullYear()} AuthentiCV. {dict.copyright}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold font-heading mb-4">{dict.productTitle}</h4>
          <ul className="space-y-2 font-sans">
            <li><Link href="#comment-ca-marche" className="text-slate-300 hover:text-white text-sm transition-colors">{dict.links.howItWorks}</Link></li>
            <li><Link href="#fonctionnalites" className="text-slate-300 hover:text-white text-sm transition-colors">{dict.links.features}</Link></li>
            <li><Link href="#tarifs" className="text-slate-300 hover:text-white text-sm transition-colors">{dict.links.pricing}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold font-heading mb-4">{dict.legalTitle}</h4>
          <ul className="space-y-2 font-sans">
            <li><Link href="/mentions-legales" className="text-slate-300 hover:text-white text-sm transition-colors">{dict.links.legal}</Link></li>
            <li><Link href="/confidentialite" className="text-slate-300 hover:text-white text-sm transition-colors">{dict.links.privacy}</Link></li>
            <li><Link href="/cgu" className="text-slate-300 hover:text-white text-sm transition-colors">{dict.links.terms}</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

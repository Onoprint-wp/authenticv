import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
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
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            Votre assistant personnel alimenté par l{"'"}IA pour créer des CV professionnels, percutants et authentiques en quelques minutes.
          </p>
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} AuthentiCV. Tous droits réservés.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Produit</h4>
          <ul className="space-y-2">
            <li><Link href="#comment-ca-marche" className="text-slate-400 hover:text-white text-sm transition-colors">Comment ça marche</Link></li>
            <li><Link href="#fonctionnalites" className="text-slate-400 hover:text-white text-sm transition-colors">Fonctionnalités</Link></li>
            <li><Link href="#tarifs" className="text-slate-400 hover:text-white text-sm transition-colors">Tarifs</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Légal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Mentions légales</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Politique de confidentialité</Link></li>
            <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">CGU</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

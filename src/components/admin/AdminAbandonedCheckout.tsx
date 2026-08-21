"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag, RefreshCw, MessageSquare, Send, CheckCircle2,
  AlertCircle, Sparkles, Phone, ExternalLink, Zap
} from "lucide-react";

interface AbandonedCart {
  resumeId: string;
  userId: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone?: string;
  location: string;
  countryCode: string;
  updatedAt: string;
  potentialRevenueXaf: number;
}

const COUNTRY_FLAGS: Record<string, string> = {
  CM: "🇨🇲",
  GA: "🇬🇦",
  CG: "🇨🇬",
  TD: "🇹🇩",
  CF: "🇨🇫",
  GQ: "🇬🇶",
};

export function AdminAbandonedCheckout() {
  const [abandonedList, setAbandonedList] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<{ id: string; text: string; whatsappUrl: string | null } | null>(null);

  const fetchAbandoned = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/abandoned");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement");
      }
      setAbandonedList(data.abandoned || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbandoned();
  }, []);

  const handleGenerateRecovery = async (cart: AbandonedCart) => {
    setGeneratingFor(cart.resumeId);
    try {
      const res = await fetch("/api/admin/abandoned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: cart.fullName,
          phone: cart.phone,
          email: cart.email,
          jobTitle: cart.jobTitle,
          discountCode: "BOOST20",
          channel: "whatsapp",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Erreur");

      setGeneratedMessage({
        id: cart.resumeId,
        text: data.messageGenerated,
        whatsappUrl: data.whatsappUrl,
      });
    } catch {
      alert("Erreur lors de la génération du message.");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleGrantProGeste = async (cart: AbandonedCart) => {
    if (!confirm(`Offrir 1 mois Pro à ${cart.fullName} (${cart.email}) comme geste commercial ?`)) return;

    try {
      const res = await fetch("/api/admin/grant-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cart.email, action: "grant_pro" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Erreur");

      setActionSuccess(`Accès Pro offert à ${cart.fullName} avec succès !`);
      setTimeout(() => setActionSuccess(null), 4000);
      fetchAbandoned();
    } catch {
      alert("Erreur lors de l'activation du compte.");
    }
  };

  const totalLatentRevenue = abandonedList.reduce((acc, c) => acc + (c.potentialRevenueXaf || 1000), 0);

  return (
    <div className="space-y-6">
      {/* ── Summary Card ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">
              Sauvetage de Ventes &amp; Paniers de CV Abandonnés (Anti-Abandon)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Candidats ayant rédigé un CV complet mais n&apos;ayant pas encore validé l&apos;export HD à 1 000 FCFA ou le Pass Pro.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Cashflow Latent Estimé</div>
            <div className="text-lg font-black text-amber-400">
              {totalLatentRevenue.toLocaleString("fr-FR")} <span className="text-xs">FCFA</span>
            </div>
          </div>
          <button
            onClick={fetchAbandoned}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Abandoned Carts Table ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Candidat &amp; Pays</th>
                <th className="px-4 py-3.5 font-semibold">Titre du CV Rédigé</th>
                <th className="px-4 py-3.5 font-semibold">Coordonnées</th>
                <th className="px-4 py-3.5 font-semibold">Dernière Activité</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions Commerciales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && abandonedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    Détection des paniers abandonnés en cours...
                  </td>
                </tr>
              ) : abandonedList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Aucun panier abandonné récent détecté. Taux de conversion optimal !
                  </td>
                </tr>
              ) : (
                abandonedList.map((cart) => {
                  const flag = COUNTRY_FLAGS[cart.countryCode] || "🇨🇲";

                  return (
                    <tr key={cart.resumeId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{flag}</span>
                          <div>
                            <div className="font-bold text-white text-xs">{cart.fullName}</div>
                            <div className="text-[11px] text-slate-400">{cart.location}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-200">
                        <div className="line-clamp-1">{cart.jobTitle}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                          Prêt à télécharger
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-slate-300">{cart.email}</div>
                        {cart.phone ? (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            {cart.phone}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 italic">Sans téléphone</div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(cart.updatedAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })} à {new Date(cart.updatedAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                        {/* Generate WhatsApp / Relance */}
                        <button
                          onClick={() => handleGenerateRecovery(cart)}
                          disabled={generatingFor === cart.resumeId}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[11px] font-semibold border border-emerald-500/30 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Relance -20%</span>
                        </button>

                        {/* Direct Pro Gift Geste */}
                        <button
                          onClick={() => handleGrantProGeste(cart)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-semibold border border-slate-700 transition-all cursor-pointer"
                          title="Offrir 1 mois Pro pour fidélisation"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Geste Pro</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Generated Message Preview Drawer ── */}
        {generatedMessage && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Message de Relance Personnalisé Généré</span>
              </div>
              <button
                onClick={() => setGeneratedMessage(null)}
                className="text-xs text-slate-500 hover:text-white"
              >
                Fermer
              </button>
            </div>

            <textarea
              readOnly
              value={generatedMessage.text}
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none font-mono"
            />

            <div className="flex items-center gap-3">
              {generatedMessage.whatsappUrl ? (
                <a
                  href={generatedMessage.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer Directement sur WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMessage.text);
                    alert("Message copié dans le presse-papiers !");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Copier le texte
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Receipt, CheckCircle2, Download } from "lucide-react";

interface PaymentItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
}

interface Props {
  subscriptions?: Array<{
    updated_at?: string;
    created_at?: string;
    status?: string;
  }>;
  isPro?: boolean;
}

export function PaymentHistorySection({ subscriptions = [], isPro }: Props) {
  // Build items from subscription record or display active plan
  const items: PaymentItem[] = subscriptions.length > 0
    ? subscriptions.map((sub, idx) => ({
        id: `sub-${idx}`,
        date: new Date(sub.updated_at || sub.created_at || "2026-08-21").toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        description: isPro ? "Abonnement Plan Pro Mensuel" : "Abonnement AuthenticV",
        amount: isPro ? "5 000 FCFA" : "0 FCFA",
        status: sub.status === "active" || sub.status === "SUCCESS" ? "Payé" : "Confirmé",
      }))
    : isPro
      ? [
          {
            id: "sub-current",
            date: "Recouvrement actif",
            description: "Abonnement Plan Pro Mensuel",
            amount: "5 000 FCFA",
            status: "Payé",
          },
        ]
      : [];

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-white">Historique des abonnements & paiements</h2>
      </div>

      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            Aucune transaction enregistrée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Montant</th>
                  <th className="pb-3 font-semibold text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <tr key={item.id} className="text-slate-300">
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{item.date}</td>
                    <td className="py-3 font-medium text-white">{item.description}</td>
                    <td className="py-3 text-indigo-300 font-semibold">{item.amount}</td>
                    <td className="py-3 text-right flex items-center justify-end gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {item.status}
                      </span>
                      <a
                        href={`/api/export-invoice-pdf?desc=${encodeURIComponent(item.description)}&amount=${encodeURIComponent(item.amount)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Facture PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

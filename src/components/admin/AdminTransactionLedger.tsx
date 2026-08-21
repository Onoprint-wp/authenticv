"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard, Search, RefreshCw, Download, CheckCircle2,
  Clock, AlertCircle, Phone, ArrowUpRight, DollarSign, Filter
} from "lucide-react";

interface Transaction {
  id: string;
  reference_id: string;
  amount_xaf: number;
  currency: string;
  country_code: string;
  operator: string;
  payment_type: string;
  status: "successful" | "pending" | "failed" | "refunded";
  phone_number?: string;
  customer_email?: string;
  customer_name?: string;
  fees_operator?: number;
  cost_ai_estimated?: number;
  created_at: string;
}

interface Summary {
  totalVolumeXaf: number;
  totalFeesXaf: number;
  totalCostAiXaf: number;
  netMarginXaf: number;
}

const COUNTRY_FLAGS: Record<string, { label: string; flag: string }> = {
  CM: { label: "Cameroun", flag: "🇨🇲" },
  GA: { label: "Gabon", flag: "🇬🇦" },
  CG: { label: "Congo", flag: "🇨🇬" },
  TD: { label: "Tchad", flag: "🇹🇩" },
  CF: { label: "RCA", flag: "🇨🇫" },
  GQ: { label: "Guinée Éq.", flag: "🇬🇶" },
  INTL: { label: "International", flag: "🌍" },
};

const OPERATOR_COLORS: Record<string, string> = {
  MTN: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  ORANGE: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  AIRTEL: "bg-red-500/10 text-red-400 border-red-500/30",
  MOOV: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  TELECEL: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  GETESA: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  CARD: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
};

export function AdminTransactionLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [country, setCountry] = useState("ALL");
  const [operator, setOperator] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (country !== "ALL") params.set("country", country);
      if (operator !== "ALL") params.set("operator", operator);
      if (status !== "ALL") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/transactions?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur de chargement des transactions");
      }

      setTransactions(data.transactions || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [country, operator, status, search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "b2c_single":
        return "Déblocage Unique (1 000 F)";
      case "b2c_monthly":
        return "Pass Pro Mensuel (5 000 F)";
      case "b2c_annual":
        return "Pass Pro Annuel (18 000 F)";
      case "b2b_pack5":
        return "Pack Recruteur 5 (20 000 F)";
      case "b2b_pack15":
        return "Pack Recruteur 15 (50 000 F)";
      case "b2b_monthly_pro":
        return "Pass Recruteur Illimité (75 000 F)";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Volume Brut Encaissé
            </div>
            <div className="text-xl lg:text-2xl font-black text-white">
              {summary.totalVolumeXaf.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-medium text-indigo-400">FCFA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-indigo-400" />
              Zone CEMAC (XAF)
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Frais Télécoms (2-3%)
            </div>
            <div className="text-xl lg:text-2xl font-black text-amber-400">
              -{summary.totalFeesXaf.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-medium text-slate-400">FCFA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              MTN MoMo, Orange, Moov, Airtel
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Coûts LLM Claude Estimés
            </div>
            <div className="text-xl lg:text-2xl font-black text-violet-400">
              -{summary.totalCostAiXaf.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-medium text-slate-400">FCFA</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Anthropic Sonnet & Haiku
            </div>
          </div>

          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-slate-900 to-emerald-950/20">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Marge Nette Réelle
            </div>
            <div className="text-xl lg:text-2xl font-black text-emerald-300">
              {summary.netMarginXaf.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-medium text-emerald-400">FCFA</span>
            </div>
            <div className="text-[11px] text-emerald-400/80 mt-1 font-semibold">
              Rentabilité nette ~92%
            </div>
          </div>
        </div>
      )}

      {/* ── Filters & Search Bar ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Journal des Ventes &amp; Flux Mobile Money CEMAC
            </h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href="/api/admin/export-csv"
              download
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Country Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pays CEMAC</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">🌍 Tous les pays CEMAC</option>
              <option value="CM">🇨🇲 Cameroun (+237)</option>
              <option value="GA">🇬🇦 Gabon (+241)</option>
              <option value="CG">🇨🇬 Congo-Brazzaville (+242)</option>
              <option value="TD">🇹🇩 Tchad (+235)</option>
              <option value="CF">🇨🇫 République Centrafricaine (+236)</option>
              <option value="GQ">🇬🇶 Guinée Équatoriale (+240)</option>
            </select>
          </div>

          {/* Operator Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Opérateur Télécom</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tous les opérateurs</option>
              <option value="MTN">MTN Mobile Money</option>
              <option value="ORANGE">Orange Money</option>
              <option value="AIRTEL">Airtel Money</option>
              <option value="MOOV">Moov Money</option>
              <option value="TELECEL">Telecel Money</option>
              <option value="CARD">Carte Bancaire (CB)</option>
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Statut Paiement</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="successful">✅ Payé / Validé</option>
              <option value="pending">⏳ En attente USSD</option>
              <option value="failed">❌ Échoué / Abandonné</option>
            </select>
          </div>

          {/* Search input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Recherche Rapide</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="N° téléphone, réf, email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Transactions Table ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Date &amp; Heure</th>
                <th className="px-4 py-3.5 font-semibold">Référence &amp; Client</th>
                <th className="px-4 py-3.5 font-semibold">Pays &amp; Télécom</th>
                <th className="px-4 py-3.5 font-semibold">Produit Acheté</th>
                <th className="px-4 py-3.5 font-semibold">Montant Brut</th>
                <th className="px-4 py-3.5 font-semibold">Statut</th>
                <th className="px-5 py-3.5 font-semibold text-right">Justificatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Chargement du journal des ventes...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    Aucune transaction trouvée avec les critères sélectionnés.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const countryInfo = COUNTRY_FLAGS[tx.country_code] || { label: tx.country_code, flag: "📍" };
                  const opClass = OPERATOR_COLORS[tx.operator] || "bg-slate-800 text-slate-300 border-slate-700";

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-slate-400">
                        <div className="font-medium text-slate-300">
                          {new Date(tx.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(tx.created_at).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-mono text-[11px] font-semibold text-indigo-400">
                          {tx.reference_id}
                        </div>
                        <div className="text-slate-300 font-medium text-xs">
                          {tx.customer_name || tx.customer_email || "Client Particulier"}
                        </div>
                        {tx.phone_number && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {tx.phone_number}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{countryInfo.flag}</span>
                          <span className="font-medium text-slate-200">{countryInfo.label}</span>
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${opClass}`}>
                          {tx.operator}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-200">
                          {getPaymentTypeLabel(tx.payment_type)}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">
                          {tx.amount_xaf.toLocaleString("fr-FR")} <span className="text-xs text-amber-400">FCFA</span>
                        </div>
                        {tx.fees_operator ? (
                          <div className="text-[10px] text-slate-500">
                            Frais: -{tx.fees_operator} F · Net: {(tx.amount_xaf - tx.fees_operator).toLocaleString("fr-FR")} F
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {tx.status === "successful" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3" />
                            Payé
                          </span>
                        ) : tx.status === "pending" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-800/50">
                            <Clock className="w-3 h-3 animate-spin" />
                            En attente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-950/60 text-red-400 border border-red-800/50">
                            <AlertCircle className="w-3 h-3" />
                            Échoué
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <a
                          href={`/api/export-invoice-pdf?ref=${tx.reference_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-[11px] font-medium transition-colors border border-slate-700 cursor-pointer"
                        >
                          <span>Facture</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

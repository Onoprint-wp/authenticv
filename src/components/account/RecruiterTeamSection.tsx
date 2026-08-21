"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, Check, Loader2, AlertCircle, Mail, ShieldCheck, Clock } from "lucide-react";

interface TeamMember {
  id: string;
  invited_email: string;
  role: string;
  status: string;
  created_at: string;
}

export function RecruiterTeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/team/invite");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/recruiter/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de l'envoi de l'invitation");
      }

      setSuccess(data.message || `Invitation envoyée avec succès à ${email} !`);
      setEmail("");
      if (data.member) {
        setMembers((prev) => [...prev, data.member]);
      }
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'invitation");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">Équipe & Collaborateurs Recruteurs</h2>
        </div>
        <span className="text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full">
          {members.length} Membre(s)
        </span>
      </div>

      {/* Formulaire d'invitation 1-clic */}
      <form onSubmit={handleInvite} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>Inviter un collègue recruteur</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email du collègue (ex: rh.adjo@entreprise.cm)"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={inviting}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
            <span>Inviter</span>
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}
      </form>

      {/* Tableau des membres de l'équipe */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Chargement des collaborateurs…</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            Aucun membre rattaché pour le moment. Invitez vos collègues ci-dessus.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Collaborateur</th>
                <th className="py-2.5 px-3">Rôle</th>
                <th className="py-2.5 px-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{m.invited_email}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {m.role === "owner" ? (
                      <span className="bg-amber-950/80 border border-amber-700/50 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        Propriétaire
                      </span>
                    ) : (
                      <span className="bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 font-medium px-2 py-0.5 rounded-full text-[11px]">
                        Recruteur Membre
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {m.status === "active" ? (
                      <span className="bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 font-semibold px-2 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Actif
                      </span>
                    ) : (
                      <span className="bg-slate-800 border border-slate-700 text-slate-400 font-medium px-2 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Invitation en attente
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

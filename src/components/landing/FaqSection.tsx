"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Dois-je entrer ma carte bancaire pour commencer ?",
    answer: "Non. Le plan gratuit est accessible sans carte bancaire. Vous pouvez créer votre CV, discuter avec Alex et prévisualiser le résultat immédiatement. Vous ne payez que si vous souhaitez passer au plan Pro.",
  },
  {
    question: "Que se passe-t-il si j'atteins les 20 messages gratuits ?",
    answer: "Le compteur se réinitialise chaque mois. Si vous avez besoin de plus de messages avant la fin du mois, vous pouvez passer au plan Pro pour des messages illimités. Votre CV reste accessible et sauvegardé même après la limite.",
  },
  {
    question: "Puis-je résilier mon abonnement Pro à tout moment ?",
    answer: "Oui, sans condition ni frais. Votre abonnement reste actif jusqu'à la fin de la période payée, puis vous repassez automatiquement sur le plan gratuit. La résiliation se fait en un clic depuis le portail de facturation.",
  },
  {
    question: "Mon CV est-il compatible avec les logiciels de recrutement (ATS) ?",
    answer: "Oui. Le format PDF généré suit les bonnes pratiques ATS : pas d'images dans le corps, police lisible, sections clairement balisées. Il est compatible avec les principaux outils utilisés par les recruteurs (Workday, Lever, Greenhouse, etc.).",
  },
  {
    question: "Mes données personnelles sont-elles sécurisées ?",
    answer: "Vos données sont hébergées en Europe sur Supabase (PostgreSQL chiffré). Elles ne sont jamais vendues ni partagées avec des tiers. Chaque utilisateur n'a accès qu'à ses propres données grâce au système de sécurité Row-Level Security (RLS).",
  },
  {
    question: "Comment fonctionne la fonctionnalité Job Match ?",
    answer: "Collez le texte d'une offre d'emploi et Alex analyse les mots-clés, compétences et exigences du poste pour vous suggérer des améliorations ciblées de votre CV. Disponible sur le plan Pro.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-900/50 border-t border-slate-800" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Questions fréquentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Tout ce que vous devez savoir avant de commencer.
          </motion.p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-800/30 transition-colors"
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Target, LayoutTemplate, Lock } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Coach IA Conversationnel",
    description: "Plus de formulaires ennuyeux. Répondez aux questions d'Alex, notre IA qui agit comme un recruteur pour extraire vos meilleures expériences.",
  },
  {
    icon: Zap,
    title: "Génération en temps réel",
    description: "À chaque réponse, votre CV s'actualise sous vos yeux. Voyez instantanément le résultat de vos échanges avec l'assistant.",
  },
  {
    icon: Shield,
    title: "Optimisé pour les ATS",
    description: "Générez des CV au format PDF lisibles par 100% des logiciels de recrutement (ATS) utilisés par les entreprises.",
  },
  {
    icon: Target,
    title: "Contenu percutant",
    description: "L'IA reformule vos expériences en mettant l'accent sur vos résultats et vos compétences clés pour convaincre les recruteurs.",
  },
  {
    icon: LayoutTemplate,
    title: "Design professionnel",
    description: "Choisissez parmi plusieurs modèles de CV élégants, modernes et personnalisables (couleurs, polices, espacements).",
  },
  {
    icon: Lock,
    title: "Données privées",
    description: "Vos données personnelles sont sécurisées et ne sont utilisées que pour générer votre CV. Vous gardez le contrôle total.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-900/50 relative border-y border-slate-800" id="fonctionnalites">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Pourquoi choisir AuthentiCV ?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Tous les outils dont vous avez besoin pour décrocher votre prochain entretien, réunis en une seule plateforme intelligente.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-indigo-900/30 border border-indigo-800/50 rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

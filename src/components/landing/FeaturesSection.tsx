"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Target, LayoutTemplate, Mail } from "lucide-react";
import type { LandingDict } from "@/lib/i18n/landing";

const ICONS = [Sparkles, Zap, Shield, Target, LayoutTemplate, Mail];

interface Props {
  dict: LandingDict["features"];
}

export function FeaturesSection({ dict }: Props) {
  return (
    <section className="py-24 bg-[#081426] relative border-y border-slate-800" id="fonctionnalites">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold font-heading text-white mb-4"
          >
            {dict.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 font-sans text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {dict.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dict.items.map((feature, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#162B46] border border-slate-700/60 rounded-2xl p-6 hover:border-[#3667F0]/60 shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#3667F0]/10 border border-[#3667F0]/30 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#32D3E1]" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 font-sans text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { MessageSquareText, FileText, Download, CheckCircle2 } from "lucide-react";
import type { LandingDict } from "@/lib/i18n/landing";

const ICONS = [MessageSquareText, FileText, Download];

interface Props {
  dict: LandingDict["howItWorks"];
}

export function HowItWorks({ dict }: Props) {
  return (
    <section className="py-16 md:py-20 bg-background relative" id="comment-ca-marche">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4"
          >
            {dict.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto"
          >
            {dict.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent" />

          {dict.steps.map((step, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-card border-2 border-brand-blue/30 rounded-full flex items-center justify-center mb-6 relative z-10 elevation-1">
                  <Icon className="w-10 h-10 text-brand-blue" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center border-4 border-background">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground font-sans text-base leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

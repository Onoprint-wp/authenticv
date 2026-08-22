"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LandingDict } from "@/lib/i18n/landing";

interface Props {
  dict: LandingDict["faq"];
}

export function FaqSection({ dict }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#0F223D] border-t border-slate-700/60" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-heading text-white mb-4"
          >
            {dict.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg font-sans"
          >
            {dict.subtitle}
          </motion.p>
        </div>

        <div className="space-y-3">
          {dict.items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#162B46] border border-slate-700/60 rounded-xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-white pr-4 font-sans">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-300 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180 text-[#32D3E1]" : ""
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
                    <p className="px-6 pb-5 text-slate-200 text-sm leading-relaxed border-t border-slate-700/50 pt-4 font-sans">
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

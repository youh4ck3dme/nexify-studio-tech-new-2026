"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkle } from "@phosphor-icons/react";

export function AppleComparisonMatrix() {
  const features = [
    {
      name: "Tvorba a adaptácia obsahu",
      legacy: "Manuálny proces (dny až týždne)",
      nexify: "Autonómna AI v reálnom čase (sekundy)",
    },
    {
      name: "Dátový základ",
      legacy: "Sila roztrieštených nástrojov",
      nexify: "2.6 Mld overených globálnych identít",
    },
    {
      name: "Pracovný postup (Workflow)",
      legacy: "Pomalé odovzdávanie a prestoje",
      nexify: "1 ucelený End-to-End spoločný systém",
    },
    {
      name: "Prediktívna inteligencia",
      legacy: "Reaktívne vyhodnocovanie po kampani",
      nexify: "Predpoveď správania a ROI vopred",
    },
    {
      name: "Lokalizovaná exekúcia",
      legacy: "Ťažkopádne škálovanie na lokálne trhy",
      nexify: "Okamžitá lokalizácia s GDPR bezpečnosťou",
    },
  ];

  return (
    <section id="comparison" className="py-24 lg:py-36 bg-background text-foreground relative">
      <div className="max-w-275 mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            Senzorické Porovnanie
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] mb-6 apple-gradient-text">
            Tradičný marketing vs. Nexify AI.
          </h2>
          <p className="text-lg text-foreground/60 font-normal">
            Pozrite sa, aký obrovský rozdiel prináša prechod na agentickú marketingovú platformu.
          </p>
        </div>

        {/* Matrix Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="apple-glass rounded-3xl overflow-hidden border border-foreground/10 shadow-2xl"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 p-6 sm:p-8 border-b border-foreground/10 bg-foreground/5 text-sm font-semibold">
            <div className="col-span-4 text-foreground/50">Funkcionalita</div>
            <div className="col-span-4 text-foreground/50">Tradičné Služby</div>
            <div className="col-span-4 text-[#2997FF] flex items-center gap-2">
              <Sparkle className="w-4 h-4" weight="fill" />
              Nexify Platforma
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-foreground/10 text-xs sm:text-sm">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-6 sm:p-8 items-center hover:bg-foreground/5 transition-colors"
              >
                <div className="col-span-4 font-medium text-foreground pr-4">{item.name}</div>
                <div className="col-span-4 text-foreground/40 flex items-center gap-2 pr-4">
                  <X className="w-4 h-4 text-red-500/70 shrink-0" weight="bold" />
                  <span>{item.legacy}</span>
                </div>
                <div className="col-span-4 text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" weight="bold" />
                  <span className="text-foreground">{item.nexify}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

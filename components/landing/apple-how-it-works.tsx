"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, GitMerge, Cpu } from "@phosphor-icons/react";

export function AppleHowItWorks() {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      id: 0,
      number: "01",
      title: "Dáta & Identita",
      subtitle: "Najsilnejšie dáta a súkromie na prvom mieste",
      description:
        "Srdcom platformy je rozsiahla dátová infraštruktúra. Združuje trhové a nákupné signály, vďaka čomu poskytuje značkám komplexné pochopenie správania zákazníkov bez ohrozenia súkromia.",
      icon: Database,
      metrics: ["2.6 Mld Identít", "100% GDPR Compliant", "Real-time Refresh"],
    },
    {
      id: 1,
      number: "02",
      title: "End-to-End Workflow",
      subtitle: "Jeden ucelený pracovný postup",
      description:
        "Náš univerzálny workflow prepája stratégiu s výkonom a spája všetky tímy v jednom rozhraní. Prepojenie dát, nástrojov a disciplín v reálnom čase znamená rýchlejšie rozhodnutia a menej handoffov.",
      icon: GitMerge,
      metrics: ["-75% Menej Handoffov", "1 Zdieľané Rozhranie", "Okamžitá Exekúcia"],
    },
    {
      id: 2,
      number: "03",
      title: "Autonómna AI",
      subtitle: "Agentická inteligencia pre lepšie výsledky",
      description:
        "Umelá inteligencia nesedí len na vrchu vašich procesov; plynule nimi prechádza. Inteligentní agenti riadia kreativitu, médiá, e-commerce aj merania pre dosiahnutie maximálneho ROI.",
      icon: Cpu,
      metrics: ["3.4x Rýchlejší Launch", "Prediktívne ROI", "Automatické A/B Testovanie"],
    },
  ];

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  };

  return (
    <section id="how-it-works" className="py-24 lg:py-36 bg-background text-foreground relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            Ako To Funguje
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] mb-6 apple-gradient-text">
            Mechanizmus, ktorý poháňa inteligenciu.
          </h2>
        </div>

        {/* iOS Style Segmented Control Tab Switcher */}
        <div className="flex items-center justify-center mb-16">
          <div className="p-1.5 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-2xl inline-flex gap-2">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveTab(idx);
                  triggerHaptic();
                }}
                className={`relative px-5 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === idx ? "text-white" : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-[#2997FF] rounded-full shadow-lg shadow-[#2997FF]/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span className="font-mono opacity-80">{step.number}</span>
                  <span>{step.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {steps.map(
              (step, idx) =>
                activeTab === idx && (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="apple-glass rounded-3xl p-8 sm:p-12 border border-foreground/10"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#2997FF]/20 border border-[#2997FF]/40 flex items-center justify-center text-[#2997FF]">
                          <step.icon className="w-7 h-7" weight="fill" />
                        </div>
                        <div>
                          <span className="text-xs font-mono text-[#2997FF] uppercase tracking-wider block">
                            Krok {step.number}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-semibold text-foreground">
                            {step.subtitle}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-foreground/70 text-base sm:text-lg leading-relaxed mb-10">
                      {step.description}
                    </p>

                    {/* Metrics Footer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-foreground/10">
                      {step.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-4 rounded-2xl bg-foreground/5 border border-foreground/5 text-center">
                          <span className="text-sm font-semibold text-foreground font-mono">{m}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

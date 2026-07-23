"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Stack,
  TrendUp,
  MagicWand,
  Database,
  Calculator,
  Globe,
  Sparkle,
  ArrowUpRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { RoiCalculatorCard } from "./roi-calculator-card";

const magneticCardHover = { y: -3, scale: 1.012 };
const magneticCardTap = { scale: 0.985 };

export function BentoFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="py-24 lg:py-36 bg-background text-foreground relative">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 right-0 w-125 h-125 bg-[#0071E3]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            Prepojené Riešenia
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] mb-6 apple-gradient-text">
            Jedna platforma. Všetky dáta, reálne výsledky.
          </h2>
          <p className="text-lg text-foreground/60 font-normal leading-relaxed">
            Každé z našich riešení je silné samo o sebe, no spoločne tvoria tú najkomplexnejšiu platformu pre marketingovú inteligenciu.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Centrálna orchestrácia (Large 2x2 or 2 col) */}
          <motion.div
            data-cursor="magnetic"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={magneticCardHover}
            whileTap={magneticCardTap}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="apple-glass-card rounded-3xl p-8 md:col-span-2 flex flex-col justify-between relative overflow-hidden group min-h-85"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#2997FF]/15 border border-[#2997FF]/30 flex items-center justify-center text-[#2997FF] mb-6 shadow-lg shadow-[#2997FF]/10">
                <Stack className="w-6 h-6" weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Centrálna orchestrácia
              </h3>
              <p className="text-foreground/60 text-base leading-relaxed max-w-lg mb-6">
                Jeden zjednotený workflow. Spojte plánovanie kampaní, kreatívnu exekúciu, médiá a meranie do jedného celku. Plynule spolupracuje s nástrojmi, ktoré už používate.
              </p>
            </div>

            {/* Workflow Nodes Visual */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-foreground/5 border border-foreground/10 backdrop-blur-md">
              {[
                { title: "Kampaňový Brief", status: "Orchestrované" },
                { title: "AI Produkcia", status: "Aktívne" },
                { title: "Mediálna Alokácia", status: "Optimalizované" },
              ].map((node, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-foreground/5 border border-foreground/5">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 dark:text-emerald-400 font-mono mb-1">
                    <CheckCircle className="w-3.5 h-3.5" weight="fill" />
                    {node.status}
                  </div>
                  <div className="text-xs font-medium text-foreground/90">{node.title}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2: Prediktívna inteligencia */}
          <motion.div
            data-cursor="magnetic"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={magneticCardHover}
            whileTap={magneticCardTap}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="apple-glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group min-h-85"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-lg shadow-purple-500/10">
                <TrendUp className="w-6 h-6" weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Prediktívna inteligencia
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed mb-6">
                Predvída, čo príde. Odhaľujeme publiká s najvyšším potenciálom a nové príležitosti ešte predtým, ako sa stanú trhovým trendom.
              </p>
            </div>

            {/* Mini Trend Line Graphic */}
            <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-foreground/50 block">Predikovaný rast</span>
                <span className="text-xl font-semibold text-purple-500 dark:text-purple-400 font-mono">+184.2%</span>
              </div>
              <div className="w-24 h-10 flex items-end gap-1">
                {[40, 55, 45, 70, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-purple-500/80 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Zosilnená kreativita */}
          <motion.div
            data-cursor="magnetic"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={magneticCardHover}
            whileTap={magneticCardTap}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="apple-glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group min-h-85"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10">
                <MagicWand className="w-6 h-6" weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Zosilnená kreativita
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Autonómne AI systémy, ktoré posúvajú kampane od zadania na trh v rekordnom čase, pričom prispôsobujú kreatívu pre každý formát.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkle className="w-4 h-4" weight="fill" />
              </div>
              <div className="text-xs text-foreground/80">
                <span className="font-semibold block text-foreground">Multi-Format Adaptation</span>
                Generovanie pre IG, TikTok, LinkedIn & Web
              </div>
            </div>
          </motion.div>

          {/* Card 4: Jednotná dátová chrbtica (Wide 2 col) */}
          <motion.div
            data-cursor="magnetic"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={magneticCardHover}
            whileTap={magneticCardTap}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="apple-glass-card rounded-3xl p-8 md:col-span-2 flex flex-col justify-between relative overflow-hidden group min-h-85"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-lg shadow-amber-500/10">
                <Database className="w-6 h-6" weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Jednotná dátová chrbtica
              </h3>
              <p className="text-foreground/60 text-base leading-relaxed max-w-lg mb-6">
                Jediný zdroj pravdy. Jasnosť pre každé rozhodnutie. 2.6 miliardy overených globálnych identitných signálov zaručuje, že všetci pracujú s kompletným obrazom trhu.
              </p>
            </div>

            {/* Live Data Ticker Bar */}
            <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-mono text-foreground/80">
                  2,600,000,000 Verified Signals Priebežne Aktualizované
                </span>
              </div>
              <div className="text-xs text-[#2997FF] font-medium flex items-center gap-1 cursor-pointer hover:underline">
                Zistiť viac o dátach <ArrowUpRight className="w-3.5 h-3.5" weight="bold" />
              </div>
            </div>
          </motion.div>

          {/* Card 5: Aktivácia zameraná na výsledky (ROI Kalkulačka) */}
          <motion.div
            data-cursor="magnetic"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={magneticCardHover}
            whileTap={magneticCardTap}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="apple-glass-card rounded-3xl p-8 md:col-span-3 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2997FF]/15 border border-[#2997FF]/30 flex items-center justify-center text-[#2997FF] mb-6">
                <Calculator className="w-6 h-6" weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Aktivácia zameraná na výsledky (ROI Kalkulačka)
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Zvoľte typ biznisu a nastavte mesačný budget, aby ste videli odhadovaný nárast tržieb a návratnosti s Nexify AI.
              </p>
            </div>

            <RoiCalculatorCard />
          </motion.div>

          {/* Card 6: Lokalizovaná optimalizácia */}
          <motion.div
            data-cursor="magnetic"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={magneticCardHover}
            whileTap={magneticCardTap}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="apple-glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group min-h-85"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF375F]/15 border border-[#FF375F]/30 flex items-center justify-center text-[#FF375F] mb-6 shadow-lg shadow-[#FF375F]/10">
                <Globe className="w-6 h-6" weight="fill" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                Lokalizovaná optimalizácia
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Globálne meradlo. Lokálna precíznosť. Geo-špecifické dáta prinášajú autentickú relevanciu v každom regióne.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-between text-xs text-foreground/70">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF375F]" />
                GDPR & Regional Compliant
              </span>
              <span className="font-mono text-foreground/40">Global Scale</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

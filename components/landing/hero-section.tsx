"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkle, Robot, Lightning, ChartLineUp, ShieldCheck, Play } from "@phosphor-icons/react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const mockupScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5], [12, 0]);
  const pointerRotateX = useMotionValue(0);
  const pointerRotateY = useMotionValue(0);
  const springRotateX = useSpring(pointerRotateX, { stiffness: 160, damping: 24, mass: 0.6 });
  const springRotateY = useSpring(pointerRotateY, { stiffness: 160, damping: 24, mass: 0.6 });
  const combinedRotateX = useTransform(
    [scrollRotateX, springRotateX],
    ([s, p]) => (s as number) + (p as number)
  );

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerRotateX.set(Math.max(-8, Math.min(8, y * -16)));
    pointerRotateY.set(Math.max(-8, Math.min(8, x * 16)));
  };

  const handlePointerLeave = () => {
    pointerRotateX.set(0);
    pointerRotateY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative pt-12 pb-24 lg:pt-20 lg:pb-36 overflow-hidden bg-background text-foreground"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-tr from-[#0071E3]/20 via-[#2997FF]/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 backdrop-blur-xl mb-8 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-[#2997FF] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
            AI Platforma Novej Generácie
          </span>
          <Sparkle className="w-4 h-4 text-[#2997FF]" weight="fill" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.035em] leading-[1.05] max-w-5xl mx-auto mb-8 apple-gradient-text"
        >
          Premeňte marketingovú zložitosť na inteligentnú akciu.
        </motion.h1>

        {/* Subheadline Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-foreground/70 font-normal max-w-3xl mx-auto leading-relaxed mb-12 tracking-tight"
        >
          Zjednodušte marketingovú komplexnosť na inteligentné kroky. Prepojte stratégiu, kreativitu, médiá, CRM a prediktívnu AI do jedného plynulého toku pre nekompromisný obchodný dopad.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            onClick={triggerHaptic}
            className="bg-[#2997FF] hover:bg-[#0071E3] text-white rounded-full px-9 h-14 text-base font-medium shadow-xl shadow-[#2997FF]/30 hover:shadow-2xl hover:shadow-[#2997FF]/50 transition-all hover:-translate-y-0.5"
            asChild
          >
            <Link href="#contact">
              Vyskúšať zadarmo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={triggerHaptic}
            className="h-14 px-8 text-base rounded-full border-foreground/20 bg-foreground/5 hover:bg-foreground/10 backdrop-blur-xl text-foreground transition-all"
            asChild
          >
            <Link href="#bento" className="flex items-center gap-2">
              Zistiť viac
              <Play className="w-4 h-4 shrink-0" weight="fill" />
            </Link>
          </Button>
        </motion.div>

        {/* Apple 3D Workspace Glass Bezel Mockup */}
        <div className="relative max-w-5xl mx-auto" style={{ perspective: "1200px" }}>
          <motion.div
            style={{
              rotateX: combinedRotateX,
              rotateY: springRotateY,
              scale: mockupScale,
              opacity: mockupOpacity,
              transformStyle: "preserve-3d",
            }}
            className="relative rounded-3xl p-3 sm:p-4 bg-linear-to-b from-foreground/10 via-foreground/5 to-transparent border border-foreground/10 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl will-change-transform"
          >
          {/* Mockup Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-foreground/5 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs font-mono text-foreground/45 tracking-wider">
              nexify-ai-workspace.app
            </div>
            <div className="flex items-center gap-2 text-xs text-[#2997FF] dark:text-[#2997FF]">
              <ShieldCheck className="w-4 h-4" weight="fill" />
              <span className="hidden sm:inline">2.6 Mld Signal Connected</span>
            </div>
          </div>

          {/* Mockup Inner Body */}
          <div className="p-6 sm:p-10 bg-card text-card-foreground rounded-b-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Live AI Agent Card */}
            <div className="apple-glass rounded-2xl p-5 border border-foreground/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2997FF]/20 border border-[#2997FF]/40 flex items-center justify-center text-[#2997FF]">
                    <Robot className="w-5 h-5" weight="fill" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Agent Orchestrator</h4>
                    <p className="text-xs text-foreground/50">Autonómny výstup v reálnom čase</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-foreground/75">
                  <div className="p-2.5 rounded-lg bg-foreground/5 border border-foreground/5 flex justify-between">
                    <span>Generovanie vizuálu kampane</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-mono">100% Hotovo</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-foreground/5 border border-foreground/5 flex justify-between">
                    <span>Predikcia správania publika</span>
                    <span className="text-[#2997FF] font-mono">Práve beží</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-foreground/10 text-xs text-foreground/45 flex items-center gap-1.5">
                <Lightning className="w-3.5 h-3.5 text-amber-500" weight="fill" />
                <span>3.4s celkový čas spracovania</span>
              </div>
            </div>

            {/* Live Predictive Graph Mockup */}
            <div className="apple-glass rounded-2xl p-5 border border-foreground/10 md:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Prediktívny Rast Tržieb (ROI)</h4>
                  <p className="text-xs text-foreground/50">Vyhodnotenie 2.6 Mld identitných signálov</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  +314% Nárast
                </span>
              </div>

              {/* Simulated Chart Bars */}
              <div className="h-32 flex items-end justify-between gap-3 px-2 pt-4">
                {[35, 48, 62, 55, 78, 92, 115, 140, 165].map((height, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-linear-to-t from-[#0071E3] to-[#2997FF] transition-all duration-1000 shadow-[0_0_15px_rgba(41,151,255,0.4)]"
                      style={{ height: `${height * 0.6}px` }}
                    />
                    <span className="text-[10px] font-mono text-foreground/40">Q{i + 1}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-foreground/10 text-xs text-foreground/50 flex justify-between items-center">
                <span>Modelované scenáre v reálnom čase</span>
                <span className="text-[#2997FF] font-medium flex items-center gap-1">
                  <ChartLineUp className="w-4 h-4" /> Optimalizované
                </span>
              </div>
            </div>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

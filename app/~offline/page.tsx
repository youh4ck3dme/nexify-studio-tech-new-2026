"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiSlash, PhoneCall, Envelope, Trophy, Sparkle } from "@phosphor-icons/react";

export default function OfflinePage() {
  const [clicks, setClicks] = useState(0);
  const [score, setScore] = useState(0);

  const handleSimulateOptimize = () => {
    setClicks((prev) => prev + 1);
    setScore((prev) => prev + Math.floor(Math.random() * 25) + 15);
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden select-none selection:bg-[#FF375F]/20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF375F]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-6">
        {/* Pulsing Offline Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#FF375F]/10 border border-[#FF375F]/30 flex items-center justify-center text-[#FF375F] mb-2 animate-pulse shadow-lg shadow-[#FF375F]/10">
          <WifiSlash className="w-8 h-8" weight="bold" />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-[#FF375F] font-semibold">
          Offline režim
        </p>

        <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-foreground">
          Ste offline
        </h1>

        <p className="text-muted-foreground text-sm max-w-sm">
          Stránku sa nepodarilo načítať, pretože ste bez internetu. Nexify automaticky monitoruje sieť a po obnovení pripojenia vás znova pripojí.
        </p>

        {/* Offline Game/Interactive Widget */}
        <div className="w-full rounded-2xl border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-xl text-left my-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Trophy className="w-4 h-4 text-amber-500" weight="fill" />
              Offline AI simulátor
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70 border border-foreground/10">
              Uložené lokálne
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Klikajte a generujte simulovaný zisk a optimalizáciu marketingu priamo vo vašom prehliadači.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-background border border-foreground/5 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block mb-1">
                Optimalizácie
              </span>
              <span className="text-xl font-bold font-mono text-[#2997FF]">
                {clicks}
              </span>
            </div>
            <div className="p-3 bg-background border border-foreground/5 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block mb-1">
                Simulovaný ROI
              </span>
              <span className="text-xl font-bold font-mono text-emerald-500">
                +{score}%
              </span>
            </div>
          </div>

          <Button
            onClick={handleSimulateOptimize}
            className="w-full bg-[#2997FF] hover:bg-[#0071E3] text-white rounded-xl h-11 text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#2997FF]/20"
          >
            <Sparkle className="w-4 h-4" weight="fill" />
            Optimalizovať offline kampaň
          </Button>
        </div>

        {/* Contact details */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-muted-foreground border-t border-foreground/10 pt-6 w-full justify-center">
          <a
            href="mailto:info@kestudio.sk"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Envelope className="w-4 h-4" />
            info@kestudio.sk
          </a>
          <span className="hidden sm:inline text-foreground/20">|</span>
          <a
            href="tel:+421900000000"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            +421 900 000 000
          </a>
        </div>

        {/* Back Home Button */}
        <Button asChild variant="outline" className="rounded-full px-8 mt-4 border-foreground/10 bg-foreground/5 hover:bg-foreground/10 text-xs">
          <Link href="/">Späť na úvod</Link>
        </Button>
      </div>
    </main>
  );
}

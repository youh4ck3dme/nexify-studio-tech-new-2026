"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Sparkle, Terminal, ArrowsClockwise as RefreshCw, Cpu, Compass, ChartBar } from "@phosphor-icons/react";

interface CampaignResult {
  title: string;
  copy: string;
  channels: { name: string; percentage: number; color: string }[];
  metrics: { label: string; value: string; color: string }[];
}

const CAMPAIGN_TEMPLATES: Record<string, CampaignResult> = {
  kaviaren: {
    title: "Čerstvo Upražená Káva u Vás do 60 Minút",
    copy: "Vychutnajte si výberové kávové zrná s doručením priamo k dverám. Pražené s láskou, mleté s precíznosťou. Prvá donáška zadarmo.",
    channels: [
      { name: "Instagram", percentage: 50, color: "bg-pink-500" },
      { name: "Facebook", percentage: 30, color: "bg-blue-600" },
      { name: "Google Search", percentage: 20, color: "bg-amber-500" },
    ],
    metrics: [
      { label: "Predikované CTR", value: "4.82%", color: "text-[#2997FF]" },
      { label: "Priemerné CPC", value: "0.22 €", color: "text-purple-400" },
      { label: "Modelované ROI", value: "+314%", color: "text-emerald-400" },
    ],
  },
  eshop: {
    title: "Udržateľná Móda, Ktorá Vám Sadne",
    copy: "Objavte novú kolekciu z organickej bavlny. Vyrobené eticky, navrhnuté pre maximálne pohodlie. Výmena veľkosti bez starostí.",
    channels: [
      { name: "Instagram Ads", percentage: 55, color: "bg-pink-500" },
      { name: "TikTok Spark", percentage: 30, color: "bg-neutral-800" },
      { name: "Pinterest", percentage: 15, color: "bg-red-600" },
    ],
    metrics: [
      { label: "Predikované CTR", value: "5.14%", color: "text-[#2997FF]" },
      { label: "Priemerné CPC", value: "0.18 €", color: "text-purple-400" },
      { label: "Modelované ROI", value: "+420%", color: "text-emerald-400" },
    ],
  },
  saas: {
    title: "Rozhodnutia Založené na Reálnych Dátach",
    copy: "Prepojte svoje systémy do jednej analýzy. Identifikujte neefektívne výdavky a ušetrite až 30% prevádzkových nákladov za prvý mesiac.",
    channels: [
      { name: "LinkedIn Ads", percentage: 60, color: "bg-blue-700" },
      { name: "Google Search", percentage: 30, color: "bg-amber-500" },
      { name: "Newsletter", percentage: 10, color: "bg-purple-600" },
    ],
    metrics: [
      { label: "Predikované CTR", value: "3.65%", color: "text-[#2997FF]" },
      { label: "Priemerné CPC", value: "1.45 €", color: "text-purple-400" },
      { label: "Modelované ROI", value: "+280%", color: "text-emerald-400" },
    ],
  },
};

const TERMINAL_LOGS = [
  "⚡ [INIT] Spúšťam autonómneho AI agenta Nexify...",
  "🔍 [DATA] Skenujem 2.6 miliardy globálnych identitných signálov...",
  "🛡️ [COMPLIANCE] Kontrolujem lokálne GDPR nariadenia a súlad... (100% OK)",
  "✍️ [CREATIVE] Generujem kreatívny koncept a testujem varianty textov...",
  "📊 [MEDIA] Optimalizujem rozpočty reklamných kanálov...",
  "✨ [SUCCESS] Orchestrácia úspešne dokončená za 3.4 sekundy!",
];

const PLACEHOLDERS = [
  "Vytvor kampaň pre lokálnu výberovú kaviareň...",
  "Optimalizuj akvizíciu zákazníkov pre módny e-shop...",
  "Navrhni lead-gen stratégiu pre B2B SaaS s analytikou...",
];

export function AiPlaygroundSection() {
  const [state, setState] = useState<"idle" | "orchestrating" | "completed">("idle");
  const [inputText, setInputText] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("kaviaren");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state !== "idle") return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [state]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleStartOrchestrator = (templateKey: string, customPrompt?: string) => {
    triggerHaptic();
    setSelectedTemplateKey(templateKey);
    setInputText(customPrompt || PLACEHOLDERS[placeholderIdx]);
    setState("orchestrating");
    setCurrentLogs([]);

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < TERMINAL_LOGS.length) {
        setCurrentLogs((prev) => [...prev, TERMINAL_LOGS[logIndex]]);
        logIndex++;
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(8);
        }
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setState("completed");
          triggerHaptic();
        }, 300);
      }
    }, 400);
  };

  useEffect(() => {
    if (terminalEndRef.current && typeof terminalEndRef.current.scrollIntoView === "function") {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentLogs]);

  const currentResult = CAMPAIGN_TEMPLATES[selectedTemplateKey] || CAMPAIGN_TEMPLATES.kaviaren;

  return (
    <section id="playground" className="relative py-24 lg:py-36 bg-background text-foreground border-t border-foreground/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            AI Simulátor · Playground
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] mb-6 apple-gradient-text">
            Vyskúšajte si orchestráciu
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            Zadajte vlastný nápad alebo kliknite na šablónu a sledujte autonómnych agentov Nexify koordinovať celú stratégiu.
          </p>
        </div>

        {/* Playground Shell */}
        <div className="max-w-4xl mx-auto">
          {state === "idle" && (
            <div className="apple-glass-card rounded-3xl p-6 sm:p-10 border border-foreground/10">
              {/* Input form */}
              <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
                  <Terminal className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={PLACEHOLDERS[placeholderIdx]}
                  className="w-full h-14 pl-12 pr-32 bg-foreground/5 border border-foreground/10 rounded-2xl outline-none text-foreground placeholder:text-foreground/30 focus:border-[#2997FF]/50 focus:ring-1 focus:ring-[#2997FF]/30 transition-all"
                />
                <button
                  onClick={() => {
                    const match = inputText.toLowerCase();
                    let key = "kaviaren";
                    if (match.includes("mód") || match.includes("eshop") || match.includes("shop")) key = "eshop";
                    if (match.includes("saas") || match.includes("b2b") || match.includes("biznis")) key = "saas";
                    handleStartOrchestrator(key, inputText);
                  }}
                  className="absolute right-2 top-2 h-10 px-5 bg-[#2997FF] hover:bg-[#0071E3] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-[#2997FF]/20 transition-all hover:scale-102"
                >
                  <Play className="w-3.5 h-3.5" weight="fill" />
                  Spustiť
                </button>
              </div>

              {/* Quick Starts */}
              <div>
                <span className="text-xs font-mono text-foreground/40 uppercase tracking-widest block mb-4">
                  Rýchly štart so šablónou
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStartOrchestrator("kaviaren", "Spusť kampaň pre lokálnu kaviareň")}
                    className="p-4 rounded-2xl border border-foreground/5 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/15 text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center mb-3">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground block group-hover:text-[#2997FF] transition-colors">
                      Lokálna Kaviareň
                    </span>
                    <span className="text-xs text-foreground/50 mt-1 block">
                      Cieľ: Donáška & Lokálne povedomie
                    </span>
                  </button>

                  <button
                    onClick={() => handleStartOrchestrator("eshop", "Optimalizuj akvizíciu pre módny e-shop")}
                    className="p-4 rounded-2xl border border-foreground/5 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/15 text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                      <Sparkle className="w-4 h-4" weight="fill" />
                    </div>
                    <span className="font-semibold text-sm text-foreground block group-hover:text-[#2997FF] transition-colors">
                      Módny E-shop
                    </span>
                    <span className="text-xs text-foreground/50 mt-1 block">
                      Cieľ: Konverzie & Akvizícia publík
                    </span>
                  </button>

                  <button
                    onClick={() => handleStartOrchestrator("saas", "Vygeneruj lead-gen pre B2B SaaS")}
                    className="p-4 rounded-2xl border border-foreground/5 bg-foreground/5 hover:bg-foreground/10 hover:border-foreground/15 text-left transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#2997FF]/10 text-[#2997FF] flex items-center justify-center mb-3">
                      <Cpu className="w-4 h-4" weight="fill" />
                    </div>
                    <span className="font-semibold text-sm text-foreground block group-hover:text-[#2997FF] transition-colors">
                      B2B SaaS platforma
                    </span>
                    <span className="text-xs text-foreground/50 mt-1 block">
                      Cieľ: Lead Generation & Budovania dôvery
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {state === "orchestrating" && (
            <div className="rounded-3xl border border-foreground/10 bg-black/90 p-6 sm:p-8 font-mono text-[13px] text-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-75 flex flex-col justify-between">
              {/* System window bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-white/40 tracking-wider">nexify-orchestrator.sh</span>
                <div className="w-12" />
              </div>

              {/* Logs console */}
              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-64 pr-2">
                {currentLogs.map((log, index) => (
                  <div
                    key={index}
                    className={index === TERMINAL_LOGS.length - 1 ? "text-emerald-400 font-bold" : "text-white/80"}
                  >
                    {log}
                  </div>
                ))}
                <div className="inline-block w-2 h-4 bg-white/70 animate-pulse" />
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}

          {state === "completed" && (
            <div className="apple-glass-card rounded-3xl p-6 sm:p-10 border border-foreground/10">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-foreground/10 pb-6 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#2997FF] font-semibold">
                    Výsledok AI Orchestrácie
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    Vygenerovaná Kampaň
                  </h3>
                </div>
                <button
                  onClick={() => setState("idle")}
                  className="self-start sm:self-center h-10 px-5 border border-foreground/10 hover:bg-foreground/5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-foreground/80"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resetovať a skúsiť znova
                </button>
              </div>

              {/* Creative output */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="p-5 rounded-2xl bg-foreground/5 border border-foreground/5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/45 mb-2">
                      Kreatívny Nadpis (Headline)
                    </h4>
                    <p className="text-lg font-semibold text-foreground">
                      {currentResult.title}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-foreground/5 border border-foreground/5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/45 mb-2">
                      Reklamný Text (Ad Copy)
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {currentResult.copy}
                    </p>
                  </div>
                </div>

                {/* Channel Split & Metrics */}
                <div className="space-y-4">
                  {/* Budget Distribution */}
                  <div className="p-5 rounded-2xl bg-foreground/5 border border-foreground/5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/45 mb-3 flex items-center gap-1">
                      <ChartBar className="w-3.5 h-3.5" />
                      Kanály & Rozpočet
                    </h4>
                    <div className="space-y-2.5">
                      {currentResult.channels.map((ch) => (
                        <div key={ch.name}>
                          <div className="flex justify-between text-xs text-foreground/80 mb-1">
                            <span>{ch.name}</span>
                            <span className="font-semibold">{ch.percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${ch.color} rounded-full`}
                                style={{ width: `${ch.percentage}%` }}
                              />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Predictions metrics */}
                  <div className="p-5 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-3">
                    {currentResult.metrics.map((m) => (
                      <div key={m.label} className="flex justify-between items-center text-xs">
                        <span className="text-foreground/50">{m.label}</span>
                        <span className={`font-mono font-bold ${m.color}`}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

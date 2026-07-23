"use client";

import { useEffect, useMemo, useState } from "react";
import { Storefront, Wrench, Bank, ArrowUpRight, Clock, UserPlus, Target } from "@phosphor-icons/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

const BAR_COLORS: Record<"without" | "with", string> = {
  without: "#8E8E93",
  with: "#2997FF",
};

type BusinessType = "ecommerce" | "sluzby" | "financie";

interface BusinessTypeConfig {
  id: BusinessType;
  label: string;
  icon: typeof Storefront;
  baselineMultiplier: number;
  nexifyMultiplier: number;
}

const BUSINESS_TYPES: BusinessTypeConfig[] = [
  { id: "ecommerce", label: "eCommerce", icon: Storefront, baselineMultiplier: 1.8, nexifyMultiplier: 4.2 },
  { id: "sluzby", label: "Služby", icon: Wrench, baselineMultiplier: 1.5, nexifyMultiplier: 3.5 },
  { id: "financie", label: "Finančníctvo", icon: Bank, baselineMultiplier: 2.0, nexifyMultiplier: 4.8 },
];

function formatEur(value: number): string {
  return `${Math.round(value).toLocaleString("sk-SK")} €`;
}

function ComparisonTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const isWith = item.payload.key === "with";
  return (
    <div className="rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-md p-4 shadow-2xl text-xs space-y-1">
      <div className="font-semibold text-foreground/50 uppercase tracking-widest text-[9px]">
        {item.payload.label}
      </div>
      <div className={`font-mono font-bold text-base ${isWith ? "text-[#2997FF]" : "text-foreground/80"}`}>
        {formatEur(item.value ?? 0)}
      </div>
      <div className="text-[10px] text-foreground/40 font-mono">mesačný obrat</div>
    </div>
  );
}

export function RoiCalculatorCard() {
  const [businessType, setBusinessType] = useState<BusinessType>("ecommerce");
  const [monthlyBudget, setMonthlyBudget] = useState(5000);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(6);
    }
  };

  const activeType = useMemo(() => {
    return BUSINESS_TYPES.find((t) => t.id === businessType) ?? BUSINESS_TYPES[0];
  }, [businessType]);

  const calculations = useMemo(() => {
    const budget = Number.isFinite(monthlyBudget) ? Math.max(monthlyBudget, 0) : 0;
    const without = budget * activeType.baselineMultiplier;
    const withNexify = budget * activeType.nexifyMultiplier;
    const uplift = withNexify - without;
    const upliftPercent = without > 0 ? Math.round((uplift / without) * 100) : 0;

    // Industry specific details
    let metricLabel = "";
    let metricValue = "";
    let metricIcon = Clock;

    if (activeType.id === "ecommerce") {
      metricLabel = "Ušetrený čas tvorby kampaní";
      metricValue = `${Math.round(budget * 0.006)} hod / mesiac`;
      metricIcon = Clock;
    } else if (activeType.id === "sluzby") {
      metricLabel = "Vygenerované leady (Nexify vs Bez)";
      const baselineLeads = Math.round((budget / 40) * activeType.baselineMultiplier);
      const nexifyLeads = Math.round((budget / 40) * activeType.nexifyMultiplier);
      metricValue = `${nexifyLeads} vs ${baselineLeads}`;
      metricIcon = UserPlus;
    } else {
      metricLabel = "Miera konverzie webu (Nexify vs Bez)";
      metricValue = "3.1% vs 1.2%";
      metricIcon = Target;
    }

    return {
      revenueWithout: without,
      revenueWith: withNexify,
      uplift,
      upliftPercent,
      metricLabel,
      metricValue,
      metricIcon,
      chartData: [
        { key: "without", label: "Bez Nexify", value: Math.round(without) },
        { key: "with", label: "S Nexify AI", value: Math.round(withNexify) },
      ],
    };
  }, [monthlyBudget, activeType]);

  if (!mounted) {
    return <div className="h-96 w-full bg-foreground/5 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full mt-6">
      {/* Control Panel (Left column) */}
      <div className="space-y-6 sm:space-y-8">
        {/* Industry segment control */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-foreground/40 block">
            Krok 1: Vyberte odvetvie
          </span>
          <div className="flex bg-foreground/5 p-1 rounded-2xl border border-foreground/10" role="group" aria-label="Typ biznisu">
            {BUSINESS_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = type.id === businessType;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setBusinessType(type.id);
                    triggerHaptic();
                  }}
                  aria-pressed={isActive}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? "bg-background border border-foreground/10 text-foreground shadow-sm"
                      : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="w-4 h-4" weight={isActive ? "fill" : "regular"} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Input & Range Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-foreground/40 block mb-1">
                Krok 2: Mesačný budget na reklamu
              </span>
              <span className="text-2xl font-bold font-mono text-foreground">
                {formatEur(monthlyBudget)}
              </span>
            </div>
            <div className="relative w-32">
              <input
                id="roi-budget-input"
                type="number"
                min={500}
                max={50000}
                step={500}
                value={monthlyBudget}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyBudget(val);
                }}
                className="w-full h-10 px-3 pr-8 rounded-xl bg-foreground/5 border border-foreground/10 outline-none focus:ring-1 focus:ring-[#2997FF]/40 text-foreground font-mono text-xs text-right"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 text-xs">€</span>
            </div>
          </div>

          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={monthlyBudget}
            onChange={(e) => {
              setMonthlyBudget(Number(e.target.value));
              triggerHaptic();
            }}
            className="w-full accent-[#2997FF] cursor-pointer bg-foreground/10 h-1.5 rounded-lg appearance-none"
            aria-label="Mesačný budget na reklamu"
          />
          <div className="flex justify-between text-[10px] text-foreground/30 font-mono">
            <span>500 €</span>
            <span>25 000 €</span>
            <span>50 000 €</span>
          </div>
        </div>

        {/* Detail industry multiplier details */}
        <div className="p-5 rounded-2xl bg-foreground/5 border border-foreground/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2997FF]/10 text-[#2997FF] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-foreground/45 uppercase tracking-widest block">
                Predikovaný ROI Koeficient
              </span>
              <span className="font-semibold text-sm text-foreground">
                S Nexify AI: <span className="text-[#2997FF] font-bold font-mono">{activeType.nexifyMultiplier.toFixed(1)}x</span> (vs Bez: {activeType.baselineMultiplier.toFixed(1)}x)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Visualization (Right column) */}
      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/45">
              Predikovaný nárast
            </span>
            {calculations.upliftPercent > 0 && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                +{calculations.upliftPercent}% nárast
              </span>
            )}
          </div>

          {/* Dynamic Recharts BarChart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calculations.chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-foreground/10" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-foreground/50"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-foreground/50"
                  tickLine={false}
                  axisLine={false}
                  width={36}
                />
                <Tooltip content={<ComparisonTooltip />} cursor={{ fill: "rgba(128,128,128,0.08)" }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={64}>
                  {calculations.chartData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={BAR_COLORS[entry.key as keyof typeof BAR_COLORS]}
                      className={entry.key === "with" ? "drop-shadow-[0_0_8px_rgba(41,151,255,0.4)]" : ""}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Industry Metric breakdown cards */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-foreground/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/45 block mb-1">
                Čistý prírastok
              </span>
              <span className="text-lg font-bold font-mono text-[#2997FF]">
                +{formatEur(calculations.uplift)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/45 block mb-1">
                {calculations.metricLabel}
              </span>
              <span className="text-sm font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                <calculations.metricIcon className="w-4 h-4 text-[#2997FF]" />
                {calculations.metricValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

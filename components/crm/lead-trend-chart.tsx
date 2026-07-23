"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import type { Client } from "@/lib/db";
import { Info } from "lucide-react";

const TREND_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

interface TrendPoint {
  date: string;
  label: string;
  count: number;
  cumulative: number;
}

function buildTrendData(clients: Client[], isDemo: boolean): TrendPoint[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dayBuckets = new Map<string, number>();
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const day = new Date(today.getTime() - i * DAY_MS);
    dayBuckets.set(day.toISOString().slice(0, 10), 0);
  }

  if (isDemo) {
    // Generate beautiful rising demo curve
    let currentIdx = 0;
    const entries = Array.from(dayBuckets.keys());
    for (const key of entries) {
      // Periodic additions to make it look realistic
      if (currentIdx % 5 === 0) {
        dayBuckets.set(key, 1);
      } else if (currentIdx % 7 === 0) {
        dayBuckets.set(key, 2);
      } else if (currentIdx === 29) {
        dayBuckets.set(key, 3);
      }
      currentIdx++;
    }
  } else {
    // Real data aggregation
    for (const client of clients) {
      const createdDay = new Date(client.createdAt);
      const key = new Date(createdDay.getFullYear(), createdDay.getMonth(), createdDay.getDate())
        .toISOString()
        .slice(0, 10);
      if (dayBuckets.has(key)) {
        dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
      }
    }
  }

  // Build cumulative sums
  let runningTotal = isDemo ? 5 : 0; // Starting baseline for demo
  return Array.from(dayBuckets.entries()).map(([date, count]) => {
    runningTotal += count;
    return {
      date,
      label: new Date(date).toLocaleDateString("sk-SK", { day: "numeric", month: "numeric" }),
      count,
      cumulative: runningTotal,
    };
  });
}

function TrendTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as TrendPoint;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121214] p-4 shadow-2xl text-xs space-y-1.5 font-sans">
      <div className="font-semibold text-white/40 uppercase tracking-widest text-[9px]">{point.label}</div>
      <div className="flex flex-col gap-1 text-white">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF375F]" />
          Denný prírastok: <strong className="font-mono">{point.count}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2997FF]" />
          Kumulatívne: <strong className="font-mono">{point.cumulative}</strong>
        </span>
      </div>
    </div>
  );
}

export function CrmAnalyticsDashboard({ clients }: { clients: Client[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDemo = clients.length === 0;

  const data = useMemo(() => {
    return buildTrendData(clients, isDemo);
  }, [clients, isDemo]);

  const latestStats = useMemo(() => {
    if (data.length === 0) return { daily: 0, total: 0 };
    const last = data[data.length - 1];
    return {
      daily: last.count,
      total: last.cumulative,
    };
  }, [data]);

  if (!mounted) {
    return <div className="h-64 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {/* Demo Warning Banner */}
      {isDemo && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl text-sm">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            <strong>Zobrazujú sa demo dáta.</strong> V databáze nemáte žiadnych klientov. Pridajte prvého klienta na aktiváciu reálnej analýzy.
          </p>
        </div>
      )}

      {/* Analytics Card */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md dark:bg-black/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/50">
              Analýza Vývoja Leadov &amp; Zákazníkov (30 Dní)
            </h3>
            <p className="text-2xl font-bold text-white mt-1">
              Celkovo {latestStats.total} {latestStats.total === 1 ? "lead" : latestStats.total < 5 && latestStats.total > 0 ? "leady" : "leadov"}
            </p>
          </div>
          <div className="flex gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF375F]" />
              <span className="text-white/60">Dnešný prírastok: <strong className="text-white font-bold">{latestStats.daily}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2997FF]" />
              <span className="text-white/60">Kumulatívne: <strong className="text-white font-bold">{latestStats.total}</strong></span>
            </div>
          </div>
        </div>

        {/* Responsive Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF375F" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF375F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2997FF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2997FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
              <Area
                type="monotone"
                dataKey="count"
                name="Denný prírastok"
                stroke="#FF375F"
                strokeWidth={2}
                fill="url(#dailyGradient)"
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Celkový počet leadov"
                stroke="#2997FF"
                strokeWidth={2}
                fill="url(#cumulativeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

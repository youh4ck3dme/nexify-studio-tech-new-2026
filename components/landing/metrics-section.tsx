"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground font-mono">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const metrics = [
  {
    value: 300,
    suffix: "%",
    prefix: "+",
    label: "Zvýšenie návštevnosti & produkcie",
  },
  {
    value: 1,
    suffix: "s",
    prefix: "<",
    label: "Rýchlosť spracovania dát",
  },
  {
    value: 98,
    suffix: "%",
    prefix: "",
    label: "Spokojnosť klientov",
  },
  {
    value: 7,
    suffix: " dní",
    prefix: "",
    label: "Čas na plné nasadenie platformy",
  },
];

export function MetricsSection() {
  return (
    <section id="metrics" className="py-24 lg:py-36 bg-background text-foreground relative border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2997FF] mb-3 block">
              Preukázateľný Rast
            </span>
            <h2 className="text-4xl lg:text-6xl font-semibold tracking-[-0.03em] apple-gradient-text">
              Výsledky, ktoré môžete merať.
            </h2>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs text-foreground/50">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Reálne Dáta
            </span>
            <span className="text-foreground/20">|</span>
            <span>Overený Výkon</span>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="apple-glass-card rounded-3xl p-8 lg:p-12 flex flex-col justify-between"
            >
              <div className="text-[#2997FF] mb-4">
                <AnimatedCounter
                  end={typeof metric.value === "number" ? metric.value : 0}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                />
              </div>
              <div className="text-lg text-foreground/70 font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

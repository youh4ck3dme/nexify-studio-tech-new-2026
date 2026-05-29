"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/catalog/category-card";
import { getHomepageMarqueeRow } from "@/lib/catalog";

function MarqueeRow({
  row,
  animationClass,
  paused,
}: {
  row: 1 | 2;
  animationClass: "marquee" | "marquee-reverse";
  paused: boolean;
}) {
  const categories = getHomepageMarqueeRow(row);
  const startIndex = row === 1 ? 0 : 3;

  return (
    <div
      className={`flex gap-6 shrink-0 ${animationClass} ${paused ? "paused" : ""}`}
    >
      {[...Array(2)].map((_, setIndex) => (
        <div key={setIndex} className="flex gap-6 shrink-0">
          {categories.map((category, idx) => (
            <CategoryCard
              key={`${category.id}-${setIndex}`}
              category={category}
              index={startIndex + idx}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CategoryMarqueeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    return () => media.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const row1 = getHomepageMarqueeRow(1);
  const row2 = getHomepageMarqueeRow(2);

  return (
    <section
      id="produkty"
      ref={sectionRef}
      className="relative py-32 lg:py-40 border-t border-foreground/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-3xl">
            <span
              id="pricing"
              className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-6"
            >
              Cenník
            </span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6">
              Jednoduché a transparentné
              <br />
              <span className="text-stroke">ceny</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Bez skrytých poplatkov, bez prekvapení. Istota pre rast vášho biznisu.
            </p>
          </div>
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 text-sm font-medium border border-foreground/20 px-6 py-3 hover:border-foreground hover:bg-foreground/5 transition-colors group shrink-0"
          >
            Zobraziť celý katalóg
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {reducedMotion ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...row1, ...row2].map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      ) : (
        <div
          className="space-y-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="w-full overflow-hidden">
            <MarqueeRow row={1} animationClass="marquee" paused={paused} />
          </div>
          <div className="w-full overflow-hidden">
            <MarqueeRow row={2} animationClass="marquee-reverse" paused={paused} />
          </div>
        </div>
      )}

      <p className="mt-12 text-center text-sm text-muted-foreground px-6">
        Pozrite si detailné balíky a ceny v našom katalógu.{" "}
        <Link
          href="/produkty"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Otvoriť katalóg
        </Link>
      </p>
    </section>
  );
}

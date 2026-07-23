"use client";

import { useEffect, useState } from "react";
import { TechProvidersMarquee } from "@/components/landing/tech-providers-marquee";

const testimonials = [
  {
    quote: "Prechod na Nexify zmenil našu kreatívnu produkciu. Dokážeme vygenerovať a adaptovať stovky variácií kampaní za minúty, čo nám prinieslo dramatický nárast konverzií.",
    author: "Miroslav H.",
    role: "Chief Marketing Officer",
    company: "AeroMedia Group",
    metric: "+314% marketingové ROI",
  },
  {
    quote: "Jednotná dátová chrbtica s 2.6 miliardami signálov nám poskytla neuveriteľnú jasnosť. Rozhodnutia o rozpočtoch už nerobíme na základe pocitov, ale presných predikcií.",
    author: "Elena R.",
    role: "Director of Growth",
    company: "Velo Commerce",
    metric: "-75% menej handoffov",
  },
  {
    quote: "Naši kreatívci konečne nestrácajú čas nudným resizovaním bannerov. Agentická AI Nexify to robí na pozadí, kým my sa sústredíme na nápady, ktoré hýbu trhom.",
    author: "Peter V.",
    role: "Creative Director",
    company: "Studio Craft",
    metric: "3.4x rýchlejší launch",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="relative py-24 lg:py-36 bg-background text-foreground border-t border-foreground/10 lg:pb-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-[#2997FF] uppercase">
            Hlasy Úspechu · Referencie
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="font-mono text-xs text-foreground/50">
            {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main Quote */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <blockquote
              className={`transition-all duration-300 ${
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              <p className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-foreground">
                "{activeTestimonial.quote}"
              </p>
            </blockquote>

            {/* Author */}
            <div
              className={`mt-12 flex items-center gap-6 transition-all duration-300 delay-100 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <span className="font-display text-xl text-foreground">
                  {activeTestimonial.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{activeTestimonial.author}</p>
                <p className="text-sm text-foreground/60">
                  {activeTestimonial.role}, {activeTestimonial.company}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Highlight */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div
              className={`p-8 border border-foreground/10 rounded-2xl bg-foreground/5 transition-all duration-300 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <span className="font-mono text-xs tracking-widest text-[#2997FF] uppercase block mb-4">
                Preukázateľný Výsledok
              </span>
              <p className="font-display text-3xl md:text-4xl text-foreground font-semibold">
                {activeTestimonial.metric}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center gap-1 mt-6 -ml-3">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveIndex(idx);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  aria-label={`Zobraziť referenciu ${idx + 1}`}
                  className="w-12 h-12 flex items-center justify-center focus:outline-none group"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-6 bg-foreground"
                        : "w-1.5 bg-foreground/20 group-hover:bg-foreground/45"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-foreground/10">
          <TechProvidersMarquee />
        </div>
      </div>
    </section>
  );
}

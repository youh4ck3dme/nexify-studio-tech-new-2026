"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CaretRight } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppleSubnav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["bento", "playground", "produkty", "how-it-works", "comparison", "testimonials", "metrics"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-2xl border-b border-foreground/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-325 mx-auto px-6 flex items-center justify-between">
        {/* Brand/Title */}
        <Link
          href="/"
          onClick={triggerHaptic}
          className="flex items-center gap-1.5 group mr-8 lg:mr-12"
        >
          <span className="font-display font-semibold tracking-tight text-xl text-foreground">
            KE<span className="text-[#FF375F]">studio</span>
          </span>
          <span className="pulse-red-dot ml-0.5" />
        </Link>

        {/* Local & External Links */}
        <nav className="hidden lg:flex items-center gap-5 text-[13px] font-semibold tracking-tight text-foreground/70">
          {[
            { id: "bento", label: "Riešenia" },
            { id: "playground", label: "Playground" },
            { id: "produkty", label: "Produkty" },
            { id: "how-it-works", label: "Ako to funguje" },
            { id: "comparison", label: "Porovnanie" },
            { id: "testimonials", label: "Referencie" },
            { id: "metrics", label: "Výsledky" },
          ].map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={triggerHaptic}
              className={`transition-colors relative py-1 hover:text-foreground ${
                activeSection === item.id ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2997FF] rounded-full" />
              )}
            </a>
          ))}
          <span className="h-3 w-px bg-foreground/15" />
          <a
            href="https://d3v3loper.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerHaptic}
            className="transition-colors py-1 hover:text-foreground text-foreground/60 font-semibold"
          >
            Developer
          </a>
          <a
            href="https://cyber-weave-craft.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={triggerHaptic}
            className="transition-colors py-1 hover:text-foreground text-foreground/60 font-semibold"
          >
            Guard
          </a>
          <Link
            href="/login"
            onClick={triggerHaptic}
            className="transition-colors py-1 hover:text-foreground text-foreground/60 font-semibold"
          >
            CRM
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            size="sm"
            onClick={triggerHaptic}
            className="bg-[#2997FF] hover:bg-[#0071E3] text-white rounded-full px-5 h-9 text-xs font-semibold tracking-tight shadow-lg shadow-[#2997FF]/25 hover:shadow-xl hover:shadow-[#2997FF]/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
            asChild
          >
            <a href="#contact">
              Vyskúšať zadarmo
              <CaretRight className="w-3.5 h-3.5 ml-1" weight="bold" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

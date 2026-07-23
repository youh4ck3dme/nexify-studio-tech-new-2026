"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CaretRight } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, ArrowLeft } from "lucide-react";

export function AppleSubnav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to close menu and handle history state
  const closeMenu = (isLinkClick = false) => {
    setIsMobileMenuOpen(false);
    if (!isLinkClick && typeof window !== "undefined" && window.history.state?.menuOpen) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["services", "playground", "produkty", "how-it-works", "comparison", "testimonials", "metrics"];
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

  // Escape key listener to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // History popstate listener to make back-navigation close the menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const state = { menuOpen: true };
    window.history.pushState(state, "");

    const handlePopState = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isMobileMenuOpen]);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  };

  return (
    <>
      <header
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
              { id: "services", label: "Riešenia" },
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
            <div className="hidden lg:flex items-center gap-3">
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

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => {
                if (isMobileMenuOpen) {
                  closeMenu(false);
                } else {
                  setIsMobileMenuOpen(true);
                }
              }}
              className="lg:hidden p-3 min-h-11 min-w-11 flex items-center justify-center text-foreground"
              aria-label={isMobileMenuOpen ? "Zavrieť menu" : "Otvoriť menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-background z-40 transition-all duration-500 safe-top safe-bottom ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto visible" 
            : "opacity-0 pointer-events-none invisible"
        }`}
        style={{ top: 0 }}
      >
        {isMobileMenuOpen && (
          <div className="flex flex-col h-full px-6 sm:px-8 pt-24 pb-8 safe-bottom overflow-y-auto">
            {/* Close / Back Indicator */}
            <div className="mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => closeMenu(false)}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors py-2 min-h-11 min-w-11"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-mono uppercase tracking-wider">Späť</span>
              </button>
              <ThemeToggle />
            </div>

            {/* Navigation Links */}
            <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
              {[
                { id: "services", label: "Riešenia", href: "/#services" },
                { id: "playground", label: "Playground", href: "/#playground" },
                { id: "produkty", label: "Produkty", href: "/#produkty" },
                { id: "how-it-works", label: "Ako to funguje", href: "/#how-it-works" },
                { id: "comparison", label: "Porovnanie", href: "/#comparison" },
                { id: "testimonials", label: "Referencie", href: "/#testimonials" },
                { id: "metrics", label: "Výsledky", href: "/#metrics" },
                { id: "crm", label: "CRM", href: "/login" },
              ].map((item, i) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => closeMenu(true)}
                  className="text-4xl sm:text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 min-h-11 flex items-center"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Bottom Button */}
            <div className="flex gap-4 pt-8 border-t border-foreground/10">
              <Button className="flex-1 bg-foreground text-background rounded-full h-14 text-base" asChild>
                <Link href="/#contact" onClick={() => closeMenu(true)}>
                  Vyskúšať zadarmo
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowLeft } from "lucide-react";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { ThemeToggle } from "@/components/theme-toggle";

const DEVELOPER_PORTAL_URL = "https://d3v3loper.lovable.app";

const navLinks = [
  { name: "Domov", href: "/" },
  { name: "Služby", href: "/#services" },
  { name: "Produkty", href: "/#produkty" },
  { name: "Ako to funguje", href: "/#how-it-works" },
  { name: "Referencie", href: "/#testimonials" },
  { name: "Cenník", href: "/#pricing" },
  { name: "Developer", href: DEVELOPER_PORTAL_URL, external: true },
  { name: "Guard", href: "https://cyber-weave-craft.lovable.app", external: true },
  { name: "Kontakt", href: "/#contact" },
  { name: "Interné CRM", href: "/login" },
] as const;

const navLinkClassName =
  "text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group link-underline";

function NavLinkItem({
  link,
  className,
  onClick,
  style,
  showUnderline = false,
}: {
  link: (typeof navLinks)[number];
  className: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  showUnderline?: boolean;
}) {
  const underline = showUnderline ? (
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
  ) : null;

  if ("external" in link && link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        style={style}
      >
        {link.name}
        {underline}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onClick} style={style}>
      {link.name}
      {underline}
    </Link>
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to handle menu closing via different triggers
  const closeMenu = (isLinkClick = false) => {
    setIsMobileMenuOpen(false);
    if (!isLinkClick && typeof window !== "undefined" && window.history.state?.menuOpen) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
      // popstate was triggered (browser went back), just close the react state
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed z-50 transition-[top,left,right,margin,padding] duration-300 safe-top safe-x ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-[max-width,background-color,border-color,border-radius,box-shadow] duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-[height,padding] duration-300 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display tracking-tight text-xl">Nexify</span>
            <span className="text-muted-foreground font-mono text-[10px] mt-0.5">Studio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.name}
                link={link}
                className={navLinkClassName}
                showUnderline
              />
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <InstallPrompt />
            <Button
              size="sm"
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 btn-micro ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
              asChild
            >
              <Link href="/#contact">Kontakt</Link>
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
            className="md:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
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

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 safe-top safe-bottom ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto visible" 
            : "opacity-0 pointer-events-none invisible"
        }`}
        style={{ top: 0 }}
      >
        {isMobileMenuOpen && (
          <div className="flex flex-col h-full px-6 sm:px-8 pt-24 pb-8 safe-bottom overflow-y-auto">
            {/* Close / Back Indicator */}
            <div className={`mb-6 flex items-center justify-between transition-all duration-500 ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              <button
                type="button"
                onClick={() => closeMenu(false)}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors py-2 min-h-[44px] min-w-[44px]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-mono uppercase tracking-wider">Späť</span>
              </button>
              <ThemeToggle />
            </div>

            {/* Navigation Links */}
            <div className="flex-1 flex flex-col justify-center gap-6 my-auto">
              {navLinks.map((link, i) => (
                <NavLinkItem
                  key={link.name}
                  link={link}
                  onClick={() => closeMenu(true)}
                  className={`text-4xl sm:text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 min-h-[44px] flex items-center ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${i * 60}ms` : "0ms" }}
                />
              ))}
            </div>
            
            {/* Bottom CTAs */}
            <div className="pb-6 md:hidden flex items-center justify-between gap-4">
              <InstallPrompt />
            </div>
            <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
            >
              <Button className="flex-1 bg-foreground text-background rounded-full h-14 text-base" asChild>
                <Link href="/#contact" onClick={() => closeMenu(true)}>
                  Kontaktujte nás
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

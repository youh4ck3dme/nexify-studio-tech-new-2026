"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { legalRoutes } from "@/lib/legal/company";

const CONSENT_KEY = "nexify-cookie-consent-v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: "all" | "essential") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Súhlas s cookies"
      className="fixed bottom-0 inset-x-0 z-50 border-t border-foreground/10 bg-background/95 backdrop-blur-md p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
          Používame nevyhnutné technológie a analytiku na prevádzku webu. Viac v{" "}
          <Link href={legalRoutes.cookies} className="underline underline-offset-4 hover:text-foreground">
            zásadách cookies
          </Link>
          .
        </p>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            className="h-10 rounded-full px-5 text-sm font-medium border border-foreground/25 text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
            onClick={() => save("essential")}
          >
            Len nevyhnutné
          </button>
          <button
            className="h-10 rounded-full px-5 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer"
            onClick={() => save("all")}
          >
            Prijať všetko
          </button>
        </div>
      </div>
    </div>
  );
}

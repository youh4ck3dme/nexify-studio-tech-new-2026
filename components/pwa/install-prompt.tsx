"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (isStandalone() || dismissed) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setDismissed(true);
      return;
    }

    if (isIos()) {
      setShowIosHint(true);
    }
  };

  if (!deferredPrompt && !isIos()) return null;

  return (
    <div className="flex items-center">
      {showIosHint ? (
        <p className="text-xs text-muted-foreground max-w-[200px] leading-snug">
          V Safari: Zdieľať → Pridať na plochu
        </p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full gap-2 h-8 text-xs"
          onClick={handleInstall}
        >
          {deferredPrompt ? (
            <>
              <Download className="w-3.5 h-3.5" />
              Nainštalovať
            </>
          ) : (
            <>
              <Share className="w-3.5 h-3.5" />
              Pridať na plochu
            </>
          )}
        </Button>
      )}
      {showIosHint && (
        <button
          type="button"
          className="ml-2 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Zavrieť"
          onClick={() => setDismissed(true)}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

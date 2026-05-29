"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isPwa = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    setIsStandalone(isPwa);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt if not standalone
      if (!isPwa) setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Fallback for iOS (Safari doesn't support beforeinstallprompt)
    const isIos = /ipad|iphone|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIos && !isPwa) {
      // Show custom guidance for iOS (e.g. tap Share -> Add to Home Screen)
      setShowPrompt(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Probably iOS or browser that doesn't support the programmatic prompt
      alert("Pre inštaláciu na iOS: ťuknite na ikonku Zdieľať (Share) naspodku obrazovky a vyberte 'Pridať na plochu' (Add to Home Screen).");
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 pt-0 transition-transform duration-500 ease-out translate-y-0 sm:pb-8 max-w-lg mx-auto w-full animate-in slide-in-from-bottom-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-4 shadow-2xl flex items-center justify-between gap-4">
        {/* Glow effect */}
        <div className="absolute -left-10 top-0 h-full w-20 bg-primary/20 blur-2xl" />
        
        <div className="flex items-center gap-4 z-10 relative">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 text-white shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm sm:text-base">Nainštalovať aplikáciu</h3>
            <p className="text-white/60 text-xs sm:text-sm">Pridaj na plochu pre dokonalý offline prístup</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 z-10 relative">
          <Button 
            onClick={handleInstallClick} 
            className="rounded-full bg-white text-black hover:bg-white/90 h-9 px-4 text-xs sm:text-sm shrink-0"
          >
            Pridať
          </Button>
          <button 
            onClick={() => setShowPrompt(false)} 
            className="text-white/40 hover:text-white/80 p-2 transition-colors shrink-0"
            aria-label="Zatvoriť"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

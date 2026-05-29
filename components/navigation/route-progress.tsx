"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    const timers = [
      window.setTimeout(() => setProgress(45), 80),
      window.setTimeout(() => setProgress(75), 180),
      window.setTimeout(() => setProgress(92), 320),
      window.setTimeout(() => {
        setProgress(100);
        window.setTimeout(() => setVisible(false), 250);
      }, 480),
    ];

    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-100 h-0.5 safe-top"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Načítavam stránku"
      aria-live="polite"
      aria-busy={progress < 100}
    >
      <Progress value={progress} className="h-0.5 rounded-none bg-foreground/10" />
      <span className="sr-only">Načítavam…</span>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Nexify Studio
      </p>
      <h1 className="text-4xl font-display">Ste offline</h1>
      <p className="max-w-md text-muted-foreground">
        Pripojenie k sieti nie je dostupné. Skontrolujte internet a skúste znova
        načítať stránku.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/">Späť na úvod</Link>
      </Button>
    </main>
  );
}

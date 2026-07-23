import { CrmDashboard } from "@/components/crm/crm-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM | KEstudio",
  description: "Interné offline-first CRM na správu klientov.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CrmPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-display mb-4 text-white">Interné CRM</h1>
        <p className="text-muted-foreground mb-12 max-w-xl">
          Tento systém plne podporuje Offline-First a beží cez lokálnu IndexedDB. 
          Ak stratíte pripojenie, môžete pokračovať v zadávaní klientov.
          Údaje sa uložia a na pozadí synchronizujú so serverom hneď, keď budete opäť online.
        </p>

        <CrmDashboard />
      </div>
    </div>
  );
}

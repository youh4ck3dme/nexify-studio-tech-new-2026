import { ClientForm } from "@/components/crm/client-form";
import { ClientList } from "@/components/crm/client-list";
import { SyncManager } from "@/components/crm/sync-manager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM | Nexify Studio",
  description: "Interné offline-first CRM na správu klientov.",
};

export default function CrmPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-display mb-4">Interné CRM</h1>
        <p className="text-muted-foreground mb-12 max-w-xl">
          Tento systém plne podporuje Offline-First a beží cez lokálnu IndexedDB. 
          Ak stratíte pripojenie, môžete pokračovať v zadávaní klientov.
          Údaje sa uložia a na pozadí synchronizujú so serverom hneď, keď budete opäť online.
        </p>

        {/* Tichý manažér na pozadí, ktorý sa postará o Background Sync */}
        <SyncManager />
        
        <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
          <div className="sticky top-24">
            <ClientForm />
          </div>
          <div>
            <ClientList />
          </div>
        </div>
      </div>
    </div>
  );
}

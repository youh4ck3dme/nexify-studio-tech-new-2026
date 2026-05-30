"use client";

import { useOptimistic, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Client, db } from "@/lib/db";
import { Wifi, WifiOff } from "lucide-react";

// Server action fallback mock
async function submitClientToServer(data: Partial<Client>) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 800));
  return data;
}

export function ClientForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const isOnline = useNetworkStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    { status: "idle", message: "" } as { status: "idle" | "saving" | "success" | "error"; message: string },
    (state, newStatus: { status: "idle" | "saving" | "success" | "error"; message?: string }) => ({
      ...state,
      ...newStatus,
      message: newStatus.message || "",
    })
  );

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const contactPerson = formData.get("contactPerson") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;
    const budget = formData.get("budget") as string;
    const status = formData.get("status") as string;
    const notes = formData.get("notes") as string;

    if (!name || !email) return;

    setIsSubmitting(true);
    addOptimisticStatus({ 
      status: "saving", 
      message: isOnline ? "Ukladám na server..." : "Ukladám lokálne (Offline)..." 
    });

    const clientData: Client = {
      name,
      contactPerson,
      email,
      phone,
      service,
      budget,
      status,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      if (isOnline) {
        await submitClientToServer(clientData);
        await db.clients.add(clientData);
      } else {
        await db.clients.add(clientData);
        await db.offlineQueue.add({
          action: "CREATE_CLIENT",
          payload: clientData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
      formRef.current?.reset();
    } catch (e) {
      console.error(e);
      await db.clients.add(clientData);
      await db.offlineQueue.add({
        action: "CREATE_CLIENT",
        payload: clientData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 lg:p-8 card-lift relative overflow-hidden backdrop-blur-xl bg-black/60">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-mono text-muted-foreground">
        {isOnline ? (
          <><Wifi className="w-4 h-4 text-green-500" /> Online</>
        ) : (
          <><WifiOff className="w-4 h-4 text-yellow-500" /> Offline režim</>
        )}
      </div>

      <h2 className="text-2xl font-display mb-6 text-white">Nový klient</h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Názov klienta / Firmy *</label>
            <input
              name="name"
              required
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Kontaktná osoba</label>
            <input
              name="contactPerson"
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">E-mail *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Telefón</label>
            <input
              name="phone"
              type="tel"
              className="w-full h-12 px-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Služba / Produkt</label>
            <select
              name="service"
              required
              className="w-full h-12 px-4 border border-white/10 bg-black/80 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white"
            >
              <option value="Webstránka">Webstránka</option>
              <option value="E-commerce">E-commerce</option>
              <option value="PWA Aplikácia">PWA Aplikácia</option>
              <option value="Branding">Branding</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Rozpočet</label>
            <select
              name="budget"
              className="w-full h-12 px-4 border border-white/10 bg-black/80 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white"
            >
              <option value="">Nevyplnené</option>
              <option value="do 1000€">do 1000€</option>
              <option value="1000-3000€">1000 - 3000€</option>
              <option value="3000€+">3000€+</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Status</label>
            <select
              name="status"
              required
              className="w-full h-12 px-4 border border-white/10 bg-black/80 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white"
            >
              <option value="Nový lead">Nový lead</option>
              <option value="Nacenenie">Nacenenie</option>
              <option value="Vo vývoji">Vo vývoji</option>
              <option value="Dokončené">Dokončené</option>
              <option value="Odmietnuté">Odmietnuté</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Poznámka</label>
          <textarea
            name="notes"
            rows={3}
            className="w-full p-4 border border-white/10 bg-white/5 rounded-lg outline-none focus:ring-2 focus:ring-white/20 input-glow text-white resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full sm:w-auto h-12 btn-micro text-black bg-white hover:bg-white/90"
          >
            {optimisticStatus.status === "saving" ? <Spinner className="mr-2" /> : null}
            {optimisticStatus.status === "saving" ? optimisticStatus.message : "Uložiť klienta do CRM"}
          </Button>
        </div>
      </form>
    </div>
  );
}

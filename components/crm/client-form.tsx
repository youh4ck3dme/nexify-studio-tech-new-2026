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
  // Let's pretend it succeeds mostly
  return data;
}

export function ClientForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const isOnline = useNetworkStatus();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useOptimistic for immediate UI feedback before DB/Server finishes
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
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!name || !email) return;

    setIsSubmitting(true);
    addOptimisticStatus({ 
      status: "saving", 
      message: isOnline ? "Ukladám na server..." : "Ukladám lokálne (Offline)..." 
    });

    const clientData = {
      name,
      email,
      phone,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      if (isOnline) {
        // Online: Odoslať na server a uložiť do lokálnej DB ako cache
        await submitClientToServer(clientData);
        await db.clients.add(clientData);
      } else {
        // Offline: Uložiť do offline fronty a lokálnej DB
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
      // Fallback ak server zlyhá aj keď sme "online"
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
    <div className="bg-card border border-border rounded-xl p-6 lg:p-8 card-lift relative overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-mono text-muted-foreground">
        {isOnline ? (
          <><Wifi className="w-4 h-4 text-green-500" /> Online</>
        ) : (
          <><WifiOff className="w-4 h-4 text-yellow-500" /> Offline režim</>
        )}
      </div>

      <h2 className="text-2xl font-display mb-6">Nový klient</h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Meno a priezvisko</label>
          <input
            name="name"
            required
            className="w-full h-12 px-4 border border-border bg-background rounded-md outline-none focus:ring-2 focus:ring-ring input-glow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full h-12 px-4 border border-border bg-background rounded-md outline-none focus:ring-2 focus:ring-ring input-glow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Telefón</label>
          <input
            name="phone"
            type="tel"
            className="w-full h-12 px-4 border border-border bg-background rounded-md outline-none focus:ring-2 focus:ring-ring input-glow"
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full sm:w-auto h-12 btn-micro text-primary-foreground"
          >
            {optimisticStatus.status === "saving" ? <Spinner className="mr-2" /> : null}
            {optimisticStatus.status === "saving" ? optimisticStatus.message : "Pridať klienta"}
          </Button>
        </div>
      </form>
    </div>
  );
}

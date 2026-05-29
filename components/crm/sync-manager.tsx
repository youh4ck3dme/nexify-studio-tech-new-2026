"use client";

import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { db } from "@/lib/db";
import { toast } from "sonner";

export function SyncManager() {
  const isOnline = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Ak sme offline alebo už synchronizujeme, nespustíme to
    if (!isOnline || isSyncing) return;

    const processQueue = async () => {
      const queue = await db.offlineQueue.toArray();
      if (queue.length === 0) return;

      setIsSyncing(true);
      toast.info(`Spúšťam synchronizáciu ${queue.length} položiek (Sme späť online)`);

      let successCount = 0;
      for (const item of queue) {
        try {
          // Tu by bol reálny fetch request:
          // await fetch('/api/clients', { method: 'POST', body: JSON.stringify(item.payload) });
          await new Promise(res => setTimeout(res, 500)); // Simulácia
          
          if (item.id) {
            await db.offlineQueue.delete(item.id);
            successCount++;
          }
        } catch (e) {
          console.error("Synchronizácia zlyhala:", e);
        }
      }

      setIsSyncing(false);
      if (successCount > 0) {
        toast.success(`Synchronizácia úspešná! Záznamy: ${successCount}`);
      }
    };

    processQueue();
  }, [isOnline, isSyncing]);

  // Tento komponent nemá UI, pracuje ticho na pozadí
  return null;
}

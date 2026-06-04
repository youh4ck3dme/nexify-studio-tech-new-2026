"use client";

import { useEffect, useState, useCallback } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";

// Inbound: Potiahne data z Postgres cez /api/sync/pull a uloží do lokálnej Dexie DB
async function pullFromPostgres(): Promise<void> {
  // TODO: Neskôr implementujeme aj Inbound Pull API z Postgresu. Zatiaľ stačí Push, 
  // čo pokryje základnú požiadavku (ukladanie dát na Vercel).
}

export function SyncManager() {
  const isOnline = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reaktívne query pre počty
  const queue = useLiveQuery(() => db.offlineQueue.toArray());
  const pendingCount = queue?.length || 0;

  // Sync proces
  const triggerSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    const items = await db.offlineQueue.toArray();
    if (items.length === 0) {
      setHasError(false);
      return;
    }

    setIsSyncing(true);
    setHasError(false);
    toast.info(`Spúšťam synchronizáciu ${items.length} zmien (Vercel Postgres)...`);

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      });

      if (!response.ok) {
        throw new Error(`Sync API vrátilo status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const idsToDelete = items.map(item => item.id).filter(id => id !== undefined) as number[];
        if (idsToDelete.length > 0) {
          await db.offlineQueue.bulkDelete(idsToDelete);
        }
        toast.success(`Všetky zmeny boli úspešne zosynchronizované s Vercelom (${idsToDelete.length} položiek).`);
        await pullFromPostgres();
      } else {
        throw new Error(data.error || "Neznáma chyba z API");
      }
    } catch (err) {
      console.error("Synchronizácia zlyhala:", err);
      setHasError(true);
      toast.error(`Synchronizácia zlyhala: ${err instanceof Error ? err.message : "Chyba"}`);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  // Auto-sync
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !isSyncing) {
      triggerSync();
    }
  }, [isOnline, pendingCount, isSyncing, triggerSync]);

  // Pull on connect
  useEffect(() => {
    if (isOnline) {
      pullFromPostgres();
    }
  }, [isOnline]);

  // Determine sync status and theme
  let statusText = "Online a pripojené";
  let statusColor = "bg-green-500";
  let borderStyle = "border-green-500/20 bg-green-500/5";
  let icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;

  if (!isOnline) {
    statusText = "Offline režim";
    statusColor = "bg-yellow-500";
    borderStyle = "border-yellow-500/20 bg-yellow-500/5";
    icon = <WifiOff className="w-5 h-5 text-yellow-400" />;
  } else if (isSyncing) {
    statusText = "Prebieha synchronizácia...";
    statusColor = "bg-blue-500";
    borderStyle = "border-blue-500/20 bg-blue-500/5";
    icon = <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
  } else if (hasError) {
    statusText = "Chyba synchronizácie s Vercel Postgres";
    statusColor = "bg-red-500";
    borderStyle = "border-red-500/20 bg-red-500/5";
    icon = <AlertCircle className="w-5 h-5 text-red-400" />;
  } else if (pendingCount > 0) {
    statusText = "Čaká na odoslanie do cloudu";
    statusColor = "bg-blue-500";
    borderStyle = "border-blue-500/20 bg-blue-500/5";
    icon = <RefreshCw className="w-5 h-5 text-blue-400" />;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl backdrop-blur-md transition-all ${borderStyle}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor} ${isSyncing ? "animate-pulse" : ""}`} />
            <h4 className="font-semibold text-sm text-white">{statusText}</h4>
          </div>
          {pendingCount > 0 ? (
            <p className="text-xs text-white/60 mt-0.5">
              Vo fronte na odoslanie: <span className="font-mono text-white font-semibold">{pendingCount}</span> neuložených zmien.
            </p>
          ) : (
            <p className="text-xs text-white/50 mt-0.5">
              Dáta sú zosynchronizované (Vercel Postgres).
            </p>
          )}
        </div>
      </div>

      <button
        onClick={triggerSync}
        disabled={!isOnline || isSyncing || pendingCount === 0}
        className="h-10 px-4 bg-white text-black font-semibold text-xs rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
        <span>Synchronizovať s cloudom</span>
      </button>
    </div>
  );
}

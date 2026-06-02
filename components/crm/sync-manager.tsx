"use client";

import { useEffect, useState, useCallback } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { db, OfflineQueueItem, Client, ClientActivity, ClientTask } from "@/lib/db";
import { toast } from "sonner";
import { WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db as firestoreDb, isFirebaseConfigured } from "@/lib/firebase/config";

const CRM_SIMULATED_SYNC = !isFirebaseConfigured;

// Outbound: Sync local IndexedDB changes to Cloud Firestore
async function syncToServer(item: OfflineQueueItem): Promise<void> {
  if (CRM_SIMULATED_SYNC || !firestoreDb) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return;
  }

  const entityIdStr = String(item.entityId);

  if (item.entityType === "client") {
    const docRef = doc(firestoreDb, "clients", entityIdStr);
    if (item.action === "create" || item.action === "update") {
      const payload = item.payload as Client;
      await setDoc(docRef, {
        ...payload,
        updatedAt: Date.now(),
      }, { merge: true });
    } else if (item.action === "delete") {
      const payload = item.payload as Client;
      await setDoc(docRef, {
        deletedAt: payload?.deletedAt || Date.now(),
        updatedAt: Date.now()
      }, { merge: true });
    }
  } else if (item.entityType === "activity") {
    const docRef = doc(firestoreDb, "activities", entityIdStr);
    if (item.action === "create" || item.action === "update") {
      const payload = item.payload as ClientActivity;
      await setDoc(docRef, {
        ...payload,
      }, { merge: true });
    }
  } else if (item.entityType === "task") {
    const payload = item.payload as { clientId: number; tasks: ClientTask[] };
    const clientIdStr = String(payload.clientId);
    const clientDocRef = doc(firestoreDb, "clients", clientIdStr);
    await setDoc(clientDocRef, {
      tasks: payload.tasks,
      updatedAt: Date.now()
    }, { merge: true });
  }
}

// Inbound: Pull new/updated data from Firestore and write it into Dexie
async function pullFromFirestore(): Promise<void> {
  if (CRM_SIMULATED_SYNC || !firestoreDb) return;

  try {
    // 1. Pull clients
    const clientsSnap = await getDocs(collection(firestoreDb, "clients"));
    for (const docObj of clientsSnap.docs) {
      const data = docObj.data();
      const id = parseInt(docObj.id, 10);
      if (isNaN(id)) continue;

      const localClient = await db.clients.get(id);
      if (!localClient || (data.updatedAt && data.updatedAt > localClient.updatedAt)) {
        await db.clients.put({
          id,
          companyName: data.companyName,
          contactName: data.contactName || "",
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          service: data.service,
          status: data.status,
          budget: data.budget || "",
          notes: data.notes || "",
          tasks: data.tasks || [],
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
          deletedAt: data.deletedAt || null,
          syncStatus: "synced",
        });
      }
    }

    // 2. Pull activities
    const activitiesSnap = await getDocs(collection(firestoreDb, "activities"));
    for (const docObj of activitiesSnap.docs) {
      const data = docObj.data();
      const id = parseInt(docObj.id, 10);
      if (isNaN(id)) continue;

      const localAct = await db.activities.get(id);
      if (!localAct) {
        await db.activities.put({
          id,
          clientId: data.clientId,
          type: data.type,
          title: data.title,
          content: data.content || "",
          createdAt: data.createdAt || Date.now(),
        });
      }
    }
  } catch (err) {
    console.error("Error pulling from Firestore:", err);
  }
}

export function SyncManager() {
  const isOnline = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reactive query of the offlineQueue
  const queue = useLiveQuery(() => db.offlineQueue.toArray());
  const pendingCount = queue?.length || 0;

  // Sync process function
  const triggerSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    const items = await db.offlineQueue.toArray();
    if (items.length === 0) {
      setHasError(false);
      return;
    }

    setIsSyncing(true);
    setHasError(false);
    toast.info(`Spúšťam synchronizáciu ${items.length} zmien...`);

    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      try {
        await syncToServer(item);

        // Update synced client's syncStatus in DB
        if (item.entityType === "client") {
          const clientId = typeof item.entityId === "string" ? parseInt(item.entityId, 10) : item.entityId;
          if (!isNaN(clientId)) {
            const client = await db.clients.get(clientId);
            if (client) {
              await db.clients.update(clientId, { syncStatus: "synced" });
            }
          }
        }

        // Delete from offlineQueue
        if (item.id) {
          await db.offlineQueue.delete(item.id);
          successCount++;
        }
      } catch (err) {
        console.error("Sync error for item:", item, err);
        failCount++;
        const errorMessage = err instanceof Error ? err.message : "Neznáma chyba";
        if (item.id) {
          await db.offlineQueue.update(item.id, {
            retryCount: (item.retryCount || 0) + 1,
            lastError: errorMessage,
          });
        }
        
        // Update client status to error
        if (item.entityType === "client") {
          const clientId = typeof item.entityId === "string" ? parseInt(item.entityId, 10) : item.entityId;
          if (!isNaN(clientId)) {
            await db.clients.update(clientId, { syncStatus: "error" });
          }
        }
      }
    }

    setIsSyncing(false);
    if (failCount > 0) {
      setHasError(true);
      toast.error(`Synchronizácia dokončená s chybami. Zlyhalo: ${failCount}`);
    } else {
      await pullFromFirestore();
      if (successCount > 0) {
        toast.success(`Všetky zmeny boli úspešne zosynchronizované (${successCount} položiek).`);
      }
    }
  }, [isOnline, isSyncing]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !isSyncing) {
      triggerSync();
    }
  }, [isOnline, pendingCount, isSyncing, triggerSync]);

  // One-time pull on mount/reconnect
  useEffect(() => {
    if (isOnline) {
      pullFromFirestore();
    }
  }, [isOnline]);

  // Determine sync status and theme
  let statusText = "Online a pripojené";
  let statusColor = "bg-green-500"; // Green
  let borderStyle = "border-green-500/20 bg-green-500/5";
  let icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;

  if (!isOnline) {
    statusText = "Offline režim";
    statusColor = "bg-yellow-500"; // Yellow
    borderStyle = "border-yellow-500/20 bg-yellow-500/5";
    icon = <WifiOff className="w-5 h-5 text-yellow-400" />;
  } else if (isSyncing) {
    statusText = "Prebieha synchronizácia...";
    statusColor = "bg-blue-500"; // Blue
    borderStyle = "border-blue-500/20 bg-blue-500/5";
    icon = <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
  } else if (hasError) {
    statusText = "Chyba synchronizácie";
    statusColor = "bg-red-500"; // Red
    borderStyle = "border-red-500/20 bg-red-500/5";
    icon = <AlertCircle className="w-5 h-5 text-red-400" />;
  } else if (pendingCount > 0) {
    statusText = "Čaká na synchronizáciu";
    statusColor = "bg-blue-500"; // Blue
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
              Lokálne dáta sú kompletne zosynchronizované.
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
        <span>Synchronizovať</span>
      </button>
    </div>
  );
}

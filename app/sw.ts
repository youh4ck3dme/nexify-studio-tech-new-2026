import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } from "serwist";
import { ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
  runtimeCaching: [
    // 1. Statické assety (fonty, CSS, obrázky z public): CacheFirst
    {
      matcher: ({ request, url }) => {
        return (
          request.destination === "font" ||
          request.destination === "style" ||
          request.destination === "image" ||
          url.pathname.startsWith("/fonts/") ||
          url.pathname.startsWith("/images/")
        );
      },
      handler: new CacheFirst({
        cacheName: "static-assets-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dní
          }),
        ],
      }),
    },

    // 2. API volania pre zoznamy (GET requesty): StaleWhileRevalidate
    {
      matcher: ({ request, url }) => {
        return request.method === "GET" && url.pathname.includes("/api/list");
      },
      handler: new StaleWhileRevalidate({
        cacheName: "api-lists-cache",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60, // 24 hodín
          }),
        ],
      }),
    },

    // 3. Detailné dáta a kritické API (zo zadania): NetworkFirst (s fallbackom na cache)
    {
      matcher: ({ request, url }) => {
        return request.method === "GET" && url.pathname.startsWith("/api/critical");
      },
      handler: new NetworkFirst({
        cacheName: "api-critical-cache",
        networkTimeoutSeconds: 3, // Po 3 sekundách fallbackne na cache
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hodín
          }),
        ],
      }),
    },

    // Zvyšné API požiadavky necachovať vôbec (podľa testov)
    {
      matcher: ({ url }) => {
        return url.pathname.startsWith("/api/");
      },
      handler: new NetworkOnly(),
    },

    // 4. Fallback na defaultnú Serwist/Next.js cache stratégiu
    ...defaultCache,
  ],
});

serwist.addEventListeners();

// --- Zabezpečenie Background Sync pre CRM ---
import { db } from "../lib/db/core"; // Používame relatívnu cestu, keďže sw.ts je v /app a db.ts je v /lib

interface SyncEvent extends ExtendableEvent {
  lastChance: boolean;
  tag: string;
}

self.addEventListener("sync", (event: any) => {
  const syncEvent = event as SyncEvent;
  if (syncEvent.tag === "sync-crm-data") {
    console.log("[Service Worker] Zachytený sync event: sync-crm-data");
    syncEvent.waitUntil(processOfflineQueue());
  }
});

async function processOfflineQueue() {
  try {
    const queue = await db.offlineQueue.toArray();
    if (queue.length === 0) return;

    console.log(`[Service Worker] Spúšťam synchronizáciu ${queue.length} položiek na pozadí...`);

    let successCount = 0;
    for (const item of queue) {
      try {
        // Simulácia odoslania na server (rovnako ako v SyncManageri)
        // await fetch('/api/clients', { method: 'POST', body: JSON.stringify(item.payload) });
        await new Promise((res) => setTimeout(res, 500));

        if (item.id) {
          await db.offlineQueue.delete(item.id);
          successCount++;
        }
      } catch (err) {
        console.error("[Service Worker] Chyba pri synchronizácii položky:", err);
      }
    }

    console.log(`[Service Worker] Synchronizácia úspešná! Záznamy: ${successCount}`);
    
    // Keďže sme v SW, vieme poslať správu klientom (otvoreným tabom)
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({ type: "SYNC_COMPLETE", successCount });
    });
  } catch (error) {
    console.error("[Service Worker] Zlyhalo spracovanie offline fronty:", error);
  }
}

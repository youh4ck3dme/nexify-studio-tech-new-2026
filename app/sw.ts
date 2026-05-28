import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

const runtimeCaching = [
  {
    matcher: ({ request, url }: { request: Request; url: URL }) =>
      request.method === "GET" && url.pathname.startsWith("/api/"),
    handler: new NetworkOnly(),
  },
  {
    matcher: ({ request }: { request: Request }) => request.mode === "navigate",
    handler: new NetworkFirst({
      cacheName: "pages",
      networkTimeoutSeconds: 3,
      plugins: [
        new ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: ONE_DAY,
        }),
      ],
    }),
  },
  {
    matcher: ({ request, url }: { request: Request; url: URL }) =>
      request.destination === "image" ||
      url.pathname.match(
        /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|otf)$/i
      ) !== null ||
      url.pathname.startsWith("/android-chrome") ||
      url.pathname.startsWith("/apple-touch-icon") ||
      url.pathname.startsWith("/favicon"),
    handler: new CacheFirst({
      cacheName: "static-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 96,
          maxAgeSeconds: ONE_WEEK,
        }),
      ],
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
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
});

serwist.addEventListeners();

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    void self.skipWaiting();
  }
});

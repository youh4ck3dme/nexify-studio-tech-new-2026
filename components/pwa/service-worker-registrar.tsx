"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const SW_URL = "/sw.js";

function notifyUpdate(registration: ServiceWorkerRegistration) {
  const waiting = registration.waiting;
  if (!waiting) return;

  toast("Nová verzia je pripravená", {
    description: "Obnovte stránku pre najnovší obsah.",
    duration: Infinity,
    action: {
      label: "Obnoviť",
      onClick: () => {
        waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      },
    },
  });
}

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register(SW_URL, {
          scope: "/",
          updateViaCache: "none",
        });

        if (registration.waiting) {
          notifyUpdate(registration);
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration?.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              notifyUpdate(registration!);
            }
          });
        });
      } catch {
        // SW registration is optional; app still works without it.
      }
    };

    void register();
  }, []);

  return null;
}

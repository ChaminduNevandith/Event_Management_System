"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (sw.js) and handles updates.
 * Should be rendered once at the root layout level.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[SW] Registered:", registration.scope);

        // Check for updates on page load
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available — you could show a toast here
              console.log("[SW] New version available. Refresh to update.");
            }
          });
        });

        // Periodically check for updates
        setInterval(() => registration.update(), 60 * 60 * 1000); // every 1hr
      } catch (err) {
        console.error("[SW] Registration failed:", err);
      }
    };

    // Register after load to not block initial render
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }
  }, []);

  return null;
}

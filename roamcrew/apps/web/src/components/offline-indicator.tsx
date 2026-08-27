"use client";

import { useEffect, useState, useCallback } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setJustReconnected(true);
    setIsSyncing(true);

    // Trigger background sync if supported
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready
        .then((reg) => (reg as any).sync.register("sync-offline-mutations"))
        .catch(() => {});
    }

    // Auto-dismiss "reconnected" banner after 3s
    setTimeout(() => {
      setIsSyncing(false);
      setJustReconnected(false);
      setShowBanner(false);
    }, 3500);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setShowBanner(true);
    setJustReconnected(false);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    setIsOnline(navigator.onLine);
    setShowBanner(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for sync complete message from service worker
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_COMPLETE") setIsSyncing(false);
    };
    navigator.serviceWorker?.addEventListener("message", handleSWMessage);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker?.removeEventListener("message", handleSWMessage);
    };
  }, [handleOnline, handleOffline]);

  if (!showBanner && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-3 px-4 py-3 text-sm font-bold shadow-lg transition-all duration-500 ${
        isOnline
          ? "bg-emerald-500 text-white shadow-emerald-500/30"
          : "bg-[#0C4A6E] text-white shadow-[#0C4A6E]/40"
      }`}
    >
      {isOnline ? (
        <>
          {isSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wifi className="w-4 h-4" />
          )}
          <span>
            {isSyncing ? "Back online — syncing your changes..." : "Connection restored!"}
          </span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>You&apos;re offline — viewing cached data</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </>
      )}
    </div>
  );
}

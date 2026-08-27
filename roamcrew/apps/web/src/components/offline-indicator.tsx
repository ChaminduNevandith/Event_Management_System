"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Check initial state
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
      setShowToast(true);
    }

    const handleOnline = () => {
      setIsOffline(false);
      setShowToast(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline || !showToast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/80 backdrop-blur-xl border border-red-200 shadow-2xl shadow-red-500/10 px-6 py-4 rounded-full flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-500">
          <WifiOff className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">You're Offline</p>
          <p className="text-xs text-slate-500">Viewing cached RoamCrew data.</p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="ml-4 h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

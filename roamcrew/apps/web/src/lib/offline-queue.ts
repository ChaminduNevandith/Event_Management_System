/**
 * Offline Mutation Queue
 * 
 * Stores failed API mutations in IndexedDB when the user is offline.
 * The service worker's Background Sync replays them when connectivity returns.
 * 
 * Usage:
 *   import { offlineFetch } from "@/lib/offline-queue";
 *   await offlineFetch("/api/tasks/123", { method: "PATCH", body: JSON.stringify({ status: "DONE" }) });
 */

const DB_NAME = "roamcrew-offline";
const DB_VERSION = 1;
const STORE_NAME = "mutations";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

async function queueMutation(url: string, options: RequestInit) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add({
      url,
      method: options.method || "GET",
      headers: options.headers ? Object.fromEntries(new Headers(options.headers).entries()) : {},
      body: options.body,
      queuedAt: Date.now(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingMutations() {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function clearPendingMutations() {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Drop-in replacement for fetchApi that queues mutations when offline.
 * Read-only requests (GET) are not queued — the service worker handles cache fallback.
 */
export async function offlineFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (!navigator.onLine && options.method && options.method !== "GET") {
    await queueMutation(url, options);
    // Register background sync
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      const reg = await navigator.serviceWorker.ready;
      await (reg as any).sync.register("sync-offline-mutations").catch(() => {});
    }
    // Return an optimistic empty response so callers don't crash
    return new Response(JSON.stringify({ queued: true, offline: true }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  }

  return fetch(url, options);
}

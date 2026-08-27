"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    pushEnabled: false,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    dailyDigest: false,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    loadSettings();
    checkSubscription();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await fetchApi("/notifications/settings");
      if (data) {
        setSettings({
          pushEnabled: data.pushEnabled,
          quietHoursEnabled: data.quietHoursEnabled,
          quietHoursStart: data.quietHoursStart,
          quietHoursEnd: data.quietHoursEnd,
          dailyDigest: data.dailyDigest,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const togglePush = async () => {
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      alert("Push notifications are not supported by this browser.");
      return;
    }

    try {
      setSaving(true);
      const registration = await navigator.serviceWorker.ready;

      if (isSubscribed) {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await fetchApi("/notifications/push/unsubscribe", {
            method: "POST",
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });
        }
        setIsSubscribed(false);
        await saveSettings({ ...settings, pushEnabled: false });
      } else {
        // Subscribe
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (!vapidKey) {
            console.error("VAPID public key not found");
            return;
          }
          const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
          
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });

          await fetchApi("/notifications/push/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
          });
          setIsSubscribed(true);
          await saveSettings({ ...settings, pushEnabled: true });
        } else {
          alert("Permission for notifications was denied.");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async (newSettings: typeof settings) => {
    try {
      setSaving(true);
      await fetchApi("/notifications/settings", {
        method: "PATCH",
        body: JSON.stringify(newSettings),
      });
      setSettings(newSettings);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    if (key === "pushEnabled") {
      togglePush();
    } else {
      saveSettings(newSettings);
    }
  };

  const handleTimeChange = (key: "quietHoursStart" | "quietHoursEnd", value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    // Debounce save or save on blur could be better, but we'll save on change for simplicity
    saveSettings(newSettings);
  };

  if (loading) {
    return <div className="p-8 text-[#0C4A6E]">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0C4A6E] tracking-tight">Notification Settings</h1>
        <p className="text-[#486581] mt-2 text-lg">Manage how and when you receive updates.</p>
      </div>

      <div className="space-y-6">
        {/* Push Notifications Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/40 shadow-xl shadow-[#0ea5e9]/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0C4A6E]">Push Notifications</h2>
              <p className="text-sm text-[#486581] mt-1 max-w-md">
                Receive browser alerts when a trip changes, a task is assigned, or a poll is created.
              </p>
            </div>
            <button
              disabled={saving}
              onClick={() => handleToggle("pushEnabled")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.pushEnabled ? "bg-[#0EA5E9]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quiet Hours Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/40 shadow-xl shadow-[#0ea5e9]/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0C4A6E]">Quiet Hours</h2>
              <p className="text-sm text-[#486581] mt-1 max-w-md">
                Mute push notifications during these hours. They will still appear in your inbox.
              </p>
            </div>
            <button
              disabled={saving}
              onClick={() => handleToggle("quietHoursEnabled")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.quietHoursEnabled ? "bg-[#f97316]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.quietHoursEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {settings.quietHoursEnabled && (
            <div className="flex items-center gap-6 p-4 bg-white/40 rounded-2xl border border-white/60">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#829ab1] uppercase tracking-wider mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => handleTimeChange("quietHoursStart", e.target.value)}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-2 text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#829ab1] uppercase tracking-wider mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => handleTimeChange("quietHoursEnd", e.target.value)}
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-2 text-[#0C4A6E] focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Daily Digest Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/40 shadow-xl shadow-[#0ea5e9]/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0C4A6E]">Daily Digest</h2>
              <p className="text-sm text-[#486581] mt-1 max-w-md">
                Get a single summary of missed notifications each day.
              </p>
            </div>
            <button
              disabled={saving}
              onClick={() => handleToggle("dailyDigest")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.dailyDigest ? "bg-[#8B5CF6]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  settings.dailyDigest ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

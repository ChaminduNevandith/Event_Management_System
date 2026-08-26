"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";

export function ProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    displayName: user?.displayName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    timezone: user?.timezone || "UTC",
    currency: user?.currency || "USD",
    language: user?.language || "en",
    measurementUnits: user?.measurementUnits || "metric",
    dateFormat: user?.dateFormat || "MM/DD/YYYY",
    avatarUrl: user?.avatarUrl || "",
    theme: user?.theme || "light",
    reducedMotion: user?.reducedMotion || false,
    travelInterests: user?.travelInterests?.join(", ") || "",
    travelPace: user?.travelPace || "",
    dietaryPreferences: user?.dietaryPreferences?.join(", ") || "",
    accessibilityPrefs: user?.accessibilityPrefs?.join(", ") || "",
    isPrivate: user?.isPrivate || false,
  });
  
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      const payload = {
        ...formData,
        travelInterests: formData.travelInterests ? formData.travelInterests.split(",").map((i: string) => i.trim()) : [],
        dietaryPreferences: formData.dietaryPreferences ? formData.dietaryPreferences.split(",").map((i: string) => i.trim()) : [],
        accessibilityPrefs: formData.accessibilityPrefs ? formData.accessibilityPrefs.split(",").map((i: string) => i.trim()) : [],
      };
      await fetchApi("/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setStatus("Profile updated successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Display Name</label>
          <input name="displayName" value={formData.displayName} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Username (Unique)</label>
          <input name="username" value={formData.username} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Short Biography</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full rounded-xl border border-white/50 bg-white/70 p-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Avatar URL</label>
          <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Timezone</label>
          <input name="timezone" value={formData.timezone} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Currency</label>
          <input name="currency" value={formData.currency} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Language</label>
          <input name="language" value={formData.language} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Measurement Units</label>
          <select name="measurementUnits" value={formData.measurementUnits} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all">
            <option value="metric">Metric (km, kg, °C)</option>
            <option value="imperial">Imperial (mi, lb, °F)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Date Format</label>
          <select name="dateFormat" value={formData.dateFormat} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Theme</label>
          <select name="theme" value={formData.theme} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Travel Pace</label>
          <select name="travelPace" value={formData.travelPace} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all">
            <option value="">Select pace...</option>
            <option value="relaxed">Relaxed</option>
            <option value="moderate">Moderate</option>
            <option value="fast">Fast-paced</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Travel Interests (comma separated)</label>
          <input name="travelInterests" value={formData.travelInterests} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" placeholder="e.g. Hiking, Museums, Food" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Dietary Preferences (comma separated)</label>
          <input name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" placeholder="e.g. Vegan, Gluten-Free" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Accessibility Needs (comma separated)</label>
          <input name="accessibilityPrefs" value={formData.accessibilityPrefs} onChange={handleChange} className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="reducedMotion" checked={formData.reducedMotion} onChange={handleChange} className="h-5 w-5 rounded border-white/50 text-[#10B981] focus:ring-[#10B981]/50" />
          <label className="text-sm font-medium text-[#0C4A6E]">Prefer Reduced Motion</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="isPrivate" checked={formData.isPrivate} onChange={handleChange} className="h-5 w-5 rounded border-white/50 text-[#10B981] focus:ring-[#10B981]/50" />
          <label className="text-sm font-medium text-[#0C4A6E]">Private Profile</label>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-white/50">
        <button type="submit" className="h-12 px-8 rounded-xl bg-[#0C4A6E] text-white font-semibold shadow-md hover:bg-[#07324B] transition-all">
          Save Changes
        </button>
        {status && <span className={`text-sm font-medium ${status.includes("Error") ? "text-red-500" : "text-[#10B981]"}`}>{status}</span>}
      </div>
    </form>
  );
}

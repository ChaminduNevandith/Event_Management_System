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
  });
  
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await fetchApi("/users/me", {
        method: "PATCH",
        body: JSON.stringify(formData),
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

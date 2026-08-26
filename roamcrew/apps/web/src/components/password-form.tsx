"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";

export function PasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus("Error: New passwords do not match.");
      return;
    }
    
    setStatus("Saving...");
    try {
      await fetchApi("/users/me/password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });
      setStatus("Password updated successfully!");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Current Password</label>
          <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">New Password</label>
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0C4A6E] mb-1">Confirm New Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full h-12 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 outline-none transition-all" />
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-white/50">
        <button type="submit" className="h-12 px-8 rounded-xl bg-red-500/90 text-white font-semibold shadow-md hover:bg-red-600 transition-all">
          Change Password
        </button>
        {status && <span className={`text-sm font-medium ${status.includes("Error") ? "text-red-500" : "text-[#10B981]"}`}>{status}</span>}
      </div>
    </form>
  );
}

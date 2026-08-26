"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { ProfileForm } from "@/components/profile-form";
import { PasswordForm } from "@/components/password-form";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchApi("/users/me");
        setUser(data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return <div className="p-8 text-[#0C4A6E]/70 font-medium">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8 text-red-500 font-medium">Failed to load user profile.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0C4A6E] tracking-tight">Account Settings</h1>
        <p className="text-[#0C4A6E]/70 mt-1">Manage your profile, preferences, and security.</p>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 md:p-8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-bold text-[#0C4A6E] mb-6">Public Profile & Preferences</h2>
        <ProfileForm user={user} />
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 md:p-8 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
        <h2 className="text-xl font-bold text-[#0C4A6E] mb-6">Security & Password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}

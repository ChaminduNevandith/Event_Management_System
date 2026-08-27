"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Users, LayoutDashboard, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchApi("/admin/stats");
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] tracking-tight">Platform Overview</h1>
        <p className="text-[#0C4A6E]/60 mt-2 text-sm md:text-base max-w-2xl">
          Monitor RoamCrew activity, manage users, and view platform statistics.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0C4A6E]">Total Users</h3>
            </div>
            <p className="text-4xl font-extrabold text-[#0C4A6E] mt-4">{stats?.totalUsers}</p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0C4A6E]">Total Trips</h3>
            </div>
            <p className="text-4xl font-extrabold text-[#0C4A6E] mt-4">{stats?.totalTrips}</p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#0C4A6E]">Active Users</h3>
            </div>
            <p className="text-4xl font-extrabold text-[#0C4A6E] mt-4">{stats?.activeUsers}</p>
          </div>
        </div>
      )}
    </div>
  );
}

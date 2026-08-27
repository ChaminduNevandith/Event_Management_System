"use client";

import { useAuth } from "@/components/auth-provider";
import { LogOut, LayoutDashboard, Settings, Users, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NotificationsBell } from "@/components/notifications-bell";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/useConfirm";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const { confirm, ConfirmationModal } = useConfirm();

  const handleLogout = async () => {
    const isConfirmed = await confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      logout();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#F0F9FF] items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 md:col-span-3 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-[100dvh] bg-[#F0F9FF] text-[#0C4A6E]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#0EA5E9]/10 bg-white/50 backdrop-blur-md hidden md:flex flex-col relative z-20">
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#0EA5E9]/10">
          <Link href="/" className="flex items-center group">
            <div className="bg-white/80 p-1 rounded-xl shadow-sm shadow-[#0EA5E9]/10 transition-transform group-hover:scale-105 border border-[#0EA5E9]/20">
              <Image src="/icon-192x192.png" alt="RoamCrew Logo" width={28} height={28} className="rounded-lg" />
            </div>
            <span className="ml-3 font-bold text-xl tracking-tight text-[#0C4A6E]">RoamCrew</span>
          </Link>
          <NotificationsBell align="left" />
        </div>
        
        <div className="p-4 flex-1">
          <div className="space-y-1">
            <Link
              href="/trips"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                pathname.startsWith("/trips") 
                  ? "bg-[#0EA5E9] text-white font-bold shadow-md shadow-[#0EA5E9]/20" 
                  : "text-[#486581] hover:bg-white/80 hover:text-[#0C4A6E] font-medium"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/friends"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                pathname.startsWith("/friends") 
                  ? "bg-[#0EA5E9] text-white font-bold shadow-md shadow-[#0EA5E9]/20" 
                  : "text-[#486581] hover:bg-white/80 hover:text-[#0C4A6E] font-medium"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Friends</span>
            </Link>
            <Link
              href="/calendar"
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                pathname.startsWith("/calendar") 
                  ? "bg-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/20" 
                  : "text-[#486581] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                pathname.startsWith("/settings") 
                  ? "bg-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/20" 
                  : "text-[#486581] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-[#0EA5E9]/10">
          <div className="flex items-center justify-between px-4 py-3 bg-white/60 rounded-xl border border-white">
            <div className="flex items-center space-x-3 truncate">
              <div className="h-8 w-8 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] font-bold text-sm shrink-0">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <span className="text-sm font-bold truncate">{user.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#829ab1] hover:text-[#fa3c1b] transition-colors p-1 rounded-md hover:bg-[#fa3c1b]/10"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-[#0EA5E9]/10 bg-white/50 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-20">
          <Link href="/" className="flex items-center">
            <div className="bg-white/80 p-0.5 rounded-lg shadow-sm shadow-[#0EA5E9]/10 border border-[#0EA5E9]/20 mr-2">
              <Image src="/icon-192x192.png" alt="RoamCrew Logo" width={24} height={24} className="rounded-md" />
            </div>
            <span className="font-bold text-lg text-[#0C4A6E]">RoamCrew</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <button onClick={handleLogout} className="p-2 text-[#829ab1] hover:text-[#fa3c1b]">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-12 relative overflow-hidden">
          {/* Subtle background glow for main area */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0EA5E9]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
      <ConfirmationModal />
    </div>
  );
}

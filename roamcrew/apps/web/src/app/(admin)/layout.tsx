"use client";

import { useAuth } from "@/components/auth-provider";
import { LogOut, ShieldAlert, Settings, Users, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/useConfirm";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { confirm, ConfirmationModal } = useConfirm();

  const handleLogout = async () => {
    const isConfirmed = await confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      logout();
    }
  };

  useEffect(() => {
    if (!isLoading && user && user.role !== "ADMIN") {
      router.push("/trips");
    }
  }, [user, isLoading, router]);

  if (isLoading || (user && user.role !== "ADMIN")) {
    return (
      <div className="flex min-h-screen bg-[#F0F9FF] items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 md:col-span-3 rounded-3xl" />
          </div>
        </div>
      <ConfirmationModal />
    </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-[100dvh] bg-[#F0F9FF] text-[#0C4A6E]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#0EA5E9]/10 bg-white/50 backdrop-blur-md hidden md:flex flex-col relative z-20">
        <div className="h-20 flex items-center justify-between px-6 border-b border-[#0EA5E9]/10">
          <Link href="/admin" className="flex items-center group">
            <div className="bg-red-50 p-1 rounded-xl shadow-sm shadow-red-500/10 transition-transform group-hover:scale-105 border border-red-200">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <span className="ml-3 font-bold text-xl tracking-tight text-[#0C4A6E]">Admin</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <div className="space-y-1">
            <Link
              href="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                pathname === "/admin" 
                  ? "bg-red-500 text-white font-bold shadow-md shadow-red-500/20" 
                  : "text-[#486581] hover:bg-white/80 hover:text-[#0C4A6E] font-medium"
              }`}
            >
              <Activity className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                pathname.startsWith("/admin/users") 
                  ? "bg-red-500 text-white font-bold shadow-md shadow-red-500/20" 
                  : "text-[#486581] hover:bg-white/80 hover:text-[#0C4A6E] font-medium"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </div>
        </div>
        
        <div className="p-4 border-t border-[#0EA5E9]/10">
          <div className="flex items-center justify-between bg-white/70 p-3 rounded-2xl shadow-sm shadow-[#0EA5E9]/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold overflow-hidden shadow-sm">
                {user.avatarUrl ? <Image src={user.avatarUrl} alt="Avatar" width={40} height={40} className="object-cover w-full h-full" /> : (user.firstName?.[0] || 'A')}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold truncate max-w-[100px] leading-tight text-[#0C4A6E]">{user.firstName}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-500">Admin</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#486581] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex justify-center">
             <Link href="/trips" className="text-xs font-semibold text-[#0EA5E9] hover:underline flex items-center gap-1">
               &larr; Back to App
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-[100dvh] max-h-[100dvh] overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-[#0EA5E9]/10 bg-white/50 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center">
             <ShieldAlert className="w-6 h-6 text-red-500" />
            <span className="ml-2 font-bold text-lg text-[#0C4A6E]">Admin</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-[#486581] hover:text-red-500">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

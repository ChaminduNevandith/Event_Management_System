"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ArrowRight, Map, Compass, Users, Wallet } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F0F9FF] text-[#0C4A6E]">
      <header className="px-6 lg:px-12 h-20 flex items-center bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 transition-all duration-300">
        <Link className="flex items-center justify-center group" href="/">
          <div className="bg-[#0EA5E9] p-2 rounded-xl group-hover:bg-[#38BDF8] transition-colors shadow-sm shadow-[#0EA5E9]/20">
            <Map className="h-5 w-5 text-white" />
          </div>
          <span className="ml-3 font-bold text-xl tracking-tight text-[#0C4A6E]">RoamCrew</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          {user ? (
            <Link className="text-sm font-semibold hover:text-[#0EA5E9] transition-colors" href="/trips">
              Dashboard
            </Link>
          ) : (
            <>
              <Link className="text-sm font-semibold hover:text-[#0EA5E9] transition-colors" href="/login">
                Log in
              </Link>
              <Link className="text-sm font-semibold bg-[#F97316] text-white px-5 py-2.5 rounded-full hover:bg-[#ea580c] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5" href="/register">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background gradient effects (Glassmorphism Light Source) */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#38BDF8]/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#F97316]/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Hero Section */}
        <div className="flex-1 container px-4 md:px-6 relative z-10 flex flex-col items-center justify-center py-24 lg:py-32">
          
          <div className="inline-flex items-center rounded-full border border-white/60 bg-white/40 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-[#0EA5E9] mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#F97316] mr-2 animate-pulse"></span>
            The Group Trip Operating System
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl text-center leading-[1.1]">
            Plan trips, <span className="relative inline-block"><span className="relative z-10 text-[#0EA5E9]">split expenses</span><div className="absolute bottom-2 left-0 w-full h-3 bg-[#38BDF8]/20 -z-10 -rotate-1"></div></span>, and coordinate.
          </h1>
          
          <p className="mx-auto max-w-2xl text-[#486581] md:text-xl text-center mt-8 leading-relaxed">
            Stop juggling spreadsheets, chat groups, and shared notes. RoamCrew brings your entire group's travel plans into one beautiful, collaborative dashboard.
          </p>
          
          <div className="space-x-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href="/trips"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#0EA5E9] px-8 text-base font-bold text-white shadow-lg shadow-[#0EA5E9]/25 transition-all hover:bg-[#0284c7] hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2"
              >
                Open Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[#F97316] px-8 text-base font-bold text-white shadow-lg shadow-[#F97316]/25 transition-all hover:bg-[#ea580c] hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2"
                >
                  Start Planning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-14 items-center justify-center rounded-full border-2 border-[#0EA5E9]/20 bg-white/50 backdrop-blur-md px-8 text-base font-bold text-[#0C4A6E] shadow-sm transition-all hover:bg-white/80 hover:border-[#0EA5E9]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] focus-visible:ring-offset-2"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
          
          {/* Glassmorphism Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl relative">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-3xl -m-6 border border-white/40 -z-10 shadow-2xl shadow-[#102a43]/5"></div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/40 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center mb-4 text-[#0EA5E9]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0C4A6E]">Visual Itineraries</h3>
              <p className="text-[#486581] mt-2 text-sm">Build beautiful timelines and visualize your journey day by day.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/40 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-[#F97316]/10 flex items-center justify-center mb-4 text-[#F97316]">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0C4A6E]">Expense Splitting</h3>
              <p className="text-[#486581] mt-2 text-sm">Track group budgets, log who paid for what, and settle up easily.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-white/40 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-[#38BDF8]/10 flex items-center justify-center mb-4 text-[#38BDF8]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0C4A6E]">Real-time Collaboration</h3>
              <p className="text-[#486581] mt-2 text-sm">Vote on destinations and plan together with live updates.</p>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="flex flex-col items-center justify-center py-8 w-full shrink-0 border-t border-[#0EA5E9]/10 bg-white/30 backdrop-blur-md">
        <p className="text-sm font-medium text-[#627d98]">© 2026 RoamCrew. All rights reserved.</p>
      </footer>
    </div>
  );
}

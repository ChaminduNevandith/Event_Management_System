"use client";

import { useState } from "react";
import { ChevronDown, Map, Users, Calendar, Wallet, Image as ImageIcon, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const guides = [
  {
    id: "trips",
    icon: Calendar,
    color: "text-[#0EA5E9]",
    bg: "bg-[#0EA5E9]/10",
    title: "Planning & Smart Itinerary",
    content: "Start by creating a new trip from the Dashboard. You can add places you want to visit without worrying about the order. Once you're ready, click 'Auto-Schedule' in the Itinerary tab. Our Smart Auto-Scheduler uses geographical clustering to group nearby places into logical days, saving you hours of planning time."
  },
  {
    id: "crew",
    icon: Users,
    color: "text-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10",
    title: "The Crew & Guest Mode",
    content: "Traveling is better together! Go to the 'Friends' tab or use the 'Invite Someone' button inside a trip to add members. Want to share your plans with parents or friends who aren't on RoamCrew? Click 'Share Link' in the trip overview to generate a frictionless 'Guest Mode' link they can view without logging in."
  },
  {
    id: "map",
    icon: Map,
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
    title: "Live Map & Location Broadcasting",
    content: "The Map tab provides an interactive overview of all your destinations and accommodations. During the trip, you can enable 'Live Location' to broadcast where you are to the rest of the crew in real-time. It’s perfect for finding each other in crowded cities or at festivals."
  },
  {
    id: "budget",
    icon: Wallet,
    color: "text-[#F97316]",
    bg: "bg-[#F97316]/10",
    title: "Expense Splitting",
    content: "Log every expense in the Budget tab. Simply enter the amount, select who paid, and who the expense was split among. RoamCrew automatically calculates the debts and generates a simplified 'Ledger' showing exactly who owes who, minimizing the math at the end of the trip."
  },
  {
    id: "recap",
    icon: ImageIcon,
    color: "text-[#F43F5E]",
    bg: "bg-[#F43F5E]/10",
    title: "Post-Trip Recap Export",
    content: "When the adventure is over, head to the 'Export' tab. RoamCrew will automatically generate a stunning visual summary of your journey complete with destinations visited, members, and a map that you can download as a high-resolution image to share on social media."
  },
  {
    id: "social",
    icon: Share2,
    color: "text-[#38BDF8]",
    bg: "bg-[#38BDF8]/10",
    title: "Rich Social Previews",
    content: "When you share your RoamCrew trip links on iMessage, WhatsApp, or Twitter, they will automatically render a beautiful, dynamic preview image showing the trip title, dates, and number of members, giving your friends a sneak peek before they even click."
  }
];

export default function GuidePage() {
  const [openSection, setOpenSection] = useState<string | null>("trips");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/60 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#0C4A6E] tracking-tight font-serif mb-4">
            How to use RoamCrew
          </h1>
          <p className="text-[#486581] text-lg max-w-2xl">
            Welcome to the ultimate group travel planner. Read this guide to master our most powerful features and make your next adventure unforgettable.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => (
          <div 
            key={guide.id}
            className={`bg-white/60 backdrop-blur-md border transition-all duration-300 rounded-2xl overflow-hidden ${
              openSection === guide.id 
                ? "border-[#0EA5E9]/30 shadow-md" 
                : "border-white/50 hover:border-[#0EA5E9]/20 shadow-sm"
            }`}
          >
            <button
              onClick={() => setOpenSection(openSection === guide.id ? null : guide.id)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${guide.bg}`}>
                  <guide.icon className={`w-6 h-6 ${guide.color}`} />
                </div>
                <h3 className="text-xl font-bold text-[#0C4A6E] font-serif tracking-tight">
                  {guide.title}
                </h3>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-[#627d98] transition-transform duration-300 ${
                  openSection === guide.id ? "rotate-180" : ""
                }`} 
              />
            </button>
            
            <AnimatePresence>
              {openSection === guide.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 pt-0 ml-16">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/10 to-transparent mb-6"></div>
                    <p className="text-[#486581] leading-relaxed text-lg">
                      {guide.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-3xl text-white shadow-lg shadow-[#0EA5E9]/20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black font-serif tracking-tight mb-2">Ready to explore?</h2>
          <p className="text-white/90 mb-6 font-medium">Create your first trip or invite your friends to start planning together.</p>
        </div>
      </div>
    </div>
  );
}

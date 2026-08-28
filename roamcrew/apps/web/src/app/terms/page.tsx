"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText, Users, RefreshCcw } from "lucide-react";
import { motion, Variants } from "framer-motion";

const terms = [
  {
    id: 1,
    title: "1. Acceptance of Terms",
    content: "By accessing and using RoamCrew, you accept and agree to be bound by the terms and provision of this agreement. Our platform is designed to make group travel planning seamless, and these terms ensure a safe environment for all our users.",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "2. Description of Service",
    content: "RoamCrew provides users with a luxury platform to plan trips, organize daily itineraries, manage shared budgets, and collaborate with travel companions in real-time. We continually innovate to bring you the best travel planning experience.",
    icon: FileText,
  },
  {
    id: 3,
    title: "3. User Conduct",
    content: "You agree to use our services only for lawful purposes. You must not use our platform in a way that infringes the rights of, restricts, or inhibits anyone else's use and enjoyment of the website. Respect your crew and the broader community.",
    icon: Users,
  },
  {
    id: 4,
    title: "4. Intellectual Property",
    content: "All content, design, and architecture on RoamCrew—including the Aurora UI, text, graphics, logos, and software—is the property of RoamCrew and protected by international copyright laws.",
    icon: Scale,
  },
  {
    id: 5,
    title: "5. Modifications to Terms",
    content: "RoamCrew reserves the right to change or modify these terms at any time without prior notice. Your continued use of the platform after any changes indicates your acceptance of the new terms. We recommend reviewing this page periodically.",
    icon: RefreshCcw,
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-aurora flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl -z-10"></div>
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0EA5E9]/20 blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#F97316]/20 blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <main className="flex-1 flex flex-col items-center pt-24 pb-24 px-6 z-10 w-full">
        <div className="w-full max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center text-[#0EA5E9] font-bold px-4 py-2 bg-white/40 backdrop-blur-md border border-white/50 rounded-full hover:bg-white/60 hover:shadow-md transition-all">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black text-[#0C4A6E] tracking-tighter font-serif mb-4 drop-shadow-sm">
              Terms & Conditions
            </h1>
            <p className="text-lg text-[#486581] font-medium max-w-2xl mx-auto">
              Please read these terms carefully before using RoamCrew. <br/>
              <span className="text-[#0EA5E9] font-bold">Last updated: August 28, 2026</span>
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {terms.map((term) => (
              <motion.div 
                key={term.id}
                variants={itemVariants}
                className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/80 shadow-lg shadow-[#102a43]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                  <term.icon className="w-48 h-48 text-[#0EA5E9]" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white shadow-md">
                      <term.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight">{term.title}</h2>
                  </div>
                  <p className="text-[#486581] leading-relaxed text-lg pl-16">
                    {term.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-[#627d98] font-medium bg-white/30 inline-block px-6 py-3 rounded-full border border-white/40">
              Questions about our terms? <a href="mailto:legal@roamcrew.example.com" className="text-[#0EA5E9] font-bold hover:underline">Contact Legal</a>
            </p>
          </motion.div>
        </div>
      </main>
      
      <footer className="flex flex-col md:flex-row items-center justify-between py-8 px-8 w-full shrink-0 border-t border-[#0EA5E9]/10 bg-white/30 backdrop-blur-md z-10">
        <p className="text-sm font-medium text-[#627d98]">© 2026 RoamCrew. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/terms" className="text-sm font-bold text-[#0EA5E9]">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-[#627d98] hover:text-[#0C4A6E] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

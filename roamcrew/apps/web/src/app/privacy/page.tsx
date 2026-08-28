"use client";

import Link from "next/link";
import { ArrowLeft, Eye, Lock, Share2, Database, Mail } from "lucide-react";
import { motion, Variants } from "framer-motion";

const privacyPolicies = [
  {
    id: 1,
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us, such as when you create an account, plan a trip, or interact with other users on the platform. This includes profile details, itineraries, and shared budgets.",
    icon: Database,
    color: "from-[#F97316] to-[#FB923C]"
  },
  {
    id: 2,
    title: "2. How We Use Your Information",
    content: "We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about your trips, account updates, and new features to enhance your travel planning.",
    icon: Eye,
    color: "from-[#0EA5E9] to-[#38BDF8]"
  },
  {
    id: 3,
    title: "3. Information Sharing",
    content: "We do not sell your personal information. We only share data with third parties when necessary to provide our services (e.g., hosting providers) or with your explicit consent when inviting others to collaborate.",
    icon: Share2,
    color: "from-[#8B5CF6] to-[#A78BFA]"
  },
  {
    id: 4,
    title: "4. Data Security",
    content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. We utilize industry-standard encryption for data at rest and in transit.",
    icon: Lock,
    color: "from-[#10B981] to-[#34D399]"
  },
  {
    id: 5,
    title: "5. Contact Us",
    content: "If you have any questions about this Privacy Policy, your rights, or how your data is handled, please contact our privacy team. We are committed to transparency.",
    icon: Mail,
    color: "from-[#F43F5E] to-[#FB7185]"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-aurora flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl -z-10"></div>
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/20 blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#10B981]/20 blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      
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
              Privacy Policy
            </h1>
            <p className="text-lg text-[#486581] font-medium max-w-2xl mx-auto">
              Your privacy is our priority. Learn how we handle your data to keep your crew safe. <br/>
              <span className="text-[#0EA5E9] font-bold">Last updated: August 28, 2026</span>
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Make the first card span full width as an intro */}
            {privacyPolicies.map((policy, index) => (
              <motion.div 
                key={policy.id}
                variants={itemVariants}
                className={`bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/80 shadow-lg shadow-[#102a43]/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${index === 0 ? 'md:col-span-2 md:p-10' : ''}`}
              >
                <div className="absolute -bottom-8 -right-8 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500 pointer-events-none">
                  <policy.icon className="w-48 h-48 text-slate-400" />
                </div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${policy.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                      <policy.icon className="w-7 h-7" />
                    </div>
                    <h2 className={`font-bold text-[#0C4A6E] font-serif tracking-tight ${index === 0 ? 'text-3xl' : 'text-2xl'}`}>
                      {policy.title}
                    </h2>
                  </div>
                  <p className="text-[#486581] leading-relaxed text-lg flex-1">
                    {policy.content}
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
              Need more details? <a href="mailto:privacy@roamcrew.example.com" className="text-[#0EA5E9] font-bold hover:underline">Contact Data Protection Officer</a>
            </p>
          </motion.div>
        </div>
      </main>
      
      <footer className="flex flex-col md:flex-row items-center justify-between py-8 px-8 w-full shrink-0 border-t border-[#0EA5E9]/10 bg-white/30 backdrop-blur-md z-10">
        <p className="text-sm font-medium text-[#627d98]">© 2026 RoamCrew. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/terms" className="text-sm font-medium text-[#627d98] hover:text-[#0C4A6E] transition-colors">
            Terms & Conditions
          </Link>
          <Link href="/privacy" className="text-sm font-bold text-[#0EA5E9]">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}

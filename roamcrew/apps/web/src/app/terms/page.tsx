import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-aurora flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10"></div>
      
      <main className="flex-1 flex flex-col items-center pt-20 pb-20 px-6 z-10 w-full">
        <div className="w-full max-w-4xl text-left">
          <Link href="/" className="inline-flex items-center text-[#0EA5E9] font-bold mb-8 hover:text-[#0284C7] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#0C4A6E] tracking-tight font-serif mb-6">Terms & Conditions</h1>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/80 shadow-xl text-[#486581] space-y-6 prose max-w-none">
            <p className="text-lg">Last updated: August 28, 2026</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">1. Acceptance of Terms</h2>
            <p>By accessing and using RoamCrew, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">2. Description of Service</h2>
            <p>RoamCrew provides users with a platform to plan trips, organize itineraries, manage budgets, and collaborate with travel companions.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">3. User Conduct</h2>
            <p>You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">4. Privacy Policy</h2>
            <p>Your privacy is very important to us. Please review our Privacy Policy, which also governs your visit to our site, to understand our practices.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">5. Modifications</h2>
            <p>RoamCrew reserves the right to change or modify these terms at any time without prior notice. Your continued use of the platform after any changes indicates your acceptance of the new terms.</p>
          </div>
        </div>
      </main>
      
      <footer className="flex flex-col items-center justify-center py-8 w-full shrink-0 border-t border-[#0EA5E9]/10 bg-white/30 backdrop-blur-md z-10">
        <p className="text-sm font-medium text-[#627d98]">© 2026 RoamCrew. All rights reserved.</p>
      </footer>
    </div>
  );
}

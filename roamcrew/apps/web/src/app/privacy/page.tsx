import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-aurora flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10"></div>
      
      <main className="flex-1 flex flex-col items-center pt-20 pb-20 px-6 z-10 w-full">
        <div className="w-full max-w-4xl text-left">
          <Link href="/" className="inline-flex items-center text-[#0EA5E9] font-bold mb-8 hover:text-[#0284C7] transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black text-[#0C4A6E] tracking-tight font-serif mb-6">Privacy Policy</h1>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/80 shadow-xl text-[#486581] space-y-6 prose max-w-none">
            <p className="text-lg">Last updated: August 28, 2026</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, plan a trip, or interact with other users on the platform.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about your trips and account.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">3. Information Sharing</h2>
            <p>We do not share your personal information with third parties except as described in this privacy policy or with your consent (e.g., when you invite others to collaborate on a trip).</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
            
            <h2 className="text-2xl font-bold text-[#0C4A6E] font-serif tracking-tight mt-8">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@roamcrew.example.com.</p>
          </div>
        </div>
      </main>
      
      <footer className="flex flex-col items-center justify-center py-8 w-full shrink-0 border-t border-[#0EA5E9]/10 bg-white/30 backdrop-blur-md z-10">
        <p className="text-sm font-medium text-[#627d98]">© 2026 RoamCrew. All rights reserved.</p>
      </footer>
    </div>
  );
}

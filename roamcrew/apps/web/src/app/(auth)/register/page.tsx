"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      login(response.access_token, response.user);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 bg-[#F0F9FF] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0EA5E9]/15 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F97316]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-[#486581] hover:text-[#0EA5E9] transition-colors z-20">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>

      <div className="w-full max-w-[480px] relative z-10 py-12">
        <div className="flex justify-center mb-8">
          <div className="bg-[#F97316] p-3 rounded-2xl shadow-lg shadow-[#F97316]/20">
            <Map className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="space-y-8 rounded-3xl bg-white/60 backdrop-blur-xl p-10 shadow-2xl shadow-[#102a43]/5 border border-white/60">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0C4A6E]">Join RoamCrew</h2>
            <p className="mt-3 text-[#486581]">Start planning your next adventure today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-[#fa3c1b]/10 p-4 text-sm font-medium text-[#da2405] border border-[#fa3c1b]/20">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#243b53]" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    required
                    className="h-12 w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#243b53]" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    required
                    className="h-12 w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#243b53]" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="h-12 w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#243b53]" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  className="h-12 w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl bg-[#F97316] px-4 py-2 text-sm font-bold text-white shadow-md shadow-[#F97316]/20 transition-all hover:bg-[#ea580c] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-4"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#486581]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#F97316] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

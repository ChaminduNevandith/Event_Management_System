"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import {  Plane, Calendar, Users, ArrowRight  } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { use } from "react";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  const { user } = useAuth();
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadInvite = async () => {
      try {
        const data = await fetchApi(`/invitations/${token}`);
        setInvite(data);
        setStatus("ready");
      } catch (err: any) {
        setError(err.message);
        setStatus("error");
      }
    };
    loadInvite();
  }, [token]);

  const handleAccept = async () => {
    if (!user) {
      // Save intent to session storage and redirect to login
      sessionStorage.setItem("pendingInviteToken", token);
      router.push("/login?redirect=/invite/" + token);
      return;
    }

    try {
      setStatus("accepting");
      await fetchApi(`/invitations/${token}/accept`, { method: "POST" });
      router.push(`/trips/${invite.tripId}`);
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] flex items-center justify-center">
        <div className="space-y-6 w-full mt-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl hidden md:block" />
          <Skeleton className="h-48 rounded-3xl hidden lg:block" />
        </div>
      </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] flex flex-col items-center justify-center p-4">
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#0C4A6E] mb-2">Invitation Invalid</h1>
          <p className="text-[#0C4A6E]/70 mb-8">{error}</p>
          <Link href="/" className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0EA5E9] px-8 text-sm font-semibold text-white shadow-lg hover:bg-[#0284C7] transition-all">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#38BDF8]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden">
          {invite.trip.coverImageUrl ? (
            <div className="h-48 w-full bg-gray-200">
              <img src={invite.trip.coverImageUrl} className="w-full h-full object-cover" alt="Trip cover" />
            </div>
          ) : (
            <div className="h-32 w-full bg-gradient-to-r from-[#0EA5E9] to-[#10B981] flex items-center justify-center">
              <Plane className="w-12 h-12 text-white/50" />
            </div>
          )}

          <div className="p-8 text-center">
            <div className="flex justify-center -mt-16 mb-4 relative z-20">
              <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-[#F0F9FF] flex items-center justify-center text-xl font-bold text-[#0EA5E9]">
                  {invite.inviter.avatarUrl ? (
                    <img src={invite.inviter.avatarUrl} className="w-full h-full rounded-full object-cover" alt="Avatar"/>
                  ) : (
                    invite.inviter.firstName[0]
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-medium text-[#0C4A6E]/70 mb-1">
              <span className="font-bold text-[#0C4A6E]">{invite.inviter.firstName} {invite.inviter.lastName}</span> invited you to a trip
            </h2>
            <h1 className="text-3xl font-bold text-[#0EA5E9] mb-6">{invite.trip.title}</h1>

            <div className="flex justify-center gap-6 mb-8 text-sm text-[#0C4A6E]/80">
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 text-[#F59E0B]" />
                {invite.trip.startDate ? new Date(invite.trip.startDate).toLocaleDateString() : 'Dates TBD'}
              </div>
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4 text-[#10B981]" />
                Join as {invite.role.charAt(0) + invite.role.slice(1).toLowerCase()}
              </div>
            </div>

            <button
              onClick={handleAccept}
              disabled={status === 'accepting'}
              className="w-full h-14 rounded-2xl bg-[#0EA5E9] text-white text-lg font-bold shadow-lg hover:bg-[#0284C7] transition-all flex items-center justify-center gap-2"
            >
              {status === 'accepting' ? 'Accepting...' : 'Accept Invitation'}
              {status !== 'accepting' && <ArrowRight className="w-5 h-5" />}
            </button>
            
            {!user && (
              <p className="text-xs text-[#0C4A6E]/60 mt-4">
                You will be asked to sign in or create an account to join the trip.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple fallback icon for error state if lucide doesn't have it imported above
function XCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  );
}

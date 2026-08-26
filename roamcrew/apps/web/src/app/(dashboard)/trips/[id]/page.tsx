"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Users, Plus, Edit, Settings } from "lucide-react";
import { format } from "date-fns";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddingDest, setIsAddingDest] = useState(false);
  const [destName, setDestName] = useState("");
  const [isSubmittingDest, setIsSubmittingDest] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      try {
        const data = await fetchApi(`/trips/${params.id}`);
        setTrip(data);
      } catch (err: any) {
        setError(err.message || "Failed to load trip.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTrip();
  }, [params.id]);

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName) return;
    setIsSubmittingDest(true);

    try {
      const newDest = await fetchApi(`/trips/${params.id}/destinations`, {
        method: "POST",
        body: JSON.stringify({ name: destName }),
      });
      // Update local state
      setTrip((prev: any) => ({
        ...prev,
        destinations: [...(prev.destinations || []), newDest],
      }));
      setDestName("");
      setIsAddingDest(false);
    } catch (err: any) {
      alert(err.message || "Failed to add destination");
    } finally {
      setIsSubmittingDest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl shadow-[#102a43]/5 max-w-2xl mx-auto mt-10">
        <h2 className="text-3xl font-extrabold text-[#0C4A6E]">Oops!</h2>
        <p className="text-[#486581] mt-3 text-lg">{error || "Trip not found"}</p>
        <button onClick={() => router.push("/trips")} className="mt-8 text-white font-bold bg-[#0EA5E9] hover:bg-[#0284c7] px-8 py-3 rounded-xl transition-colors shadow-md">
          Return to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="relative">
        <Link href="/trips" className="inline-flex items-center text-sm font-bold text-[#486581] hover:text-[#0EA5E9] mb-6 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to trips
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="rounded-full bg-[#0EA5E9]/15 px-4 py-1.5 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider border border-[#0EA5E9]/20 shadow-sm">
                {trip.status}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0C4A6E] leading-tight">
              {trip.title}
            </h1>
            {trip.description && (
              <p className="text-[#486581] mt-4 max-w-3xl text-lg leading-relaxed">{trip.description}</p>
            )}
          </div>
          <button className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 backdrop-blur-md px-6 text-sm font-bold text-[#0C4A6E] shadow-sm transition-all hover:bg-white/80 hover:border-[#0EA5E9]/40 hover:-translate-y-0.5 shrink-0">
            <Settings className="mr-2 h-4 w-4" />
            Manage Trip
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#0EA5E9]/10">
          {trip.startDate && (
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white shadow-sm font-bold text-[#0C4A6E]">
              <Calendar className="mr-2 h-5 w-5 text-[#F97316]" />
              {format(new Date(trip.startDate), "MMMM d, yyyy")}
              {trip.endDate && ` - ${format(new Date(trip.endDate), "MMMM d, yyyy")}`}
            </div>
          )}
          <div className="flex items-center bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white shadow-sm font-bold text-[#0C4A6E]">
            <Users className="mr-2 h-5 w-5 text-[#38BDF8]" />
            {trip.members.length} Crew Member{trip.members.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
        {/* Main Content (Itinerary) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0C4A6E] flex items-center ml-2">
              <MapPin className="mr-2 h-6 w-6 text-[#0EA5E9]" /> Itinerary
            </h2>
            {!isAddingDest && (
              <button 
                onClick={() => setIsAddingDest(true)}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0EA5E9] px-4 text-sm font-bold text-white shadow-md shadow-[#0EA5E9]/20 transition-all hover:bg-[#0284c7] hover:-translate-y-0.5"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Stop
              </button>
            )}
          </div>

          {isAddingDest && (
            <form onSubmit={handleAddDestination} className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-end shadow-lg animate-in fade-in zoom-in-95 duration-200">
              <div className="flex-1 w-full space-y-2">
                <label className="text-sm font-bold text-[#243b53]" htmlFor="destName">
                  Where to?
                </label>
                <input
                  id="destName"
                  required
                  autoFocus
                  placeholder="e.g. Kyoto, Japan"
                  className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-sm px-4 py-2 text-base text-[#0C4A6E] font-medium placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition-all shadow-sm"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                />
              </div>
              <div className="flex space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setIsAddingDest(false)}
                  className="h-12 flex-1 sm:flex-none px-6 rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 text-sm font-bold text-[#0C4A6E] hover:bg-white/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDest || !destName}
                  className="h-12 flex-1 sm:flex-none px-6 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold shadow-md shadow-[#0EA5E9]/20 hover:bg-[#0284c7] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmittingDest ? "Adding..." : "Add Stop"}
                </button>
              </div>
            </form>
          )}

          {trip.destinations?.length > 0 ? (
            <div className="space-y-6 pt-2">
              {trip.destinations.map((dest: any, index: number) => (
                <div key={dest.id} className="relative pl-10 group">
                  {/* Timeline connector */}
                  {index !== trip.destinations.length - 1 && (
                    <div className="absolute left-[15px] top-10 bottom-[-32px] w-1 bg-gradient-to-b from-[#0EA5E9] to-[#38BDF8]/30 rounded-full"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-3 h-8 w-8 rounded-full border-[6px] border-[#F0F9FF] bg-[#0EA5E9] shadow-md z-10 flex items-center justify-center transition-transform group-hover:scale-110"></div>
                  
                  <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#0EA5E9]/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h3 className="text-2xl font-extrabold text-[#0C4A6E]">
                        {dest.name}
                      </h3>
                      {dest.startDate ? (
                        <span className="text-sm font-bold bg-[#F97316]/10 text-[#F97316] px-4 py-1.5 rounded-full border border-[#F97316]/20">
                          {format(new Date(dest.startDate), "MMM d")}
                        </span>
                      ) : (
                        <span className="text-sm font-bold bg-white/50 text-[#829ab1] px-4 py-1.5 rounded-full border border-white">
                          Dates TBD
                        </span>
                      )}
                    </div>
                    
                    {/* Placeholder for activities */}
                    <div className="mt-6 p-6 rounded-2xl bg-white/40 border-2 border-dashed border-[#0EA5E9]/20 text-center text-sm font-medium text-[#486581] flex flex-col items-center justify-center">
                      <Plus className="h-8 w-8 text-[#0EA5E9]/40 mb-2" />
                      No activities planned yet.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isAddingDest && (
              <div className="rounded-3xl border-2 border-dashed border-[#0EA5E9]/20 bg-white/30 backdrop-blur-md p-16 text-center flex flex-col items-center shadow-sm">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <MapPin className="h-10 w-10 text-[#0EA5E9]/40" />
                </div>
                <h3 className="text-xl font-bold text-[#0C4A6E]">Your itinerary is empty</h3>
                <p className="text-[#486581] mt-2 max-w-sm">Add your first destination to start building out the schedule.</p>
              </div>
            )
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Members Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg shadow-[#102a43]/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/50 bg-white/40">
              <h3 className="font-extrabold text-xl text-[#0C4A6E] flex items-center">
                <Users className="mr-2 h-6 w-6 text-[#38BDF8]" />
                The Crew <span className="ml-2 bg-[#0EA5E9] text-white text-xs px-2 py-0.5 rounded-full">{trip.members.length}</span>
              </h3>
            </div>
            <div className="p-3">
              {trip.members.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 hover:bg-white/50 rounded-2xl transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                      {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-base text-[#0C4A6E]">{member.user.firstName} {member.user.lastName}</p>
                      <p className="text-xs font-bold text-[#F97316] mt-0.5 uppercase tracking-wide">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-white/50 bg-white/40">
              <button className="text-sm font-bold text-[#0EA5E9] hover:text-[#0284c7] w-full text-center py-2 bg-white rounded-xl shadow-sm border border-[#0EA5E9]/10 transition-colors">
                + Invite Someone
              </button>
            </div>
          </div>
          
          {/* Budget Summary Placeholder */}
          <div className="bg-gradient-to-br from-[#F97316] to-[#ea580c] rounded-3xl shadow-lg shadow-[#F97316]/20 overflow-hidden text-white p-6 relative">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <h3 className="font-extrabold text-xl mb-2 relative z-10">Trip Budget</h3>
            <p className="text-white/80 text-sm font-medium relative z-10">Expense tracking is disabled until destinations are finalized.</p>
            <button className="mt-4 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold w-full border border-white/20">
              Set up Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

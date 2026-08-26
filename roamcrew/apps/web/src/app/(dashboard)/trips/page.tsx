"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Plus, MapPin, Calendar, Users, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await fetchApi("/trips");
        setTrips(data);
      } catch (err: any) {
        setError("Failed to load trips.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTrips();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0C4A6E]">Your Trips</h1>
          <p className="text-[#486581] mt-2 text-lg">Manage and plan your upcoming adventures.</p>
        </div>
        <Link
          href="/trips/new"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0EA5E9] px-6 py-2 text-sm font-bold text-white shadow-md shadow-[#0EA5E9]/20 transition-all hover:bg-[#0284c7] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-2 shrink-0"
        >
          <Plus className="mr-2 h-5 w-5" />
          Plan New Trip
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-[#fa3c1b]/10 p-4 text-sm font-medium text-[#da2405] border border-[#fa3c1b]/20">
          {error}
        </div>
      )}

      {trips.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-16 text-center shadow-xl shadow-[#102a43]/5 mt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9]/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="bg-white p-5 rounded-full shadow-sm mb-6 border border-white">
            <MapPin className="h-12 w-12 text-[#38BDF8]" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#0C4A6E]">No trips planned yet</h3>
          <p className="text-[#486581] mt-3 mb-8 max-w-md text-lg leading-relaxed">
            You don't have any upcoming trips. Create your first itinerary to start collaborating with friends!
          </p>
          <Link
            href="/trips/new"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-[#F97316] px-8 text-base font-bold text-white shadow-lg shadow-[#F97316]/20 transition-all hover:bg-[#ea580c] hover:-translate-y-1"
          >
            Create your first trip
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`} className="group block h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md shadow-lg shadow-[#102a43]/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white/60 relative">
                
                {/* Visual Header / Cover Image Placeholder */}
                <div className="h-40 w-full bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/5 relative overflow-hidden group-hover:from-[#0EA5E9]/30 transition-colors duration-500">
                  {trip.coverImageUrl ? (
                    <img src={trip.coverImageUrl} alt={trip.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwRUE1RTkiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0EA5E9] shadow-sm border border-white">
                    {trip.status}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <h3 className="text-2xl font-extrabold leading-tight text-[#0C4A6E] group-hover:text-[#0EA5E9] transition-colors line-clamp-1">
                    {trip.title}
                  </h3>
                  
                  {trip.description ? (
                    <p className="mt-3 text-[#486581] line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>
                  ) : (
                    <p className="mt-3 text-[#9fb3c8] italic">No description provided</p>
                  )}
                  
                  <div className="mt-auto pt-8 flex flex-col gap-4">
                    {trip.startDate && (
                      <div className="flex items-center font-medium text-[#243b53]">
                        <div className="bg-[#0EA5E9]/10 p-2 rounded-lg mr-3">
                          <Calendar className="h-4 w-4 text-[#0EA5E9]" />
                        </div>
                        <span>
                          {format(new Date(trip.startDate), "MMM d, yyyy")}
                          {trip.endDate && ` - ${format(new Date(trip.endDate), "MMM d")}`}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-[#0EA5E9]/10 pt-4 mt-2">
                      <div className="flex items-center font-medium text-[#486581]">
                        <Users className="mr-2 h-4 w-4 shrink-0" />
                        <span>{trip.members.length} member{trip.members.length !== 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="bg-white rounded-full p-2 text-[#0EA5E9] shadow-sm group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { fetchApi } from "@/lib/api";
import Image from "next/image";
import { format } from "date-fns";
import { MapPin, Calendar, Users, Navigation } from "lucide-react";
import { ReportButton } from "@/components/report-button";

export default async function PublicTripRecapPage({ params }: { params: { token: string } }) {
  let trip;
  try {
    // Note: since this is a Server Component, fetchApi which uses localStorage won't work.
    // We need to do a standard fetch to the backend without Auth.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/public-trips/${params.token}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error("Trip not found");
    trip = await res.json();
  } catch (error) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold text-[#0C4A6E] mb-4">Trip Not Found</h1>
        <p className="text-lg text-[#486581] max-w-md">This recap link might have expired, or the trip was deleted.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] overflow-x-hidden">
      {/* Hero Header */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-[#0C4A6E] flex items-end pb-16 px-6 md:px-16 lg:px-24">
        {trip.coverImageUrl && (
          <Image 
            src={trip.coverImageUrl} 
            alt={trip.title} 
            fill 
            className="object-cover opacity-60" 
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C4A6E] via-[#0C4A6E]/50 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/40 px-4 py-1.5 rounded-full text-white font-bold text-sm mb-4">
            RoamCrew Recap
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-md mb-4 leading-tight">
            {trip.title}
          </h1>
          {trip.description && (
            <p className="text-xl text-white/90 max-w-2xl font-medium leading-relaxed drop-shadow-sm mb-6">
              {trip.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 mt-4">
            {trip.startDate && (
              <div className="flex items-center text-white/90 font-bold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Calendar className="w-5 h-5 mr-2" />
                {format(new Date(trip.startDate), "MMMM d, yyyy")}
                {trip.endDate && ` - ${format(new Date(trip.endDate), "MMMM d, yyyy")}`}
              </div>
            )}
            <div className="flex items-center text-white/90 font-bold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Users className="w-5 h-5 mr-2" />
              {trip.members.length} Adventurers
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-16">
        
        {/* Destinations */}
        <div className="mb-20">
          <h2 className="text-3xl font-extrabold text-[#0C4A6E] mb-10 flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-[#0EA5E9]" />
            Where We Went
          </h2>
          
          {trip.destinations?.length > 0 ? (
            <div className="space-y-12">
              {trip.destinations.map((dest: any) => (
                <div key={dest.id} className="bg-white rounded-3xl shadow-xl shadow-[#102a43]/5 overflow-hidden border border-[#0EA5E9]/10">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative h-64 md:h-auto bg-[#F0F9FF]">
                      {dest.imageUrl ? (
                        <Image src={dest.imageUrl} alt={dest.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#0EA5E9]/40 bg-[#0EA5E9]/5">
                          <MapPin className="w-20 h-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:p-10 md:w-2/3 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-[#0EA5E9]/10 text-[#0EA5E9] font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                          Destination
                        </span>
                        {(dest.startDate || dest.endDate) && (
                          <span className="text-[#486581] font-medium text-sm">
                            {dest.startDate && format(new Date(dest.startDate), "MMM d")}
                            {dest.endDate && dest.startDate && " - "}
                            {dest.endDate && format(new Date(dest.endDate), "MMM d")}
                          </span>
                        )}
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0C4A6E] mb-4">{dest.name}</h3>
                      {dest.notes && (
                        <p className="text-[#486581] leading-relaxed mb-6 italic border-l-4 border-[#0EA5E9] pl-4">"{dest.notes}"</p>
                      )}
                      
                      {/* Places / Highlights */}
                      {dest.places && dest.places.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-[#243b53] uppercase tracking-wider mb-3 flex items-center">
                            <Navigation className="w-4 h-4 mr-2" />
                            Highlights
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {dest.places.map((place: any) => (
                              <span key={place.id} className="bg-[#F0F9FF] text-[#0C4A6E] border border-[#0EA5E9]/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                                {place.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/60 rounded-3xl p-10 text-center border border-white">
              <p className="text-[#486581] font-medium text-lg">No destinations were added to this trip.</p>
            </div>
          )}
        </div>

        {/* The Crew */}
        <div>
          <h2 className="text-3xl font-extrabold text-[#0C4A6E] mb-10 flex items-center">
            <Users className="w-8 h-8 mr-3 text-[#0EA5E9]" />
            The Crew
          </h2>
          <div className="flex flex-wrap gap-6">
            {trip.members.map((m: any) => (
              <div key={m.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-md shadow-[#102a43]/5 border border-[#0EA5E9]/10 pr-8">
                {m.user.avatarUrl ? (
                  <img src={m.user.avatarUrl} alt={m.user.firstName} className="w-12 h-12 rounded-full object-cover border-2 border-[#0EA5E9]/20" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-bold text-lg">
                    {m.user.firstName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-[#0C4A6E] text-lg">{m.user.firstName}</div>
                  <div className="text-xs font-bold text-[#0EA5E9] bg-[#0EA5E9]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-[#0C4A6E] py-12 text-center border-t-4 border-[#0EA5E9]">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white p-1 rounded-md shadow-sm mr-2">
            <Image src="/icon-192x192.png" alt="RoamCrew Logo" width={24} height={24} className="rounded-sm" />
          </div>
          <span className="font-bold text-xl text-white">RoamCrew</span>
        </div>
        <p className="text-[#0EA5E9] font-medium text-sm mb-4">Created with RoamCrew • Plan your next adventure</p>
        <div className="flex justify-center">
          <ReportButton contentType="PUBLIC_RECAP" contentId={trip.id} label="Report this page" />
        </div>
      </footer>
    </div>
  );
}

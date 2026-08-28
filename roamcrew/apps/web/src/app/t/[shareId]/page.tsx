import { fetchApi } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { MapPin, Calendar, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const TripMap = dynamic(() => import('@/components/trip-map'), { ssr: false });

export default async function GuestTripPage({ params }: { params: { shareId: string } }) {
  let trip;
  try {
    // Next.js server component fetch
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${baseUrl}/public-trips/share/${params.shareId}`, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error("Trip not found");
    trip = await res.json();
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">This trip link is invalid or has expired.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#0EA5E9] text-white rounded-xl font-bold">
            Create Your Own Trip
          </Link>
        </div>
      </div>
    );
  }

  const { title, description, coverImageUrl, startDate, endDate, destinations, members, places } = trip;
  
  // Format dates
  const formattedDates = startDate && endDate 
    ? `${format(parseISO(startDate), 'MMM d')} - ${format(parseISO(endDate), 'MMM d, yyyy')}`
    : 'Dates TBD';

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-24">
      {/* Hero Section */}
      <div className="relative h-96 w-full">
        {coverImageUrl ? (
          <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <span className="inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium">
              Guest View
            </span>
            <h1 className="text-4xl md:text-6xl font-black break-words">{title}</h1>
            <div className="flex flex-wrap items-center gap-6 mt-2 text-white/90">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {formattedDates}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {members?.length || 1} travelers
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12 space-y-12">
        {description && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About this trip</h2>
            <p className="text-slate-600 leading-relaxed text-lg break-words whitespace-pre-wrap">{description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Destinations */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-[#0EA5E9]" />
              Destinations
            </h2>
            {destinations?.length > 0 ? (
              <div className="space-y-4">
                {destinations.map((dest: any, index: number) => (
                  <div key={dest.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg break-words">{dest.name}</h3>
                      {dest.description && <p className="text-slate-500 text-sm mt-1 break-words whitespace-pre-wrap">{dest.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No destinations added yet.</p>
            )}
          </div>

          {/* Members */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-[#0EA5E9]" />
              Travelers
            </h2>
            <div className="flex flex-wrap gap-4">
              {members?.map((m: any) => (
                <div key={m.id} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {m.user.avatarUrl ? (
                      <img src={m.user.avatarUrl} alt={m.user.firstName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      m.user.firstName?.[0] || 'U'
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{m.user.firstName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-[#0EA5E9]" />
            Trip Map
          </h2>
          <div className="w-full relative z-0">
            <TripMap destinations={destinations} places={places} itineraryItems={destinations?.flatMap((d: any) => d.itineraryItems || [])} />
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-[#0C4A6E] to-[#102a43] p-12 rounded-[2rem] text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Join the Crew</h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Want to vote on destinations, add places, and collaborate on this itinerary? Sign in to join the trip fully.
            </p>
            <Link href={`/trips/${trip.id}`} className="inline-block px-8 py-4 bg-white text-[#0C4A6E] rounded-xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
              Log in to Collaborate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { Download, Camera, MapPin, Users, Heart, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function ExportTripPage() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await fetchApi(`/trips/${params.id}`);
        setTrip(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load trip");
      } finally {
        setIsLoading(false);
      }
    };
    loadTrip();
  }, [params.id]);

  const handleExport = async () => {
    if (!captureRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(captureRef.current, {
        scale: 2, // High resolution
        useCORS: true, // For external images
        backgroundColor: '#F4F7FB'
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `${trip.title || "trip"}-recap.png`;
      link.click();
      
      toast.success("Recap exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export image");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0EA5E9]" />
      </div>
    );
  }

  if (!trip) return <div>Trip not found</div>;

  const formattedDates = trip.startDate && trip.endDate 
    ? `${format(parseISO(trip.startDate), 'MMM d')} - ${format(parseISO(trip.endDate), 'MMM d, yyyy')}`
    : 'Dates TBD';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/trips/${params.id}`} className="text-[#0EA5E9] font-medium flex items-center hover:underline mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Export Trip Recap</h1>
          <p className="text-slate-500">Generate a beautiful image to share with your crew.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
          ) : (
            <Download className="w-5 h-5 mr-2" />
          )}
          {isExporting ? "Exporting..." : "Save as Image"}
        </button>
      </div>

      {/* The Printable Area */}
      <div className="rounded-[2rem] overflow-hidden border-[8px] border-white shadow-2xl bg-white" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div ref={captureRef} className="bg-[#F4F7FB] w-full min-h-[800px] relative">
          {/* Header Image */}
          <div className="h-80 w-full relative">
            {trip.coverImageUrl ? (
              <img src={trip.coverImageUrl} crossOrigin="anonymous" alt={trip.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
              <h2 className="text-5xl font-black mb-2">{trip.title}</h2>
              <div className="flex items-center gap-6 text-white/90 font-medium text-lg">
                <span className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> {formattedDates}</span>
                <span className="flex items-center"><Users className="w-5 h-5 mr-2" /> {trip.members.length} Travelers</span>
              </div>
            </div>
            
            {/* Logo/Watermark */}
            <div className="absolute top-6 right-8 text-white font-black text-2xl drop-shadow-md">
              RoamCrew
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Top Destinations */}
            {trip.destinations?.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[#0EA5E9]" />
                  Places We Visited
                </h3>
                <div className="flex flex-wrap gap-3">
                  {trip.destinations.map((d: any) => (
                    <span key={d.id} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200">
                      {d.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Travel Crew */}
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                The Crew
              </h3>
              <div className="flex flex-wrap gap-4">
                {trip.members.map((m: any) => (
                  <div key={m.id} className="flex items-center bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold mr-3 overflow-hidden">
                      {m.user.avatarUrl ? (
                        <img src={m.user.avatarUrl} crossOrigin="anonymous" alt={m.user.firstName} className="w-full h-full object-cover" />
                      ) : (
                        m.user.firstName?.[0] || 'U'
                      )}
                    </div>
                    <span className="font-bold text-slate-700">{m.user.firstName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Stats Footer */}
            <div className="text-center pt-8 border-t border-slate-200">
              <p className="text-slate-500 font-medium">Made with ❤️ using RoamCrew</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

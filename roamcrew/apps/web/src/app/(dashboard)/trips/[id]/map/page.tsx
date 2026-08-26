"use client";

import { useState, useEffect, use } from "react";
import { fetchApi } from "@/lib/api";
import dynamic from "next/dynamic";
import { Map, MapPin } from "lucide-react";

// Dynamically import the map component with SSR disabled
// Leaflet uses the window object heavily, which causes errors during server-side rendering
const TripMap = dynamic(() => import("@/components/trip-map"), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full rounded-3xl border-2 border-white bg-white/40 backdrop-blur-md flex items-center justify-center shadow-xl shadow-[#102a43]/10">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent mb-4"></div>
        <p className="font-bold text-[#0C4A6E]">Loading Map Data...</p>
      </div>
    </div>
  )
});

export default function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  
  const [destinations, setDestinations] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      try {
        const [destData, placesData] = await Promise.all([
          fetchApi(`/trips/${tripId}/destinations`),
          fetchApi(`/trips/${tripId}/places`)
        ]);
        setDestinations(destData);
        setPlaces(placesData);
      } catch (err) {
        console.error("Failed to load map data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMapData();
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  const validDestinationsCount = destinations.filter(d => d.latitude && d.longitude).length;
  const validPlacesCount = places.filter(p => p.latitude && p.longitude).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C4A6E] flex items-center">
            <Map className="w-6 h-6 mr-2 text-[#0EA5E9]" />
            Trip Map
          </h2>
          <p className="text-[#486581] font-medium text-sm mt-1">
            See your destinations and saved places geographically.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white shadow-sm">
            <div className="w-3 h-3 rounded-full bg-[#0EA5E9] mr-2 shadow-sm shadow-[#0EA5E9]/50"></div>
            <span className="text-sm font-bold text-[#0C4A6E]">{validDestinationsCount} Destinations</span>
          </div>
          <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white shadow-sm">
            <div className="w-3 h-3 rounded-full bg-[#F97316] mr-2 shadow-sm shadow-[#F97316]/50"></div>
            <span className="text-sm font-bold text-[#0C4A6E]">{validPlacesCount} Places</span>
          </div>
        </div>
      </div>

      {(destinations.length > 0 && validDestinationsCount === 0) && (
        <div className="bg-orange-100 text-orange-800 p-4 rounded-2xl border border-orange-200 text-sm font-bold flex items-start">
          <MapPin className="w-5 h-5 mr-2 shrink-0 text-orange-500" />
          You have destinations, but none have latitude/longitude coordinates assigned to them. Edit them in the Destinations tab to see them on the map.
        </div>
      )}

      <TripMap destinations={destinations} places={places} />
    </div>
  );
}

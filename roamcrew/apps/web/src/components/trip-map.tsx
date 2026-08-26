"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons
const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const placeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);
  return null;
}

export default function TripMap({ 
  destinations, 
  places 
}: { 
  destinations: any[], 
  places: any[] 
}) {
  
  // Filter out items without coordinates
  const validDestinations = destinations.filter(d => d.latitude && d.longitude);
  const validPlaces = places.filter(p => p.latitude && p.longitude);

  const allPositions: [number, number][] = [
    ...validDestinations.map(d => [d.latitude, d.longitude] as [number, number]),
    ...validPlaces.map(p => [p.latitude, p.longitude] as [number, number])
  ];

  const center: [number, number] = allPositions.length > 0 
    ? allPositions[0] 
    : [0, 0]; // Default center if no pins

  return (
    <div className="h-[600px] w-full rounded-3xl overflow-hidden border-2 border-white shadow-xl shadow-[#102a43]/10 relative z-0">
      <MapContainer 
        center={center} 
        zoom={allPositions.length > 0 ? 10 : 2} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {allPositions.length > 0 && <MapBounds positions={allPositions} />}

        {validDestinations.map(dest => (
          <Marker 
            key={dest.id} 
            position={[dest.latitude, dest.longitude]}
            icon={destinationIcon}
          >
            <Popup className="rounded-xl">
              <div className="font-bold text-[#0C4A6E] text-base">{dest.name}</div>
              <div className="text-xs text-[#486581] font-medium bg-[#0EA5E9]/10 px-2 py-0.5 rounded-md inline-block mt-1 mb-2">
                Destination
              </div>
              {dest.description && (
                <p className="text-sm text-[#486581] mt-1">{dest.description}</p>
              )}
            </Popup>
          </Marker>
        ))}

        {validPlaces.map(place => (
          <Marker 
            key={place.id} 
            position={[place.latitude, place.longitude]}
            icon={placeIcon}
          >
            <Popup className="rounded-xl">
              <div className="font-bold text-[#0C4A6E] text-base">{place.name}</div>
              <div className="text-xs text-[#486581] font-medium bg-[#F97316]/10 px-2 py-0.5 rounded-md inline-block mt-1 mb-2">
                Saved Place
              </div>
              {place.category && (
                <div className="text-xs font-bold text-[#F97316] mb-1">{place.category}</div>
              )}
              {place.address && (
                <p className="text-xs text-[#486581] flex items-start mt-1">
                  <MapPin className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                  {place.address}
                </p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {allPositions.length === 0 && (
        <div className="absolute inset-0 z-[1000] bg-white/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white text-center">
            <Navigation className="w-8 h-8 text-[#0EA5E9] mx-auto mb-2 opacity-50" />
            <p className="font-bold text-[#0C4A6E]">No locations found</p>
            <p className="text-sm text-[#486581]">Add destinations and places with coordinates.</p>
          </div>
        </div>
      )}
    </div>
  );
}

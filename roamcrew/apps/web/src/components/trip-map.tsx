"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
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

import { usePathname } from "next/navigation";

function MapBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    const updateBounds = () => {
      const size = map.getSize();
      if (size.x > 0 && size.y > 0) {
        if (positions.length > 1) {
          const bounds = L.latLngBounds(positions);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        } else if (positions.length === 1) {
          map.setView(positions[0], 12);
        }
      } else {
        setTimeout(updateBounds, 100);
      }
    };
    updateBounds();
  }, [map, positions]);
  return null;
}

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function TripMap({ 
  destinations = [], 
  places = [],
  itineraryItems = []
}: { 
  destinations?: any[], 
  places?: any[],
  itineraryItems?: any[]
}) {
  const pathname = usePathname();
  
  // Filter out items without coordinates or invalid numbers
  const validDestinations = destinations
    .filter(d => d.latitude && d.longitude)
    .map(d => ({ ...d, latitude: Number(d.latitude), longitude: Number(d.longitude) }))
    .filter(d => !isNaN(d.latitude) && !isNaN(d.longitude))
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    
  const validPlaces = places
    .filter(p => p.latitude && p.longitude)
    .map(p => ({ ...p, latitude: Number(p.latitude), longitude: Number(p.longitude) }))
    .filter(p => !isNaN(p.latitude) && !isNaN(p.longitude));

  const validItineraryItems = itineraryItems
    .filter(item => (item.latitude && item.longitude) || (item.place?.latitude && item.place?.longitude))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const getCoordinates = (item: any): [number, number] => {
    if (item.latitude && item.longitude) return [Number(item.latitude), Number(item.longitude)];
    return [Number(item.place.latitude), Number(item.place.longitude)];
  };

  const itineraryPath: [number, number][] = validItineraryItems
    .map(getCoordinates)
    .filter(coords => !isNaN(coords[0]) && !isNaN(coords[1]));
    
  const destinationPath: [number, number][] = validDestinations.map(d => [d.latitude, d.longitude]);

  const allPositions: [number, number][] = [
    ...itineraryPath,
    ...destinationPath,
    ...validPlaces.map(p => [p.latitude, p.longitude] as [number, number])
  ].filter(coords => !isNaN(coords[0]) && !isNaN(coords[1]));

  const center: [number, number] = allPositions.length > 0 
    ? allPositions[0] 
    : [0, 0]; // Default center if no pins

  return (
    <div className="w-full rounded-3xl overflow-hidden border-2 border-white shadow-xl shadow-[#102a43]/10 relative z-0" style={{ height: "600px" }}>
      <MapContainer 
        key={pathname || "map"}
        center={center} 
        zoom={allPositions.length > 0 ? 10 : 2} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <InvalidateMapSize />

        {allPositions.length > 0 && <MapBounds positions={allPositions} />}

        {destinationPath.length > 1 && (
          <Polyline 
            positions={destinationPath} 
            color="#0EA5E9" 
            weight={4} 
            opacity={0.8}
            dashArray="10, 10" 
            lineCap="round"
          />
        )}

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
        {itineraryPath.length > 1 && (
          <Polyline 
            positions={itineraryPath} 
            color="#F59E0B" 
            weight={3} 
            opacity={0.8}
            dashArray="5, 10" 
            lineCap="round"
          />
        )}

        {validItineraryItems.map(item => (
          <Marker 
            key={item.id} 
            position={getCoordinates(item)}
            icon={placeIcon} // Can use a custom icon later
          >
            <Popup className="rounded-xl">
              <div className="font-bold text-[#0C4A6E] text-base">{item.title}</div>
              <div className="text-xs text-[#486581] font-medium bg-[#F59E0B]/10 px-2 py-0.5 rounded-md inline-block mt-1 mb-2">
                Itinerary Item
              </div>
              {item.description && (
                <p className="text-xs text-[#486581] mt-1">{item.description}</p>
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

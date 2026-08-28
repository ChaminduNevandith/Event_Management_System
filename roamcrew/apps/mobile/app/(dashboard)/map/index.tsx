import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { fetchApi } from "../../../lib/api";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

export default function GlobalMapScreen() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchApi("/trips");
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  // Get all unique places from all trips
  const allPlaces = trips.flatMap((trip) => 
    trip.itinerary?.map((item: any) => ({
      ...item.place,
      tripTitle: trip.title,
    })) || []
  ).filter(place => place && place.latitude && place.longitude);

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 bg-[#0EA5E9] shadow-sm z-10">
        <Text className="text-2xl font-black font-serif text-white">Global Map</Text>
      </View>
      
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: allPlaces[0]?.latitude || 37.78825,
          longitude: allPlaces[0]?.longitude || -122.4324,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }}
      >
        {allPlaces.map((place: any, index: number) => (
          <Marker
            key={`${place.id}-${index}`}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.tripTitle}
            pinColor="#0EA5E9"
          />
        ))}
      </MapView>
    </View>
  );
}

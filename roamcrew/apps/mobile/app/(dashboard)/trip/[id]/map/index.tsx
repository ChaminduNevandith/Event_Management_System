import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '../../../../../lib/api';
import { ArrowLeft } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

export default function TripMap() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setUserLocation(loc);
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await fetchApi(`/trips/${id}`);
        setTrip(data);
      } catch (error) {
        console.error('Failed to load trip', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadTrip();
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  const places = trip?.itinerary?.filter((item: any) => item.place?.latitude && item.place?.longitude) || [];

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 bg-[#0EA5E9] flex-row items-center z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-white/20 rounded-full">
            <ArrowLeft color="white" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Live Map</Text>
      </View>

      <View className="flex-1">
        {places.length > 0 ? (
          <MapView
            provider={PROVIDER_DEFAULT}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: places[0]?.place?.latitude || 37.78825,
              longitude: places[0]?.place?.longitude || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Destination Markers */}
            {places.map((item: any) => (
              <Marker
                key={item.id}
                coordinate={{ latitude: item.place.latitude, longitude: item.place.longitude }}
                title={item.place.name}
                description={item.place.address}
                pinColor="#0EA5E9"
              />
            ))}

            {/* Live User Location */}
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                }}
                title="You"
                pinColor="#E11D48" // Red marker for user
              />
            )}
          </MapView>
        ) : (
          <View className="flex-1 items-center justify-center p-8 bg-white">
              <Text className="text-[#486581] text-center font-medium">Add places with coordinates to see them on the map.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

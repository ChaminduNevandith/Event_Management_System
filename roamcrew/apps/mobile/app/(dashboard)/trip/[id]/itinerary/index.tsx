import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '../../../../../lib/api';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';

export default function TripItinerary() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await fetchApi(`/trips/${id}`);
        setTrip(data);
      } catch (error) {
        console.error('Failed to load trip itinerary', error);
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

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
            <ArrowLeft color="#0EA5E9" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0C4A6E]">Itinerary</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {trip?.itinerary && trip.itinerary.length > 0 ? (
          <View className="space-y-4">
            {trip.itinerary.map((item: any, index: number) => (
              <View key={item.id} className="bg-white rounded-3xl p-5 border border-[#0EA5E9]/10 shadow-sm mb-4">
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-[#F0F9FF] rounded-2xl items-center justify-center mr-4">
                    <Text className="text-[#0EA5E9] font-bold text-lg">{index + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#0C4A6E]">{item.place?.name}</Text>
                    {item.startTime && item.endTime && (
                      <Text className="text-[#0EA5E9] font-medium mt-1">
                        {format(parseISO(item.startTime), 'MMM d, h:mm a')} - {format(parseISO(item.endTime), 'h:mm a')}
                      </Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <MapPin color="#9AA5B1" size={16} />
                      <Text className="text-[#9AA5B1] ml-1 flex-1" numberOfLines={1}>{item.place?.address}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="p-8 bg-white rounded-3xl items-center border border-[#0EA5E9]/10 mt-10">
            <MapPin color="#0EA5E9" size={48} className="mb-4 opacity-50" />
            <Text className="text-xl font-bold text-[#0C4A6E] mb-2">No places yet</Text>
            <Text className="text-[#486581] text-center font-medium">Add places and auto-schedule them to see your itinerary.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

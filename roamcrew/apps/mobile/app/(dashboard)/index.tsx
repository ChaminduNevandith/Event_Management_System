import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchApi } from '../../lib/api';
import { Calendar, Users, Plus } from 'lucide-react-native';

type Trip = any;
import { format, parseISO } from 'date-fns';

export default function TripsDashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadTrips = async () => {
    try {
      const data = await fetchApi('/trips');
      setTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  }, []);

  const renderTripCard = ({ item }: { item: Trip }) => {
    const isPlanning = new Date(item.startDate) > new Date();

    return (
      <TouchableOpacity 
        onPress={() => router.push(`/(dashboard)/trip/${item.id}` as any)}
        className="bg-white rounded-3xl overflow-hidden mb-6 shadow-sm border border-[#0EA5E9]/10"
      >
        {/* Cover Image Placeholder */}
        <View className="h-40 bg-[#0C4A6E] relative">
          <Image 
            source={{ uri: item.coverImageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80' }} 
            className="w-full h-full opacity-80"
          />
          <View className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">
              {isPlanning ? 'Planning' : 'Ongoing'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-5">
          <Text className="text-2xl font-black font-serif text-[#0C4A6E] mb-2">{item.title}</Text>
          {item.description && (
            <Text className="text-[#486581] mb-4" numberOfLines={2}>{item.description}</Text>
          )}

          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center bg-[#F0F9FF] px-3 py-1.5 rounded-full">
              <Calendar color="#0EA5E9" size={14} />
              <Text className="text-sm text-[#0C4A6E] font-medium ml-2">
                {format(parseISO(item.startDate.toString()), 'MMM d, yyyy')}
              </Text>
            </View>
            <View className="flex-row items-center bg-[#F0F9FF] px-3 py-1.5 rounded-full">
              <Users color="#0EA5E9" size={14} />
              <Text className="text-sm text-[#0C4A6E] font-medium ml-2">
                {item.members?.length || 1}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="px-6 pt-6 pb-2">
        <Text className="text-3xl font-black font-serif text-[#0C4A6E]">Your Trips</Text>
        <Text className="text-[#486581] text-base mt-1">Manage and plan your upcoming adventures.</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTripCard}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-[#486581] text-lg text-center font-medium">No trips planned yet.</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity 
        onPress={() => router.push('/(dashboard)/create-trip')}
        className="absolute bottom-6 right-6 w-16 h-16 bg-[#0EA5E9] rounded-full items-center justify-center shadow-lg shadow-[#0EA5E9]/50"
      >
        <Plus color="white" size={32} />
      </TouchableOpacity>
    </View>
  );
}

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '../../../../lib/api';
type Trip = any;
import { Map, Calendar as CalendarIcon, Wallet, ArrowLeft } from 'lucide-react-native';

export default function TripDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'map'>('itinerary');
  const [isLoading, setIsLoading] = useState(true);

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

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <Text className="text-[#486581]">Trip not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* Header */}
      <View className="pt-14 pb-4 px-6 bg-[#0EA5E9] rounded-b-3xl shadow-sm z-10">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-white/20 rounded-full">
            <ArrowLeft color="white" size={20} />
          </TouchableOpacity>
          <Text className="text-2xl font-black font-serif text-white flex-1" numberOfLines={1}>{trip.title}</Text>
        </View>

        {/* Custom Tabs */}
        <View className="flex-row bg-white/20 p-1 rounded-2xl">
          <TouchableOpacity 
            onPress={() => setActiveTab('itinerary')}
            className={`flex-1 py-2 rounded-xl flex-row justify-center items-center ${activeTab === 'itinerary' ? 'bg-white shadow-sm' : ''}`}
          >
            <CalendarIcon size={16} color={activeTab === 'itinerary' ? '#0EA5E9' : 'white'} />
            <Text className={`ml-2 font-bold ${activeTab === 'itinerary' ? 'text-[#0EA5E9]' : 'text-white'}`}>Itinerary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('budget')}
            className={`flex-1 py-2 rounded-xl flex-row justify-center items-center ${activeTab === 'budget' ? 'bg-white shadow-sm' : ''}`}
          >
            <Wallet size={16} color={activeTab === 'budget' ? '#0EA5E9' : 'white'} />
            <Text className={`ml-2 font-bold ${activeTab === 'budget' ? 'text-[#0EA5E9]' : 'text-white'}`}>Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('map')}
            className={`flex-1 py-2 rounded-xl flex-row justify-center items-center ${activeTab === 'map' ? 'bg-white shadow-sm' : ''}`}
          >
            <Map size={16} color={activeTab === 'map' ? '#0EA5E9' : 'white'} />
            <Text className={`ml-2 font-bold ${activeTab === 'map' ? 'text-[#0EA5E9]' : 'text-white'}`}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === 'itinerary' && (
          <View>
            <Text className="text-xl font-black font-serif text-[#0C4A6E] mb-4">Smart Itinerary</Text>
            {trip.itinerary && trip.itinerary.length > 0 ? (
              trip.itinerary.map((item: any) => (
                <View key={item.id} className="bg-white p-4 rounded-2xl mb-4 border border-[#0EA5E9]/10 shadow-sm flex-row items-center">
                  <View className="w-12 h-12 bg-[#F0F9FF] rounded-xl items-center justify-center mr-4">
                    <Text className="text-[#0EA5E9] font-bold">Day</Text>
                    <Text className="text-[#0EA5E9] font-black">{item.dayNumber || 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[#0C4A6E] font-bold text-lg">{item.place?.name || item.title}</Text>
                    <Text className="text-[#486581] text-sm" numberOfLines={1}>{item.place?.address || 'Custom event'}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="p-8 bg-white rounded-3xl items-center border border-[#0EA5E9]/10">
                <Text className="text-[#486581] text-center font-medium">No places added yet. Add destinations to generate an auto-schedule!</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'budget' && (
          <View>
             <Text className="text-xl font-black font-serif text-[#0C4A6E] mb-4">Expense Splitting</Text>
             <View className="p-8 bg-white rounded-3xl items-center border border-[#0EA5E9]/10">
                <Text className="text-[#486581] text-center font-medium">Budget UI coming in next update.</Text>
             </View>
          </View>
        )}

        {activeTab === 'map' && (
          <View>
             <Text className="text-xl font-black font-serif text-[#0C4A6E] mb-4">Live Map</Text>
             <View className="p-8 bg-white rounded-3xl items-center border border-[#0EA5E9]/10">
                <Text className="text-[#486581] text-center font-medium">Native Map loading...</Text>
             </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '../../../../lib/api';
import { 
  Map, Calendar as CalendarIcon, Wallet, ArrowLeft, Share2, 
  BedDouble, Activity, MessageSquare, CheckSquare, 
  MapPin, Camera, Plane, HelpCircle 
} from 'lucide-react-native';

type Trip = any;

const MODULES = [
  { id: 'itinerary', title: 'Itinerary', icon: CalendarIcon, color: '#0EA5E9', bg: 'bg-[#0EA5E9]/10' },
  { id: 'map', title: 'Live Map', icon: Map, color: '#10B981', bg: 'bg-[#10B981]/10' },
  { id: 'budget', title: 'Budget', icon: Wallet, color: '#F97316', bg: 'bg-[#F97316]/10' },
  { id: 'chat', title: 'Crew Chat', icon: MessageSquare, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10' },
  { id: 'accommodations', title: 'Lodging', icon: BedDouble, color: '#38BDF8', bg: 'bg-[#38BDF8]/10' },
  { id: 'tasks', title: 'Checklists', icon: CheckSquare, color: '#EAB308', bg: 'bg-[#EAB308]/10' },
  { id: 'memories', title: 'Memories', icon: Camera, color: '#F43F5E', bg: 'bg-[#F43F5E]/10' },
  { id: 'destinations', title: 'Places', icon: MapPin, color: '#06B6D4', bg: 'bg-[#06B6D4]/10' },
  { id: 'transport', title: 'Transit', icon: Plane, color: '#6366F1', bg: 'bg-[#6366F1]/10' },
  { id: 'activity', title: 'Activity', icon: Activity, color: '#84CC16', bg: 'bg-[#84CC16]/10' },
  { id: 'decisions', title: 'Polls', icon: HelpCircle, color: '#EC4899', bg: 'bg-[#EC4899]/10' },
];

export default function TripHub() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState<Trip | null>(null);
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
      <View className="pt-14 pb-8 px-6 bg-[#0EA5E9] rounded-b-[40px] shadow-sm z-10">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-white/20 rounded-full">
            <ArrowLeft color="white" size={20} />
          </TouchableOpacity>
          <View className="flex-1" />
          <TouchableOpacity onPress={() => router.push(`/(dashboard)/trip/${id}/export`)} className="p-2 bg-white/20 rounded-full">
            <Share2 color="white" size={20} />
          </TouchableOpacity>
        </View>
        <Text className="text-4xl font-black font-serif text-white mb-2">{trip.title}</Text>
        <Text className="text-white/80 font-medium text-lg">{trip.description || 'No description provided'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <Text className="text-xl font-bold text-[#0C4A6E] mb-6">Trip Modules</Text>
        
        <View className="flex-row flex-wrap justify-between">
          {MODULES.map((module) => (
            <TouchableOpacity 
              key={module.id}
              onPress={() => router.push(`/(dashboard)/trip/${id}/${module.id}`)}
              className="w-[48%] bg-white rounded-3xl p-5 mb-4 border border-[#0EA5E9]/10 shadow-sm items-center"
            >
              <View className={`w-14 h-14 ${module.bg} rounded-2xl items-center justify-center mb-3`}>
                <module.icon color={module.color} size={28} />
              </View>
              <Text className="font-bold text-[#0C4A6E]">{module.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

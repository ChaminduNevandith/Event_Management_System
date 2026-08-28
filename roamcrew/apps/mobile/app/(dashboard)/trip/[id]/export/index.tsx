import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchApi } from '../../../../../lib/api';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function ExportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const viewShotRef = useRef<any>(null);

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

  const handleShare = async () => {
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/jpeg',
            dialogTitle: `Share ${trip?.title || 'Trip'} Recap`,
            UTI: 'public.jpeg',
          });
        }
      }
    } catch (error) {
      console.error('Failed to capture and share:', error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center bg-white justify-between">
        <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
                <ArrowLeft color="#0EA5E9" size={20} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-[#0C4A6E]">Export Recap</Text>
        </View>
        <TouchableOpacity onPress={handleShare} className="p-2 bg-[#0EA5E9] rounded-full flex-row items-center px-4">
            <Share2 color="white" size={16} />
            <Text className="text-white font-bold ml-2">Share</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center p-6">
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={{ width: '100%', aspectRatio: 9/16, backgroundColor: '#0EA5E9', borderRadius: 24, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-4xl font-black font-serif text-white mb-2 text-center">{trip.title}</Text>
            <Text className="text-white/80 font-medium text-lg text-center">{trip.description || 'An amazing journey.'}</Text>
            
            <View className="bg-white/20 p-4 rounded-2xl mt-8 w-full">
                <Text className="text-white font-bold mb-2">Crew Members</Text>
                {trip.members?.map((m: any) => (
                    <Text key={m.userId} className="text-white font-medium">{m.user.firstName} {m.user.lastName}</Text>
                ))}
            </View>
            <Text className="text-white/50 text-sm mt-8">Made with RoamCrew</Text>
        </ViewShot>
      </View>
    </View>
  );
}

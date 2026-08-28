import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
            <ArrowLeft color="#0EA5E9" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0C4A6E]">Privacy Policy</Text>
      </View>
      <ScrollView className="flex-1 p-6">
        <Text className="text-[#486581] leading-7 mb-4">
          This is a placeholder for the Privacy Policy content. We take your privacy seriously.
        </Text>
        <Text className="text-lg font-bold text-[#0C4A6E] mb-2 mt-4">1. Data Collection</Text>
        <Text className="text-[#486581] leading-7 mb-4">
          We collect your email, name, and trip data to provide our services.
        </Text>
        <Text className="text-lg font-bold text-[#0C4A6E] mb-2 mt-4">2. Data Usage</Text>
        <Text className="text-[#486581] leading-7 mb-20">
          Your data is not sold to third parties. We use it to coordinate your trips and provide itinerary suggestions.
        </Text>
      </ScrollView>
    </View>
  );
}

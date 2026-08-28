import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ActivityScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
            <ArrowLeft color="#0EA5E9" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0C4A6E]">Activity Log</Text>
      </View>
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-[#486581] text-center font-medium">Activity feed coming soon.</Text>
      </View>
    </View>
  );
}

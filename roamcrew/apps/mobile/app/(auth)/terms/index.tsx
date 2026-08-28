import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
            <ArrowLeft color="#0EA5E9" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0C4A6E]">Terms of Service</Text>
      </View>
      <ScrollView className="flex-1 p-6">
        <Text className="text-[#486581] leading-7 mb-4">
          By using RoamCrew, you agree to these terms. This is a placeholder for the actual Terms of Service content.
        </Text>
        <Text className="text-lg font-bold text-[#0C4A6E] mb-2 mt-4">1. Account Creation</Text>
        <Text className="text-[#486581] leading-7 mb-4">
          You must provide accurate information when creating an account.
        </Text>
        <Text className="text-lg font-bold text-[#0C4A6E] mb-2 mt-4">2. User Conduct</Text>
        <Text className="text-[#486581] leading-7 mb-20">
          Be respectful to others. Don't spam or upload illegal content.
        </Text>
      </ScrollView>
    </View>
  );
}

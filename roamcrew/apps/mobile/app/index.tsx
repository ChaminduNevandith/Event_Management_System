import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-[#0C4A6E]">
      <Text className="text-4xl font-black text-white font-serif mb-4">RoamCrew</Text>
      <Text className="text-xl text-[#0EA5E9] font-bold">Mobile App</Text>
      <StatusBar style="light" />
    </View>
  );
}

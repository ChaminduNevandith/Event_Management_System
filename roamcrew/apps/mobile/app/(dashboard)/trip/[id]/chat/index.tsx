import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ArrowLeft, Send } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#F8FAFC]">
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
            <ArrowLeft color="#0EA5E9" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0C4A6E]">Crew Chat</Text>
      </View>
      
      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center my-4">
            <Text className="text-[#9AA5B1] text-xs font-bold uppercase">Today</Text>
        </View>
        <View className="bg-white p-3 rounded-2xl rounded-tl-none self-start max-w-[80%] mb-4 border border-[#F0F9FF]">
            <Text className="font-bold text-[#0EA5E9] text-xs mb-1">Jane Doe</Text>
            <Text className="text-[#0C4A6E]">Hey crew! Who's booking the Airbnb?</Text>
        </View>
        <View className="bg-[#0EA5E9] p-3 rounded-2xl rounded-tr-none self-end max-w-[80%] mb-4">
            <Text className="text-white">I'll look into it tonight!</Text>
        </View>
      </ScrollView>

      <View className="p-4 bg-white border-t border-[#F0F9FF] flex-row items-center">
        <TextInput
            className="flex-1 bg-[#F8FAFC] border border-[#F0F9FF] rounded-full px-4 py-3 text-[#0C4A6E] mr-3"
            placeholder="Type a message..."
            placeholderTextColor="#9AA5B1"
            value={message}
            onChangeText={setMessage}
        />
        <TouchableOpacity className="w-12 h-12 bg-[#0EA5E9] rounded-full items-center justify-center">
            <Send color="white" size={20} style={{ marginLeft: -2 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

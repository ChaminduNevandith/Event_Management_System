import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { fetchApi } from "../../lib/api";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function CreateTripScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreate = async () => {
    if (!title) return;
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchApi("/trips", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      router.replace(`/(dashboard)/trip/${data.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="pt-14 pb-4 px-6 border-b border-[#F0F9FF] flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-[#F0F9FF] rounded-full">
            <ArrowLeft color="#0EA5E9" size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0C4A6E]">Create New Trip</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl items-center justify-center mb-4">
            <MapPin color="#0EA5E9" size={32} />
          </View>
          <Text className="text-[#486581] text-center">Where are we going next?</Text>
        </View>

        {error ? (
          <View className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
            <Text className="text-red-600 text-center font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-4">
          <View>
            <Text className="text-[#486581] font-medium mb-2">Trip Title</Text>
            <TextInput
              className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium focus:border-[#0EA5E9]"
              placeholder="e.g. Summer in Tokyo"
              placeholderTextColor="#9AA5B1"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="text-[#486581] font-medium mb-2">Description (Optional)</Text>
            <TextInput
              className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium focus:border-[#0EA5E9]"
              placeholder="What's the vibe?"
              placeholderTextColor="#9AA5B1"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />
          </View>

          <TouchableOpacity
            onPress={handleCreate}
            disabled={isLoading || !title}
            className={`w-full p-4 rounded-xl items-center justify-center mt-4 ${
              isLoading || !title ? 'bg-[#0EA5E9]/50' : 'bg-[#0EA5E9]'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Create Trip</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

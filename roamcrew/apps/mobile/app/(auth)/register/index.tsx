import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useAuth } from "../../../components/auth-provider";
import { fetchApi } from "../../../lib/api";
import { UserPlus, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} className="absolute top-12 left-6 p-2 bg-[#F0F9FF] rounded-full z-10">
            <ArrowLeft color="#0EA5E9" size={24} />
        </TouchableOpacity>

        <View className="w-full max-w-sm mx-auto space-y-6 mt-12">
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl items-center justify-center mb-4">
              <UserPlus color="#0EA5E9" size={32} />
            </View>
            <Text className="text-4xl font-serif font-black text-[#0C4A6E]">Join Crew</Text>
            <Text className="text-[#486581] text-lg text-center mt-2">Create an account to start planning.</Text>
          </View>

          {error ? (
            <View className="bg-red-50 p-4 rounded-xl border border-red-100">
              <Text className="text-red-600 text-center font-medium">{error}</Text>
            </View>
          ) : null}

          <View className="space-y-4">
            <View className="flex-row space-x-4">
                <View className="flex-1 mr-2">
                    <Text className="text-[#486581] font-medium mb-2">First Name</Text>
                    <TextInput
                    className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium focus:border-[#0EA5E9]"
                    placeholder="Jane"
                    placeholderTextColor="#9AA5B1"
                    value={firstName}
                    onChangeText={setFirstName}
                    />
                </View>
                <View className="flex-1 ml-2">
                    <Text className="text-[#486581] font-medium mb-2">Last Name</Text>
                    <TextInput
                    className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium focus:border-[#0EA5E9]"
                    placeholder="Doe"
                    placeholderTextColor="#9AA5B1"
                    value={lastName}
                    onChangeText={setLastName}
                    />
                </View>
            </View>

            <View>
              <Text className="text-[#486581] font-medium mb-2">Email Address</Text>
              <TextInput
                className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium focus:border-[#0EA5E9]"
                placeholder="you@example.com"
                placeholderTextColor="#9AA5B1"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-[#486581] font-medium mb-2">Password</Text>
              <TextInput
                className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium focus:border-[#0EA5E9]"
                placeholder="••••••••"
                placeholderTextColor="#9AA5B1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading || !email || !password || !firstName || !lastName}
              className={`w-full p-4 rounded-xl items-center justify-center flex-row ${
                isLoading || !email || !password || !firstName || !lastName ? 'bg-[#0EA5E9]/50' : 'bg-[#0EA5E9]'
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Create Account</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4 flex-wrap">
                <Text className="text-[#486581]">By signing up, you agree to our </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/terms')}>
                    <Text className="text-[#0EA5E9] font-bold">Terms</Text>
                </TouchableOpacity>
                <Text className="text-[#486581]"> and </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/privacy')}>
                    <Text className="text-[#0EA5E9] font-bold">Privacy Policy</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

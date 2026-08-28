import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useAuth } from "../../../components/auth-provider";
import { fetchApi } from "../../../lib/api";
import { LogIn } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white items-center justify-center p-6"
    >
      <View className="w-full max-w-sm space-y-8">
        <View className="items-center">
          <View className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl items-center justify-center mb-4">
            <LogIn color="#0EA5E9" size={32} />
          </View>
          <Text className="text-4xl font-serif font-black text-[#0C4A6E]">RoamCrew</Text>
          <Text className="text-[#486581] text-lg text-center mt-2">Sign in to plan your next adventure</Text>
        </View>

        {error ? (
          <View className="bg-red-50 p-4 rounded-xl border border-red-100">
            <Text className="text-red-600 text-center font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="space-y-4">
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
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            className={`w-full p-4 rounded-xl items-center justify-center flex-row mt-6 ${
              isLoading || !email || !password ? 'bg-[#0EA5E9]/50' : 'bg-[#0EA5E9]'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
            <View className="flex-row justify-center mt-6">
              <Text className="text-[#486581]">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text className="text-[#0EA5E9] font-bold">Sign up</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../components/auth-provider";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0C4A6E]">
        <ActivityIndicator size="large" color="#0EA5E9" />
        <StatusBar style="light" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(dashboard)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
import { fetchApi } from "../../../lib/api";
import { useAuth } from "../../../components/auth-provider";
import { User, LogOut, Settings, Save } from "lucide-react-native";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { logout } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const loadUser = async () => {
    try {
      const data = await fetchApi("/users/me");
      setUser(data);
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetchApi("/users/me", {
        method: "PUT",
        body: JSON.stringify({ firstName, lastName }),
      });
      Alert.alert("Success", "Profile updated successfully");
      loadUser();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() }
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      <View className="mb-8">
        <Text className="text-3xl font-black font-serif text-[#0C4A6E]">Profile</Text>
        <Text className="text-[#486581] mt-1">Manage your account and preferences</Text>
      </View>

      <View className="bg-white p-6 rounded-3xl border border-[#0EA5E9]/10 shadow-sm mb-6 items-center">
        <View className="w-24 h-24 bg-[#0EA5E9]/10 rounded-full items-center justify-center mb-4">
          <User color="#0EA5E9" size={40} />
        </View>
        <Text className="text-2xl font-bold text-[#0C4A6E]">{user?.firstName} {user?.lastName}</Text>
        <Text className="text-[#486581]">@{user?.username || user?.email?.split('@')[0]}</Text>
        <Text className="text-[#9AA5B1] mt-1">{user?.email}</Text>
      </View>

      <View className="bg-white p-6 rounded-3xl border border-[#0EA5E9]/10 shadow-sm mb-6">
        <View className="flex-row items-center mb-4">
          <Settings color="#0EA5E9" size={20} />
          <Text className="text-xl font-bold text-[#0C4A6E] ml-2">Personal Info</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-[#486581] font-medium mb-2">First Name</Text>
            <TextInput
              className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View>
            <Text className="text-[#486581] font-medium mb-2">Last Name</Text>
            <TextInput
              className="w-full bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl p-4 text-[#0C4A6E] font-medium"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          
          <TouchableOpacity 
            onPress={handleSave}
            disabled={isSaving}
            className={`mt-4 p-4 rounded-xl flex-row items-center justify-center ${isSaving ? 'bg-[#0EA5E9]/50' : 'bg-[#0EA5E9]'}`}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save color="white" size={20} />
                <Text className="text-white font-bold text-lg ml-2">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-red-50 p-5 rounded-2xl flex-row items-center justify-center border border-red-100"
      >
        <LogOut color="#DC2626" size={20} />
        <Text className="text-red-600 font-bold text-lg ml-2">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

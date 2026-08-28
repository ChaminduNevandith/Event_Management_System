import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { fetchApi } from "../../../lib/api";
import { UserPlus, UserCheck, XCircle, CheckCircle, Search, Users } from "lucide-react-native";

export default function FriendsScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState("");
  const [isSending, setIsSending] = useState(false);

  const loadData = async () => {
    try {
      const [fData, rData] = await Promise.all([
        fetchApi("/friends"),
        fetchApi("/friends/requests/pending"),
      ]);
      setFriends(fData);
      setRequests(rData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendRequest = async () => {
    if (!searchUsername) return;
    setIsSending(true);
    try {
      await fetchApi("/friends/request", {
        method: "POST",
        body: JSON.stringify({ targetUsername: searchUsername }),
      });
      Alert.alert("Success", "Friend request sent!");
      setSearchUsername("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not send request");
    } finally {
      setIsSending(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await fetchApi(`/friends/request/${id}`, { method: "PUT", body: JSON.stringify({ action: "ACCEPT" }) });
      loadData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetchApi(`/friends/request/${id}`, { method: "PUT", body: JSON.stringify({ action: "REJECT" }) });
      loadData();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
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
        <Text className="text-3xl font-black font-serif text-[#0C4A6E]">Friends</Text>
        <Text className="text-[#486581] mt-1">Connect with your travel crew</Text>
      </View>

      <View className="bg-white p-5 rounded-3xl border border-[#0EA5E9]/10 shadow-sm mb-8">
        <Text className="text-lg font-bold text-[#0C4A6E] mb-3">Add a Friend</Text>
        <View className="flex-row items-center space-x-2">
            <View className="flex-1 bg-[#F0F9FF] border border-[#0EA5E9]/20 rounded-xl px-4 py-3 flex-row items-center mr-2">
                <Search color="#9AA5B1" size={20} />
                <TextInput
                    className="flex-1 ml-2 text-[#0C4A6E] font-medium"
                    placeholder="Search by username..."
                    placeholderTextColor="#9AA5B1"
                    value={searchUsername}
                    onChangeText={setSearchUsername}
                    autoCapitalize="none"
                />
            </View>
            <TouchableOpacity 
                className={`p-3 rounded-xl items-center justify-center ${isSending || !searchUsername ? 'bg-[#0EA5E9]/50' : 'bg-[#0EA5E9]'}`}
                onPress={handleSendRequest}
                disabled={isSending || !searchUsername}
            >
                {isSending ? <ActivityIndicator color="white" /> : <UserPlus color="white" size={24} />}
            </TouchableOpacity>
        </View>
      </View>

      {requests.length > 0 && (
        <View className="mb-8">
          <Text className="text-xl font-bold text-[#0C4A6E] mb-4">Pending Requests</Text>
          {requests.map(req => (
            <View key={req.id} className="bg-white p-4 rounded-2xl flex-row items-center justify-between mb-3 shadow-sm border border-yellow-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                  <UserPlus color="#EAB308" size={20} />
                </View>
                <Text className="font-bold text-[#0C4A6E]">{req.requester.firstName} {req.requester.lastName}</Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity onPress={() => handleAccept(req.id)} className="p-2 bg-green-100 rounded-full mr-2">
                  <CheckCircle color="#16A34A" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleReject(req.id)} className="p-2 bg-red-100 rounded-full">
                  <XCircle color="#DC2626" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View>
        <Text className="text-xl font-bold text-[#0C4A6E] mb-4">Your Crew ({friends.length})</Text>
        {friends.length === 0 ? (
          <View className="p-6 bg-white rounded-2xl border border-[#0EA5E9]/10 items-center">
            <Text className="text-[#486581] font-medium">You haven't added any friends yet.</Text>
          </View>
        ) : (
          friends.map(friend => (
            <View key={friend.id} className="bg-white p-4 rounded-2xl flex-row items-center mb-3 shadow-sm border border-[#0EA5E9]/10">
              <View className="w-12 h-12 bg-[#F0F9FF] rounded-full items-center justify-center mr-3">
                <Text className="text-[#0EA5E9] font-bold text-lg">{friend.friend.firstName[0]}</Text>
              </View>
              <View>
                <Text className="font-bold text-[#0C4A6E] text-lg">{friend.friend.firstName} {friend.friend.lastName}</Text>
                <Text className="text-[#486581]">@{friend.friend.username || friend.friend.email.split('@')[0]}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

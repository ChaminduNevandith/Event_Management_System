import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { ChevronDown, Map, Users, Calendar, Wallet, Image as ImageIcon, Share2 } from "lucide-react-native";

const guides = [
  {
    id: "trips",
    icon: Calendar,
    color: "#0EA5E9",
    bg: "bg-[#0EA5E9]/10",
    title: "Planning & Smart Itinerary",
    content: "Start by creating a new trip from the Dashboard. You can add places you want to visit without worrying about the order. Once you're ready, click 'Auto-Schedule' in the Itinerary tab. Our Smart Auto-Scheduler uses geographical clustering to group nearby places into logical days, saving you hours of planning time."
  },
  {
    id: "crew",
    icon: Users,
    color: "#8B5CF6",
    bg: "bg-[#8B5CF6]/10",
    title: "The Crew & Guest Mode",
    content: "Traveling is better together! Go to the 'Friends' tab or use the 'Invite Someone' button inside a trip to add members. Want to share your plans with parents or friends who aren't on RoamCrew? Click 'Share Link' in the trip overview to generate a frictionless 'Guest Mode' link they can view without logging in."
  },
  {
    id: "map",
    icon: Map,
    color: "#10B981",
    bg: "bg-[#10B981]/10",
    title: "Live Map & Location Broadcasting",
    content: "The Map tab provides an interactive overview of all your destinations and accommodations. During the trip, you can enable 'Live Location' to broadcast where you are to the rest of the crew in real-time. It’s perfect for finding each other in crowded cities or at festivals."
  },
  {
    id: "budget",
    icon: Wallet,
    color: "#F97316",
    bg: "bg-[#F97316]/10",
    title: "Expense Splitting",
    content: "Log every expense in the Budget tab. Simply enter the amount, select who paid, and who the expense was split among. RoamCrew automatically calculates the debts and generates a simplified 'Ledger' showing exactly who owes who, minimizing the math at the end of the trip."
  },
  {
    id: "recap",
    icon: ImageIcon,
    color: "#F43F5E",
    bg: "bg-[#F43F5E]/10",
    title: "Post-Trip Recap Export",
    content: "When the adventure is over, head to the 'Export' tab. RoamCrew will automatically generate a stunning visual summary of your journey complete with destinations visited, members, and a map that you can download as a high-resolution image to share on social media."
  },
  {
    id: "social",
    icon: Share2,
    color: "#38BDF8",
    bg: "bg-[#38BDF8]/10",
    title: "Rich Social Previews",
    content: "When you share your RoamCrew trip links on iMessage, WhatsApp, or Twitter, they will automatically render a beautiful, dynamic preview image showing the trip title, dates, and number of members, giving your friends a sneak peek before they even click."
  }
];

export default function GuideScreen() {
  const [openSection, setOpenSection] = useState<string | null>("trips");

  return (
    <ScrollView className="flex-1 bg-[#F8FAFC]" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      <View className="mb-8">
        <Text className="text-3xl font-black font-serif text-[#0C4A6E]">User Guide</Text>
        <Text className="text-[#486581] mt-1">Master RoamCrew features</Text>
      </View>

      <View className="space-y-4">
        {guides.map((guide) => (
          <TouchableOpacity
            key={guide.id}
            onPress={() => setOpenSection(openSection === guide.id ? null : guide.id)}
            className="bg-white rounded-3xl border border-[#0EA5E9]/10 shadow-sm overflow-hidden"
          >
            <View className="p-5 flex-row items-center">
              <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${guide.bg}`}>
                <guide.icon color={guide.color} size={24} />
              </View>
              <Text className="flex-1 font-bold text-lg text-[#0C4A6E] pr-2">{guide.title}</Text>
              <ChevronDown 
                color="#9AA5B1" 
                size={24} 
                style={{ transform: [{ rotate: openSection === guide.id ? "180deg" : "0deg" }] }}
              />
            </View>
            
            {openSection === guide.id && (
              <View className="px-5 pb-5 pt-2 border-t border-[#F0F9FF]">
                <Text className="text-[#486581] leading-6">{guide.content}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

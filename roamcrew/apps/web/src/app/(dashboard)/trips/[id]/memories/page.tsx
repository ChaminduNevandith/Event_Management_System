"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Camera, MapPin, Calendar, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripMemoriesPage() {
  const params = useParams();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchApi(`/trips/${params.id}/activity-logs`);
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="space-y-6 w-full mt-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Group activities by date
  const groupedMemories: Record<string, any[]> = {};
  activities.forEach(activity => {
    const dateStr = format(new Date(activity.createdAt), 'yyyy-MM-dd');
    if (!groupedMemories[dateStr]) groupedMemories[dateStr] = [];
    groupedMemories[dateStr].push(activity);
  });

  const sortedDates = Object.keys(groupedMemories).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-gradient-to-br from-[#0EA5E9]/10 to-[#8B5CF6]/10 p-8 rounded-3xl border border-white/60 shadow-sm backdrop-blur-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4 text-[#F97316]">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#0C4A6E] mb-2">Trip Memories</h2>
        <p className="text-[#486581] max-w-xl mx-auto">
          A chronological scrapbook of everything that happened. From planning the first destination to checking off the last task.
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-[#486581] bg-white/40 rounded-3xl border border-white">
          No memories recorded yet. Start planning your trip!
        </div>
      ) : (
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[50%] before:-translate-x-px before:h-full before:w-1 before:bg-gradient-to-b before:from-[#0EA5E9]/30 before:via-[#8B5CF6]/30 before:to-transparent">
          {sortedDates.map((dateStr) => {
            const dayActivities = groupedMemories[dateStr];
            
            return (
              <div key={dateStr} className="relative">
                {/* Date Marker */}
                <div className="flex items-center justify-start md:justify-center mb-8 relative z-10">
                  <div className="bg-white px-6 py-2 rounded-full shadow-md border border-[#0EA5E9]/20 font-bold text-[#0EA5E9] ml-12 md:ml-0 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                    {format(new Date(dateStr), 'MMMM do, yyyy')}
                  </div>
                </div>

                <div className="space-y-8">
                  {dayActivities.map((activity, index) => {
                    // Alternate left/right based on index for desktop
                    const isLeft = index % 2 === 0;

                    let Icon = Camera;
                    if (activity.action.includes('DESTINATION')) Icon = MapPin;
                    else if (activity.action.includes('TASK')) Icon = Calendar;

                    return (
                      <div key={activity.id} className={`relative flex items-center justify-between md:justify-normal ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} group`}>
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F0F9FF] bg-[#0EA5E9] text-white shadow-md shrink-0 md:order-1 md:group-odd:translate-x-[50%] md:group-even:-translate-x-[50%] absolute left-0 md:left-1/2 z-10">
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        {/* Card */}
                        <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] ml-12 md:ml-0 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-sm hover:shadow-lg transition-all ${isLeft ? 'md:mr-12 text-left' : 'md:ml-12 text-left md:text-right'}`}>
                          <div className={`flex items-center gap-2 mb-2 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                            <span className="font-bold text-[#0C4A6E] bg-[#0EA5E9]/10 px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                              {activity.action.replace(/_/g, ' ')}
                            </span>
                            <time className="text-xs font-bold text-[#486581] opacity-70">
                              {format(new Date(activity.createdAt), 'h:mm a')}
                            </time>
                          </div>
                          {activity.details && (
                            <p className="text-[#486581] font-medium leading-relaxed">{activity.details}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

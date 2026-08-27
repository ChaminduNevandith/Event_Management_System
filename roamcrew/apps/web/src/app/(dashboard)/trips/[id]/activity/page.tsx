"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {  Activity, Clock  } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripActivityPage() {
  const params = useParams();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      try {
        const data = await fetchApi(`/trips/${params.id}/activity-logs`);
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadActivity();
  }, [params.id]);

  if (isLoading) {
    return <div className="space-y-6 w-full mt-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl hidden md:block" />
          <Skeleton className="h-48 rounded-3xl hidden lg:block" />
        </div>
      </div>;
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg shadow-[#102a43]/5 p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <Activity className="h-6 w-6 text-[#0EA5E9]" />
        <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Trip Activity</h2>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 text-[#486581]">
          No recent activity to show.
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#0EA5E9]/20 before:to-transparent">
          {activities.map((activity) => (
            <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white/80 backdrop-blur-sm text-[#0EA5E9] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Clock className="w-4 h-4" />
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0C4A6E] text-sm uppercase tracking-wider">{activity.action.replace(/_/g, ' ')}</span>
                  <time className="text-xs font-bold text-[#486581] opacity-70">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </time>
                </div>
                {activity.details && (
                  <p className="text-sm text-[#486581]">{activity.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

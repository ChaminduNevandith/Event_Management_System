"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Map action strings to icons + colors
const ACTION_CONFIG: Record<string, { emoji: string; color: string }> = {
  CREATED_TRIP:          { emoji: "✈️",  color: "bg-[#0EA5E9]/10 text-[#0EA5E9]" },
  UPDATED_TRIP:          { emoji: "✏️",  color: "bg-amber-100 text-amber-600" },
  ARCHIVED_TRIP:         { emoji: "📦",  color: "bg-gray-100 text-gray-600" },
  RESTORED_TRIP:         { emoji: "♻️",  color: "bg-emerald-100 text-emerald-600" },
  DELETED_TRIP:          { emoji: "🗑️",  color: "bg-red-100 text-red-600" },
  MARKED_AS_TEMPLATE:    { emoji: "📋",  color: "bg-[#F97316]/10 text-[#F97316]" },
  UNMARKED_AS_TEMPLATE:  { emoji: "📋",  color: "bg-gray-100 text-gray-600" },
  GENERATED_PUBLIC_LINK: { emoji: "🔗",  color: "bg-purple-100 text-purple-600" },
  CREATED_FROM_TEMPLATE: { emoji: "🔄",  color: "bg-[#0EA5E9]/10 text-[#0EA5E9]" },
  ADDED_DESTINATION:     { emoji: "📍",  color: "bg-[#F97316]/10 text-[#F97316]" },
  UPDATED_DESTINATION:   { emoji: "📍",  color: "bg-amber-100 text-amber-600" },
  REMOVED_DESTINATION:   { emoji: "📍",  color: "bg-red-100 text-red-600" },
  ADDED_EXPENSE:         { emoji: "💰",  color: "bg-emerald-100 text-emerald-600" },
  UPDATED_EXPENSE:       { emoji: "💰",  color: "bg-amber-100 text-amber-600" },
  DELETED_EXPENSE:       { emoji: "💰",  color: "bg-red-100 text-red-600" },
  ADDED_TASK:            { emoji: "✅",  color: "bg-emerald-100 text-emerald-600" },
  COMPLETED_TASK:        { emoji: "✅",  color: "bg-emerald-100 text-emerald-600" },
  MEMBER_JOINED:         { emoji: "👤",  color: "bg-[#0EA5E9]/10 text-[#0EA5E9]" },
  MEMBER_LEFT:           { emoji: "👤",  color: "bg-gray-100 text-gray-600" },
};

function getActionConfig(action: string) {
  return ACTION_CONFIG[action] || { emoji: "📌", color: "bg-gray-100 text-gray-600" };
}

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
    return (
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg shadow-[#102a43]/5 p-6 md:p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg shadow-[#102a43]/5 p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#0EA5E9]/10 p-2.5 rounded-xl border border-[#0EA5E9]/20">
          <svg className="h-5 w-5 text-[#0EA5E9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Trip Audit Log</h2>
          <p className="text-sm text-[#486581]">A complete record of all changes to this trip</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-extrabold text-[#0C4A6E] mb-2">No Activity Yet</h3>
          <p className="text-[#486581] max-w-sm">Actions taken on this trip will appear here as a full audit history.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0EA5E9]/30 via-[#0EA5E9]/10 to-transparent" />

          <div className="space-y-1">
            {activities.map((activity, idx) => {
              const { emoji, color } = getActionConfig(activity.action);
              return (
                <div key={activity.id} className="relative flex items-start gap-4 pl-2 py-3 group">
                  {/* Icon bubble */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 border-2 border-white shadow-sm ${color}`}>
                    {emoji}
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-white/70 rounded-2xl px-4 py-3 border border-white shadow-sm group-hover:shadow-md transition-shadow min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span className="font-bold text-[#0C4A6E] text-sm">
                        {activity.action.replace(/_/g, ' ')}
                      </span>
                      <time className="text-xs font-medium text-[#9fb3c8] shrink-0">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                    {activity.details && (
                      <p className="text-sm text-[#486581] mt-1">{activity.details}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

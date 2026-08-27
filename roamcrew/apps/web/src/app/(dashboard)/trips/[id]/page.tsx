"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, isAfter, isToday } from "date-fns";
import { useAuth } from "@/components/auth-provider";
import { 
  MapPin, CheckSquare, Wallet, Activity, CalendarClock, 
  ArrowRight, Clock, Plus, Compass, MessageSquare, AlertCircle
} from "lucide-react";

export default function TripOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [tripData, tasksData, balancesData, activitiesData] = await Promise.all([
          fetchApi(`/trips/${params.id}`),
          fetchApi(`/trips/${params.id}/tasks`),
          fetchApi(`/trips/${params.id}/expenses/balances`),
          fetchApi(`/trips/${params.id}/activity-logs`)
        ]);
        
        setTrip(tripData);
        setTasks(tasksData);
        setBalances(balancesData);
        setActivities(activitiesData);
      } catch (err: any) {
        console.error("Failed to load overview data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      loadDashboardData();
    }
  }, [params.id, user]);

  if (isLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  if (!trip) return null;

  // Compute Upcoming Events
  const allEvents = (trip.destinations || []).flatMap((d: any) => 
    (d.itineraryItems || []).map((i: any) => ({ ...i, destinationName: d.name }))
  );
  
  const upcomingEvents = allEvents
    .filter((e: any) => e.startTime && (isAfter(new Date(e.startTime), new Date()) || isToday(new Date(e.startTime))))
    .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  // Compute My Pending Tasks
  const myPendingTasks = tasks
    .filter(t => t.assigneeId === user?.id && t.status !== 'COMPLETED')
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    })
    .slice(0, 3);

  // Compute Budget Snapshot
  const myBalance = balances.find(b => b.userId === user?.id)?.netBalance || 0;
  const isOwed = myBalance > 0;
  const isOwing = myBalance < 0;

  // Recent Activity
  const recentActivity = activities.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href={`/trips/${params.id}/itinerary`} className="group bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white hover:border-[#0EA5E9]/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
          <div className="bg-[#0EA5E9]/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Compass className="h-6 w-6 text-[#0EA5E9]" />
          </div>
          <span className="font-bold text-[#0C4A6E]">Itinerary</span>
        </Link>
        <Link href={`/trips/${params.id}/tasks`} className="group bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white hover:border-[#F97316]/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
          <div className="bg-[#F97316]/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <CheckSquare className="h-6 w-6 text-[#F97316]" />
          </div>
          <span className="font-bold text-[#0C4A6E]">Tasks</span>
        </Link>
        <Link href={`/trips/${params.id}/budget`} className="group bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white hover:border-[#10B981]/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
          <div className="bg-[#10B981]/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="h-6 w-6 text-[#10B981]" />
          </div>
          <span className="font-bold text-[#0C4A6E]">Budget</span>
        </Link>
        <Link href={`/trips/${params.id}/chat`} className="group bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white hover:border-[#8B5CF6]/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center">
          <div className="bg-[#8B5CF6]/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <MessageSquare className="h-6 w-6 text-[#8B5CF6]" />
          </div>
          <span className="font-bold text-[#0C4A6E]">Chat</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Events Widget */}
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm flex flex-col hover:border-[#0EA5E9]/30 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-[#0C4A6E] flex items-center">
              <CalendarClock className="mr-2 h-6 w-6 text-[#0EA5E9]" /> Up Next
            </h3>
            <Link href={`/trips/${params.id}/itinerary`} className="text-sm font-bold text-[#0EA5E9] hover:text-[#0284c7] flex items-center">
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
            {upcomingEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#829ab1] text-sm font-medium py-8 bg-white/40 rounded-2xl border-2 border-dashed border-[#0C4A6E]/10">
                <Compass className="h-8 w-8 mb-2 opacity-50" />
                No upcoming events scheduled.
              </div>
            ) : (
              upcomingEvents.map((event: any, i: number) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white/80 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all group">
                  <div className="bg-[#0EA5E9]/10 text-[#0EA5E9] p-3 rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[#0C4A6E] truncate">{event.title}</h4>
                    <p className="text-sm font-medium text-[#486581] mt-1 truncate">
                      {format(new Date(event.startTime), "MMM d, h:mm a")} • {event.destinationName}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Tasks Widget */}
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm flex flex-col hover:border-[#F97316]/30 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-[#0C4A6E] flex items-center">
              <CheckSquare className="mr-2 h-6 w-6 text-[#F97316]" /> My Tasks
            </h3>
            <Link href={`/trips/${params.id}/tasks`} className="text-sm font-bold text-[#F97316] hover:text-[#ea580c] flex items-center">
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-3 flex-1">
            {myPendingTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#829ab1] text-sm font-medium py-8 bg-white/40 rounded-2xl border-2 border-dashed border-[#0C4A6E]/10">
                <CheckSquare className="h-8 w-8 mb-2 opacity-50" />
                You're all caught up!
              </div>
            ) : (
              myPendingTasks.map(task => (
                <Link key={task.id} href={`/trips/${params.id}/tasks`} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-white shadow-sm hover:shadow-md transition-all group">
                  <div className="h-5 w-5 rounded border-2 border-[#F97316]/50 group-hover:border-[#F97316] group-hover:bg-[#F97316]/10 flex-shrink-0 transition-colors"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#0C4A6E] truncate text-sm">{task.title}</h4>
                    {task.dueDate && (
                      <p className="text-xs font-medium text-[#F97316] mt-0.5">
                        Due {format(new Date(task.dueDate), "MMM d")}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Budget Snapshot Widget */}
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm flex flex-col hover:border-[#10B981]/30 transition-colors">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-[#0C4A6E] flex items-center">
              <Wallet className="mr-2 h-6 w-6 text-[#10B981]" /> My Balance
            </h3>
            <Link href={`/trips/${params.id}/budget`} className="text-sm font-bold text-[#10B981] hover:text-[#059669] flex items-center">
              Open ledger <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center py-6 bg-white/40 rounded-2xl border border-white/60 shadow-inner">
             {myBalance === 0 ? (
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#10B981]/10 text-[#10B981] mb-3 group-hover:scale-110 transition-transform">
                    <CheckSquare className="h-7 w-7" />
                  </div>
                  <h4 className="font-extrabold text-2xl text-[#0C4A6E]">Settled Up</h4>
                  <p className="text-[#486581] font-medium text-sm mt-1">You don't owe anything.</p>
                </div>
             ) : (
                <div className="text-center group">
                  <h4 className={`font-extrabold text-4xl mb-2 group-hover:scale-105 transition-transform ${isOwed ? 'text-[#10B981]' : 'text-red-500'}`}>
                    ${Math.abs(myBalance).toFixed(2)}
                  </h4>
                  <p className="text-[#0C4A6E] font-bold">
                    {isOwed ? 'You are owed' : 'You owe the group'}
                  </p>
                </div>
             )}
          </div>
        </div>

        {/* Recent Activity Widget */}
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm flex flex-col hover:border-[#8B5CF6]/30 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-xl text-[#0C4A6E] flex items-center">
              <Activity className="mr-2 h-6 w-6 text-[#8B5CF6]" /> Activity
            </h3>
            <Link href={`/trips/${params.id}/activity`} className="text-sm font-bold text-[#8B5CF6] hover:text-[#7C3AED] flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4 flex-1">
             {recentActivity.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-[#829ab1] text-sm font-medium py-8 bg-white/40 rounded-2xl border-2 border-dashed border-[#0C4A6E]/10">
                 <Activity className="h-8 w-8 mb-2 opacity-50" />
                 No recent activity.
               </div>
             ) : (
               <div className="relative border-l-2 border-[#8B5CF6]/20 ml-3 space-y-6 mt-2">
                 {recentActivity.map((log: any) => (
                   <div key={log.id} className="relative pl-5 group">
                     <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-[#8B5CF6] shadow-[0_0_0_3px_rgba(255,255,255,1)] group-hover:scale-125 transition-transform"></div>
                     <p className="text-sm font-medium text-[#0C4A6E]">
                       {log.details || log.action?.replace(/_/g, ' ')}
                     </p>
                     <p className="text-xs font-medium text-[#829ab1] mt-0.5">
                       {format(new Date(log.createdAt), "MMM d, h:mm a")}
                     </p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

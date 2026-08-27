"use client";

import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

type ItineraryItem = {
  id: string;
  title: string;
  description?: string;
  startTime: string | null;
  endTime: string | null;
  isAllDay: boolean;
  type: string;
  destination: {
    trip: {
      id: string;
      title: string;
    };
  };
};

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi("/calendar/events");
      
      const itemEvents = (data.items || []).map((item: ItineraryItem) => ({
        id: item.id,
        title: item.title,
        start: item.startTime,
        end: item.endTime || item.startTime,
        allDay: item.isAllDay || (!item.startTime && !item.endTime),
        extendedProps: {
          tripId: item.destination.trip.id,
          tripTitle: item.destination.trip.title,
          type: item.type,
          description: item.description,
        },
        backgroundColor: getColorForType(item.type),
        borderColor: getColorForType(item.type),
      }));

      const tripEvents = (data.trips || []).map((trip: any) => ({
        id: `trip-${trip.id}`,
        title: `🛫 Trip: ${trip.title}`,
        start: trip.startDate,
        end: trip.endDate || trip.startDate,
        allDay: true,
        extendedProps: {
          tripId: trip.id,
          tripTitle: trip.title,
          type: 'TRIP',
          description: trip.description,
        },
        backgroundColor: '#475569',
        borderColor: '#334155',
      }));

      setEvents([...tripEvents, ...itemEvents]);
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case "FLIGHT": return "#0ea5e9";
      case "TRANSPORT": return "#8b5cf6";
      case "ACCOMMODATION": return "#f59e0b";
      case "DINING": return "#ef4444";
      case "NOTE": return "#94a3b8";
      case "ACTIVITY":
      default:
        return "#10b981";
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const { tripId } = clickInfo.event.extendedProps;
    router.push(`/trips/${tripId}/itinerary`);
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="flex flex-col p-1 overflow-hidden">
        <div className="font-semibold text-xs whitespace-nowrap overflow-hidden text-ellipsis">
          {eventInfo.event.title}
        </div>
        {!eventInfo.event.allDay && (
          <div className="text-[10px] opacity-90 truncate">
            {eventInfo.timeText} - {eventInfo.event.extendedProps.tripTitle}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex items-center mb-8">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20 mr-4">
          <CalendarIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#0C4A6E] tracking-tight">Your Schedule</h1>
          <p className="text-[#486581]">View all your itineraries across your trips.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e2e8f0]">
        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-[#0EA5E9] animate-spin" />
          </div>
        ) : (
          <div className="calendar-container">
            <style jsx global>{`
              .calendar-container .fc {
                font-family: inherit;
              }
              .calendar-container .fc-theme-standard td, .calendar-container .fc-theme-standard th {
                border-color: #f1f5f9;
              }
              .calendar-container .fc-col-header-cell-cushion {
                padding: 12px;
                color: #475569;
                font-weight: 600;
                text-decoration: none;
              }
              .calendar-container .fc-daygrid-day-number {
                padding: 8px;
                color: #0f172a;
                font-weight: 500;
                text-decoration: none;
              }
              .calendar-container .fc-event {
                cursor: pointer;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                transition: transform 0.1s, box-shadow 0.1s;
                border: none;
              }
              .calendar-container .fc-event:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .calendar-container .fc-button-primary {
                background-color: #0ea5e9 !important;
                border-color: #0ea5e9 !important;
                text-transform: capitalize;
                border-radius: 8px;
                font-weight: 600;
              }
              .calendar-container .fc-button-primary:not(:disabled):active, .calendar-container .fc-button-primary:not(:disabled).fc-button-active {
                background-color: #0284c7 !important;
                border-color: #0284c7 !important;
              }
              .calendar-container .fc-toolbar-title {
                font-size: 1.5rem !important;
                font-weight: 700 !important;
                color: #0c4a6e;
              }
              .calendar-container .fc-day-today {
                background-color: #f0f9ff !important;
              }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              contentHeight="auto"
              dayMaxEvents={true}
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

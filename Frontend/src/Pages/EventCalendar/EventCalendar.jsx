import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Loader2, 
  Calendar as CalendarIcon, MapPin, Clock 
} from "lucide-react";
import Sidebar from "../../Componets/Sidebar"; // Adjust path as needed

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/event");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Calendar Logic Variables
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Handlers to change months
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Helper to find events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Dashboard Sidebar */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Event Calendar</h2>
              <p className="text-gray-500 mt-1 font-light">Get a bird's-eye view of all your upcoming events.</p>
            </div>
            
            {/* Calendar Controls */}
            <div className="flex items-center space-x-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <button 
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Today
              </button>
              <div className="w-px h-6 bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={prevMonth}
                  className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 w-40 text-center">
                  {monthNames[month]} {year}
                </h3>
                <button 
                  onClick={nextMonth}
                  className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading calendar...</p>
            </div>
          ) : (
            /* Calendar Grid Container */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              
              {/* Days of the Week Row */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* The Calendar Grid */}
              <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(120px,1fr)] bg-gray-100 gap-px">
                
                {/* Blank cells for days before the 1st of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="bg-gray-50/50"></div>
                ))}

                {/* Actual Days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayEvents = getEventsForDay(day);
                  
                  // Check if this cell is exactly "today"
                  const isToday = 
                    day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();

                  return (
                    <div 
                      key={day} 
                      className={`bg-white p-2 flex flex-col hover:bg-indigo-50/10 transition-colors group ${isToday ? 'ring-2 ring-inset ring-indigo-500' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                          {day}
                        </span>
                      </div>
                      
                      {/* Event Chips Container */}
                      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id}
                            onClick={() => navigate(`/view-event/${event.id}`, { state: event })}
                            className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm"
                            title={event.event_name}
                          >
                            <p className="font-semibold truncate">{event.event_name}</p>
                            <p className="text-[10px] opacity-80 flex items-center truncate mt-0.5">
                              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                              {event.event_time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Blank cells to fill the last row if needed */}
                {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, index) => (
                  <div key={`empty-end-${index}`} className="bg-gray-50/50"></div>
                ))}

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global Style specifically for the scrollbar inside calendar cells so it stays clean */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default EventCalendar;
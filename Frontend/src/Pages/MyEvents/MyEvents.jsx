import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Clock, Plus, 
  Users, Eye, Edit, Trash2, 
  Loader2, CalendarDays, MoreVertical
} from "lucide-react";
import Sidebar from "../../Componets/Sidebar"; // Adjust path as needed

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      // Replace with your endpoint that fetches ONLY the logged-in user's events
      const response = await axios.get("http://localhost:5000/event");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching my events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // --- ACTION HANDLERS ---
  const handleView = (event) => navigate(`/view-event/${event.id}`, { state: event });
  const handleEdit = (event) => navigate(`/update-event/${event.id}`, { state: event }); // Assuming you'll make an edit page, or you can trigger a modal
  
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/event/${eventId}`);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event.");
      }
    }
  };

  // --- FILTER LOGIC ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.event_date);
    if (activeTab === "upcoming") {
      return eventDate >= today;
    } else {
      return eventDate < today;
    }
  });

  return (
    <div className="flex h-screen bg-gray-50 relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Dashboard Sidebar */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">My Events</h2>
              <p className="text-gray-500 mt-1 font-light">Manage the events you are hosting.</p>
            </div>
            
            <button
              onClick={() => navigate('/add-event')}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 w-fit">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === "upcoming" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === "past" 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-transparent">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading your events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            
            /* EVENT CARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.event_date);
                const month = eventDate.toLocaleString('default', { month: 'short' });
                const day = eventDate.getDate();

                return (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group"
                  >
                    {/* Card Header (Gradient Image Placeholder) */}
                    <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 relative">
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-center shadow-sm">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide leading-none">{month}</p>
                        <p className="text-xl font-extrabold text-gray-900 leading-none mt-1">{day}</p>
                      </div>
                      {/* Ticket Price Badge */}
                      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-semibold text-sm">
                        ${event.ticketprice}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={event.event_name}>
                        {event.event_name}
                      </h3>
                      
                      <div className="space-y-2 mb-6 flex-1">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                          {event.event_time}
                        </div>
                        <div className="flex items-start text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{event.venue}</span>
                        </div>
                      </div>

                      {/* Card Footer (Actions) */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        
                        <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                          {/* Mock Guest Count - you can replace with actual count */}
                          {Math.floor(Math.random() * 50) + 10} Guests
                        </div>

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleView(event)}
                            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(event)}
                            className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(event.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center mt-4">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-6">
                <CalendarDays className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === "upcoming" ? "No upcoming events" : "No past events"}
              </h3>
              <p className="text-gray-500 max-w-md mb-8">
                {activeTab === "upcoming" 
                  ? "You haven't created any events yet, or all your events have already passed. Time to start planning!" 
                  : "You don't have any past events recorded in the system yet."}
              </p>
              
              {activeTab === "upcoming" && (
                <button
                  onClick={() => navigate('/add-event')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Event
                </button>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MyEvents;
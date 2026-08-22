import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, MapPin, Clock, Ticket, 
  Loader2, CalendarDays, Eye, Edit, 
  Trash2, Users, X, Plus, User
} from "lucide-react";
import Sidebar from "../../Componets/Sidebar";  

const EventDetails = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- MODAL STATES ---
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // State for the update form
  const [updateFormData, setUpdateFormData] = useState({
    event_name: "", description: "", event_date: "", event_time: "", venue: "", ticketprice: ""
  });

  // Mock state for Guest List (Replace with actual API data)
  const [guests, setGuests] = useState([]);
  const [newGuestName, setNewGuestName] = useState("");

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

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- ACTION HANDLERS ---
  
  const handleView = (event) => {
    navigate(`/view-event/${event.id}`, { state: event });
  };

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

  // --- UPDATE MODAL LOGIC ---
  const handleOpenUpdate = (event) => {
    setSelectedEvent(event);
    const formattedDate = new Date(event.event_date).toISOString().split("T")[0];
    
    setUpdateFormData({
      ...event,
      event_date: formattedDate
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/event/${selectedEvent.id}`, updateFormData);
      
      setEvents(events.map(ev => (ev.id === selectedEvent.id ? updateFormData : ev)));
      setIsUpdateModalOpen(false);
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  // --- GUEST LIST MODAL LOGIC ---
  const handleOpenGuestList = async (event) => {
    setSelectedEvent(event);
    setIsGuestModalOpen(true);
    
    // Using mock data for UI display
    setGuests([{ id: 1, name: "Alice Johnson" }, { id: 2, name: "Bob Smith" }]);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    try {
      const newGuest = { id: Date.now(), name: newGuestName };
      setGuests([...guests, newGuest]);
      setNewGuestName("");
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* ===== HEADER SECTION ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Manage Events</h2>
              <p className="text-gray-500 mt-1 font-light">View, update, and manage your upcoming events and guest lists.</p>
            </div>
            
            {/* NEW: Add Event Button */}
            <button
              onClick={() => navigate('/add-event')}
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Event
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading amazing events...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                      <th className="p-5 whitespace-nowrap">Event Name</th>
                      <th className="p-5 whitespace-nowrap">Date & Time</th>
                      <th className="p-5 whitespace-nowrap">Venue</th>
                      <th className="p-5 whitespace-nowrap">Ticket Price</th>
                      <th className="p-5 text-center whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="p-5 align-top">
                            <p className="font-semibold text-gray-900 text-lg mb-1">{event.event_name}</p>
                            <p className="text-sm text-gray-500 font-light line-clamp-2 max-w-xs">{event.description}</p>
                          </td>
                          <td className="p-5 align-top whitespace-nowrap">
                            <div className="flex items-center text-gray-700 mb-1">
                              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                              <span className="font-medium">
                                {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.event_time}
                            </div>
                          </td>
                          <td className="p-5 align-top">
                            <div className="flex items-start text-gray-700 max-w-xs">
                              <MapPin className="w-4 h-4 mr-2 text-fuchsia-500 flex-shrink-0 mt-0.5" />
                              <span className="font-medium">{event.venue}</span>
                            </div>
                          </td>
                          <td className="p-5 align-top whitespace-nowrap">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold text-sm border border-green-100">
                              <Ticket className="w-4 h-4 mr-1.5" />
                              ${event.ticketprice}
                            </div>
                          </td>
                          <td className="p-5 align-middle">
                            <div className="flex items-center justify-center space-x-2">
                              <button onClick={() => handleView(event)} title="View Event" className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg transition-colors">
                                <Eye className="w-5 h-5" />
                              </button>
                              
                              <button onClick={() => handleOpenGuestList(event)} title="Manage Guest List" className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg transition-colors">
                                <Users className="w-5 h-5" />
                              </button>
                              
                              <button onClick={() => handleOpenUpdate(event)} title="Edit Event" className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-800 rounded-lg transition-colors">
                                <Edit className="w-5 h-5" />
                              </button>
                              
                              <button onClick={() => handleDelete(event.id)} title="Delete Event" className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 rounded-lg transition-colors">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarDays className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium text-lg">No events scheduled yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* UPDATE EVENT MODAL */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Update Event</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input 
                  type="text" required
                  value={updateFormData.event_name} 
                  onChange={(e) => setUpdateFormData({...updateFormData, event_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required rows="3"
                  value={updateFormData.description} 
                  onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" required
                    value={updateFormData.event_date} 
                    onChange={(e) => setUpdateFormData({...updateFormData, event_date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" required
                    value={updateFormData.event_time} 
                    onChange={(e) => setUpdateFormData({...updateFormData, event_time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <input 
                    type="text" required
                    value={updateFormData.venue} 
                    onChange={(e) => setUpdateFormData({...updateFormData, venue: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    value={updateFormData.ticketprice} 
                    onChange={(e) => setUpdateFormData({...updateFormData, ticketprice: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUEST LIST MODAL */}
      {isGuestModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Guest List</h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[250px]">{selectedEvent.event_name}</p>
              </div>
              <button onClick={() => setIsGuestModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {guests.length > 0 ? (
                <ul className="space-y-3">
                  {guests.map((guest) => (
                    <li key={guest.id} className="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-800">{guest.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No guests added yet.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <form onSubmit={handleAddGuest} className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Enter guest name..." 
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!newGuestName.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl shadow-md transition-all flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetails;
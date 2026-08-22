import React, { useState } from "react";
import axios from "axios";
import { 
  Type, AlignLeft, Calendar, Clock, 
  MapPin, Ticket, Loader2, AlertCircle, CheckCircle2 
} from "lucide-react";
import Sidebar from "../../Componets/Sidebar"; // Ensure this path matches where you saved Sidebar.jsx

const EventForm = () => {
  const [eventData, setEventData] = useState({
    event_name: "",
    description: "",
    event_date: "",
    event_time: "",
    venue: "",
    ticketprice: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:5000/events", eventData);
      console.log("Event saved:", response.data);

      // Clear the form after successful submission
      setEventData({
        event_name: "",
        description: "",
        event_date: "",
        event_time: "",
        venue: "",
        ticketprice: "",
      });
      
      setSuccessMessage("Awesome! Your event has been successfully created.");
      
      // Auto-hide success message after 4 seconds
      setTimeout(() => setSuccessMessage(""), 4000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Something went wrong";
      console.error("Error saving event:", errorMsg);
      setErrorMessage("Failed to save event: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Dashboard Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
            <p className="text-gray-500 mt-1 font-light">Fill out the details below to publish a new event to the platform.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            
            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-6 flex items-start p-4 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMessage && (
              <div className="mb-6 flex items-start p-4 text-sm text-green-800 border border-green-200 rounded-xl bg-green-50 font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="event_name">
                  Event Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="event_name"
                    id="event_name"
                    placeholder="e.g., Summer Music Festival 2024"
                    value={eventData.event_name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                    <AlignLeft className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    id="description"
                    rows="4"
                    placeholder="What is this event about?"
                    value={eventData.description}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              {/* Date and Time (Side by Side on Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="event_date">
                    Event Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="event_date"
                      id="event_date"
                      value={eventData.event_date}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="event_time">
                    Event Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="event_time"
                      id="event_time"
                      value={eventData.event_time}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Venue and Price (Side by Side on Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="venue">
                    Venue / Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="venue"
                      id="venue"
                      placeholder="e.g., Central Park Pavilion"
                      value={eventData.venue}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ticketprice">
                    Ticket Price ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Ticket className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="ticketprice"
                      id="ticketprice"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={eventData.ticketprice}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving Event...
                    </>
                  ) : (
                    'Publish Event'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventForm;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  Calendar, MapPin, Clock, Ticket, CheckSquare, 
  Users, DollarSign, Paperclip, Bell, ArrowLeft,
  Map, MoreHorizontal, Download, Plus, CheckCircle2, Circle
} from "lucide-react";
import Sidebar from "../../Componets/Sidebar"; // Adjust path as needed

const EventView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Active tab state
  const [activeTab, setActiveTab] = useState("details");

  // Fallback mock data in case the user navigates directly without passing state
  const event = state || {
    id: 1,
    event_name: "Summer Music Festival 2024",
    description: "Join us for the biggest summer music festival featuring top artists, food trucks, and amazing vibes. Don't forget your sunscreen and good energy!",
    event_date: "2024-08-15",
    event_time: "14:00",
    venue: "Central Park, New York",
    ticketprice: "150.00"
  };

  // Mock Data for the different categories (You will replace these with API calls later)
  const todos = [
    { id: 1, task: "Book main stage lighting", completed: true },
    { id: 2, task: "Finalize catering menu", completed: false },
    { id: 3, task: "Send VIP invitations", completed: false },
  ];

  const budget = {
    allocated: 15000,
    spent: 9500,
    expenses: [
      { id: 1, item: "Venue Deposit", amount: 5000, date: "Jul 10" },
      { id: 2, item: "Audio/Visual Setup", amount: 3500, date: "Jul 15" },
      { id: 3, item: "Marketing Ads", amount: 1000, date: "Jul 20" },
    ]
  };

  const attachments = [
    { id: 1, name: "Stage_Layout_v2.pdf", size: "2.4 MB", type: "pdf" },
    { id: 2, name: "Catering_Contract.docx", size: "1.1 MB", type: "doc" },
  ];

  const reminders = [
    { id: 1, title: "Final headcount due", date: "Aug 1, 2024", type: "Warning" },
    { id: 2, title: "Pay catering balance", date: "Aug 10, 2024", type: "Payment" },
  ];

  // Helper to format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  // Google Maps Embed URL generator
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.venue)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  // Tab definitions
  const tabs = [
    { id: "details", label: "Overview", icon: Map },
    { id: "todos", label: "To-Do List", icon: CheckSquare },
    { id: "guests", label: "Guests", icon: Users },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "attachments", label: "Attachments", icon: Paperclip },
    { id: "reminders", label: "Reminders", icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-gray-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/show')}
            className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Events
          </button>
          <div className="flex space-x-3">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
          
          {/* EVENT HEADER CARD */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
            {/* Decorative background shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-4">
                  Upcoming Event
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                  {event.event_name}
                </h1>
                <div className="flex flex-wrap items-center text-gray-600 gap-y-2 gap-x-6 font-medium">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                    {formatDate(event.event_date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                    {event.event_time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-2xl mb-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    isActive 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREA */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* 1. OVERVIEW & MAP TAB */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Details */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About this Event</h3>
                    <p className="text-gray-600 leading-relaxed font-light">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start">
                      <div className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-xl mr-4">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Venue Location</p>
                        <p className="font-semibold text-gray-900">{event.venue}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl mr-4">
                        <Ticket className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Ticket Price</p>
                        <p className="font-semibold text-gray-900 text-xl">${event.ticketprice}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Map */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 h-[400px]">
                  <iframe 
                    title="Google Map"
                    src={mapEmbedUrl}
                    className="w-full h-full rounded-xl border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            )}

            {/* 2. TODO LIST TAB */}
            {activeTab === "todos" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Task List</h3>
                  <button className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div key={todo.id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500 mr-4 cursor-pointer" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 mr-4 cursor-pointer hover:text-gray-400" />
                      )}
                      <span className={`font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {todo.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BUDGET & EXPENSES TAB */}
            {activeTab === "budget" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 font-medium mb-1">Total Budget</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">${budget.allocated.toLocaleString()}</h3>
                    
                    <div className="text-left mb-2 flex justify-between text-sm font-medium">
                      <span className="text-gray-600">Spent: ${budget.spent.toLocaleString()}</span>
                      <span className="text-gray-400">Left: ${(budget.allocated - budget.spent).toLocaleString()}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" 
                        style={{ width: `${(budget.spent / budget.allocated) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 text-left">{Math.round((budget.spent / budget.allocated) * 100)}% of budget utilized</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Recent Expenses</h3>
                      <button className="text-sm font-medium text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                        <Plus className="w-4 h-4 mr-1" /> Add Expense
                      </button>
                    </div>
                    <div className="space-y-4">
                      {budget.expenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900">{expense.item}</p>
                            <p className="text-xs text-gray-400 mt-1">{expense.date}</p>
                          </div>
                          <span className="font-bold text-gray-900">${expense.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ATTACHMENTS TAB */}
            {activeTab === "attachments" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Event Documents</h3>
                  <button className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Upload File
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors group">
                      <div className="flex items-center">
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg mr-4">
                          <Paperclip className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{file.size}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. REMINDERS & NOTIFICATIONS TAB */}
            {activeTab === "reminders" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-3xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Scheduled Reminders</h3>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white"></div>
                      <p className="text-xs font-semibold text-indigo-600 mb-1 tracking-wider uppercase">{reminder.date}</p>
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl inline-block min-w-[300px]">
                        <p className="font-medium text-gray-900">{reminder.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. GUESTS TAB (Fallback if they want to view full screen instead of modal) */}
            {activeTab === "guests" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-3xl">
                 <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Guest List Management</h3>
                 <p className="text-gray-500 mb-6">View and manage attendees for this specific event.</p>
                 <button onClick={() => navigate(`/guest-list/${event.id}`)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                   Open Guest Manager
                 </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default EventView;
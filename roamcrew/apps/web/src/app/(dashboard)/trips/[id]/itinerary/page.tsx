"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Plus, Calendar, Clock, MapPin, Plane, Train, Bus, Car, Home, Camera, Utensils, Users, Hash, Trash2 } from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";

const iconMap: Record<string, any> = {
  FLIGHT: Plane,
  TRANSPORT: Bus,
  ACCOMMODATION: Home,
  ACTIVITY: Camera,
  DINING: Utensils,
  NOTE: Hash,
};

const colorMap: Record<string, string> = {
  FLIGHT: "bg-blue-100 text-blue-600 border-blue-200",
  TRANSPORT: "bg-emerald-100 text-emerald-600 border-emerald-200",
  ACCOMMODATION: "bg-purple-100 text-purple-600 border-purple-200",
  ACTIVITY: "bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/20",
  DINING: "bg-orange-100 text-orange-600 border-orange-200",
  NOTE: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function ItineraryPage() {
  const params = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("ACTIVITY");
  const [destinationId, setDestinationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [itemsData, destsData] = await Promise.all([
        fetchApi(`/trips/${params.id}/itinerary`),
        fetchApi(`/trips/${params.id}/destinations`)
      ]);
      setItems(itemsData);
      setDestinations(destsData);
      if (destsData.length > 0) setDestinationId(destsData[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleDelete = async (itemId: string) => {
    if (!confirm("Remove this item from the itinerary?")) return;
    try {
      await fetchApi(`/trips/${params.id}/itinerary/${itemId}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
      const endIso = new Date(`${endDate}T${endTime}:00`).toISOString();

      await fetchApi(`/trips/${params.id}/itinerary`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          type,
          destinationId,
          startTime: startIso,
          endTime: endIso,
        })
      });

      setShowModal(false);
      setTitle("");
      setDescription("");
      setType("ACTIVITY");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to create item");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group items by day
  const groupedItems = items.reduce((acc: any, item: any) => {
    const day = format(parseISO(item.startTime), "yyyy-MM-dd");
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const sortedDays = Object.keys(groupedItems).sort();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Daily Itinerary</h2>
          <p className="text-[#486581] font-medium text-sm mt-1">Your journey timeline</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </button>
      </div>

      <div className="space-y-12">
        {sortedDays.map((day) => {
          const dayItems = groupedItems[day];
          return (
            <div key={day} className="relative">
              {/* Day Header */}
              <div className="sticky top-4 z-20 mb-6 flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center bg-white border-2 border-[#0EA5E9]/20 rounded-2xl w-16 h-16 shadow-lg shadow-[#0EA5E9]/5">
                  <span className="text-xs font-bold text-[#0EA5E9] uppercase">{format(parseISO(day), "MMM")}</span>
                  <span className="text-2xl font-black text-[#0C4A6E] leading-none">{format(parseISO(day), "d")}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0C4A6E]">{format(parseISO(day), "EEEE")}</h3>
                  <p className="text-sm font-medium text-[#486581]">{dayItems.length} events</p>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="relative pl-8 md:pl-24 space-y-6">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-[5.5rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#0EA5E9]/50 via-[#0EA5E9]/20 to-transparent"></div>

                {dayItems.map((item: any, idx: number) => {
                  const Icon = iconMap[item.type] || Hash;
                  const colorClass = colorMap[item.type] || colorMap.NOTE;

                  return (
                    <div key={item.id} className="relative group">
                      {/* Timeline Dot & Line Connector */}
                      <div className="absolute -left-[1.35rem] md:left-[-3.1rem] top-6 flex items-center justify-center">
                        <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-md z-10 transition-transform group-hover:scale-110 ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Time (Desktop Only) */}
                      <div className="hidden md:block absolute left-[-9rem] top-6 w-20 text-right">
                        <div className="font-bold text-[#0C4A6E]">{format(parseISO(item.startTime), "HH:mm")}</div>
                        <div className="text-xs font-medium text-[#486581]">
                          {format(parseISO(item.endTime), "HH:mm")}
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-lg shadow-[#102a43]/5 flex flex-col sm:flex-row sm:items-start transition-all hover:shadow-xl hover:border-[#0EA5E9]/30">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
                              {item.type}
                            </span>
                            <div className="md:hidden flex items-center text-sm font-bold text-[#0C4A6E]">
                              <Clock className="w-3.5 h-3.5 mr-1 text-[#0EA5E9]" />
                              {format(parseISO(item.startTime), "HH:mm")} - {format(parseISO(item.endTime), "HH:mm")}
                            </div>
                          </div>
                          <h4 className="text-lg font-bold text-[#0C4A6E] leading-tight mb-1">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-[#486581] leading-relaxed">{item.description}</p>
                          )}
                          
                          {item.destination && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <div className="inline-flex items-center bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">
                                <MapPin className="w-3 h-3 mr-1" />
                                {item.destination.name}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="py-20 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60">
            <Calendar className="h-16 w-16 text-[#0EA5E9]/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#0C4A6E] mb-2">No itinerary yet</h3>
            <p className="text-[#486581] font-medium max-w-md mx-auto mb-8">Start adding flights, activities, and accommodations to build your daily schedule.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center rounded-xl bg-white border-2 border-[#0EA5E9]/20 px-6 py-3 text-sm font-bold text-[#0EA5E9] shadow-sm transition-all hover:bg-[#f0f9ff] hover:border-[#0EA5E9]/40"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add First Event
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2">Add Event</h2>
            <p className="text-[#486581] text-sm mb-6">Schedule an activity, flight, or stay.</p>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Destination</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white font-medium"
                  required
                >
                  <option value="" disabled>Select a destination</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                  placeholder="e.g. Flight to Paris, Dinner at Louie's"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white font-medium"
                  >
                    <option value="FLIGHT">✈️ Flight</option>
                    <option value="TRANSPORT">🚆 Transport</option>
                    <option value="ACCOMMODATION">🏨 Accommodation</option>
                    <option value="ACTIVITY">📸 Activity</option>
                    <option value="DINING">🍽️ Dining</option>
                    <option value="NOTE">📌 Note</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Notes (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white min-h-[80px]"
                  placeholder="Booking references, meeting points..."
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border-2 border-white bg-white/50 px-4 py-3 text-sm font-bold text-[#486581] transition-all hover:bg-white hover:text-[#0C4A6E] shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { MapPin, Plus, Plane, Bed, Utensils, Activity, Car, NotebookText, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

const getItemIcon = (type: string) => {
  switch (type) {
    case 'FLIGHT': return <Plane className="h-5 w-5 text-blue-500" />;
    case 'ACCOMMODATION': return <Bed className="h-5 w-5 text-indigo-500" />;
    case 'DINING': return <Utensils className="h-5 w-5 text-orange-500" />;
    case 'TRANSPORT': return <Car className="h-5 w-5 text-emerald-500" />;
    case 'NOTE': return <NotebookText className="h-5 w-5 text-slate-500" />;
    case 'ACTIVITY':
    default: return <Activity className="h-5 w-5 text-rose-500" />;
  }
};

export default function TripItineraryPage() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddingDest, setIsAddingDest] = useState(false);
  const [destName, setDestName] = useState("");
  const [isSubmittingDest, setIsSubmittingDest] = useState(false);

  const [addingItemToDest, setAddingItemToDest] = useState<string | null>(null);
  const [itemData, setItemData] = useState({ title: "", description: "", type: "ACTIVITY", startTime: "", endTime: "" });
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      try {
        const data = await fetchApi(`/trips/${params.id}`);
        setTrip(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrip();
  }, [params.id]);

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destName) return;
    setIsSubmittingDest(true);

    try {
      const newDest = await fetchApi(`/trips/${params.id}/destinations`, {
        method: "POST",
        body: JSON.stringify({ name: destName }),
      });
      setTrip((prev: any) => ({
        ...prev,
        destinations: [...(prev.destinations || []), newDest],
      }));
      setDestName("");
      setIsAddingDest(false);
    } catch (err: any) {
      alert(err.message || "Failed to add destination");
    } finally {
      setIsSubmittingDest(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent, destId: string) => {
    e.preventDefault();
    if (!itemData.title) return;
    setIsSubmittingItem(true);

    try {
      const newItem = await fetchApi(`/trips/${params.id}/destinations/${destId}/items`, {
        method: "POST",
        body: JSON.stringify({
          title: itemData.title,
          description: itemData.description,
          type: itemData.type,
          startTime: itemData.startTime ? new Date(itemData.startTime).toISOString() : undefined,
          endTime: itemData.endTime ? new Date(itemData.endTime).toISOString() : undefined,
        }),
      });

      setTrip((prev: any) => ({
        ...prev,
        destinations: prev.destinations.map((d: any) => 
          d.id === destId 
            ? { ...d, itineraryItems: [...(d.itineraryItems || []), newItem] } 
            : d
        )
      }));
      setAddingItemToDest(null);
      setItemData({ title: "", description: "", type: "ACTIVITY", startTime: "", endTime: "" });
    } catch (err: any) {
      alert(err.message || "Failed to add activity");
    } finally {
      setIsSubmittingItem(false);
    }
  };

  const handleDeleteItem = async (destId: string, itemId: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await fetchApi(`/trips/${params.id}/items/${itemId}`, { method: "DELETE" });
      setTrip((prev: any) => ({
        ...prev,
        destinations: prev.destinations.map((d: any) => 
          d.id === destId 
            ? { ...d, itineraryItems: d.itineraryItems.filter((i: any) => i.id !== itemId) } 
            : d
        )
      }));
    } catch (err: any) {
      alert("Failed to delete item: " + err.message);
    }
  };

  if (isLoading || !trip) return null; // Let the layout handle the main loading state

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0C4A6E] flex items-center ml-2">
          <MapPin className="mr-2 h-6 w-6 text-[#0EA5E9]" /> Itinerary
        </h2>
        {!isAddingDest && (
          <button 
            onClick={() => setIsAddingDest(true)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0EA5E9] px-4 text-sm font-bold text-white shadow-md shadow-[#0EA5E9]/20 transition-all hover:bg-[#0284c7] hover:-translate-y-0.5"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Stop
          </button>
        )}
      </div>

      {isAddingDest && (
        <form onSubmit={handleAddDestination} className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-end shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-bold text-[#243b53]" htmlFor="destName">
              Where to?
            </label>
            <input
              id="destName"
              required
              autoFocus
              placeholder="e.g. Kyoto, Japan"
              className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-sm px-4 py-2 text-base text-[#0C4A6E] font-medium placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition-all shadow-sm"
              value={destName}
              onChange={(e) => setDestName(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              type="button"
              onClick={() => setIsAddingDest(false)}
              className="h-12 flex-1 sm:flex-none px-6 rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 text-sm font-bold text-[#0C4A6E] hover:bg-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingDest || !destName}
              className="h-12 flex-1 sm:flex-none px-6 rounded-xl bg-[#0EA5E9] text-white text-sm font-bold shadow-md shadow-[#0EA5E9]/20 hover:bg-[#0284c7] transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmittingDest ? "Adding..." : "Add Stop"}
            </button>
          </div>
        </form>
      )}

      {trip.destinations?.length > 0 ? (
        <div className="space-y-6 pt-2">
          {trip.destinations.map((dest: any, index: number) => {
            const items = (dest.itineraryItems || []).sort((a: any, b: any) => {
              if (!a.startTime) return 1;
              if (!b.startTime) return -1;
              return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });

            return (
              <div key={dest.id} className="relative pl-10 group">
                {index !== trip.destinations.length - 1 && (
                  <div className="absolute left-[15px] top-10 bottom-[-32px] w-1 bg-gradient-to-b from-[#0EA5E9] to-[#38BDF8]/30 rounded-full"></div>
                )}
                <div className="absolute left-0 top-3 h-8 w-8 rounded-full border-[6px] border-[#F0F9FF] bg-[#0EA5E9] shadow-md z-10 flex items-center justify-center transition-transform group-hover:scale-110"></div>
                
                <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[#0EA5E9]/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0EA5E9]/10 pb-4 mb-6">
                    <h3 className="text-2xl font-extrabold text-[#0C4A6E]">
                      {dest.name}
                    </h3>
                    {dest.startDate ? (
                      <span className="text-sm font-bold bg-[#F97316]/10 text-[#F97316] px-4 py-1.5 rounded-full border border-[#F97316]/20">
                        {format(new Date(dest.startDate), "MMM d")}
                      </span>
                    ) : (
                      <span className="text-sm font-bold bg-white/50 text-[#829ab1] px-4 py-1.5 rounded-full border border-white">
                        Dates TBD
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {items.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/40 border-2 border-dashed border-[#0EA5E9]/20 text-center text-sm font-medium text-[#486581] flex flex-col items-center justify-center">
                        <Clock className="h-8 w-8 text-[#0EA5E9]/40 mb-2" />
                        No activities planned for this stop.
                      </div>
                    ) : (
                      items.map((item: any) => (
                        <div key={item.id} className="group/item flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-white shadow-sm hover:shadow-md hover:bg-white/70 transition-all">
                          <div className="h-10 w-10 rounded-full bg-white border border-[#0EA5E9]/10 flex flex-shrink-0 items-center justify-center shadow-sm">
                            {getItemIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-[#0C4A6E] truncate">{item.title}</h4>
                              <button onClick={() => handleDeleteItem(dest.id, item.id)} className="text-[#829ab1] hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm font-medium text-[#486581]">
                              <span className="inline-flex items-center">
                                <Clock className="mr-1.5 h-3.5 w-3.5" />
                                {item.startTime ? format(new Date(item.startTime), "MMM d, h:mm a") : "Time TBD"}
                              </span>
                              {item.description && (
                                <span className="truncate max-w-md hidden sm:inline-block text-[#829ab1]">
                                  • {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {addingItemToDest === dest.id ? (
                    <form onSubmit={(e) => handleAddItem(e, dest.id)} className="mt-6 bg-white/70 rounded-2xl p-5 border border-white shadow-sm">
                      <h4 className="font-bold text-[#0C4A6E] mb-4 text-sm uppercase tracking-wider">New Activity</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-[#486581] mb-1 block">Title</label>
                          <input required value={itemData.title} onChange={e => setItemData({...itemData, title: e.target.value})} className="w-full h-10 rounded-xl border-none bg-white px-3 text-sm focus:ring-2 focus:ring-[#0EA5E9]/50 shadow-sm" placeholder="e.g. Dinner at Nobu" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#486581] mb-1 block">Type</label>
                          <select value={itemData.type} onChange={e => setItemData({...itemData, type: e.target.value})} className="w-full h-10 rounded-xl border-none bg-white px-3 text-sm focus:ring-2 focus:ring-[#0EA5E9]/50 shadow-sm">
                            <option value="ACTIVITY">Activity</option>
                            <option value="FLIGHT">Flight</option>
                            <option value="ACCOMMODATION">Accommodation</option>
                            <option value="DINING">Dining</option>
                            <option value="TRANSPORT">Transport</option>
                            <option value="NOTE">Note</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#486581] mb-1 block">Time (Optional)</label>
                          <input type="datetime-local" value={itemData.startTime} onChange={e => setItemData({...itemData, startTime: e.target.value})} className="w-full h-10 rounded-xl border-none bg-white px-3 text-sm focus:ring-2 focus:ring-[#0EA5E9]/50 shadow-sm" />
                        </div>
                        <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                          <button type="button" onClick={() => setAddingItemToDest(null)} className="px-4 py-2 text-sm font-bold text-[#486581] hover:bg-white rounded-xl transition-colors">Cancel</button>
                          <button type="submit" disabled={isSubmittingItem} className="px-4 py-2 text-sm font-bold text-white bg-[#0EA5E9] hover:bg-[#0284c7] rounded-xl shadow-sm transition-colors">{isSubmittingItem ? "Saving..." : "Save Activity"}</button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setAddingItemToDest(dest.id)} className="mt-6 w-full py-3 rounded-2xl border-2 border-dashed border-[#0EA5E9]/20 text-[#0EA5E9] font-bold text-sm hover:bg-[#0EA5E9]/5 transition-colors flex items-center justify-center">
                      <Plus className="mr-2 h-4 w-4" /> Add Activity
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !isAddingDest && (
          <div className="rounded-3xl border-2 border-dashed border-[#0EA5E9]/20 bg-white/30 backdrop-blur-md p-16 text-center flex flex-col items-center shadow-sm">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <MapPin className="h-10 w-10 text-[#0EA5E9]/40" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E]">Your itinerary is empty</h3>
            <p className="text-[#486581] mt-2 max-w-sm">Add your first destination to start building out the schedule.</p>
          </div>
        )
      )}
    </div>
  );
}

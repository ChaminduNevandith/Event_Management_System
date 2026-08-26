"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { MapPin, Plus, List, Image as ImageIcon, Tag, Link as LinkIcon, Navigation } from "lucide-react";

type PlaceCategory = "ACCOMMODATION" | "FOOD" | "ATTRACTION" | "ACTIVITY" | "TRANSPORT" | "OTHER";

export default function PlacesPage() {
  const params = useParams();
  const [places, setPlaces] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter state
  const [selectedDestination, setSelectedDestination] = useState<string>("all");

  // Form State
  const [name, setName] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [category, setCategory] = useState<PlaceCategory>("ATTRACTION");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  const loadData = async () => {
    try {
      const [placesData, destsData] = await Promise.all([
        fetchApi(`/trips/${params.id}/places`),
        fetchApi(`/trips/${params.id}/destinations`)
      ]);
      setPlaces(placesData);
      setDestinations(destsData.filter((d: any) => d.status === "APPROVED"));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      await fetchApi(`/trips/${params.id}/places`, {
        method: "POST",
        body: JSON.stringify({
          name,
          destinationId: destinationId || undefined,
          category,
          address: address || undefined,
          notes: notes || undefined,
          tags,
        })
      });
      setShowAddModal(false);
      setName("");
      setDestinationId("");
      setAddress("");
      setNotes("");
      setTagsStr("");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to add place");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this place from your saved list?")) return;
    try {
      await fetchApi(`/trips/${params.id}/places/${id}`, { method: "DELETE" });
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  const filteredPlaces = selectedDestination === "all" 
    ? places 
    : places.filter(p => p.destinationId === selectedDestination);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ACCOMMODATION': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'FOOD': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'ATTRACTION': return 'text-sky-600 bg-sky-100 border-sky-200';
      case 'ACTIVITY': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'TRANSPORT': return 'text-amber-600 bg-amber-100 border-amber-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Saved Places</h2>
          <p className="text-[#486581] font-medium text-sm mt-1">Bookmarked spots, restaurants, and sights</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Save Place
        </button>
      </div>

      {destinations.length > 0 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button 
            onClick={() => setSelectedDestination("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedDestination === "all" ? "bg-[#0C4A6E] text-white shadow-md" : "bg-white/50 text-[#486581] hover:bg-white"}`}
          >
            All Destinations
          </button>
          {destinations.map(d => (
            <button 
              key={d.id}
              onClick={() => setSelectedDestination(d.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedDestination === d.id ? "bg-[#0EA5E9] text-white shadow-md" : "bg-white/50 text-[#486581] hover:bg-white"}`}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlaces.map(place => (
          <div key={place.id} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-lg shadow-[#102a43]/5 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 border ${getCategoryColor(place.category)}`}>
                  {place.category}
                </span>
                <h3 className="text-xl font-bold text-[#0C4A6E] leading-tight group-hover:text-[#0EA5E9] transition-colors">{place.name}</h3>
              </div>
            </div>

            {place.address && (
              <div className="flex items-start mt-2 text-sm text-[#486581] font-medium">
                <Navigation className="mr-1.5 h-4 w-4 mt-0.5 text-[#0EA5E9] shrink-0" />
                <span className="leading-relaxed">{place.address}</span>
              </div>
            )}

            {place.notes && (
              <div className="mt-4 p-3 bg-white/50 rounded-xl text-sm text-[#0C4A6E] border border-white/80 leading-relaxed italic">
                "{place.notes}"
              </div>
            )}

            <div className="mt-auto pt-5 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {place.tags?.map((tag: string, i: number) => (
                  <span key={i} className="text-[10px] font-bold bg-[#f0f9ff] text-[#0284c7] px-2 py-1 rounded-md">#{tag}</span>
                ))}
              </div>
              
              <button 
                onClick={() => handleDelete(place.id)}
                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {filteredPlaces.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60">
            <MapPin className="h-12 w-12 text-[#0EA5E9]/30 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-1">No places saved yet</h3>
            <p className="text-[#486581] font-medium">Keep track of spots you want to visit here.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 inline-flex items-center rounded-xl bg-white border-2 border-[#0EA5E9]/20 px-5 py-2.5 text-sm font-bold text-[#0EA5E9] shadow-sm transition-all hover:bg-[#f0f9ff] hover:border-[#0EA5E9]/40"
            >
              <Plus className="mr-2 h-4 w-4" />
              Save your first place
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2">Save a Place</h2>
            <p className="text-[#486581] text-sm mb-6">Add a restaurant, hotel, or attraction to your list.</p>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Place Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 pl-11 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    placeholder="e.g. The Louvre"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PlaceCategory)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white font-bold"
                  >
                    <option value="ATTRACTION">Attraction</option>
                    <option value="FOOD">Food & Drink</option>
                    <option value="ACCOMMODATION">Accommodation</option>
                    <option value="ACTIVITY">Activity</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Destination</label>
                  <select
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white font-bold"
                  >
                    <option value="">(None)</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Address / Link</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Navigation className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 pl-11 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    placeholder="Address or Google Maps link"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white min-h-[80px]"
                  placeholder="Must try the croissants..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Tags</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 pl-11 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    placeholder="e.g. coffee, views, cheap (comma separated)"
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border-2 border-white bg-white/50 px-4 py-3 text-sm font-bold text-[#486581] transition-all hover:bg-white hover:text-[#0C4A6E] shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Place"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

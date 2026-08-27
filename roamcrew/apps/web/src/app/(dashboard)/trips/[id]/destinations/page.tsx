"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import {  MapPin, Plus, ThumbsUp, ThumbsDown, Calendar, Image as ImageIcon  } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

type DestinationStatus = "PROPOSED" | "APPROVED" | "REJECTED";

export default function DestinationsPage() {
  const params = useParams();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const loadDestinations = async () => {
    try {
      const data = await fetchApi(`/trips/${params.id}/destinations`);
      setDestinations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUser((window as any)._currentUser);
    loadDestinations();
  }, [params.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/trips/${params.id}/destinations`, {
        method: "POST",
        body: JSON.stringify({
          name,
          description: description || undefined,
          imageUrl: imageUrl || undefined,
        })
      });
      setShowAddModal(false);
      setName("");
      setDescription("");
      setImageUrl("");
      loadDestinations();
    } catch (err: any) {
      alert(err.message || "Failed to add destination");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (id: string, voteType: "UP" | "DOWN") => {
    try {
      await fetchApi(`/trips/${params.id}/destinations/${id}/vote`, {
        method: "POST",
        body: JSON.stringify({ voteType })
      });
      loadDestinations();
    } catch (err: any) {
      alert(err.message || "Failed to vote");
    }
  };

  const handleChangeStatus = async (id: string, status: DestinationStatus) => {
    try {
      await fetchApi(`/trips/${params.id}/destinations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      loadDestinations();
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this destination?")) return;
    try {
      await fetchApi(`/trips/${params.id}/destinations/${id}`, {
        method: "DELETE"
      });
      loadDestinations();
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full mt-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl hidden md:block" />
          <Skeleton className="h-48 rounded-3xl hidden lg:block" />
        </div>
      </div>
    );
  }

  const columns: { title: string; status: DestinationStatus; color: string }[] = [
    { title: "Proposed", status: "PROPOSED", color: "from-[#F97316] to-[#ea580c]" },
    { title: "Approved", status: "APPROVED", color: "from-[#10B981] to-[#059669]" },
    { title: "Rejected", status: "REJECTED", color: "from-[#EF4444] to-[#DC2626]" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Destination Candidates</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colDests = destinations.filter(d => d.status === col.status);
          
          return (
            <div key={col.status} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-xl shadow-[#102a43]/5 flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-4 border-b border-white/40 pb-3">
                <h3 className="font-extrabold text-[#0C4A6E] flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${col.color} mr-2`} />
                  {col.title}
                </h3>
                <span className="bg-white text-[#486581] text-xs font-bold px-2 py-1 rounded-full shadow-sm">{colDests.length}</span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {colDests.map(dest => {
                  const upvotes = dest.votes?.filter((v: any) => v.voteType === "UP") || [];
                  const downvotes = dest.votes?.filter((v: any) => v.voteType === "DOWN") || [];
                  const myVote = currentUser ? dest.votes?.find((v: any) => v.userId === currentUser.id)?.voteType : null;

                  return (
                    <div key={dest.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#0EA5E9]/10 group transition-all hover:shadow-md hover:border-[#0EA5E9]/30">
                      {dest.imageUrl && (
                        <div className="h-32 -mx-4 -mt-4 mb-3 rounded-t-2xl overflow-hidden bg-gray-100">
                          <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#0C4A6E] text-lg leading-tight group-hover:text-[#0EA5E9] transition-colors flex items-center">
                          <MapPin className="mr-1.5 h-4 w-4 text-[#F97316]" />
                          {dest.name}
                        </h4>
                        
                        {/* Status Select for moving cards */}
                        <select 
                          value={dest.status}
                          onChange={(e) => handleChangeStatus(dest.id, e.target.value as DestinationStatus)}
                          className="text-xs bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] rounded-lg px-2 py-1 font-bold outline-none cursor-pointer hover:bg-[#e0f2fe]"
                        >
                          <option value="PROPOSED">Proposed</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>

                      {dest.description && (
                        <p className="text-sm text-[#486581] line-clamp-2 mb-4 leading-relaxed">{dest.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        {/* Voting */}
                        <div className="flex space-x-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button 
                            onClick={() => handleVote(dest.id, "UP")}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${myVote === "UP" ? "bg-green-100 text-green-700" : "text-gray-500 hover:bg-gray-200"}`}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>{upvotes.length}</span>
                          </button>
                          <button 
                            onClick={() => handleVote(dest.id, "DOWN")}
                            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${myVote === "DOWN" ? "bg-red-100 text-red-700" : "text-gray-500 hover:bg-gray-200"}`}
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                            <span>{downvotes.length}</span>
                          </button>
                        </div>

                        <button 
                          onClick={() => handleDelete(dest.id)}
                          className="text-xs text-red-400 hover:text-red-600 font-medium px-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}

                {colDests.length === 0 && (
                  <div className="text-center py-10 bg-white/30 rounded-2xl border border-dashed border-white/60">
                    <MapPin className="h-8 w-8 text-[#0EA5E9]/30 mx-auto mb-2" />
                    <p className="text-sm text-[#486581] font-medium">No destinations here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2">Propose Destination</h2>
            <p className="text-[#486581] text-sm mb-6">Suggest a place for your crew to visit.</p>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Destination Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 pl-11 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    placeholder="e.g. Kyoto, Japan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Why here?</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white min-h-[100px]"
                  placeholder="It has great food and temples..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Cover Image URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 pl-11 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                    placeholder="https://example.com/image.jpg"
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
                  {isSubmitting ? "Adding..." : "Propose"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

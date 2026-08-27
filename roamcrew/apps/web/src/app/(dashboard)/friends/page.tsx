"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { UserPlus, UserCheck, XCircle, CheckCircle, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendsPage() {
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [newCircleName, setNewCircleName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [fData, rData, cData] = await Promise.all([
        fetchApi("/friends"),
        fetchApi("/friends/requests/pending"),
        fetchApi("/circles")
      ]);
      setFriends(fData);
      setRequests(rData);
      setCircles(cData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName) return;
    try {
      await fetchApi("/circles", {
        method: "POST",
        body: JSON.stringify({ name: newCircleName }),
      });
      setNewCircleName("");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername) return;
    setStatus("Sending...");
    try {
      await fetchApi("/friends/request", {
        method: "POST",
        body: JSON.stringify({ targetUsername: searchUsername }),
      });
      setStatus("Request sent successfully!");
      setSearchUsername("");
      setTimeout(() => setStatus(""), 3000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await fetchApi(`/friends/accept/${id}`, { method: "POST" });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await fetchApi(`/friends/decline/${id}`, { method: "POST" });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRemove = async (friendId: string) => {
    if (!confirm("Are you sure you want to remove this friend?")) return;
    try {
      await fetchApi(`/friends/${friendId}`, { method: "DELETE" });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="space-y-6 w-full mt-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl hidden md:block" />
          <Skeleton className="h-48 rounded-3xl hidden lg:block" />
        </div>
      </div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0C4A6E] tracking-tight">Social & Friends</h1>
        <p className="text-[#0C4A6E]/70 mt-1">Connect with other travelers and plan trips together.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Friends List */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            <h2 className="text-xl font-bold text-[#0C4A6E] mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#10B981]" />
              My Friends ({friends.length})
            </h2>
            
            {friends.length === 0 ? (
              <p className="text-[#0C4A6E]/60 text-sm">You haven't added any friends yet.</p>
            ) : (
              <div className="space-y-3">
                {friends.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center font-bold text-[#0EA5E9]">
                        {f.avatarUrl ? <img src={f.avatarUrl} alt="" className="w-full h-full rounded-full object-cover"/> : (f.firstName?.[0] || '?')}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0C4A6E] leading-tight">{f.firstName} {f.lastName}</p>
                        <p className="text-xs text-[#0C4A6E]/60">@{f.username || 'unknown'}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(f.id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove Friend">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Circles */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            <h2 className="text-xl font-bold text-[#0C4A6E] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#F59E0B]" />
              Travel Circles ({circles.length})
            </h2>
            
            {circles.length === 0 ? (
              <p className="text-[#0C4A6E]/60 text-sm mb-4">You haven't joined any travel circles yet.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {circles.map(c => (
                  <div key={c.id} className="p-4 bg-white/60 rounded-xl border border-white/50">
                    <p className="font-bold text-[#0C4A6E]">{c.name}</p>
                    <p className="text-xs text-[#0C4A6E]/70 mt-1">{c.members.length} member(s)</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleCreateCircle} className="space-y-3 pt-4 border-t border-white/50">
              <h3 className="text-sm font-bold text-[#0C4A6E]">Create a New Circle</h3>
              <div className="flex gap-2">
                <input 
                  value={newCircleName} 
                  onChange={e => setNewCircleName(e.target.value)} 
                  placeholder="e.g. College Crew" 
                  className="flex-1 h-10 rounded-xl border border-white/50 bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#F59E0B]/50 outline-none transition-all" 
                  required 
                />
                <button type="submit" className="h-10 px-4 rounded-xl bg-[#F59E0B] text-white text-sm font-bold hover:bg-[#D97706] transition-all">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          {/* Add Friend Form */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-bold text-[#0C4A6E] mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#0EA5E9]" />
              Add a Friend
            </h2>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#0C4A6E]/70 mb-1">Search by Username</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0C4A6E]/40" />
                  <input 
                    value={searchUsername} 
                    onChange={e => setSearchUsername(e.target.value)} 
                    placeholder="traveler123" 
                    className="w-full h-10 rounded-xl border border-white/50 bg-white/70 pl-9 pr-4 text-sm focus:ring-2 focus:ring-[#0EA5E9]/50 outline-none transition-all" 
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="w-full h-10 rounded-xl bg-[#0EA5E9] text-white font-semibold shadow hover:bg-[#0284C7] transition-all">
                Send Request
              </button>
              {status && <p className={`text-xs font-medium text-center ${status.includes('Error') ? 'text-red-500' : 'text-[#10B981]'}`}>{status}</p>}
            </form>
          </div>

          {/* Pending Requests */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
            <h2 className="text-lg font-bold text-[#0C4A6E] mb-4">
              Pending Requests ({requests.length})
            </h2>
            
            {requests.length === 0 ? (
              <p className="text-[#0C4A6E]/60 text-sm">No pending requests.</p>
            ) : (
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="p-3 bg-white/60 rounded-xl border border-white/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center font-bold text-[#F59E0B] text-xs">
                        {req.user.firstName?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#0C4A6E] leading-tight">{req.user.firstName} {req.user.lastName}</p>
                        <p className="text-xs text-[#0C4A6E]/60">@{req.user.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleAccept(req.id)} className="flex-1 flex justify-center items-center gap-1 h-8 rounded-lg bg-[#10B981] text-white text-xs font-medium hover:bg-[#059669]">
                        <CheckCircle className="w-3 h-3" /> Accept
                      </button>
                      <button onClick={() => handleDecline(req.id)} className="flex-1 flex justify-center items-center gap-1 h-8 rounded-lg bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300">
                        <XCircle className="w-3 h-3" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

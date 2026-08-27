"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Settings } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth-provider";

export default function TripLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Settings State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [status, setStatus] = useState("PLANNING");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDescription(trip.description || "");
      setCoverImageUrl(trip.coverImageUrl || "");
      setStatus(trip.status);
      setStartDate(trip.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "");
      setEndDate(trip.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "");
      setTimezone(trip.timezone || "");
    }
  }, [trip]);

  useEffect(() => {
    async function loadTrip() {
      try {
        const data = await fetchApi(`/trips/${params.id}`);
        setTrip(data);
      } catch (err: any) {
        setError(err.message || "Failed to load trip.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTrip();
  }, [params.id]);

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await fetchApi(`/trips/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title,
          description: description || undefined,
          coverImageUrl: coverImageUrl || undefined,
          status,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          timezone,
        })
      });
      const data = await fetchApi(`/trips/${params.id}`);
      setTrip(data);
      setShowSettingsModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to update trip");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm(`Are you sure you want to ${trip.isArchived ? 'restore' : 'archive'} this trip?`)) return;
    try {
      await fetchApi(`/trips/${params.id}/${trip.isArchived ? 'restore' : 'archive'}`, { method: "POST" });
      const data = await fetchApi(`/trips/${params.id}`);
      setTrip(data);
    } catch (err: any) {
      alert(err.message || "Failed to archive/restore trip");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you absolutely sure you want to delete this trip? This action cannot be undone.")) return;
    try {
      await fetchApi(`/trips/${params.id}`, { method: "DELETE" });
      router.push("/trips");
    } catch (err: any) {
      alert(err.message || "Failed to delete trip");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetchApi(`/trips/${params.id}/members/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole })
      });
      const data = await fetchApi(`/trips/${params.id}`);
      setTrip(data);
    } catch (err: any) {
      alert(err.message || "Failed to change role");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto bg-[#F0F9FF]">
        <div className="min-h-full">
          {/* Hero Image Skeleton */}
          <Skeleton className="h-64 md:h-80 w-full rounded-none" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
            <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white shadow-xl mb-8 space-y-4">
              <Skeleton className="h-10 w-2/3 md:w-1/3" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <Skeleton className="h-64 rounded-3xl hidden md:block" />
              <div className="md:col-span-3 space-y-8">
                <Skeleton className="h-[500px] rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl shadow-[#102a43]/5 max-w-2xl mx-auto mt-10">
        <h2 className="text-3xl font-extrabold text-[#0C4A6E]">Oops!</h2>
        <p className="text-[#486581] mt-3 text-lg">{error || "Trip not found"}</p>
        <button onClick={() => router.push("/trips")} className="mt-8 text-white font-bold bg-[#0EA5E9] hover:bg-[#0284c7] px-8 py-3 rounded-xl transition-colors shadow-md">
          Return to Trips
        </button>
      </div>
    );
  }

  const tabs = [
    { name: "Overview", href: `/trips/${params.id}` },
    { name: "Itinerary", href: `/trips/${params.id}/itinerary` },
    { name: "Map", href: `/trips/${params.id}/map` },
    { name: "Destinations", href: `/trips/${params.id}/destinations` },
    { name: "Accommodations", href: `/trips/${params.id}/accommodations` },
    { name: "Transport", href: `/trips/${params.id}/transport` },
    { name: "Places", href: `/trips/${params.id}/places` },
    { name: "Decisions", href: `/trips/${params.id}/decisions` },
    { name: "Tasks", href: `/trips/${params.id}/tasks` },
    { name: "Budget", href: `/trips/${params.id}/budget` },
    { name: "Chat", href: `/trips/${params.id}/chat` },
    { name: "Activity", href: `/trips/${params.id}/activity` },
    { name: "Memories", href: `/trips/${params.id}/memories` },
    { name: "Export", href: `/trips/${params.id}/export` },
  ];

  const myRole = trip.members.find((m: any) => m.user.id === user?.id)?.role || 'MEMBER';
  const canManage = myRole === 'OWNER' || myRole === 'ADMIN';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {trip.isArchived && (
        <div className="bg-[#fa3c1b]/10 p-3 rounded-xl border border-[#fa3c1b]/20 text-center text-[#da2405] font-bold text-sm">
          This trip is archived. It is read-only.
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl">
        {trip.coverImageUrl && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10"></div>
            <img src={trip.coverImageUrl} className="w-full h-full object-cover" alt="Trip Cover" />
          </div>
        )}
        <div className="relative z-10 px-8 py-10">
          <Link href="/trips" className="inline-flex items-center text-sm font-bold text-[#486581] hover:text-[#0EA5E9] mb-6 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to trips
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="rounded-full bg-[#0EA5E9]/15 px-4 py-1.5 text-xs font-bold text-[#0EA5E9] uppercase tracking-wider border border-[#0EA5E9]/20 shadow-sm">
                  {trip.status}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0C4A6E] leading-tight">
                {trip.title}
              </h1>
              {trip.description && (
                <p className="text-[#486581] mt-4 max-w-3xl text-lg leading-relaxed font-medium bg-white/40 p-4 rounded-xl backdrop-blur-sm border border-white/50">{trip.description}</p>
              )}
            </div>
            {canManage && (
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 backdrop-blur-md px-6 text-sm font-bold text-[#0C4A6E] shadow-sm transition-all hover:bg-white/80 hover:border-[#0EA5E9]/40 hover:-translate-y-0.5 shrink-0"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Trip
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[#0EA5E9]/10">
            {trip.startDate && (
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white shadow-sm font-bold text-[#0C4A6E]">
                <Calendar className="mr-2 h-5 w-5 text-[#F97316]" />
                {format(new Date(trip.startDate), "MMMM d, yyyy")}
                {trip.endDate && ` - ${format(new Date(trip.endDate), "MMMM d, yyyy")}`}
              </div>
            )}
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-white shadow-sm font-bold text-[#0C4A6E]">
              <Users className="mr-2 h-5 w-5 text-[#38BDF8]" />
              {trip.members.length} Crew Member{trip.members.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mt-8 bg-white/40 p-1.5 rounded-2xl border border-white shadow-sm backdrop-blur-md">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`whitespace-nowrap shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white text-[#0EA5E9] shadow-sm border border-white"
                      : "text-[#486581] hover:text-[#0C4A6E] hover:bg-white/50"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
        {/* Main Content (Children) */}
        <div className="lg:col-span-2 space-y-6">
          {children}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Members Card */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg shadow-[#102a43]/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-white/50 bg-white/40">
              <h3 className="font-extrabold text-xl text-[#0C4A6E] flex items-center">
                <Users className="mr-2 h-6 w-6 text-[#38BDF8]" />
                The Crew <span className="ml-2 bg-[#0EA5E9] text-white text-xs px-2 py-0.5 rounded-full">{trip.members.length}</span>
              </h3>
            </div>
            <div className="p-3">
              {trip.members.map((member: any) => (
                <div key={member.id} className="flex flex-col p-3 hover:bg-white/50 rounded-2xl transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white flex items-center justify-center font-bold shadow-md">
                        {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0C4A6E]">{member.user.firstName} {member.user.lastName}</p>
                        <p className="text-xs font-bold text-[#F97316] mt-0.5 uppercase tracking-wide">{member.role}</p>
                      </div>
                    </div>
                    {canManage && member.role !== 'OWNER' && (
                      <select 
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                        className="text-xs font-bold border border-white/50 rounded-lg bg-white/60 text-[#0C4A6E] px-2 py-1 outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="MEMBER">MEMBER</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {canManage && (
              <div className="px-6 py-4 border-t border-white/50 bg-white/40">
                <button onClick={() => setShowInviteModal(true)} className="text-sm font-bold text-[#0EA5E9] hover:text-[#0284c7] w-full text-center py-2 bg-white rounded-xl shadow-sm border border-[#0EA5E9]/10 transition-colors">
                  + Invite Someone
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-[#F97316] to-[#ea580c] rounded-3xl shadow-lg shadow-[#F97316]/20 overflow-hidden text-white p-6 relative">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <h3 className="font-extrabold text-xl mb-2 relative z-10">Trip Budget</h3>
            <p className="text-white/80 text-sm font-medium relative z-10">You can now track shared expenses on the Budget tab.</p>
            <Link href={`/trips/${params.id}/budget`} className="mt-4 block text-center bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold w-full border border-white/20">
              View Budget Ledger
            </Link>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/60 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => { setShowInviteModal(false); setInviteLink(''); }} className="absolute top-6 right-6 text-[#486581] hover:text-[#0EA5E9] bg-white/50 p-2 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2 pr-8">Invite to {trip.title}</h2>
            <p className="text-[#486581] text-sm mb-6">Generate a link to share, or invite directly.</p>
            
            <div className="space-y-4">
              <button 
                onClick={async () => {
                  try {
                    const inv = await fetchApi(`/invitations/trip/${params.id}`, { method: 'POST', body: JSON.stringify({}) });
                    setInviteLink(`${window.location.origin}/invite/${inv.token}`);
                  } catch (err: any) { alert(err.message); }
                }}
                className="w-full py-3 rounded-xl bg-[#0EA5E9] text-white font-bold hover:bg-[#0284C7] transition-all shadow-sm border border-[#0EA5E9]"
              >
                Generate Link
              </button>
              
              {inviteLink && (
                <div className="p-3 bg-white/60 border border-[#0EA5E9]/20 rounded-xl flex items-center justify-between overflow-hidden shadow-inner">
                  <span className="text-sm font-medium text-[#0C4A6E] truncate mr-2 select-all">{inviteLink}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      alert("Copied to clipboard!");
                    }}
                    className="text-xs font-bold bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 px-4 py-2 rounded-lg shadow-sm shrink-0 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0C4A6E]/60 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 hide-scrollbar flex flex-col">
            <button onClick={() => setShowSettingsModal(false)} className="absolute top-6 right-6 text-[#486581] hover:text-[#0EA5E9] bg-white/50 p-2 rounded-full transition-colors z-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-3xl font-extrabold text-[#0C4A6E] mb-6 pr-10">Trip Settings</h2>
            
            <form onSubmit={handleUpdateTrip} className="space-y-6 flex-shrink-0">
              <div className="grid md:grid-cols-2 gap-5 bg-white/40 p-6 rounded-2xl border border-white/60">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-[#243b53]">Title</label>
                  <input required className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium text-[#0C4A6E] shadow-sm transition-all" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-[#243b53]">Description</label>
                  <textarea className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] min-h-[100px] font-medium text-[#0C4A6E] shadow-sm transition-all" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-[#243b53]">Cover Image URL</label>
                  <input type="url" className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium text-[#0C4A6E] shadow-sm transition-all" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#243b53]">Status</label>
                  <select className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] font-bold text-[#0C4A6E] shadow-sm transition-all" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PLANNING">PLANNING</option>
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#243b53]">Timezone</label>
                  <select className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium text-[#0C4A6E] shadow-sm transition-all" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    {Intl.supportedValuesOf('timeZone').map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#243b53]">Start Date</label>
                  <input type="date" className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium text-[#0C4A6E] shadow-sm transition-all" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#243b53]">End Date</label>
                  <input type="date" min={startDate} className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#0EA5E9] font-medium text-[#0C4A6E] shadow-sm transition-all" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="px-6 py-2.5 rounded-xl text-[#0C4A6E] font-bold hover:bg-[#0C4A6E]/5 border border-transparent transition-colors">Cancel</button>
                <button type="submit" disabled={isUpdating} className="px-8 py-2.5 rounded-xl bg-[#0EA5E9] text-white font-bold hover:bg-[#0284c7] shadow-md shadow-[#0EA5E9]/20 transition-all">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-red-100 bg-red-50/80 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 rounded-b-3xl">
              <h3 className="text-xl font-extrabold text-[#da2405] mb-2 flex items-center">
                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                 Danger Zone
              </h3>
              <p className="text-sm text-red-700/80 font-medium mb-6">These actions can have permanent consequences for the entire crew. Please be careful.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={handleArchive} className="px-5 py-2.5 rounded-xl bg-orange-100 text-orange-700 font-bold hover:bg-orange-200 border border-orange-200 transition-colors shadow-sm">
                  {trip.isArchived ? "Restore Trip" : "Archive Trip"}
                </button>
                {myRole === 'OWNER' && (
                  <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 border border-red-200 transition-colors shadow-sm">
                    Delete Trip
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

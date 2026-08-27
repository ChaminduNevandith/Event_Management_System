"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import {  Plus, Home, MapPin, Calendar, Clock, Edit2, Trash2  } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AccommodationsPage({ params }: { params: { id: string } }) {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirm, ConfirmationModal } = useConfirm();

  // Form State
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    try {
      const data = await fetchApi(`/trips/${params.id}/accommodations`);
      setAccommodations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchApi(`/trips/${params.id}/accommodations`, {
        method: "POST",
        body: JSON.stringify({
          name,
          address,
          checkIn: checkIn ? new Date(checkIn).toISOString() : undefined,
          checkOut: checkOut ? new Date(checkOut).toISOString() : undefined,
          bookingRef,
          notes,
        }),
      });
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add accommodation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete this accommodation?");
    if (!isConfirmed) return;
    try {
      await fetchApi(`/trips/${params.id}/accommodations/${id}`, { method: "DELETE" });
      toast.success("Item deleted successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setCheckIn("");
    setCheckOut("");
    setBookingRef("");
    setNotes("");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Accommodations</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-[#0EA5E9] text-white font-bold rounded-xl hover:bg-[#0284c7] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Place to Stay
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accommodations.map((acc) => (
          <div key={acc.id} className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-[#0EA5E9]/10 rounded-xl flex items-center justify-center text-[#0EA5E9]">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0C4A6E]">{acc.name}</h3>
                  {acc.bookingRef && (
                    <span className="text-xs font-semibold text-[#0EA5E9] bg-[#0EA5E9]/10 px-2 py-0.5 rounded-full">Ref: {acc.bookingRef}</span>
                  )}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button onClick={() => handleDelete(acc.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {acc.address && (
              <div className="flex items-start space-x-2 text-sm text-[#486581] mt-3">
                <MapPin className="h-4 w-4 mt-0.5 text-[#F97316] shrink-0" />
                <span>{acc.address}</span>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white grid grid-cols-2 gap-4">
              {acc.checkIn && (
                <div>
                  <p className="text-xs font-bold text-[#486581] uppercase tracking-wider mb-1 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" /> Check In
                  </p>
                  <p className="text-sm font-semibold text-[#0C4A6E]">
                    {format(new Date(acc.checkIn), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              )}
              {acc.checkOut && (
                <div>
                  <p className="text-xs font-bold text-[#486581] uppercase tracking-wider mb-1 flex items-center">
                    <Clock className="mr-1 h-3 w-3" /> Check Out
                  </p>
                  <p className="text-sm font-semibold text-[#0C4A6E]">
                    {format(new Date(acc.checkOut), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              )}
            </div>

            {acc.notes && (
              <p className="mt-4 text-sm text-[#486581] bg-white/50 p-3 rounded-xl border border-white/50 italic">
                {acc.notes}
              </p>
            )}
          </div>
        ))}
        {accommodations.length === 0 && (
          <div className="md:col-span-2 text-center py-12 bg-white/40 rounded-2xl border border-dashed border-white/80">
            <Home className="mx-auto h-12 w-12 text-[#0EA5E9]/40 mb-3" />
            <h3 className="text-lg font-bold text-[#0C4A6E]">No accommodations yet</h3>
            <p className="text-[#486581] mt-1">Add your hotels, Airbnbs, or hostels here.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-lg shadow-2xl my-8 relative animate-in zoom-in-95 duration-200">
            <button type="button" onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-[#486581] hover:text-[#0EA5E9] bg-white/50 p-2 rounded-full transition-colors z-10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-6 pr-8">Add Accommodation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-[#243b53]">Place Name</label>
                <input required className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#0EA5E9] outline-none" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-[#243b53]">Address</label>
                <input className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#0EA5E9] outline-none" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Check-In</label>
                  <input type="datetime-local" className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#0EA5E9] outline-none" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Check-Out</label>
                  <input type="datetime-local" className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#0EA5E9] outline-none" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-[#243b53]">Booking Reference</label>
                <input className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#0EA5E9] outline-none" value={bookingRef} onChange={(e) => setBookingRef(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-[#243b53]">Notes</label>
                <textarea className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#0EA5E9] outline-none" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 rounded-xl text-[#0C4A6E] font-bold hover:bg-white/50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl bg-[#0EA5E9] text-white font-bold hover:bg-[#0284c7] transition-colors shadow-sm">{isSubmitting ? "Saving..." : "Save Place"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmationModal />
    </div>
  );
}

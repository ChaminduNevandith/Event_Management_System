"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import {  Plus, Plane, Train, Bus, Ship, Car, Calendar, Clock, MapPin, Trash2  } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";

export default function TransportPage({ params }: { params: { id: string } }) {
  const [transports, setTransports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirm, ConfirmationModal } = useConfirm();

  // Form State
  const [type, setType] = useState("FLIGHT");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    try {
      const data = await fetchApi(`/trips/${params.id}/transport`);
      setTransports(data);
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
      await fetchApi(`/trips/${params.id}/transport`, {
        method: "POST",
        body: JSON.stringify({
          type,
          origin,
          destination,
          departureTime: departureTime ? new Date(departureTime).toISOString() : undefined,
          arrivalTime: arrivalTime ? new Date(arrivalTime).toISOString() : undefined,
          bookingRef,
          seatNumber,
          notes,
        }),
      });
      setShowAddModal(false);
      resetForm();
      toast.success("Transport added successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add transport");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm("Delete this transport?");
    if (!isConfirmed) return;
    try {
      await fetchApi(`/trips/${params.id}/transport/${id}`, { method: "DELETE" });
      toast.success("Transport deleted!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setType("FLIGHT");
    setOrigin("");
    setDestination("");
    setDepartureTime("");
    setArrivalTime("");
    setBookingRef("");
    setSeatNumber("");
    setNotes("");
  };

  const getIcon = (t: string) => {
    switch (t) {
      case "FLIGHT": return <Plane className="h-5 w-5" />;
      case "TRAIN": return <Train className="h-5 w-5" />;
      case "BUS": return <Bus className="h-5 w-5" />;
      case "FERRY": return <Ship className="h-5 w-5" />;
      case "CAR": return <Car className="h-5 w-5" />;
      default: return <Plane className="h-5 w-5" />;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Transport</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-[#F97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Transport
        </button>
      </div>

      <div className="space-y-4">
        {transports.map((t) => (
          <div key={t.id} className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-5 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center text-[#F97316]">
                  {getIcon(t.type)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0C4A6E] capitalize">{t.type.toLowerCase()}</h3>
                  <div className="flex space-x-2 mt-1">
                    {t.bookingRef && <span className="text-xs font-semibold text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded-full">Ref: {t.bookingRef}</span>}
                    {t.seatNumber && <span className="text-xs font-semibold text-[#0EA5E9] bg-[#0EA5E9]/10 px-2 py-0.5 rounded-full">Seat: {t.seatNumber}</span>}
                  </div>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/60">
              <div>
                <p className="text-xs font-bold text-[#486581] uppercase tracking-wider mb-1 flex items-center">
                  <MapPin className="mr-1 h-3 w-3" /> Origin
                </p>
                <p className="text-sm font-bold text-[#0C4A6E]">{t.origin || "TBD"}</p>
                {t.departureTime && (
                  <p className="text-xs text-[#0EA5E9] mt-1 font-semibold flex items-center">
                    <Calendar className="mr-1 h-3 w-3" /> {format(new Date(t.departureTime), "MMM d, h:mm a")}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-[#486581] uppercase tracking-wider mb-1 flex items-center">
                  <MapPin className="mr-1 h-3 w-3" /> Destination
                </p>
                <p className="text-sm font-bold text-[#0C4A6E]">{t.destination || "TBD"}</p>
                {t.arrivalTime && (
                  <p className="text-xs text-[#0EA5E9] mt-1 font-semibold flex items-center">
                    <Calendar className="mr-1 h-3 w-3" /> {format(new Date(t.arrivalTime), "MMM d, h:mm a")}
                  </p>
                )}
              </div>
            </div>

            {t.notes && (
              <p className="mt-4 text-sm text-[#486581] bg-white/50 p-3 rounded-xl border border-white/50 italic">
                {t.notes}
              </p>
            )}
          </div>
        ))}
        {transports.length === 0 && (
          <div className="text-center py-12 bg-white/40 rounded-2xl border border-dashed border-white/80">
            <Plane className="mx-auto h-12 w-12 text-[#F97316]/40 mb-3" />
            <h3 className="text-lg font-bold text-[#0C4A6E]">No transport booked</h3>
            <p className="text-[#486581] mt-1">Add your flights, trains, or buses here.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-lg shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-6">Add Transport</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-[#243b53]">Type</label>
                <select className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="FLIGHT">Flight</option>
                  <option value="TRAIN">Train</option>
                  <option value="BUS">Bus</option>
                  <option value="FERRY">Ferry</option>
                  <option value="CAR">Car</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Origin</label>
                  <input className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Destination</label>
                  <input className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={destination} onChange={(e) => setDestination(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Departure</label>
                  <input type="datetime-local" className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Arrival</label>
                  <input type="datetime-local" className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Booking Reference</label>
                  <input className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={bookingRef} onChange={(e) => setBookingRef(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#243b53]">Seat Number</label>
                  <input className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-[#243b53]">Notes</label>
                <textarea className="w-full rounded-xl border border-white bg-white/50 px-4 py-2 mt-1 focus:ring-2 focus:ring-[#F97316] outline-none" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 rounded-xl text-[#0C4A6E] font-bold hover:bg-white/50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl bg-[#F97316] text-white font-bold hover:bg-[#ea580c] transition-colors shadow-sm">{isSubmitting ? "Saving..." : "Save Transport"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmationModal />
    </div>
  );
}

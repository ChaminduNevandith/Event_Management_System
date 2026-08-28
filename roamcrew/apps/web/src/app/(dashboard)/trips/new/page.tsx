"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Type, AlignLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewTripPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetchApi("/trips", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          coverImageUrl: coverImageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          timezone,
        }),
      });
      toast.success("Trip created successfully!");
      router.push(`/trips/${response.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/trips" className="inline-flex items-center text-sm font-bold text-[#486581] hover:text-[#0EA5E9] mb-6 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to trips
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0C4A6E]">Plan a New Trip</h1>
        <p className="text-[#486581] mt-2 text-lg">Set the foundation for your next great adventure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/60 shadow-xl shadow-[#102a43]/5">
        {error && (
          <div className="rounded-xl bg-[#fa3c1b]/10 p-4 text-sm font-medium text-[#da2405] border border-[#fa3c1b]/20">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#243b53] flex items-center" htmlFor="title">
                <Type className="h-4 w-4 mr-2 text-[#0EA5E9]" /> Trip Title <span className="text-[#fa3c1b] ml-1">*</span>
              </label>
              <input
                id="title"
                required
                className="flex h-14 w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-2 text-base text-[#0C4A6E] font-medium placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition-all shadow-sm"
                placeholder="e.g. Summer in Japan"
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#243b53] flex items-center" htmlFor="description">
                <AlignLeft className="h-4 w-4 mr-2 text-[#0EA5E9]" /> Description
              </label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-3 text-base text-[#0C4A6E] font-medium placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition-all shadow-sm resize-y"
                placeholder="What's the vibe? Share some thoughts with your crew..."
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#243b53] flex items-center" htmlFor="coverImageUrl">
                <Type className="h-4 w-4 mr-2 text-[#0EA5E9]" /> Cover Image URL
              </label>
              <input
                id="coverImageUrl"
                type="url"
                className="flex h-14 w-full rounded-xl border border-white bg-white/50 backdrop-blur-sm px-4 py-2 text-base text-[#0C4A6E] font-medium placeholder:text-[#829ab1] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 focus:border-[#0EA5E9] transition-all shadow-sm"
                placeholder="Leave blank for a beautiful default image..."
                maxLength={255}
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
              {coverImageUrl && (
                <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-white/50">
                  <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 bg-white/40 p-6 rounded-2xl border border-white/40">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#243b53] flex items-center" htmlFor="startDate">
                <CalendarDays className="h-4 w-4 mr-2 text-[#F97316]" /> Start Date
              </label>
              <input
                id="startDate"
                type="date"
                className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#243b53] flex items-center" htmlFor="endDate">
                <CalendarDays className="h-4 w-4 mr-2 text-[#F97316]" /> End Date
              </label>
              <input
                id="endDate"
                type="date"
                className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#243b53] flex items-center" htmlFor="timezone">
                Timezone
              </label>
              <select
                id="timezone"
                className="flex h-12 w-full rounded-xl border border-white bg-white/70 backdrop-blur-sm px-4 py-2 text-sm text-[#0C4A6E] font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] transition-all shadow-sm"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {Intl.supportedValuesOf('timeZone').map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 pt-6 border-t border-[#0EA5E9]/10 gap-4 sm:gap-0">
          <Link
            href="/trips"
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 backdrop-blur-sm px-8 text-sm font-bold text-[#0C4A6E] transition-colors hover:bg-white/80 hover:border-[#0EA5E9]/40"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || !title}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0EA5E9] px-8 text-sm font-bold text-white shadow-md shadow-[#0EA5E9]/20 transition-all hover:bg-[#0284c7] hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
}

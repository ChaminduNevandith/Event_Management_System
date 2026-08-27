"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Flag, X } from "lucide-react";

const REASONS = [
  { value: "SPAM", label: "Spam or misleading" },
  { value: "HARASSMENT", label: "Harassment or bullying" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate content" },
  { value: "MISINFORMATION", label: "False information" },
  { value: "COPYRIGHT", label: "Copyright violation" },
  { value: "OTHER", label: "Other" },
];

interface ReportButtonProps {
  contentType: string;
  contentId: string;
  /** Optional label override */
  label?: string;
}

export function ReportButton({ contentType, contentId, label }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setSubmitting(true);
    try {
      await fetchApi("/reports", {
        method: "POST",
        body: JSON.stringify({ contentType, contentId, reason, description }),
      });
      toast.success("Report submitted. Our team will review it shortly.");
      setOpen(false);
      setReason("");
      setDescription("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report. Are you logged in?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#486581] hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
      >
        <Flag className="w-4 h-4" />
        {label || "Report"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/60 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-xl border border-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-[#486581] hover:text-red-500 bg-white/50 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
                <Flag className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0C4A6E]">Submit a Report</h2>
                <p className="text-sm text-[#486581]">Help us keep RoamCrew safe.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#243b53]">Reason *</label>
                <div className="grid grid-cols-1 gap-2">
                  {REASONS.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                        reason === r.value
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "border-[#0C4A6E]/10 hover:bg-[#F0F9FF] hover:border-[#0EA5E9]/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.value}
                        checked={reason === r.value}
                        onChange={() => setReason(r.value)}
                        className="accent-red-500"
                      />
                      <span className="font-medium text-sm">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#243b53]">Additional Details (optional)</label>
                <textarea
                  className="w-full rounded-xl border border-[#0C4A6E]/10 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-red-300 min-h-[80px] font-medium text-[#0C4A6E] shadow-sm transition-all resize-none"
                  placeholder="Describe what you saw..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-[#0C4A6E] font-bold hover:bg-[#0C4A6E]/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-md shadow-red-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

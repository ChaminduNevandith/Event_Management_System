"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { Flag, CheckCircle, XCircle, Eye, AlertTriangle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/useConfirm";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:   { label: "Pending",   color: "bg-amber-100 text-amber-700 border-amber-200",  icon: <Clock className="w-3 h-3" /> },
  REVIEWED:  { label: "Reviewed",  color: "bg-blue-100 text-blue-700 border-blue-200",     icon: <Eye className="w-3 h-3" /> },
  RESOLVED:  { label: "Resolved",  color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle className="w-3 h-3" /> },
  DISMISSED: { label: "Dismissed", color: "bg-gray-100 text-gray-600 border-gray-200",     icon: <XCircle className="w-3 h-3" /> },
};

const REASON_LABELS: Record<string, string> = {
  SPAM: "Spam",
  HARASSMENT: "Harassment",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  MISINFORMATION: "Misinformation",
  COPYRIGHT: "Copyright Violation",
  OTHER: "Other",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [resolving, setResolving] = useState<string | null>(null);
  const { confirm, ConfirmationModal } = useConfirm();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reportsData, statsData] = await Promise.all([
        fetchApi(`/admin/reports${filterStatus ? `?status=${filterStatus}` : ""}`),
        fetchApi("/admin/reports/stats"),
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (err: any) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filterStatus]);

  const handleResolve = async (id: string, status: "RESOLVED" | "DISMISSED" | "REVIEWED", note?: string) => {
    setResolving(id);
    try {
      await fetchApi(`/admin/reports/${id}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({ status, resolvedNote: note }),
      });
      toast.success(`Report marked as ${status.toLowerCase()}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update report");
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0C4A6E]">Abuse Reports</h1>
        <p className="text-[#486581] mt-2 text-lg">Review and resolve content reports from users.</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pending",   value: stats.pending,   color: "text-amber-600",   bg: "bg-amber-50 border-amber-100" },
            { label: "Reviewed",  value: stats.reviewed,  color: "text-blue-600",    bg: "bg-blue-50 border-blue-100" },
            { label: "Resolved",  value: stats.resolved,  color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            { label: "Dismissed", value: stats.dismissed, color: "text-gray-500",    bg: "bg-gray-50 border-gray-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border ${s.bg} p-5 flex flex-col`}>
              <span className="text-sm font-bold text-[#486581] mb-1">{s.label}</span>
              <span className={`text-4xl font-extrabold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#0EA5E9]/10 pb-4 flex-wrap">
        {["", "PENDING", "REVIEWED", "RESOLVED", "DISMISSED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
              filterStatus === s
                ? "bg-[#0EA5E9] text-white shadow-md shadow-[#0EA5E9]/20"
                : "text-[#486581] hover:bg-[#0EA5E9]/10 hover:text-[#0C4A6E]"
            }`}
          >
            {s === "" ? "All" : STATUS_CONFIG[s]?.label}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-white/40 backdrop-blur-md p-16 text-center shadow-xl">
          <Flag className="w-16 h-16 text-[#0EA5E9]/30 mb-4" />
          <h3 className="text-2xl font-extrabold text-[#0C4A6E]">No Reports Found</h3>
          <p className="text-[#486581] mt-2 max-w-md">
            {filterStatus ? `No reports with status "${STATUS_CONFIG[filterStatus]?.label}"` : "There are no submitted abuse reports yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const sc = STATUS_CONFIG[report.status];
            return (
              <div key={report.id} className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </span>
                      <span className="bg-[#0EA5E9]/10 text-[#0C4A6E] px-3 py-1 rounded-full text-xs font-bold border border-[#0EA5E9]/20">
                        {report.contentType.replace(/_/g, " ")}
                      </span>
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                    </div>

                    {/* Reporter info */}
                    <div className="flex items-center gap-3 mb-3">
                      {report.reporter?.avatarUrl ? (
                        <img src={report.reporter.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#0EA5E9]/20" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-bold text-sm">
                          {report.reporter?.firstName?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-[#0C4A6E] text-sm">{report.reporter?.firstName} {report.reporter?.lastName}</span>
                        <span className="text-[#486581] text-xs ml-2">{report.reporter?.email}</span>
                      </div>
                      <span className="text-xs text-[#9fb3c8] ml-auto">
                        {format(new Date(report.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>

                    {/* Description */}
                    {report.description && (
                      <p className="text-sm text-[#486581] bg-[#F0F9FF] rounded-xl px-4 py-3 border border-[#0EA5E9]/10 italic">
                        "{report.description}"
                      </p>
                    )}
                    {report.resolvedNote && (
                      <p className="text-xs text-[#486581] mt-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                        <span className="font-bold text-[#243b53]">Admin note: </span>{report.resolvedNote}
                      </p>
                    )}
                    <p className="text-xs text-[#9fb3c8] mt-2 font-mono">Content ID: {report.contentId}</p>
                  </div>

                  {/* Actions */}
                  {report.status === "PENDING" || report.status === "REVIEWED" ? (
                    <div className="flex flex-col gap-2 shrink-0 min-w-[180px]">
                      {report.status === "PENDING" && (
                        <button
                          disabled={resolving === report.id}
                          onClick={() => handleResolve(report.id, "REVIEWED")}
                          className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 font-bold rounded-xl text-sm hover:bg-blue-100 transition-colors"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      <button
                        disabled={resolving === report.id}
                        onClick={() => handleResolve(report.id, "RESOLVED")}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold rounded-xl text-sm hover:bg-emerald-100 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        disabled={resolving === report.id}
                        onClick={() => handleResolve(report.id, "DISMISSED")}
                        className="px-4 py-2 bg-gray-50 text-gray-600 border border-gray-100 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${sc.color}`}>
                      {sc.icon} {sc.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ConfirmationModal />
    </div>
  );
}

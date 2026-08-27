"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Download, FileText, FileSpreadsheet, MapPin } from "lucide-react";
import { exportExpensesToCSV, exportExpensesToPDF, exportItineraryToPDF } from "@/lib/exportUtils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExportPage() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [tripData, expensesData] = await Promise.all([
          fetchApi(`/trips/${params.id}`),
          fetchApi(`/trips/${params.id}/expenses`)
        ]);
        setTrip(tripData);
        setExpenses(expensesData);
      } catch (err) {
        console.error("Failed to load export data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </div>
    );
  }

  if (!trip) return <div>Trip not found</div>;

  const handleExportItinerary = () => {
    setIsExporting(true);
    const allEvents = (trip.destinations || []).flatMap((d: any) => 
      (d.itineraryItems || []).map((i: any) => ({ ...i, destinationName: d.name }))
    );
    exportItineraryToPDF(allEvents, trip.title);
    setIsExporting(false);
  };

  const handleExportExpensesCSV = () => {
    exportExpensesToCSV(expenses, trip.title);
  };

  const handleExportExpensesPDF = () => {
    exportExpensesToPDF(expenses, trip.title);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0C4A6E] flex items-center mb-6">
          <Download className="mr-2 h-6 w-6 text-[#0EA5E9]" />
          Export Data
        </h2>
        <p className="text-[#486581] mb-8 max-w-2xl">
          Download your trip itinerary or financial records to easily share them with others, keep for your personal archives, or use offline.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Itinerary Export */}
          <div className="bg-white/70 p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center text-center transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center mb-4 text-[#0EA5E9]">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#0C4A6E] mb-2">Itinerary</h3>
            <p className="text-sm text-[#486581] mb-6 flex-1">
              Export the full trip schedule with times, locations, and notes.
            </p>
            <button 
              onClick={handleExportItinerary}
              disabled={isExporting || trip.destinations?.length === 0}
              className="w-full flex items-center justify-center py-3 bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>

          {/* Expenses PDF */}
          <div className="bg-white/70 p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center text-center transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-4 text-[#10B981]">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#0C4A6E] mb-2">Expense Report</h3>
            <p className="text-sm text-[#486581] mb-6 flex-1">
              A beautifully formatted PDF of all recorded trip expenses.
            </p>
            <button 
              onClick={handleExportExpensesPDF}
              disabled={expenses.length === 0}
              className="w-full flex items-center justify-center py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>

          {/* Expenses CSV */}
          <div className="bg-white/70 p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center text-center transition-transform hover:scale-105">
            <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mb-4 text-[#F97316]">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-[#0C4A6E] mb-2">Raw Expenses</h3>
            <p className="text-sm text-[#486581] mb-6 flex-1">
              Spreadsheet format (CSV) suitable for Excel or Google Sheets.
            </p>
            <button 
              onClick={handleExportExpensesCSV}
              disabled={expenses.length === 0}
              className="w-full flex items-center justify-center py-3 bg-[#F97316] hover:bg-[#ea580c] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

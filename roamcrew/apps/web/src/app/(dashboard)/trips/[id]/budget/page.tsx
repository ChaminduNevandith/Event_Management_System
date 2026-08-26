"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { Receipt, Plus, DollarSign, Tag, Calendar, User, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function TripBudgetPage() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: "",
    category: "FOOD",
    date: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [tripData, expensesData] = await Promise.all([
          fetchApi(`/trips/${params.id}`),
          fetchApi(`/trips/${params.id}/expenses`),
        ]);
        setTrip(tripData);
        setExpenses(expensesData);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseData.title || !expenseData.amount) return;
    
    setIsSubmitting(true);
    try {
      const amount = parseFloat(expenseData.amount);
      const memberCount = trip.members.length;
      const splitAmount = amount / memberCount;
      
      const me = trip.members.find((m: any) => m.role === 'OWNER') || trip.members[0]; // Simplification for MVP

      const payload = {
        title: expenseData.title,
        amount: amount,
        currency: "USD",
        date: new Date(expenseData.date).toISOString(),
        category: expenseData.category,
        payerId: me.userId, // Assuming I paid
        splits: trip.members.map((m: any) => ({
          userId: m.userId,
          amount: splitAmount
        }))
      };

      const newExpense = await fetchApi(`/trips/${params.id}/expenses`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setExpenses([newExpense, ...expenses]);
      setIsAddingExpense(false);
      setExpenseData({
        title: "",
        amount: "",
        category: "FOOD",
        date: new Date().toISOString().slice(0, 16),
      });
    } catch (err: any) {
      alert("Failed to add expense: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await fetchApi(`/trips/${params.id}/expenses/${expenseId}`, { method: "DELETE" });
      setExpenses(expenses.filter(e => e.id !== expenseId));
    } catch (err: any) {
      alert("Failed to delete expense: " + err.message);
    }
  };

  if (isLoading || !trip) return null;

  const totalCost = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
        <div className="flex items-center">
          <Receipt className="mr-3 h-6 w-6 text-[#F97316]" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0C4A6E]">Ledger</h2>
            <p className="text-sm font-bold text-[#F97316]">Total: ${totalCost.toFixed(2)}</p>
          </div>
        </div>
        {!isAddingExpense && (
          <button 
            onClick={() => setIsAddingExpense(true)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#F97316] px-4 text-sm font-bold text-white shadow-md shadow-[#F97316]/20 transition-all hover:bg-[#ea580c] hover:-translate-y-0.5"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </button>
        )}
      </div>

      {isAddingExpense && (
        <form onSubmit={handleAddExpense} className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4 border-b border-[#F97316]/10 pb-4">
            <h3 className="font-extrabold text-xl text-[#0C4A6E]">New Expense</h3>
            <span className="text-xs font-bold bg-[#0EA5E9]/10 text-[#0EA5E9] px-3 py-1 rounded-full border border-[#0EA5E9]/20">
              Splitting Equally ({trip.members.length} ways)
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-[#486581] mb-1 block">What was it for?</label>
              <div className="relative">
                <Receipt className="absolute left-3 top-3 h-5 w-5 text-[#829ab1]" />
                <input required autoFocus value={expenseData.title} onChange={e => setExpenseData({...expenseData, title: e.target.value})} className="w-full h-12 rounded-xl border border-white bg-white/70 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#F97316]/50 shadow-sm" placeholder="e.g. Sushi Dinner" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-bold text-[#486581] mb-1 block">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-[#829ab1]" />
                <input required type="number" min="0.01" step="0.01" value={expenseData.amount} onChange={e => setExpenseData({...expenseData, amount: e.target.value})} className="w-full h-12 rounded-xl border border-white bg-white/70 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#F97316]/50 shadow-sm" placeholder="0.00" />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#486581] mb-1 block">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-[#829ab1]" />
                <select value={expenseData.category} onChange={e => setExpenseData({...expenseData, category: e.target.value})} className="w-full h-12 rounded-xl border border-white bg-white/70 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#F97316]/50 shadow-sm appearance-none">
                  <option value="FLIGHTS">Flights</option>
                  <option value="ACCOMMODATION">Accommodation</option>
                  <option value="FOOD">Food & Dining</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="ACTIVITIES">Activities</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold text-[#486581] mb-1 block">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-[#829ab1]" />
                <input type="datetime-local" value={expenseData.date} onChange={e => setExpenseData({...expenseData, date: e.target.value})} className="w-full h-12 rounded-xl border border-white bg-white/70 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#F97316]/50 shadow-sm" />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setIsAddingExpense(false)} className="px-6 py-2.5 text-sm font-bold text-[#486581] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-white">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold text-white bg-[#F97316] hover:bg-[#ea580c] rounded-xl shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50">{isSubmitting ? "Saving..." : "Save Expense"}</button>
            </div>
          </div>
        </form>
      )}

      {expenses.length > 0 ? (
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="divide-y divide-white/40">
            {expenses.map((expense) => (
              <div key={expense.id} className="p-5 flex items-center justify-between hover:bg-white/50 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-2xl bg-white border border-[#F97316]/10 flex flex-shrink-0 items-center justify-center shadow-sm">
                    <Receipt className="h-6 w-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0C4A6E] text-base">{expense.title}</h4>
                    <div className="flex items-center text-xs font-bold text-[#829ab1] mt-1 space-x-3">
                      <span className="flex items-center"><User className="h-3 w-3 mr-1" /> Paid by {expense.payer?.firstName || "Someone"}</span>
                      <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {format(new Date(expense.date), "MMM d")}</span>
                      <span className="bg-white/50 px-2 py-0.5 rounded-full border border-white text-[10px] uppercase tracking-wider">{expense.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-extrabold text-lg text-[#0C4A6E]">${expense.amount.toFixed(2)}</div>
                    <div className="text-xs font-bold text-[#0EA5E9]">You owe ${(expense.amount / trip.members.length).toFixed(2)}</div>
                  </div>
                  <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 text-[#829ab1] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 rounded-xl hover:bg-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isAddingExpense && (
          <div className="rounded-3xl border-2 border-dashed border-[#F97316]/20 bg-white/30 backdrop-blur-md p-16 text-center flex flex-col items-center shadow-sm">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Receipt className="h-10 w-10 text-[#F97316]/40" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E]">No expenses yet</h3>
            <p className="text-[#486581] mt-2 max-w-sm">Add shared costs here to automatically keep track of who owes what.</p>
          </div>
        )
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { fetchApi } from "@/lib/api";
import {  Plus, Receipt, User as UserIcon, Trash2, ArrowRight  } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Modal } from "@/components/ui/modal";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useSocket } from "@/components/socket-provider";

const CURRENCIES = Intl.supportedValuesOf ? Intl.supportedValuesOf("currency").map(c => ({ value: c, label: c })) : [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'INR', label: 'INR - Indian Rupee' }
];

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  const { confirm, ConfirmationModal } = useConfirm();
  
  const [trip, setTrip] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'balances' | 'settlements'>('balances');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    currency: "USD",
    payerId: "",
    category: "OTHER"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { socket } = useSocket();

  const loadData = async () => {
    try {
      const [tripData, expensesData, balancesData, settlementsData] = await Promise.all([
        fetchApi(`/trips/${tripId}`),
        fetchApi(`/trips/${tripId}/expenses`),
        fetchApi(`/trips/${tripId}/expenses/balances`),
        fetchApi(`/trips/${tripId}/expenses/settlements`)
      ]);
      setTrip(tripData);
      setExpenses(expensesData);
      setBalances(balancesData);
      setSettlements(settlementsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  useEffect(() => {
    if (!socket) return;
    const handleDataUpdated = (type: string) => {
      if (type === 'expense') {
        loadData();
      }
    };
    socket.on('dataUpdated', handleDataUpdated);
    return () => {
      socket.off('dataUpdated', handleDataUpdated);
    };
  }, [socket]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount || !newExpense.payerId) return;
    setIsSubmitting(true);

    try {
      const totalAmount = parseFloat(newExpense.amount);
      const memberCount = trip.members.length;
      const splitAmount = parseFloat((totalAmount / memberCount).toFixed(2));
      
      // Fix rounding error by giving the remainder to the payer
      let totalSplit = 0;
      const splits = trip.members.map((m: any) => {
        const amt = m.userId === newExpense.payerId 
          ? splitAmount + (totalAmount - (splitAmount * memberCount))
          : splitAmount;
        totalSplit += amt;
        return {
          userId: m.userId,
          amount: parseFloat(amt.toFixed(2))
        };
      });

      await fetchApi(`/trips/${tripId}/expenses`, {
        method: "POST",
        body: JSON.stringify({
          title: newExpense.title,
          amount: totalAmount,
          currency: newExpense.currency,
          payerId: newExpense.payerId,
          category: newExpense.category,
          splits: splits
        })
      });

      setIsAddOpen(false);
      setNewExpense({ title: "", amount: "", currency: "USD", payerId: "", category: "OTHER" });
      toast.success("Expense added successfully!");
      if (socket) socket.emit("clientDataUpdated", { tripId, eventType: 'expense' });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const isConfirmed = await confirm("Are you sure you want to delete this expense?");
    if (!isConfirmed) return;
    try {
      await fetchApi(`/trips/${tripId}/expenses/${expenseId}`, {
        method: "DELETE"
      });
      toast.success("Expense deleted");
      if (socket) socket.emit("clientDataUpdated", { tripId, eventType: 'expense' });
      loadData();
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  };

  if (loading) {
    return <div className="space-y-6 w-full mt-4">
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
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="text-orange-500" />
            Budget & Ledger
          </h1>
          <p className="text-slate-500">Track shared expenses and balances.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/20">
          <Plus className="w-4 h-4 mr-2" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Balances View */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Overview</h2>
            <div className="bg-slate-100 rounded-lg p-1 flex items-center">
              <button 
                onClick={() => setActiveTab('balances')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'balances' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Balances
              </button>
              <button 
                onClick={() => setActiveTab('settlements')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${activeTab === 'settlements' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Settle Up
              </button>
            </div>
          </div>
          
          <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-6 space-y-4">
            
            {activeTab === 'balances' && (
              <div className="space-y-6">
                {balances.length === 0 && (
                  <div className="text-slate-500 text-center py-4">No balances yet.</div>
                )}
                {balances.map((group: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{group.currency} Balances</h3>
                    {group.balances.map((b: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/50 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                            {b.user.firstName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{b.user.firstName} {b.user.lastName}</div>
                            <div className="text-xs text-slate-500 font-medium">
                              {b.amount > 0 ? "Owed money" : b.amount < 0 ? "Owes money" : "Settled up"}
                            </div>
                          </div>
                        </div>
                        <div className={`font-black text-lg ${b.amount > 0 ? "text-emerald-500" : b.amount < 0 ? "text-rose-500" : "text-slate-400"}`}>
                          {b.amount > 0 ? "+" : ""}{formatCurrency(b.amount, group.currency)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settlements' && (
              <div className="space-y-6">
                {settlements.length === 0 ? (
                  <div className="text-slate-500 text-center py-8 flex flex-col items-center gap-3 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                      <Receipt className="w-8 h-8" />
                    </div>
                    <span className="font-semibold text-slate-700">Everyone is perfectly settled up!</span>
                  </div>
                ) : (
                  settlements.map((group: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      {group.settlements.length > 0 && (
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest text-center mt-2">
                          {group.currency} Settlements
                        </h3>
                      )}
                      {group.settlements.map((s: any, i: number) => (
                        <div key={i} className="group relative flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 border-2 border-white flex items-center justify-center text-rose-700 font-bold shadow-md z-10 -mr-3">
                                {s.from.firstName[0]}
                              </div>
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-white flex items-center justify-center text-emerald-700 font-bold shadow-md z-0">
                                {s.to.firstName[0]}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                <span>{s.from.firstName}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                                <span>{s.to.firstName}</span>
                              </div>
                              <div className="text-xs font-medium text-slate-500">Pays via App or Cash</div>
                            </div>
                          </div>
                          <div className="font-black text-slate-800 text-xl relative z-10 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                            {formatCurrency(s.amount, group.currency)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>

        {/* Ledger View */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Recent Expenses</h2>
          <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-6 space-y-4">
            {expenses.length === 0 && (
              <div className="text-slate-500 text-center py-4 text-sm">No expenses recorded.</div>
            )}
            {expenses.map((expense) => (
              <div key={expense.id} className="p-4 rounded-xl bg-white/50 border border-slate-100 shadow-sm flex flex-col gap-3 group relative">
                <button 
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex justify-between pr-8">
                  <div>
                    <div className="font-semibold text-slate-800">{expense.title}</div>
                    <div className="text-xs text-slate-500 font-medium bg-slate-200/50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {expense.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{formatCurrency(expense.amount, expense.currency)}</div>
                    <div className="text-xs text-slate-500">{format(new Date(expense.date), "MMM d, yyyy")}</div>
                  </div>
                </div>
                
                <div className="text-sm bg-blue-50/50 rounded-lg p-2 border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <UserIcon className="w-3.5 h-3.5" />
                    Paid by <span className="font-medium text-slate-800">{expense.payer.firstName}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Split equally
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Expense"
        className="max-w-md my-8"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-4 pr-8">Add Expense</h3>
        
        <form onSubmit={handleAddExpense} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input 
              type="text" 
              value={newExpense.title}
              onChange={e => setNewExpense({...newExpense, title: e.target.value})}
              className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              placeholder="e.g., Dinner at Mario's"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Currency</label>
              <SearchableSelect 
                options={CURRENCIES}
                value={newExpense.currency}
                onChange={val => setNewExpense({...newExpense, currency: val})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <input 
                type="number" 
                step="0.01"
                value={newExpense.amount}
                onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Paid By</label>
            <select 
              value={newExpense.payerId}
              onChange={e => setNewExpense({...newExpense, payerId: e.target.value})}
              className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
              required
            >
              <option value="">Select someone...</option>
              {trip?.members.map((m: any) => (
                <option key={m.userId} value={m.userId}>
                  {m.user.firstName} {m.user.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select 
              value={newExpense.category}
              onChange={e => setNewExpense({...newExpense, category: e.target.value})}
              className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            >
              <option value="FOOD">Food & Dining</option>
              <option value="TRANSPORT">Transport</option>
              <option value="ACCOMMODATION">Accommodation</option>
              <option value="ACTIVITIES">Activities</option>
              <option value="SHOPPING">Shopping</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="pt-2 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-slate-400 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              This expense will automatically be split equally among all {trip?.members.length} trip members.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddOpen(false)} disabled={isSubmitting} className="px-4 py-2 hover:bg-slate-100 rounded-md text-slate-600 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full disabled:opacity-50 flex items-center">
              {isSubmitting ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal />
    </div>
  );
}

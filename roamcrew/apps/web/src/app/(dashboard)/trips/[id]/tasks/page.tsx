"use client";

import { useState, useEffect, use } from "react";
import { fetchApi } from "@/lib/api";
import {  Plus, CheckSquare, Clock, AlertCircle, FileText, ShoppingBag, Briefcase, Trash2, Calendar as CalendarIcon, User as UserIcon  } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const CATEGORIES = [
  { id: "GENERAL", name: "General Tasks", icon: CheckSquare, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "PACKING", name: "Packing List", icon: Briefcase, color: "text-orange-500", bg: "bg-orange-100" },
  { id: "BOOKING", name: "Bookings", icon: Clock, color: "text-purple-500", bg: "bg-purple-100" },
  { id: "VISA", name: "Visa & Docs", icon: FileText, color: "text-rose-500", bg: "bg-rose-100" },
  { id: "SHOPPING", name: "Shopping List", icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-100" },
];

export default function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  const { confirm, ConfirmationModal } = useConfirm();

  const [tasks, setTasks] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [activeTab, setActiveTab] = useState("GENERAL");

  const loadData = async () => {
    try {
      const [tasksData, tripData] = await Promise.all([
        fetchApi(`/trips/${tripId}/tasks`),
        fetchApi(`/trips/${tripId}`)
      ]);
      setTasks(tasksData);
      setTrip(tripData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/trips/${tripId}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          category,
          priority,
          dueDate: dueDate || undefined,
          assigneeId: assigneeId || undefined
        })
      });
      
      setIsAddOpen(false);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setAssigneeId("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await fetchApi(`/trips/${tripId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      // Revert on failure
      loadData();
    }
  };

  const handleDelete = async (taskId: string) => {
    const isConfirmed = await confirm("Are you sure you want to delete this task?");
    if (!isConfirmed) return;
    try {
      await fetchApi(`/trips/${tripId}/tasks/${taskId}`, { method: "DELETE" });
      toast.success("Item deleted successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
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

  const filteredTasks = tasks.filter(t => t.category === activeTab);
  const completedCount = filteredTasks.filter(t => t.status === "COMPLETED").length;
  const progress = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Tasks & Checklists</h2>
          <p className="text-[#486581] font-medium text-sm mt-1">Keep track of everything you need to do before you go.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar gap-2">
        {CATEGORIES.map(cat => {
          const catTasks = tasks.filter(t => t.category === cat.id);
          const active = activeTab === cat.id;
          const CatIcon = cat.icon;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center px-4 py-3 rounded-2xl whitespace-nowrap transition-all border-2 ${
                active 
                  ? `border-transparent bg-white shadow-md` 
                  : `border-white/50 bg-white/40 hover:bg-white/60`
              }`}
            >
              <div className={`p-1.5 rounded-lg mr-2 ${active ? cat.bg : 'bg-slate-200'}`}>
                <CatIcon className={`w-4 h-4 ${active ? cat.color : 'text-slate-500'}`} />
              </div>
              <span className={`font-bold text-sm ${active ? 'text-[#0C4A6E]' : 'text-[#486581]'}`}>
                {cat.name}
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                active ? 'bg-slate-100 text-slate-600' : 'bg-white/50 text-slate-500'
              }`}>
                {catTasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      {filteredTasks.length > 0 && (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm flex items-center">
          <div className="flex-1 mr-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-[#0C4A6E]">Completion Progress</span>
              <span className="text-xs font-bold text-[#486581]">{completedCount} of {filteredTasks.length} done</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-500">{progress}%</div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60">
            <CheckSquare className="w-12 h-12 text-[#0EA5E9]/30 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-1">No tasks yet</h3>
            <p className="text-[#486581] text-sm">Add a task to this category to get started.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-start p-4 rounded-2xl border-2 transition-all ${
                task.status === "COMPLETED" 
                  ? "bg-slate-50/50 border-white/50 opacity-70" 
                  : "bg-white/80 backdrop-blur-md border-white shadow-sm hover:border-[#0EA5E9]/30 hover:shadow-md"
              }`}
            >
              <button 
                onClick={() => handleToggleStatus(task.id, task.status)}
                className="mt-1 mr-4 shrink-0 focus:outline-none"
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  task.status === "COMPLETED" 
                    ? "bg-emerald-500 border-emerald-500 text-white" 
                    : "border-slate-300 hover:border-emerald-400"
                }`}>
                  {task.status === "COMPLETED" && <CheckSquare className="w-4 h-4" />}
                </div>
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={`text-lg font-bold transition-all ${
                      task.status === "COMPLETED" ? "text-slate-500 line-through decoration-2 decoration-slate-300" : "text-[#0C4A6E]"
                    }`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={`text-sm mt-1 ${task.status === "COMPLETED" ? "text-slate-400" : "text-[#486581]"}`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {task.priority !== "MEDIUM" && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center ${
                      task.priority === "URGENT" || task.priority === "HIGH" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                    }`}>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {task.priority}
                    </span>
                  )}
                  
                  {task.dueDate && (
                    <span className={`text-xs font-bold flex items-center ${
                      new Date(task.dueDate) < new Date() && task.status !== "COMPLETED" ? "text-red-500" : "text-slate-500"
                    }`}>
                      <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </span>
                  )}
                  
                  {task.assignee && (
                    <span className="text-xs font-bold text-slate-600 flex items-center bg-slate-100 px-2 py-0.5 rounded-md">
                      {task.assignee.avatarUrl ? (
                        <img src={task.assignee.avatarUrl} className="w-4 h-4 rounded-full mr-1.5" alt="" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-300 mr-1.5 flex items-center justify-center text-[8px] text-white">
                          {task.assignee.firstName[0]}
                        </div>
                      )}
                      {task.assignee.firstName} {task.assignee.lastName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-6">New Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Task Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 outline-none focus:border-[#0EA5E9] focus:bg-white"
                  placeholder="e.g. Renew passport"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 outline-none focus:border-[#0EA5E9] focus:bg-white min-h-[80px]"
                  placeholder="Add details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 outline-none focus:border-[#0EA5E9] focus:bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 outline-none focus:border-[#0EA5E9] focus:bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 outline-none focus:border-[#0EA5E9] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Assignee</label>
                  <select 
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 outline-none focus:border-[#0EA5E9] focus:bg-white"
                  >
                    <option value="">Anyone</option>
                    {trip?.members?.map((m: any) => (
                      <option key={m.user.id} value={m.user.id}>
                        {m.user.firstName} {m.user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:scale-105 text-white font-bold rounded-xl shadow-md transition-all">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmationModal />
    </div>
  );
}

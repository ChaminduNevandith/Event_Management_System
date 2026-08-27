"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import {  Plus, MessageSquare, CheckSquare, Clock, User, CheckCircle2  } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function DecisionsPage() {
  const params = useParams();
  const [polls, setPolls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [options, setOptions] = useState([{ text: "" }, { text: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const [pollsData, userProfile] = await Promise.all([
        fetchApi(`/trips/${params.id}/polls`),
        fetchApi('/users/me')
      ]);
      setPolls(pollsData);
      setCurrentUser(userProfile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validOptions = options.filter(o => o.text.trim().length > 0);
      if (validOptions.length < 2) {
        toast.error("Please provide at least two options.");
        setIsSubmitting(false);
        return;
      }
      
      await fetchApi(`/trips/${params.id}/polls`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description: description || undefined,
          isMultipleChoice,
          options: validOptions,
        })
      });
      
      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setIsMultipleChoice(false);
      setOptions([{ text: "" }, { text: "" }]);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create poll");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await fetchApi(`/trips/${params.id}/polls/${pollId}/vote`, {
        method: "POST",
        body: JSON.stringify({ optionId })
      });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to vote");
    }
  };

  const handleAddOption = () => setOptions([...options, { text: "" }]);
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };
  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
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
        <div>
          <h2 className="text-2xl font-extrabold text-[#0C4A6E]">Decision Room</h2>
          <p className="text-[#486581] font-medium text-sm mt-1">Propose ideas and vote together</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Poll
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {polls.map((poll) => {
          // Calculate total votes for percentages
          const totalVotes = poll.options.reduce((acc: number, opt: any) => acc + opt.votes.length, 0);

          return (
            <div key={poll.id} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-lg shadow-[#102a43]/5 flex flex-col group transition-all hover:shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#0C4A6E] leading-tight">{poll.title}</h3>
                  {poll.description && (
                    <p className="text-sm text-[#486581] mt-1 line-clamp-2">{poll.description}</p>
                  )}
                </div>
                {poll.status === "RESOLVED" && (
                  <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center shrink-0 ml-2">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6 flex-1">
                {poll.options.map((option: any) => {
                  const hasVoted = option.votes.some((v: any) => v.user.id === currentUser?.id);
                  const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(poll.id, option.id)}
                      disabled={poll.status !== "OPEN"}
                      className={`w-full relative overflow-hidden rounded-xl border-2 transition-all text-left p-3 flex justify-between items-center z-10 ${
                        hasVoted 
                          ? 'border-[#0EA5E9] bg-white' 
                          : 'border-white/80 bg-white/40 hover:border-[#0EA5E9]/50 hover:bg-white'
                      } ${poll.status !== "OPEN" ? 'cursor-default opacity-80' : ''}`}
                    >
                      <div 
                        className="absolute inset-y-0 left-0 bg-[#0EA5E9]/10 -z-10 transition-all duration-500 ease-out" 
                        style={{ width: `${percentage}%` }} 
                      />
                      
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          hasVoted ? 'border-[#0EA5E9] bg-[#0EA5E9]' : 'border-slate-300'
                        } ${poll.isMultipleChoice ? 'rounded-md' : 'rounded-full'}`}>
                          {hasVoted && <CheckSquare className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-bold ${hasVoted ? 'text-[#0C4A6E]' : 'text-[#486581]'}`}>{option.text}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-[#486581] font-bold">
                        {option.votes.length > 0 && (
                          <div className="flex -space-x-1 mr-1">
                            {option.votes.slice(0, 3).map((v: any, i: number) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold overflow-hidden">
                                {v.user.avatarUrl ? (
                                  <img src={v.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  v.user.firstName[0]
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <span>{percentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#486581] font-medium pt-4 border-t border-white/50">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Proposed by {poll.creator.firstName}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          );
        })}

        {polls.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60">
            <CheckSquare className="h-12 w-12 text-[#0EA5E9]/30 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-1">No polls yet</h3>
            <p className="text-[#486581] font-medium">Create a poll to make a group decision.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex items-center rounded-xl bg-white border-2 border-[#0EA5E9]/20 px-5 py-2.5 text-sm font-bold text-[#0EA5E9] shadow-sm transition-all hover:bg-[#f0f9ff] hover:border-[#0EA5E9]/40"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your first poll
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C4A6E]/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 my-8 relative">
            <button type="button" onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-[#486581] hover:text-[#0EA5E9] bg-white/50 p-2 rounded-full transition-colors z-10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2 pr-8">Create a Poll</h2>
            <p className="text-[#486581] text-sm mb-6">Ask the crew a question and gather votes.</p>
            
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Question</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                  placeholder="e.g. Where should we stay?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-3 text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white min-h-[80px]"
                  placeholder="Add context to help people decide..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#486581] mb-1.5 ml-1">Options</label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex space-x-2">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        className="flex-1 rounded-xl border-2 border-[#0EA5E9]/20 bg-white/50 px-4 py-2.5 text-sm text-[#0C4A6E] outline-none transition-all focus:border-[#0EA5E9] focus:bg-white"
                        placeholder={`Option ${i + 1}`}
                        required
                      />
                      {options.length > 2 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveOption(i)}
                          className="px-3 rounded-xl border-2 border-red-100 bg-red-50 text-red-500 hover:bg-red-100 font-bold"
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="w-full py-2.5 border-2 border-dashed border-[#0EA5E9]/30 rounded-xl text-sm font-bold text-[#0EA5E9] hover:bg-[#0EA5E9]/5 transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-white">
                <input
                  type="checkbox"
                  id="multi"
                  checked={isMultipleChoice}
                  onChange={(e) => setIsMultipleChoice(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0EA5E9] focus:ring-[#0EA5E9]"
                />
                <label htmlFor="multi" className="text-sm font-bold text-[#0C4A6E]">
                  Allow multiple choices
                </label>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl border-2 border-white bg-white/50 px-4 py-3 text-sm font-bold text-[#486581] transition-all hover:bg-white hover:text-[#0C4A6E] shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] px-4 py-3 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Poll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

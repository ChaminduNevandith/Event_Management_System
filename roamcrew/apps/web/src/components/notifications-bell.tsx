"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function NotificationsBell({ 
  align = 'right' 
}: { 
  align?: 'left' | 'right' 
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await fetchApi("/notifications");
      setNotifications(data);
      const unread = data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetchApi(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetchApi(`/notifications/read-all`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#486581] hover:text-[#0C4A6E] hover:bg-white/50 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-80 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl shadow-[#102a43]/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
          <div className="px-4 py-3 border-b border-[#0C4A6E]/5 flex items-center justify-between bg-white/50">
            <h3 className="font-bold text-[#0C4A6E]">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-bold text-[#0EA5E9] hover:text-[#0284c7]"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#486581]">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-[#0C4A6E]/5">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 transition-colors hover:bg-white ${n.isRead ? 'opacity-70' : 'bg-[#F0F9FF]/30'}`}
                    onClick={() => !n.isRead && markAsRead(n.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${n.isRead ? 'text-[#486581] font-medium' : 'text-[#0C4A6E] font-bold'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-[#829ab1] mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] font-bold text-[#829ab1] mt-1.5 uppercase tracking-wide">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div className="shrink-0 flex items-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                            className="h-6 w-6 rounded-full bg-white border border-[#0C4A6E]/10 flex items-center justify-center text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-colors"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

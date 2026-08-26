"use client";

import { useState, useEffect, useRef, use } from "react";
import { fetchApi } from "@/lib/api";
import { Send, Image as ImageIcon, Smile, MoreVertical } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { format } from "date-fns";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // 1. Fetch initial messages
    const loadMessages = async () => {
      try {
        const data = await fetchApi(`/trips/${tripId}/messages`);
        setMessages(data);
        
        // Also get current user info from local storage or API
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    loadMessages();

    // 2. Setup Socket.IO connection
    const token = localStorage.getItem("access_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    // Connect to the WebSocket Gateway
    const socket = io(apiUrl, {
      auth: { token }
    });
    
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to chat server");
      // Join the trip's chat room
      socket.emit("joinTrip", { tripId });
    });

    socket.on("newMessage", (message: any) => {
      setMessages(prev => {
        // Prevent duplicate messages if we already have it
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      setTimeout(scrollToBottom, 100);
    });

    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [tripId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      tripId,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA5E9] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-white/60 bg-white/40 flex justify-between items-center z-10 shrink-0">
        <div>
          <h3 className="font-extrabold text-[#0C4A6E] text-lg">Crew Chat</h3>
          <p className="text-xs font-bold text-[#486581]">Real-time encrypted connection</p>
        </div>
        <button className="p-2 hover:bg-white/50 rounded-xl transition-colors">
          <MoreVertical className="w-5 h-5 text-[#486581]" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
            <div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-full flex items-center justify-center mb-4">
              <Smile className="w-8 h-8 text-[#0EA5E9]" />
            </div>
            <h4 className="text-[#0C4A6E] font-bold text-lg mb-1">It's quiet here...</h4>
            <p className="text-[#486581] text-sm">Send the first message to kick off the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = currentUser && msg.user.id === currentUser.id;
            const showAvatar = index === messages.length - 1 || messages[index + 1]?.user.id !== msg.user.id;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                <div className={`flex max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                  
                  {/* Avatar */}
                  {!isMe && (
                    <div className="w-8 shrink-0">
                      {showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                          {msg.user.firstName[0]}{msg.user.lastName[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && showAvatar && (
                      <span className="text-[10px] font-bold text-[#486581] ml-1 mb-1">{msg.user.firstName}</span>
                    )}
                    
                    <div 
                      className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                        isMe 
                          ? 'bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white rounded-br-sm' 
                          : 'bg-white border border-white/60 text-[#0C4A6E] rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    
                    <span className={`text-[10px] font-bold text-slate-400 mt-1 ${isMe ? 'mr-1' : 'ml-1'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/40 border-t border-white/60 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <button type="button" className="p-3 text-[#486581] hover:text-[#0EA5E9] hover:bg-white/50 rounded-xl transition-colors shrink-0">
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-white/70 border border-white focus:border-[#0EA5E9]/30 rounded-2xl py-3 pl-4 pr-10 text-sm text-[#0C4A6E] placeholder-[#486581]/50 outline-none shadow-inner"
            />
            <button type="button" className="absolute right-3 top-3 text-[#486581]/50 hover:text-[#F97316] transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="p-3 bg-[#0EA5E9] hover:bg-[#0284c7] disabled:opacity-50 disabled:hover:bg-[#0EA5E9] text-white rounded-2xl shadow-md transition-all shrink-0"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

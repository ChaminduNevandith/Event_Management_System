"use client";

import { useEffect, useState, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { useParams } from "next/navigation";
import { MessageSquare, Send, User } from "lucide-react";
import { format } from "date-fns";
import io, { Socket } from "socket.io-client";

export default function TripChatPage() {
  const params = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [me, setMe] = useState<any>(null); // We need our own user ID to style messages differently
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial history
  useEffect(() => {
    async function loadData() {
      try {
        const [tripData, messagesData] = await Promise.all([
          fetchApi(`/trips/${params.id}`),
          fetchApi(`/trips/${params.id}/messages`),
        ]);
        
        // Find 'me' using the token implicitly or just by checking which member I am
        // For MVP, since we don't have a /users/me endpoint handy here easily, 
        // we might not perfectly align left/right unless we decode the JWT or have context.
        // I will just use the token from localStorage to initialize socket.
        
        setMessages(messagesData);
      } finally {
        setIsLoading(false);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
    loadData();
  }, [params.id]);

  // Connect to Socket.IO
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    // We can decode payload to get our own user ID for UI styling
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setMe(payload.userId);
    } catch(e) {}

    const newSocket = io("http://localhost:3001", {
      auth: { token }
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat socket");
      newSocket.emit("joinTrip", { tripId: params.id });
    });

    newSocket.on("newMessage", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      tripId: params.id,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col h-[600px] bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Chat Header */}
      <div className="bg-white/40 p-4 border-b border-white flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="mr-3 h-6 w-6 text-[#10B981]" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#0C4A6E]">Trip Chat</h2>
            <p className="text-xs font-bold text-[#10B981]">Live</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <MessageSquare className="h-12 w-12 text-[#10B981]/20 mb-3" />
            <p className="text-[#486581] font-medium text-sm max-w-xs">Start the conversation! Drop an idea or say hi to the crew.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.userId === me;
            const showName = !isMe && (index === 0 || messages[index - 1].userId !== msg.userId);

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {showName && (
                  <span className="text-xs font-bold text-[#829ab1] ml-2 mb-1">
                    {msg.user?.firstName || "Crew Member"}
                  </span>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  isMe 
                    ? 'bg-[#10B981] text-white rounded-br-sm shadow-md shadow-[#10B981]/20' 
                    : 'bg-white border border-[#10B981]/10 text-[#0C4A6E] rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm font-medium leading-relaxed break-words">{msg.content}</p>
                </div>
                <span className={`text-[10px] font-bold text-[#829ab1] mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>
                  {format(new Date(msg.createdAt), "h:mm a")}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/40 border-t border-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-12 rounded-xl border border-white bg-white/70 px-4 text-sm focus:ring-2 focus:ring-[#10B981]/50 shadow-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !socket}
            className="h-12 px-6 rounded-xl bg-[#10B981] text-white flex items-center justify-center shadow-md shadow-[#10B981]/20 hover:bg-[#059669] transition-all disabled:opacity-50 hover:-translate-y-0.5"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

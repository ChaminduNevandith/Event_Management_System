"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-provider";

interface SocketContextType {
  socket: Socket | null;
  activeUsers: any[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, activeUsers: [] });

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ tripId, children }: { tripId: string, children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token || !user) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const newSocket = io(apiUrl, { auth: { token } });
    socketRef.current = newSocket;
    
    newSocket.on("connect", () => {
      console.log("Connected to global trip socket");
      newSocket.emit("joinTrip", { tripId, user });
    });

    newSocket.on("activeUsers", (users: any[]) => {
      // Remove duplicate users if they have multiple tabs open (same user.id)
      const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values());
      setActiveUsers(uniqueUsers);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [tripId, user]);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

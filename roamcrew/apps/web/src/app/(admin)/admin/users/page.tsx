"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { Users, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchApi("/admin/users");
        setUsers(data);
      } catch (err) {
        console.error(err);
        // Mock data
        setUsers([
           { id: "1", firstName: "Alice", lastName: "Smith", email: "alice@example.com", role: "ADMIN" },
           { id: "2", firstName: "Bob", lastName: "Jones", email: "bob@example.com", role: "USER" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] tracking-tight">User Management</h1>
          <p className="text-[#0C4A6E]/60 mt-2 text-sm md:text-base max-w-2xl">
            View and manage users on the platform.
          </p>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40 text-[#0C4A6E]/60 text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-500 text-sm">
                          {u.firstName?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-[#0C4A6E]">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-[#0C4A6E]/60">ID: {u.id.substring(0,8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#0C4A6E]/80 text-sm">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-[#0C4A6E]/60 hover:text-[#0C4A6E] rounded-xl hover:bg-white/50 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

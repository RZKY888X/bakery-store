"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold text-white">Manajemen User</h2>
        <div className="text-sm text-gray-400 font-mono bg-[#1A1A1A] px-3 py-1 rounded-full border border-white/10">Total: {users.length} Users</div>
      </div>

      <div className="bg-[#1A1A1A] rounded-3xl shadow-lg border border-white/5 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
           <thead className="bg-[#202020] text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/5">
              <tr>
                 <th className="px-8 py-5">ID</th>
                 <th className="px-8 py-5">Name</th>
                 <th className="px-8 py-5">Email</th>
                 <th className="px-8 py-5">Role</th>
                 <th className="px-8 py-5">Joined Date</th>
                 <th className="px-8 py-5">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                 <tr key={user.id} className="hover:bg-white/5 transition group">
                    <td className="px-8 py-5 text-gray-500 font-mono text-xs">#{user.id}</td>
                    <td className="px-8 py-5 font-bold text-white group-hover:text-gold transition">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs ring-1 ring-gold/20">
                             {user.name.substring(0,2).toUpperCase()}
                          </div>
                          {user.name}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-gray-400">{user.email}</td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                          ${user.role === "ADMIN" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                          {user.role}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                       <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl disabled:opacity-30 disabled:hover:bg-transparent transition"
                          disabled={user.role === 'ADMIN'}
                          title={user.role === 'ADMIN' ? "Cannot delete Admin" : "Delete User"}
                       >
                          <Trash2 size={16} />
                       </button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}

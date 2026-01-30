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
        <h2 className="font-display text-2xl font-bold">Manajemen User</h2>
        <div className="text-sm text-gray-500">Total: {users.length} Users</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                 <th className="px-6 py-4">ID</th>
                 <th className="px-6 py-4">Name</th>
                 <th className="px-6 py-4">Email</th>
                 <th className="px-6 py-4">Role</th>
                 <th className="px-6 py-4">Joined Date</th>
                 <th className="px-6 py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                 <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-400">#{user.id}</td>
                    <td className="px-6 py-4 font-bold">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                             {user.name.substring(0,2).toUpperCase()}
                          </div>
                          {user.name}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                          ${user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-600"}`}>
                          {user.role}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                       <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                          disabled={user.role === 'ADMIN'}
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

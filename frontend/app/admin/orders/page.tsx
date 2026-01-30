"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

interface Order {
  id: number;
  user: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
       console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:4000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { 
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold">Daftar Pesanan</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                 <th className="px-6 py-4">Order ID</th>
                 <th className="px-6 py-4">Customer</th>
                 <th className="px-6 py-4">Total</th>
                 <th className="px-6 py-4">Date</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                 <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">#{order.id}</td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-dark">{order.user?.name || "Unknown"}</p>
                       <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gold">Rp {order.totalAmount.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                       <select 
                          value={order.status} 
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-none outline-none cursor-pointer
                             ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                               order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                               order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                               "bg-blue-100 text-blue-700"}`}
                       >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                       </select>
                    </td>
                    <td className="px-6 py-4">
                       <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                          <Eye size={16} />
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

"use client";

import { useState, useEffect } from "react";
import { Eye, Printer, X } from "lucide-react";

interface Order {
  id: number;
  user: { name: string; email: string };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
  shippingAddress?: string;
  paymentMethod?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      if(selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({...selectedOrder, status});
      }
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handlePrint = () => {
      window.print();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 print:hidden">
        <div>
           <h2 className="font-display text-3xl font-bold text-white">Daftar Pesanan</h2>
           <p className="text-gray-400 text-sm mt-1">Pantau dan kelola status pesanan masuk secara real-time.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#1A1A1A] border border-white/10 text-gray-300 rounded-xl text-sm font-bold shadow-sm hover:bg-white/5 transition flex items-center gap-2">
                <Printer size={16} /> Export
            </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-3xl shadow-lg border border-white/5 overflow-hidden overflow-x-auto print:hidden">
        <table className="w-full text-sm text-left">
           <thead className="bg-[#202020] text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/5">
              <tr>
                 <th className="px-8 py-5">Order ID</th>
                 <th className="px-8 py-5">Customer</th>
                 <th className="px-8 py-5">Total</th>
                 <th className="px-8 py-5">Date</th>
                 <th className="px-8 py-5">Status</th>
                 <th className="px-8 py-5 text-right">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                 <tr key={order.id} className="hover:bg-white/5 transition group">
                    <td className="px-8 py-5 font-bold text-white text-base">
                        #{order.id}
                    </td>
                    <td className="px-8 py-5">
                       <p className="font-bold text-white text-sm group-hover:text-gold transition">{order.user?.name || "Unknown"}</p>
                       <p className="text-xs text-gray-500 font-medium">{order.user?.email}</p>
                    </td>
                    <td className="px-8 py-5 font-bold text-white font-mono">Rp {order.totalAmount?.toLocaleString("id-ID")}</td>
                    <td className="px-8 py-5 text-gray-500 font-medium whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium'})}</td>
                    <td className="px-8 py-5">
                       <div className="relative inline-block">
                           <select 
                              value={order.status} 
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase border shadow-sm outline-none cursor-pointer transition hover:shadow-md
                                 ${order.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                                   order.status === "PROCESSED" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                   order.status === "SHIPPED" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                   order.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                   order.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                   "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                           >
                              <option value="PENDING" className="bg-[#1A1A1A] text-gray-300">Pending</option>
                              <option value="PAID" className="bg-[#1A1A1A] text-gray-300">Paid</option>
                              <option value="PROCESSED" className="bg-[#1A1A1A] text-gray-300">Processed</option>
                              <option value="SHIPPED" className="bg-[#1A1A1A] text-gray-300">Shipped</option>
                              <option value="COMPLETED" className="bg-[#1A1A1A] text-gray-300">Completed</option>
                              <option value="CANCELLED" className="bg-[#1A1A1A] text-gray-300">Cancelled</option>
                           </select>
                           <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full
                                ${order.status === "PENDING" ? "bg-yellow-500" : 
                                  order.status === "PROCESSED" ? "bg-indigo-500" :
                                  order.status === "SHIPPED" ? "bg-blue-500" :
                                  order.status === "COMPLETED" ? "bg-green-500" :
                                  order.status === "CANCELLED" ? "bg-red-500" :
                                  "bg-gray-500"}`}>
                            </span>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2.5 text-gray-500 hover:text-gold hover:bg-gold/10 rounded-xl transition"
                            title="Lihat Detail"
                        >
                          <Eye size={18} />
                       </button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed">
            <div className="bg-[#1A1A1A] rounded-3xl w-[95%] md:w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl print:w-full print:max-w-none print:shadow-none print:rounded-none print:border-none print:bg-white">
                <div className="p-6 border-b border-white/5 flex justify-between items-center print:hidden bg-[#202020]">
                    <h3 className="font-display text-xl font-bold text-white">Detail Pesanan #{selectedOrder.id}</h3>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-bold text-xs rounded-xl hover:bg-gold hover:text-dark transition border border-white/5"
                         >
                            <Printer size={16} /> Cetak Struk
                         </button>
                         <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition">
                            <X size={20} />
                         </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="p-8 print:p-0 print:text-black">
                    {/* Header: Dark on Screen, Black on Print */}
                    <div className="text-center mb-8 border-b border-dashed border-gray-700 print:border-gray-300 pb-6">
                        <h1 className="font-display text-2xl font-bold text-white print:text-black mb-1">Bakery Store</h1>
                        <p className="text-xs text-gray-400 print:text-gray-600">Jl. Roti Enak No. 123, Jakarta Selatan</p>
                        <p className="text-xs text-gray-400 print:text-gray-600">Telp: 0812-3456-7890</p>
                    </div>

                    <div className="flex justify-between mb-6 text-sm">
                        <div>
                            <p className="text-gray-500 print:text-gray-600 text-xs mb-1">Kepada Yth:</p>
                            <p className="font-bold text-white print:text-black text-lg">{selectedOrder.user?.name}</p>
                            <p className="text-gray-400 print:text-gray-600">{selectedOrder.user?.email}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-gray-500">ID: #{selectedOrder.id}</p>
                             <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                             <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-2
                                ${selectedOrder.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 print:bg-yellow-100 print:text-yellow-700" : 
                                  selectedOrder.status === "PROCESSED" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 print:bg-indigo-100 print:text-indigo-700" :
                                  selectedOrder.status === "SHIPPED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 print:bg-blue-100 print:text-blue-700" :
                                  selectedOrder.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border border-green-500/20 print:bg-green-100 print:text-green-700" :
                                  selectedOrder.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border border-red-500/20 print:bg-red-100 print:text-red-700" :
                                  "bg-gray-500/10 text-gray-400 border border-gray-500/20 print:bg-gray-100 print:text-gray-700"}`}>
                                {selectedOrder.status}
                             </div>
                        </div>
                    </div>

                    {/* Shipping Address Section - More Prominent */}
                    <div className="mb-6 p-4 bg-[#202020] print:bg-gray-50 rounded-xl border border-white/5 print:border-gray-200">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 print:text-gray-500 uppercase font-bold tracking-wider mb-1">Alamat Pengiriman</p>
                                <p className="text-white print:text-black font-medium">{selectedOrder.shippingAddress || "Tidak ada alamat"}</p>
                            </div>
                        </div>
                        {selectedOrder.paymentMethod && (
                            <div className="flex items-start gap-3 mt-4 pt-4 border-t border-white/5 print:border-gray-200">
                                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 print:text-gray-500 uppercase font-bold tracking-wider mb-1">Metode Pembayaran</p>
                                    <p className="text-white print:text-black font-medium">{selectedOrder.paymentMethod}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <table className="w-full text-sm">
                            <thead className="bg-[#202020] print:bg-gray-50 uppercase text-[10px] font-bold text-gray-400 print:text-gray-500 rounded-lg">
                                <tr>
                                    <th className="py-3 px-4 text-left rounded-l-lg print:rounded-none">Produk</th>
                                    <th className="py-3 px-4 text-center">Qty</th>
                                    <th className="py-3 px-4 text-right">Harga</th>
                                    <th className="py-3 px-4 text-right rounded-r-lg print:rounded-none">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 print:divide-gray-100">
                                {selectedOrder.items?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-white print:text-black">{item.product?.name || `Product #${item.productId}`}</p>
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-gray-400 print:text-gray-600">x{item.quantity}</td>
                                        <td className="py-4 px-4 text-right text-gray-400 print:text-gray-600">
                                            {item.price?.toLocaleString("id-ID")}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-gold print:text-black">
                                            {(item.price * item.quantity).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end border-t border-dashed border-gray-700 print:border-gray-200 pt-6">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 print:text-gray-500">Subtotal</span>
                                <span className="font-medium text-white print:text-black">Rp {selectedOrder.totalAmount?.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 print:text-gray-500">Pajak (Included)</span>
                                <span className="font-medium text-white print:text-black">-</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white print:text-black border-t border-white/10 print:border-gray-300 pt-4 mt-2">
                                <span>Total Bayar</span>
                                <span>Rp {selectedOrder.totalAmount?.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                    </div>
                   
                    <div className="mt-12 text-center text-xs text-gray-500 print:text-gray-400 font-medium">
                        <p>Terima kasih atas pesanan Anda!</p>
                        <p className="mt-1">Simpan struk ini sebagai bukti pembayaran yang sah.</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

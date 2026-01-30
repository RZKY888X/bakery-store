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
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="font-display text-2xl font-bold">Daftar Pesanan</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto print:hidden">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                 <th className="px-4 py-3 md:px-6 md:py-4">Order ID</th>
                 <th className="px-4 py-3 md:px-6 md:py-4">Customer</th>
                 <th className="px-4 py-3 md:px-6 md:py-4">Total</th>
                 <th className="px-4 py-3 md:px-6 md:py-4">Date</th>
                 <th className="px-4 py-3 md:px-6 md:py-4">Status</th>
                 <th className="px-4 py-3 md:px-6 md:py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                 <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 md:px-6 md:py-4 font-bold">#{order.id}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                       <p className="font-bold text-dark">{order.user?.name || "Unknown"}</p>
                       <p className="text-xs text-gray-400 hidden md:block">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 font-bold text-gold">Rp {order.totalAmount?.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-gray-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                       <select 
                          value={order.status} 
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border-none outline-none cursor-pointer
                             ${order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                               order.status === "PROCESSED" ? "bg-indigo-100 text-indigo-700" :
                               order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                               order.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                               order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                               "bg-gray-100 text-gray-700"}`}
                       >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PROCESSED">PROCESSED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                       </select>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                       <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded transition"
                        >
                          <Eye size={16} />
                       </button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed">
            <div className="bg-white rounded-2xl w-[95%] md:w-full max-w-2xl max-h-[90vh] overflow-y-auto print:w-full print:max-w-none print:shadow-none print:rounded-none">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center print:hidden">
                    <h3 className="font-display text-xl font-bold">Detail Pesanan #{selectedOrder.id}</h3>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-200 transition"
                         >
                            <Printer size={16} /> Cetak Struk
                         </button>
                         <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X size={20} />
                         </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div className="p-8 print:p-0">
                    <div className="text-center mb-8 border-b border-dashed border-gray-300 pb-6">
                        <h1 className="font-display text-2xl font-bold text-dark mb-1">Bakery Store</h1>
                        <p className="text-xs text-gray-500">Jl. Roti Enak No. 123, Jakarta Selatan</p>
                        <p className="text-xs text-gray-500">Telp: 0812-3456-7890</p>
                    </div>

                    <div className="flex justify-between mb-8 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Kepada Yth:</p>
                            <p className="font-bold text-dark">{selectedOrder.user?.name}</p>
                            <p className="text-gray-500">{selectedOrder.user?.email}</p>
                            <p className="text-xs text-gray-400 mt-2">ID: #{selectedOrder.id}</p>
                            <p className="text-xs text-gray-400">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                             <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase
                                ${selectedOrder.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                                  selectedOrder.status === "PROCESSED" ? "bg-indigo-100 text-indigo-700" :
                                  selectedOrder.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                                  selectedOrder.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                  selectedOrder.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                  "bg-gray-100 text-gray-700"}`}>
                                {selectedOrder.status}
                             </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500">
                                <tr>
                                    <th className="py-2 px-1 text-left">Produk</th>
                                    <th className="py-2 px-1 text-center">Qty</th>
                                    <th className="py-2 px-1 text-right">Harga</th>
                                    <th className="py-2 px-1 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedOrder.items?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-3 px-1">
                                            <p className="font-medium text-dark">{item.product?.name || `Product #${item.productId}`}</p>
                                        </td>
                                        <td className="py-3 px-1 text-center font-medium text-gray-600">x{item.quantity}</td>
                                        <td className="py-3 px-1 text-right text-gray-500">
                                            {item.price?.toLocaleString("id-ID")}
                                        </td>
                                        <td className="py-3 px-1 text-right font-bold text-dark">
                                            {(item.price * item.quantity).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end border-t border-gray-200 pt-6">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-dark">Rp {selectedOrder.totalAmount?.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Pajak (Included)</span>
                                <span className="font-medium text-dark">-</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-dark border-t border-dashed border-gray-300 pt-2 mt-2">
                                <span>Total Bayar</span>
                                <span>Rp {selectedOrder.totalAmount?.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                    </div>
                   
                    <div className="mt-12 text-center text-xs text-gray-400 font-medium">
                        <p>Terima kasih atas pesanan Anda!</p>
                        <p className="mt-1">simpan struk ini sebagai bukti pembayaran yang sah.</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

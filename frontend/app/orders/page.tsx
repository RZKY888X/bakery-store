"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Clock, CheckCircle } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  invoiceId?: string; // If from Xendit
  invoiceUrl?: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data pesanan");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat riwayat pesanan.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "PAID": return "bg-green-100 text-green-700";
      case "SHIPPED": return "bg-blue-100 text-blue-700";
      case "COMPLETED": return "bg-gray-100 text-gray-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Menunggu Pembayaran";
      case "PAID": return "Sudah Dibayar";
      case "SHIPPED": return "Sedang Dikirim";
      case "COMPLETED": return "Selesai";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
             <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
             </button>
             <h1 className="font-display text-3xl font-bold text-brown">Pesanan Saya</h1>
        </div>

        {loading ? (
           <div className="text-center py-20">
              <p>Memuat pesanan...</p>
           </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Belum ada pesanan</h2>
            <p className="text-gray-500 mb-6">Yuk, mulai pesan roti favoritmu sekarang!</p>
            <Link href="/produk" className="bg-gold text-dark font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                        Order #{order.id} • {new Date(order.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status === 'PAID' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {getStatusLabel(order.status)}
                    </div>
                  </div>
                  <div className="text-right">
                     <div className="text-xs text-gray-500 mb-1">Total Pembayaran</div>
                     <div className="font-bold text-lg text-brown">Rp {order.totalAmount.toLocaleString("id-ID")}</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                         <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                           {/* Using standard img for consistency with recent fixes */}
                           <img 
                              src={item.product?.image || '/assets/product-placeholder.png'} 
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                           />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-sm text-dark">{item.product?.name}</h4>
                            <div className="text-xs text-gray-500 mt-1">
                               {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'PENDING' && order.invoiceUrl && (
                    <div className="bg-yellow-50 px-6 py-3 flex justify-between items-center">
                        <span className="text-xs text-yellow-800 font-bold">Menunggu Pembayaran</span>
                        <a href={order.invoiceUrl} target="_blank" className="text-xs bg-yellow-500 text-white px-3 py-2 rounded font-bold hover:bg-yellow-600">
                            Bayar Sekarang
                        </a>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

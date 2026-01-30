"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Users, 
    DollarSign, 
    Package, 
    TrendingUp, 
    ArrowRight 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:4000/api/orders/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error("Failed to fetch admin stats", e);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  if (loading) {
      return (
          <div className="flex h-96 items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          </div>
      );
  }

  return (
    <>
       <div className="mb-8 flex justify-between items-end">
          <div>
              <p className="text-gray-500 font-medium text-sm mb-1">Selamat Datang Kembali,</p>
              <h2 className="font-display text-3xl font-bold text-dark">Dashboard Overview</h2>
          </div>
          <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-white to-orange-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-hover-effect">
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 rounded-xl shadow-inner">
                    <DollarSign size={24} />
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <TrendingUp size={12} /> +12.5%
                </div>
             </div>
             <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Pendapatan</p>
                <h3 className="text-3xl font-bold text-dark tracking-tight">Rp {stats?.revenue?.toLocaleString('id-ID')}</h3>
             </div>
          </div>

           {/* Active Orders Card */}
           <div className="bg-gradient-to-br from-white to-blue-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-hover-effect">
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl shadow-inner">
                    <ShoppingCart size={24} />
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                    Active
                </div>
             </div>
             <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Pesanan Aktif</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-dark tracking-tight">{stats?.activeOrders}</h3>
                    <span className="text-xs text-blue-500 font-bold">Perlu tindakan</span>
                </div>
             </div>
          </div>

           {/* Total Users Card */}
           <div className="bg-gradient-to-br from-white to-purple-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition card-hover-effect">
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-xl shadow-inner">
                    <Users size={24} />
                </div>
             </div>
             <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Pelanggan</p>
                <h3 className="text-3xl font-bold text-dark tracking-tight">{stats?.users}</h3>
             </div>
          </div>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Package className="text-gold" size={20} />
                    Pesanan Terbaru
                </h3>
                <Link href="/admin/orders" className="text-xs font-bold text-gold hover:text-yellow-600 flex items-center gap-1 group">
                    Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </Link>
             </div>
             <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                         <th className="px-6 py-4">Order ID</th>
                         <th className="px-6 py-4">Customer</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4 text-right">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {stats?.recentOrders?.map((order: any, i: number) => (
                         <tr key={i} className="hover:bg-yellow-50/50 transition cursor-pointer group">
                            <td className="px-6 py-4 font-bold text-dark group-hover:text-gold transition">
                                #{order.id}
                                <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        {order.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    {order.user?.name || 'Guest'}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                                  ${order.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : 
                                    order.status === "SHIPPED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    order.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                                    "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-dark text-right">
                                Rp {order.totalAmount?.toLocaleString('id-ID')}
                            </td>
                         </tr>
                      ))}
                      {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                          <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada pesanan</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Quick Actions / Insights */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-gold/20 transition duration-700"></div>
                
                <div className="relative z-10">
                   <div className="w-10 h-10 bg-white/10 rounded-xl mb-4 flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp size={20} className="text-gold" />
                   </div>
                   <h3 className="font-bold text-lg mb-2">Performance Insight</h3>
                   <p className="text-xs text-gray-400 leading-relaxed mb-6">
                      Penjualan kategori <strong>Bakery</strong> mendominasi 45% transaksi minggu ini. Stock management disarankan untuk flour dan butter.
                   </p>
                   <Link href="/admin/reports" className="inline-flex items-center justify-center w-full py-3 bg-gold hover:bg-yellow-500 text-dark font-bold text-sm rounded-xl transition shadow-lg shadow-gold/20">
                      Lihat Laporan Lengkap
                   </Link>
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                 <h3 className="font-bold text-sm text-gray-500 uppercase tracking-widest mb-4">Aksi Cepat</h3>
                 <div className="space-y-3">
                     <Link href="/admin/products/new" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition text-sm font-medium text-gray-700 group">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition">
                            <Package size={16} />
                        </div>
                        Tambah Produk Baru
                     </Link>
                     <Link href="/admin/reports" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition text-sm font-medium text-gray-700 group">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                            <Users size={16} />
                        </div>
                        Analisis Pelanggan
                     </Link>
                 </div>
             </div>
          </div>
       </div>
    </>
  );
}

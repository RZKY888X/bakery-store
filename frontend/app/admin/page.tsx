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
       <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
              <p className="text-gray-400 font-medium text-sm mb-1">{
                  new Date().getHours() < 12 ? "Selamat Pagi," : 
                  new Date().getHours() < 15 ? "Selamat Siang," : 
                  new Date().getHours() < 18 ? "Selamat Sore," : "Selamat Malam,"
              }</p>
              <h2 className="font-display text-4xl font-bold text-white">Dashboard Overview</h2>
          </div>
          <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 py-2 bg-[#1A1A1A] rounded-full border border-white/5 shadow-sm">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="relative overflow-hidden bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-xl shadow-black/20 group hover:-translate-y-1 transition-all duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign size={80} className="text-gold" />
             </div>
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-[#252525] text-gold rounded-2xl shadow-inner border border-white/5">
                    <DollarSign size={24} />
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full flex items-center gap-1 border border-green-500/20">
                    <TrendingUp size={12} /> +12.5%
                </div>
             </div>
             <div className="relative z-10">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wide">Total Pendapatan</p>
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">Rp {stats?.revenue?.toLocaleString('id-ID')}</h3>
             </div>
          </div>

           {/* Active Orders Card */}
           <div className="relative overflow-hidden bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-xl shadow-black/20 group hover:-translate-y-1 transition-all duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package size={80} className="text-blue-500" />
             </div>
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-[#252525] text-blue-500 rounded-2xl shadow-inner border border-white/5">
                    <ShoppingCart size={24} />
                </div>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">
                    Active
                </div>
             </div>
             <div className="relative z-10">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wide">Pesanan Aktif</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight">{stats?.activeOrders}</h3>
                    <span className="text-xs text-start text-gray-500 font-medium">Sedang diproses</span>
                </div>
             </div>
          </div>

           {/* Total Users Card */}
           <div className="relative overflow-hidden bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-xl shadow-black/20 group hover:-translate-y-1 transition-all duration-300">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} className="text-purple-500" />
             </div>
             <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-[#252525] text-purple-500 rounded-2xl shadow-inner border border-white/5">
                    <Users size={24} />
                </div>
             </div>
             <div className="relative z-10">
                <p className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-wide">Total Pelanggan</p>
                <h3 className="text-3xl font-display font-bold text-white tracking-tight">{stats?.users}</h3>
             </div>
          </div>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-3xl border border-white/5 shadow-lg overflow-hidden flex flex-col">
             <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#202020]">
                <h3 className="font-bold text-xl flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                        <Package size={16} />
                    </div>
                    Pesanan Terbaru
                </h3>
                <Link href="/admin/orders" className="text-xs font-bold text-gray-500 hover:text-gold flex items-center gap-1 group transition">
                    Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </Link>
             </div>
             <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-[#1A1A1A] text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/5">
                      <tr>
                         <th className="px-8 py-5">Order ID</th>
                         <th className="px-8 py-5">Customer</th>
                         <th className="px-8 py-5">Status</th>
                         <th className="px-8 py-5 text-right">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {stats?.recentOrders?.map((order: any, i: number) => (
                         <tr key={i} className="hover:bg-white/5 transition cursor-pointer group">
                            <td className="px-8 py-5 font-bold text-white group-hover:text-gold transition">
                                <span className="font-mono text-xs text-gray-500">#{order.id}</span>
                                <span className="block text-[10px] text-gray-600 font-normal mt-1">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-gray-300 font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm border border-white/5">
                                        {order.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="font-bold text-white">{order.user?.name || 'Guest'}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm
                                  ${order.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : 
                                    order.status === "PROCESSED" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                                    order.status === "SHIPPED" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                    order.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                    "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="px-8 py-5 font-bold text-white text-right">
                                Rp {order.totalAmount?.toLocaleString('id-ID')}
                            </td>
                         </tr>
                      ))}
                      {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                          <tr><td colSpan={4} className="p-10 text-center text-gray-600">Belum ada pesanan terbaru.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Quick Actions / Insights */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-[#1A1A1A] rounded-3xl shadow-xl p-8 text-white relative overflow-hidden group border border-white/5">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition duration-700"></div>
                
                <div className="relative z-10 text-center">
                   <div className="w-14 h-14 mx-auto bg-white/5 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                        <TrendingUp size={28} className="text-gold" />
                   </div>
                   <h3 className="font-display font-bold text-2xl mb-2 text-white">Insight Mingguan</h3>
                   <p className="text-sm text-gray-400 leading-relaxed mb-8">
                      Penjualan kategori <span className="text-white font-bold">Bakery</span> mendominasi 45% transaksi.
                   </p>
                   <Link href="/admin/reports" className="inline-flex w-full items-center justify-center py-3.5 bg-gold hover:bg-yellow-500 text-dark font-bold text-sm rounded-xl transition shadow-lg shadow-gold/20 transform hover:-translate-y-0.5">
                      Lihat Laporan Lengkap
                   </Link>
                </div>
             </div>

             <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 shadow-sm p-6">
                 <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-6 px-2">Aksi Cepat</h3>
                 <div className="space-y-3">
                     <Link href="/admin/products" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition text-sm font-bold text-white group border border-transparent hover:border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition shadow-sm border border-green-500/20">
                            <Package size={20} />
                        </div>
                        Tambah Produk Baru
                     </Link>
                     <Link href="/admin/users" className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl transition text-sm font-bold text-white group border border-transparent hover:border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition shadow-sm border border-blue-500/20">
                            <Users size={20} />
                        </div>
                        Kelola Pelanggan
                     </Link>
                 </div>
             </div>
          </div>
       </div>
    </>
  );
}

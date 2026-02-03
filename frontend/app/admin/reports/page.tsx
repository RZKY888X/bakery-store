"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<any[]>([]);
  const [filter, setFilter] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:4000/api/orders/report?range=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.ok) {
                const data = await res.json();
                setReportData(data.salesData);
            }
        } catch(e) {
            console.error("Failed to fetch reports", e);
        } finally {
            setLoading(false);
        }
    };
    fetchReports();
  }, [filter]);


  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
               <h1 className="font-display text-3xl font-bold text-white">Laporan Penjualan</h1>
               <p className="text-gray-400 text-sm mt-1">Analisis performa bisnis dan tren penjualan.</p>
            </div>
            <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-1 flex shadow-lg">
                {['today', 'weekly', 'monthly'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition capitalize ${filter === t ? 'bg-gold text-dark shadow-lg shadow-gold/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {t === 'today' ? 'Hari Ini' : t === 'weekly' ? 'Mingguan' : 'Bulanan'}
                    </button>
                ))}
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
                { label: "Total Pendapatan", value: "Rp 45.200.000", change: "+12.5%", positive: true, icon: "💰" },
                { label: "Total Transaksi", value: "1,204", change: "+5.2%", positive: true, icon: "🧾" },
                { label: "Produk Terjual", value: "3,450", change: "-2.1%", positive: false, icon: "📦" },
                { label: "Rata-rata Order", value: "Rp 125.000", change: "+8.4%", positive: true, icon: "📊" },
            ].map((stat, i) => (
                <div key={i} className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-xl shadow-black/20 group hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                        <span className="text-xl grayscale group-hover:grayscale-0 transition opacity-50">{stat.icon}</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3">{stat.value}</h3>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${stat.positive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {stat.change} vs periode lalu
                    </span>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Chart */}
            <div className="bg-[#1A1A1A] p-8 rounded-3xl shadow-lg border border-white/5">
                <div className="mb-8">
                     <h3 className="font-bold text-xl text-white">Grafik Penjualan</h3>
                     <p className="text-sm text-gray-400 font-medium">{filter === 'today' ? 'Performa per Jam' : filter === 'weekly' ? 'Performa 7 Hari Terakhir' : 'Performa per Minggu'}</p>
                </div>
                <div className="h-80 w-full">
                    {loading ? (
                         <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                         </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData} margin={{top: 0, right: 0, left: -20, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#6B7280', fontSize: 10, fontWeight: 500}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#6B7280', fontSize: 10, fontWeight: 500}}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip 
                                    cursor={{fill: '#ffffff05'}}
                                    contentStyle={{borderRadius: '12px', border: '1px solid #333', backgroundColor: '#1A1A1A', color: 'white'}}
                                    itemStyle={{color: '#fff', fontWeight: 'bold'}}
                                    formatter={(value: any) => [`Rp ${value.toLocaleString("id-ID")}`, "Sales"]}
                                />
                                <Bar dataKey="sales" fill="#D4AF37" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Popular Products (Static) */}
            <div className="bg-[#1A1A1A] p-8 rounded-3xl shadow-lg border border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-bold text-xl text-white">Produk Terlaris</h3>
                        <p className="text-sm text-gray-400 font-medium">Top 5 item minggu ini</p>
                    </div>
                    <button className="text-gold text-xs font-bold hover:underline">Lihat Semua</button>
                </div>
                <div className="space-y-2">
                    {[
                        {name: "Butter Croissant Royale", category: "Pastry", sales: 450, revenue: "Rp 10.800.000"},
                        {name: "Traditional Baguette", category: "Breads", sales: 320, revenue: "Rp 5.760.000"},
                        {name: "Strawberry Tart", category: "Cakes", sales: 210, revenue: "Rp 8.400.000"},
                        {name: "Pain Au Chocolat", category: "Pastry", sales: 180, revenue: "Rp 5.040.000"},
                        {name: "Sourdough Country Loaf", category: "Sourdough", sales: 145, revenue: "Rp 6.960.000"},
                    ].map((product, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition group border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                                <span className={`font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center ${i < 3 ? 'bg-gold text-dark' : 'bg-white/10 text-gray-400'}`}>#{i+1}</span>
                                <div>
                                    <h4 className="font-bold text-sm text-white group-hover:text-gold transition">{product.name}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{product.category} • {product.sales} terjual</p>
                                </div>
                            </div>
                            <span className="font-bold text-sm text-gold font-mono bg-gold/10 px-2 py-1 rounded-lg border border-gold/10">{product.revenue}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

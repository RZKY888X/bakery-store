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
        <div className="flex justify-between items-center mb-8">
            <h1 className="font-display text-3xl font-bold text-dark">Laporan Penjualan</h1>
            <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm">
                <button 
                    onClick={() => setFilter('today')}
                    className={`px-4 py-1.5 font-bold text-xs rounded transition ${filter === 'today' ? 'bg-gold text-dark shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Hari Ini
                </button>
                <button 
                    onClick={() => setFilter('weekly')}
                    className={`px-4 py-1.5 font-bold text-xs rounded transition ${filter === 'weekly' ? 'bg-gold text-dark shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Mingguan
                </button>
                <button 
                    onClick={() => setFilter('monthly')}
                    className={`px-4 py-1.5 font-bold text-xs rounded transition ${filter === 'monthly' ? 'bg-gold text-dark shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Bulanan
                </button>
            </div>
        </div>

        {/* Summary Cards (Static for Demo, could be dynamic too) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Pendapatan</p>
                <h3 className="text-2xl font-bold text-dark mb-2">Rp 45.200.000</h3>
                <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded">+12.5%</span>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Transaksi</p>
                <h3 className="text-2xl font-bold text-dark mb-2">1,204</h3>
                <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded">+5.2%</span>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Produk Terjual</p>
                <h3 className="text-2xl font-bold text-dark mb-2">3,450</h3>
                <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">-2.1%</span>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Rata-rata Order</p>
                <h3 className="text-2xl font-bold text-dark mb-2">Rp 125.000</h3>
                <span className="text-xs text-green-500 font-bold bg-green-50 px-2 py-1 rounded">+8.4%</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-6">Grafik Penjualan ({filter === 'today' ? 'Per Jam' : filter === 'weekly' ? 'Per Hari' : 'Per Minggu'})</h3>
                <div className="h-80 w-full">
                    {loading ? (
                         <div className="h-full flex items-center justify-center text-gray-400 text-sm">Loading data...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={reportData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9CA3AF', fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#9CA3AF', fontSize: 12}}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                    formatter={(value: any) => [`Rp ${value.toLocaleString("id-ID")}`, "Sales"]}
                                />
                                <Bar dataKey="sales" fill="#D68C45" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Popular Products (Static) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Produk Terlaris</h3>
                    <button className="text-gold text-sm font-bold">Lihat Semua</button>
                </div>
                <div className="space-y-4">
                    {[
                        {name: "Butter Croissant Royale", category: "Pastry", sales: 450, revenue: "Rp 10.800.000"},
                        {name: "Traditional Baguette", category: "Breads", sales: 320, revenue: "Rp 5.760.000"},
                        {name: "Strawberry Tart", category: "Cakes", sales: 210, revenue: "Rp 8.400.000"},
                        {name: "Pain Au Chocolat", category: "Pastry", sales: 180, revenue: "Rp 5.040.000"},
                        {name: "Sourdough Country Loaf", category: "Sourdough", sales: 145, revenue: "Rp 6.960.000"},
                    ].map((product, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                            <div className="flex items-center gap-4">
                                <span className={`font-bold text-sm w-6 text-center ${i < 3 ? 'text-gold' : 'text-gray-400'}`}>#{i+1}</span>
                                <div>
                                    <h4 className="font-bold text-sm text-dark">{product.name}</h4>
                                    <p className="text-xs text-gray-500">{product.category} • {product.sales} terjual</p>
                                </div>
                            </div>
                            <span className="font-bold text-sm text-dark">{product.revenue}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}

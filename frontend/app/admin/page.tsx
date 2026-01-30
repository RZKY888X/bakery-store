"use client";

export default function AdminDashboard() {
  return (
    <>
       <div className="mb-8">
          <h2 className="font-display text-2xl font-bold">Dashboard Overview</h2>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-gray-500 text-sm mb-1">Total Users</p>
                   <h3 className="text-3xl font-bold text-dark">1,248</h3>
                </div>
                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">👤</div>
             </div>
             <p className="text-xs text-green-500 flex items-center gap-1">
                <span>↗</span> <span className="font-bold">+12.5%</span> dari bulan lalu
             </p>
          </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                   <h3 className="text-3xl font-bold text-dark">Rp 45.200.000</h3>
                </div>
                <div className="p-2 bg-yellow-50 text-gold rounded-lg">💵</div>
             </div>
             <p className="text-xs text-green-500 flex items-center gap-1">
                <span>↗</span> <span className="font-bold">+8.2%</span> minggu ini
             </p>
          </div>

           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <p className="text-gray-500 text-sm mb-1">Active Orders</p>
                   <h3 className="text-3xl font-bold text-dark">24</h3>
                </div>
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">📦</div>
             </div>
             <p className="text-xs text-orange-500 flex items-center gap-1">
                <span>🕒</span> <span className="font-bold">6 Perlu Dikirim</span> hari ini
             </p>
          </div>
       </div>

       <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-lg">Ringkasan Aktivitas Terkini</h3>
                <button className="text-xs font-bold text-gold hover:text-yellow-600">Lihat Semua</button>
             </div>
             <div className="p-0">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                      <tr>
                         <th className="px-6 py-4">Order ID</th>
                         <th className="px-6 py-4">Customer</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Amount</th>
                         <th className="px-6 py-4">Date</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {[
                         {id: "#ORD-001", user: "Andi Wijaya", status: "Pending", amount: "Rp 150.000", date: "2 mins ago"},
                         {id: "#ORD-002", user: "Siti Aminah", status: "Completed", amount: "Rp 85.000", date: "15 mins ago"},
                         {id: "#ORD-003", user: "Budi Santoso", status: "Shipped", amount: "Rp 210.000", date: "1 hour ago"},
                         {id: "#ORD-004", user: "Dewi Lestari", status: "Completed", amount: "Rp 45.000", date: "3 hours ago"},
                      ].map((order, i) => (
                         <tr key={i} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium">{order.id}</td>
                            <td className="px-6 py-4 text-gray-600">{order.user}</td>
                            <td className="px-6 py-4">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                                  ${order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                                    order.status === "Completed" ? "bg-green-100 text-green-700" :
                                    "bg-blue-100 text-blue-700"}`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-dark">{order.amount}</td>
                            <td className="px-6 py-4 text-gray-400 text-xs">{order.date}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* New Users */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Pendaftaran User Baru</h3>
                    <button className="text-gray-400">•••</button>
                </div>
                <div className="space-y-6">
                   {[
                      {name: "Ria Kusuma", email: "ria.kusuma@email.com", time: "JUST NOW"},
                      {name: "Hadi Mulya", email: "hadi.m@email.com", time: "45M AGO"},
                      {name: "Siska Tania", email: "siska@email.com", time: "2H AGO"},
                   ].map((u, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                            {u.name.substring(0,2).toUpperCase()}
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-sm text-dark">{u.name}</h4>
                            <p className="text-xs text-gray-400">{u.email}</p>
                         </div>
                         <span className="text-[10px] font-bold text-gray-300">{u.time}</span>
                      </div>
                   ))}
                </div>
             </div>

             <div className="bg-[#D68C45] rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="flex items-center gap-2 font-bold mb-2">
                      <span>📈</span> Insight Toko
                   </h3>
                   <p className="text-xs opacity-90 leading-relaxed mb-6">
                      Penjualan croissant meningkat sebesar 15% sejak minggu lalu. Pertimbangkan untuk menambah kapasitas produksi di akhir pekan ini.
                   </p>
                   <div className="mb-4">
                      <span className="text-4xl font-bold">15%</span>
                      <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Growth in Specialty Pastries</p>
                   </div>
                   <button className="bg-white text-[#D68C45] font-bold text-xs px-4 py-2 rounded-lg w-full">Lihat Laporan</button>
                </div>
             </div>
          </div>
       </div>
    </>
  );
}

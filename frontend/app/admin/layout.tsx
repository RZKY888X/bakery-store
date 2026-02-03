// frontend/app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Users, LogOut, ShoppingBag, Star, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "ADMIN") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Produk", href: "/admin/products", icon: Package },
    { name: "Manajemen User", href: "/admin/users", icon: Users },
    { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#101010] flex font-sans text-white/90 overflow-hidden relative selection:bg-gold selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
          w-72 bg-[#151515] text-white fixed h-full z-50 flex flex-col transition-all duration-300 shadow-2xl border-r border-white/5
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#151515]">
           <Link href="/" className="block">
              <Image 
                src="/Logoswadista1.svg" 
                alt="Swadista Logo" 
                width={160} 
                height={60} 
                className="object-contain w-auto h-14"
              />
           </Link>
           <button className="lg:hidden text-gray-400 hover:text-white transition" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
           </button>
        </div>

        <div className="p-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Main Menu</p>
            <nav className="space-y-2">
            {menu.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${
                    isActive
                        ? "bg-gradient-to-r from-gold to-yellow-600 text-white shadow-lg shadow-gold/10"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                    <item.icon size={20} className={isActive ? "text-white" : "text-gray-500 group-hover:text-gold transition"} />
                    <span className="relative z-10">{item.name}</span>
                </Link>
                );
            })}
            </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 bg-[#151515]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl text-sm font-medium transition"
          >
            <LogOut size={20} />
            Keluar Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-auto relative scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {/* Header */}
        <header className="bg-[#101010]/80 backdrop-blur-md border-b border-white/5 px-6 md:px-10 py-5 flex justify-between items-center sticky top-0 z-30 transition-all">
           
           <div className="flex items-center gap-4">
               <button className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition" onClick={() => setSidebarOpen(true)}>
                   <Menu size={24} />
               </button>
               <h2 className="hidden md:block font-display text-xl font-bold text-white">
                  {menu.find(m => m.href === pathname)?.name || "Dashboard"}
               </h2>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block leading-tight">
                     <p className="text-sm font-bold text-white">{user.name}</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Administrator</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gold/10 p-0.5 border border-gold/20 shadow-lg shadow-gold/5">
                     <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=D4AF37&color=fff`} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover"
                    />
                  </div>
              </div>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

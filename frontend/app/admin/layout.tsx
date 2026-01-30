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
    <div className="min-h-screen bg-gray-100 flex font-sans text-dark overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
          w-64 bg-white border-r border-gray-200 fixed h-full z-30 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <Image 
                src="/Logoswadista1.svg" 
                alt="Swadista Logo" 
                width={140} 
                height={50} 
                className="object-contain w-auto h-12"
              />
           </div>
           <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
           </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-yellow-50 text-gold border-l-4 border-gold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-dark"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-auto relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-10">
           
           <div className="flex items-center gap-4">
               <button className="lg:hidden p-2 text-gray-500" onClick={() => setSidebarOpen(true)}>
                   <Menu size={24} />
               </button>
               <div className="hidden md:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg w-96">
                  <span className="text-gray-400">🔍</span>
                  <input type="text" placeholder="Cari transaksi, user..." className="bg-transparent text-sm w-full outline-none" />
               </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="relative text-gray-500 hover:text-dark">
                 🔔
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                  <div className="text-right hidden md:block">
                     <p className="text-sm font-bold">{user.name}</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wide">Store Manager</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                  </div>
              </div>
           </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// frontend/components/header.tsx
// ============================================================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, LayoutDashboard, LogOut, Truck } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check for user in localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      
      // Fetch Latest Order for Notification
      const fetchLatestOrder = async () => {
         const token = localStorage.getItem("token");
         if(!token) return;
         try {
             // We can reuse the my-orders endpoint and take the first one
             const res = await fetch("http://localhost:4000/api/orders/my-orders", {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if(res.ok) {
                 const orders = await res.json();
                 if(orders.length > 0) {
                     setLatestOrder(orders[0]); // Most recent order
                 }
             }
         } catch(e) {
             console.error("Failed to fetch notification", e);
         }
      };
      fetchLatestOrder();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header ref={headerRef} className="sticky top-0 w-full z-50 bg-yellow-50/95 backdrop-blur-md border-b border-yellow-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        {/* Logo kiri */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logoswadista1.svg"
            alt="Logo"
            width={140}
            height={26}
            className="object-contain"
          />
        </Link>

        {/* Nav tengah (Desktop) */}
        <nav className="hidden md:flex gap-8 text-yellow-900 font-serif text-lg font-semibold uppercase tracking-wide mx-auto">
          <Link href="/" className="hover:text-yellow-700 transition">
            Home
          </Link>
          <Link href="/tentang" className="hover:text-yellow-700 transition">
            Tentang
          </Link>
          <Link href="/produk" className="hover:text-yellow-700 transition">
            Produk
          </Link>
          <Link href="/contact" className="hover:text-yellow-700 transition">
            Kontak
          </Link>
          <Link href="/program" className="hover:text-yellow-700 transition">
            Program
          </Link>
          {user?.role === "ADMIN" && (
             <Link href="/admin" className="text-gold hover:text-yellow-700 transition flex items-center gap-1">
                 <LayoutDashboard size={18} />
                 Dashboard
             </Link>
          )}
        </nav>

        {/* Cart + Notification + Auth + Hamburger kanan */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
           {user && (
              <div className="relative">
                 <button 
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 hover:bg-yellow-200 rounded-full transition relative"
                 >
                    <Truck className="w-5 h-5 text-yellow-900" />
                    {/* Red Dot if there is a latest order */}
                    {latestOrder && (
                       <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    )}
                 </button>

                  {/* Notification Dropdown */}
                 {notificationOpen && latestOrder && (
                    <>
                        {/* Mobile Overlay/Backdrop (Optional, helps close on click outside but we have the hook) */}
                        <div className="fixed inset-0 z-40 bg-black/5 md:hidden" onClick={() => setNotificationOpen(false)}></div>
                        
                        <div className="fixed left-4 right-4 top-24 z-50 md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 origin-top-right animate-in fade-in slide-in-from-top-2">
                           <div className="flex justify-between items-center mb-3">
                              <h4 className="font-bold text-sm text-yellow-900">Info Pengiriman</h4>
                              <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase">
                                 {latestOrder.status}
                              </span>
                           </div>
                           
                           <div className="flex gap-3 mb-3">
                               <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0 relative">
                                  {/* Show first item image */}
                                  <img 
                                    src={latestOrder.items?.[0]?.product?.image || '/assets/product-placeholder.png'} 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Product';
                                        (e.target as HTMLImageElement).onerror = null;
                                    }}
                                    alt="Product" 
                                    className="w-full h-full object-cover"
                                  />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-dark line-clamp-1 truncate">
                                     {latestOrder.items?.[0]?.product?.name}
                                     {latestOrder.items?.length > 1 && ` +${latestOrder.items.length - 1} lainnya`}
                                  </p>
                                  <p className="text-[10px] text-gray-500 mt-0.5">
                                     Total: Rp {latestOrder.totalAmount?.toLocaleString('id-ID')}
                                  </p>
                               </div>
                           </div>
    
                           <Link 
                              href="/orders" 
                              onClick={() => setNotificationOpen(false)}
                              className="block text-center text-xs font-bold text-gold hover:text-yellow-600 hover:underline transition"
                           >
                              Lacak Pesanan
                           </Link>
                        </div>
                    </>
                 )}
                  {notificationOpen && !latestOrder && (
                     <div className="absolute right-0 mt-2 w-48 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 text-center">
                        <p className="text-xs text-gray-500">Belum ada pengiriman aktif.</p>
                     </div>
                  )}
              </div>
           )}

          <Link
            href="/cart"
            className="relative p-2 hover:bg-yellow-200 rounded-full transition"
          >
            <ShoppingBag className="w-5 h-5 text-yellow-900" />
          </Link>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
             {user ? (
                <div className="relative pl-3 border-l border-yellow-900/20">
                    <button 
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="w-9 h-9 rounded-full bg-yellow-900 text-white flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-yellow-400 transition"
                    >
                        {user?.name?.charAt(0) || 'U'}
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 transform z-50 animate-in fade-in slide-in-from-top-2">
                             <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                                <p className="text-sm font-bold text-yellow-900 truncate">{user?.name}</p>
                             </div>
                             
                             {user?.role === "ADMIN" && (
                                <Link 
                                    href="/admin" 
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 rounded-lg transition"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                             )}

                             <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition text-left mt-1"
                             >
                                <LogOut size={16} />
                                Keluar
                             </button>
                        </div>
                    )}
                </div>
             ) : (
                <div className="flex items-center gap-2">
                   <Link href="/login" className="px-4 py-2 text-sm font-bold text-yellow-900 hover:text-yellow-700 transition">
                      Masuk
                   </Link>
                   <Link href="/register" className="px-4 py-2 text-sm font-bold bg-yellow-900 text-white rounded-full hover:bg-yellow-800 transition shadow-md">
                      Daftar
                   </Link>
                </div>
             )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-full hover:bg-yellow-200 transition"
          >
             <div className="relative w-6 h-6">
                 <Menu className={`w-6 h-6 text-yellow-900 absolute transition-all duration-300 transform ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
                 <X className={`w-6 h-6 text-yellow-900 absolute transition-all duration-300 transform ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
             </div>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div 
         className={`
            md:hidden bg-yellow-50 border-t border-yellow-900/10 px-6 py-4 flex flex-col gap-4 text-center shadow-xl absolute w-full left-0 bg-opacity-95 backdrop-blur-md transition-all duration-300 origin-top
            ${open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}
         `}
      >
           {user ? (
              <div className="flex items-center justify-center gap-3 py-2 border-b border-yellow-900/10 mb-2">
                 <div className="w-8 h-8 rounded-full bg-yellow-900 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                 </div>
                 <span className="font-bold text-yellow-900">{user?.name || 'User'}</span>
                 <button onClick={handleLogout} className="px-3 py-1 text-xs font-bold bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition ml-2">
                    Keluar
                 </button>
              </div>
           ) : (
              <div className="flex justify-center gap-4 py-2 border-b border-yellow-900/10 mb-2">
                 <Link href="/login" className="font-bold text-yellow-900">Masuk</Link>
                 <span className="text-yellow-900/40">|</span>
                 <Link href="/register" className="font-bold text-yellow-900">Daftar</Link>
              </div>
           )}

          <Link
            href="/tentang"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-yellow-700 transition"
          >
            Tentang
          </Link>
          <Link
            href="/produk"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-yellow-700 transition"
          >
            Produk
          </Link>
          <Link
             href="/admin" 
             onClick={() => setOpen(false)}
             className={`block py-2 hover:text-yellow-700 transition ${user?.role === "ADMIN" ? "block" : "hidden"}`}
          >
             Dashboard Admin
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-yellow-700 transition"
          >
            Kontak
          </Link>
          <Link
            href="/program"
            onClick={() => setOpen(false)}
            className="block py-2 hover:text-yellow-700 transition"
          >
            Program
          </Link>
      </div>
    </header>
  );
}

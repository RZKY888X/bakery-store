"use client";

import { useCart } from "@/context/cart-context";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";

const MapPicker = dynamic(() => import("@/components/map-picker"), { 
    ssr: false,
    loading: () => <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const tax = cartTotal * 0.11;
  const shipping = 15000;
  const total = cartTotal + tax + shipping;

  const [loading, setLoading] = useState(false);
  
  // Form State
  // Form State
  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      lat: 0,
      lng: 0
  });

  const handlePayment = async () => {
    if(!formData.firstName || !formData.phone || !formData.address) {
        alert("Mohon lengkapi data pengiriman.");
        return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Silakan login terlebih dahulu untuk melanjutkan pembayaran.");
          router.push("/login?redirect=/checkout");
          setLoading(false);
          return;
      }

      // Create order directly without payment gateway
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
          shippingAddress: formData.address,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            lat: formData.lat,
            lng: formData.lng
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat pesanan");

      // Clear cart and redirect to success page
      clearCart();
      router.push("/success");

    } catch (error: any) {
      console.error("Order Error:", error);
      alert(`Gagal: ${error.message}`);
      setLoading(false);
    }
  };

  if (!items.length) return null;

  return (
    <>
      <main className="min-h-screen bg-[#FDFBF7] py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Minimal Header */}
          <div className="flex items-center gap-4 mb-8">
             <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
             </button>
             <div className="h-8 w-[1px] bg-gray-300 mx-2"></div>
             <div className="flex items-center gap-2">
                 <span className="font-display font-bold text-xl text-brown">Checkout</span>
             </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Side - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Info */}
              <section className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold mb-6">
                   <span className="text-gold">🚚</span> Informasi Pengiriman
                </h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Nama Depan</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                   </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Nama Belakang</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                   </div>
                </div>
                 <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Nomor Telepon</label>
                      <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                 </div>
                 <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Alamat Lengkap</label>
                      <textarea 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 h-24" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      ></textarea>
                 </div>
                 
                 {/* Map */}
                 <div className="h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mt-6 relative z-0">
                    <p className="absolute top-2 left-2 z-[1000] bg-white/80 px-2 py-1 text-[10px] rounded shadow backdrop-blur-sm pointer-events-none">
                        Klik pada peta untuk menandai lokasi
                    </p>
                    <MapPicker 
                        onLocationSelect={(lat, lng) => {
                            setFormData(prev => ({ ...prev, lat, lng }));
                            // Optional: You could allow manual address override here if you had reverse geocoding
                        }} 
                    />
                 </div>
                 {formData.lat !== 0 && (
                     <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
                         📍 Lokasi terpilih: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                     </p>
                 )}
              </section>

              {/* Delivery Method */}
              <section>
                 <h3 className="flex items-center gap-2 font-display text-xl font-bold mb-6">
                   <span className="text-gold">📦</span> Metode Pengiriman
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="border-2 border-gold bg-yellow-50 p-4 rounded-xl flex justify-between items-center cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">🚚</div>
                         <div>
                            <p className="font-bold text-sm">Kurir Kilat</p>
                            <p className="text-xs text-gray-500">Sampai dalam 30-45 menit</p>
                         </div>
                      </div>
                      <span className="font-bold text-sm">Rp 15.000</span>
                   </div>
                    <div className="border border-gray-200 bg-white p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-gray-300">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">🏪</div>
                         <div>
                            <p className="font-bold text-sm">Ambil Sendiri</p>
                            <p className="text-xs text-gray-500">Swadista Bakery Pusat</p>
                         </div>
                      </div>
                      <span className="font-bold text-gold text-sm">GRATIS</span>
                   </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                 <h3 className="flex items-center gap-2 font-display text-xl font-bold mb-6">
                   <span className="text-gold">💳</span> Metode Pembayaran
                </h3>
                 <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                    <p className="font-bold text-green-800 mb-2">✓ Transfer Bank / COD</p>
                    <p className="text-sm text-green-600">Pembayaran dapat dilakukan melalui transfer bank atau bayar langsung saat barang diterima.</p>
                    <div className="flex justify-center gap-4 mt-4 opacity-70">
                        <span className="font-bold text-gray-500">BCA</span>
                        <span className="font-bold text-gray-500">MANDIRI</span>
                        <span className="font-bold text-gray-500">BRI</span>
                        <span className="font-bold text-gray-500">COD</span>
                    </div>
                 </div>
              </section>
            </div>

            {/* Right Side - Summary */}
            <div className="lg:col-span-1">
               <div className="bg-white p-8 rounded-xl shadow-sm sticky top-10">
                  <h3 className="font-display text-xl font-bold mb-6">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-4 mb-6">
                     {items.map(item => (
                        <div key={item.id} className="flex gap-4">
                           <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <p className="font-bold text-sm text-dark">{item.name}</p>
                              <p className="text-xs text-gray-500">x {item.quantity}</p>
                              <p className="font-bold text-sm mt-1">Rp {item.price.toLocaleString("id-ID")}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="border-t border-b py-6 my-6 space-y-3 text-sm text-gray-600">
                     <div className="flex justify-between">
                         <span>Subtotal</span>
                         <span className="font-bold text-dark">Rp {cartTotal.toLocaleString("id-ID")}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>Biaya Pengiriman</span>
                         <span className="font-bold text-dark">Rp {shipping.toLocaleString("id-ID")}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>Biaya Layanan</span>
                         <span className="font-bold text-dark">Rp 2.000</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-xs uppercase tracking-wide">Total Bayar</span>
                  </div>
                  <div className="flex justify-between items-end mb-8">
                      <span className="font-extrabold text-3xl text-gold">Rp {total.toLocaleString("id-ID")}</span>
                      <span className="text-[10px] text-gray-400 mb-1">Sudah termasuk PPN</span>
                  </div>
                  
                  <div className="mb-6">
                     <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-2">Catatan Pesanan</div>
                     <textarea className="w-full border border-gray-200 rounded-lg p-3 text-xs h-20 resize-none" placeholder="Contoh: Titip di satpam, jangan pakai kantong plastik..."></textarea>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-gold hover:bg-yellow-500 text-dark font-bold py-4 rounded-lg transition shadow-lg disabled:opacity-70"
                  >
                    {loading ? "Memproses..." : "Pesan Sekarang"}
                  </button>
                  
                  <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                     Dengan menekan tombol di atas, Anda menyetujui <a href="#" className="underline">Syarat & Ketentuan</a> yang berlaku.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

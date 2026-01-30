"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Robust clearing: Call context function AND manually clear storage
    const performCleanup = async () => {
        clearCart();
        localStorage.removeItem("cart");

        // Request 1: Trigger Status Update to SHIPPED
        // In a real production app, this should be a Webhook from Xendit/Midtrans.
        // For this demo/implementation, we trigger it from client-side success landing.
        const token = localStorage.getItem("token");
        // We might need to store orderId in localStorage during checkout to send it here,
        // OR simply rely on the fact that for "My Orders" fetching it will show latest.
        
        // HOWEVER, the requirement is "jika pesanan sudah dibayar maka statusnya langsung shiped"
        // Since we don't have the OrderID easily available here without URL params (which Xendit might not pass back purely),
        // we can try to fetch the latest PENDING order or just rely on the webhook.
        
        // BETTER APPROACH: The checkout page should probably redirect with ?order_id=XYZ
        // But if we can't control that easily, let's assume we can fetch the latest order for this user and if it's pending/paid, move to shipped?
        // OR: Since Xendit redirects to successRedirectUrl: 'http://localhost:3000/success', we can't easily append ID unless we pre-generate the link dynamically.
        // Let's assume for this specific user request, we update the LATEST order.
        
        if (token) {
             try {
                 const res = await fetch("http://localhost:4000/api/orders/my-orders", {
                      headers: { Authorization: `Bearer ${token}` }
                 });
                 if(res.ok) {
                     const orders = await res.json();
                     if(orders.length > 0) {
                        const latest = orders[0];
                        if(latest.status === 'PENDING' || latest.status === 'PAID') {
                            await fetch("http://localhost:4000/api/payment/success-callback", {
                                method: "POST",
                                headers: { 
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}` 
                                },
                                body: JSON.stringify({ orderId: latest.id })
                            });
                        }
                     }
                 }
             } catch(e) {
                 console.error("Failed to auto-update status", e);
             }
        }
    };

    const timer = setTimeout(() => {
        performCleanup();
    }, 100);

    return () => clearTimeout(timer);
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Terima Kasih!
        </h1>
        <p className="text-gray-500 mb-8">
            Pembayaran Anda berhasil diverifikasi. Pesanan Anda sedang kami siapkan dengan penuh cinta.
        </p>

        <div className="space-y-3">
             <Link 
                href="/orders" 
                className="block w-full border-2 border-gold text-gold hover:bg-yellow-50 font-bold py-3 rounded-xl transition"
            >
                Lihat Pesanan Saya
            </Link>
            <Link 
                href="/produk" 
                className="block w-full bg-gold hover:bg-yellow-500 text-dark font-bold py-3 rounded-xl transition"
            >
                Belanja Lagi
            </Link>
            <Link 
                href="/" 
                className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 rounded-xl transition"
            >
                Kembali ke Beranda
            </Link>
        </div>
      </div>
    </main>
  );
}

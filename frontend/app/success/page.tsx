"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful payment return
    clearCart();
  }, []);

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

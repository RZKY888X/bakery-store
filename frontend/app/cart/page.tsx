// frontend/app/cart/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const router = useRouter();
  const tax = cartTotal * 0.11;
  const total = cartTotal + tax;

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
                 <span className="font-display font-bold text-xl text-brown">Keranjang</span>
             </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <p className="text-xl font-bold text-gray-400 mb-6">Keranjang Anda kosong</p>
              <Link
                href="/produk"
                className="bg-gold text-dark font-bold py-3 px-8 rounded-full hover:bg-yellow-500 transition"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Product List */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                      {/* Using standard img to bypass Next.js strict private IP check in dev */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-lg text-dark">{item.name}</h3>
                       {/* Hardcoded description for now as it's not in Product interface but required by design */}
                      <p className="text-xs text-gray-500 mt-1 mb-2">Tekstur renyah dengan rasa mentega premium.</p>
                      <p className="font-bold text-gold">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-dark"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-dark"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <Link href="/produk" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-dark mt-6">
                  <ArrowLeft size={16} /> Lanjut Belanja
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-xl shadow-sm sticky top-32">
                  <h3 className="font-display text-xl font-bold mb-6">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-4 mb-6 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-dark">Rp {cartTotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimasi Pajak (11%)</span>
                      <span className="font-bold text-dark">Rp {tax.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Biaya Pengiriman</span>
                      <span className="font-bold">Gratis</span>
                    </div>
                  </div>

                  <div className="border-t pt-6 mb-8 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-gold text-2xl">Rp {total.toLocaleString("id-ID")}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full block bg-gold hover:bg-yellow-500 text-dark font-bold text-center py-4 rounded-lg transition shadow-lg mb-6"
                  >
                    Lanjut ke Checkout →
                  </Link>

                  <div className="space-y-4 text-xs text-gray-500">
                     <div className="flex gap-3 items-center bg-yellow-50 p-3 rounded-lg">
                        <span className="text-yellow-600">🛡️</span>
                        <p>Pembayaran aman dengan enkripsi SSL 256-bit.</p>
                     </div>
                     <div className="flex gap-3 items-center bg-yellow-50 p-3 rounded-lg">
                        <span className="text-yellow-600">🚚</span>
                        <p>Estimasi pengiriman 30-45 menit ke lokasi Anda.</p>
                     </div>
                  </div>
                  
                  <div className="mt-8 bg-[#F9F5EB] p-4 rounded-lg border border-[#EADSC0] flex justify-between items-center">
                     <div className="flex items-center gap-2 text-sm font-bold text-[#7A5C3A]">
                        <span>🏷️</span> Ada kode promo?
                     </div>
                     <button className="text-[#D6A45E] font-bold text-sm">Tambah</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

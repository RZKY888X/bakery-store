// ==========================================================================
// Frontend/components/sections/products.tsx
// ==========================================================================
"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/toast-provider";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function Products() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast("Berhasil ditambahkan ke keranjang!", product.name, product.image);
  };

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch("http://localhost:4000/api/products/favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites");
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? favorites.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === favorites.length - 1 ? 0 : prev + 1));
  };

  // Calculate position relative to active card
  const getCardStyles = (index: number) => {
    const total = favorites.length;
    let diff = index - activeIndex;
    
    // Handle wrap-around for circular carousel
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    // Base styles for positioning
    const isActive = diff === 0;
    const isAdjacent = Math.abs(diff) === 1;
    const isVisible = Math.abs(diff) <= 2;

    if (!isVisible) {
      return {
        opacity: 0,
        transform: `translateX(${diff * 100}%) scale(0.6) rotateY(${diff > 0 ? -45 : 45}deg)`,
        zIndex: 0,
        pointerEvents: 'none' as const,
      };
    }

    return {
      opacity: isActive ? 1 : isAdjacent ? 0.6 : 0.3,
      transform: `translateX(${diff * 85}%) scale(${isActive ? 1 : isAdjacent ? 0.85 : 0.7}) rotateY(${diff * -15}deg)`,
      zIndex: isActive ? 30 : isAdjacent ? 20 : 10,
      pointerEvents: isActive ? 'auto' as const : 'none' as const,
    };
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/assets/background-pattern.png')",
          backgroundSize: "400px",
          backgroundRepeat: "repeat"
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            Top 5 Pilihan
          </span>
          <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl font-bold text-gray-900">
            Produk <span className="text-amber-600 italic">Favorit</span> Kami
          </h2>
          <p className="font-serif text-gray-600 text-lg mt-4 max-w-xl mx-auto">
            Pilihan makanan ringan yang hangat dan lezat dari pelanggan kami
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
              <span className="text-gray-400">Memuat produk...</span>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Belum ada produk favorit.</div>
        ) : (
          <>
            {/* 3D Card Carousel */}
            <div className="relative h-[500px] md:h-[520px] flex items-center justify-center perspective-1000">
              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 md:left-12 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl group"
                aria-label="Previous"
              >
                <ArrowLeft size={22} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 md:right-12 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all duration-300 shadow-lg hover:shadow-xl group"
                aria-label="Next"
              >
                <ArrowRight size={22} className="group-hover:scale-110 transition-transform" />
              </button>
              
              {/* Cards Container */}
              <div className="relative w-full max-w-sm md:max-w-md h-full flex items-center justify-center">
                {favorites.map((product, index) => {
                  const styles = getCardStyles(index);
                  const isActive = index === activeIndex;
                  
                  return (
                    <div
                      key={product.id}
                      className="absolute w-72 md:w-80 transition-all duration-500 ease-out"
                      style={{
                        ...styles,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl h-[440px] md:h-[460px] flex flex-col border ${isActive ? 'border-amber-200' : 'border-gray-100'} transition-all duration-300`}>
                        {/* Image */}
                        <div className="relative h-56 md:h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-amber-700 shadow-sm">
                            {product.category || "Bakery"}
                          </div>
                          
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                              <button 
                                onClick={() => handleAddToCart(product)}
                                className="bg-white text-gray-900 font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-amber-500 hover:text-white transition-colors"
                              >
                                <ShoppingBag size={18} /> Beli Sekarang
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col justify-between flex-1 bg-white">
                          <div>
                            <h3 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2">
                              Nikmati kelezatan {product.name} yang dibuat dengan bahan premium.
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <p className="font-sans font-bold text-xl md:text-2xl text-amber-600">
                              Rp {product.price.toLocaleString("id-ID")}
                            </p>
                            {isActive && (
                              <button 
                                onClick={() => handleAddToCart(product)}
                                className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors duration-300"
                              >
                                <ShoppingBag size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {favorites.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-amber-500 w-8' 
                      : 'bg-gray-300 hover:bg-amber-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/produk" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-amber-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Lihat Semua Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

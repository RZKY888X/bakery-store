"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function Products() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
      addToCart(product);
      alert("Produk Favorit ditambahkan ke keranjang!");
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200; 
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className='py-20 bg-white relative overflow-hidden'>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/mainbanner.png"
          alt="Favorites Background"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-white/90" /> {/* Light overlay to keep it subtle as requested, or maybe dark? User said "gambar sebagai background". Existing design is light theme. Let's keep it light but with texture. Actually, typically "background image" implies visibility. I'll use a high transparency overlay. */}
      </div>

      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/assets/background-pattern.png')",
          backgroundSize: "400px",
          backgroundRepeat: "repeat"
        }}
      />
      
      <div className='max-w-7xl mx-auto px-6 relative z-10'>
        <div className='flex flex-col md:flex-row justify-between items-end mb-12'>
          <div className='text-left'>
            <h2 className='font-(family-name:--font-display) text-5xl font-bold text-dark'>
              Produk <span className=' text-brown italic'>Favorit</span> Kami
            </h2>
            <p className='font-serif text-brown text-lg mt-4'>
              Pilihan makanan ringan yang hangat dan lezat (Top 5)
            </p>
          </div>
          
          <div className='flex gap-4 mt-6 md:mt-0'>
            <button
              onClick={() => scroll("left")}
              className='w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition duration-300'
              aria-label="Scroll left"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className='w-12 h-12 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white transition duration-300'
              aria-label="Scroll right"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {loading ? (
             <div className="flex justify-center py-20"><span className="text-gray-400">Memuat produk...</span></div>
        ) : favorites.length === 0 ? (
             <div className="text-center py-20 text-gray-500">Belum ada produk favorit.</div>
        ) : (
        <div
          ref={scrollRef}
          className='flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-6 px-6'
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {favorites.map((product) => (
            <div
              key={product.id}
              className='min-w-[280px] md:min-w-[320px] snap-start group relative'
            >
              <div className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-[420px] flex flex-col border border-gray-100'>
                <div className='relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center'>
                    <div className='absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brown shadow-sm'>
                      {product.category || "Bakery"}
                    </div>
                  
                  <div className="relative w-full h-full"> 
                    <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                    />
                  </div>
                  
                  <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                     <button 
                         onClick={() => handleAddToCart(product)}
                         className='bg-white text-dark font-bold px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg flex items-center gap-2'
                     >
                        <ShoppingBag size={18} /> Beli Sekarang
                     </button>
                  </div>
                </div>

                <div className='p-6 flex flex-col justify-between flex-1 relative bg-white'>
                   <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-150 transition-transform duration-500 origin-top-right"></div>
                   
                  <div className="relative z-10">
                    <h3 className='font-display text-xl font-bold text-dark mb-2 group-hover:text-brown transition-colors'>
                      {product.name}
                    </h3>
                    <p className='text-gray-500 text-sm line-clamp-2'>
                      Nikmati kelezatan {product.name} yang dibuat dengan bahan premium.
                    </p>
                  </div>
                  
                  <div className='flex items-center justify-between mt-4 relative z-10'>
                    <p className='font-sans font-bold text-xl text-dark'>
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <button 
                        onClick={() => handleAddToCart(product)}
                        className='w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors duration-300'
                    >
                        <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
        
        <div className='mt-12 text-center'>
            <Link href="/produk" className='inline-block border-b-2 border-dark pb-1 text-dark font-bold hover:text-gold hover:border-gold transition-colors uppercase tracking-widest text-sm'>
                Lihat Semua Menu
            </Link>
        </div>
      </div>
    </section>
  );
}

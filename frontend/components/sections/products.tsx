"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Products() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const products = [
    {
      name: "Butter Croissant",
      price: "14.000",
      image: "/assets/products/buttercroissant.jpeg",
      badge: true,
    },
    {
      name: "Pain au Chocolat",
      price: "18.000",
      image: "/assets/products/painauchocholat.jpeg",
    },
    {
      name: "Cinnamon Roll",
      price: "13.000",
      image: "/assets/products/cinnamon.jpeg",
    },
    {
      name: "Almond Croissant",
      price: "18.000",
      image: "/assets/products/almond.jpeg",
    },
    {
      name: "Banana Bread",
      price: "24.000",
      image: "/assets/products/banana bread.jpeg",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Adjust scroll amount as needed
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className='py-24 bg-beige relative overflow-hidden'>
       {/* Background pattern matching product page for consistency */}
       <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply">
          <Image
            src="/assets/background-pattern.png"
            alt="Background Pattern"
            fill
            className="object-cover"
          />
       </div>

      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex flex-col md:flex-row justify-between items-end mb-12'>
          <div className='text-left'>
            <h2 className='font-(family-name:--font-display) text-5xl font-bold text-dark'>
              Produk <span className='text-brown italic'>Favorit</span> Kami
            </h2>
            <p className='text-brown text-lg mt-4'>
              Pilihan makanan ringan yang hangat dan lezat (Top 5)
            </p>
          </div>
          
          {/* Internal Navigation for Carousel */}
          <div className="flex gap-4 mt-6 md:mt-0">
             <button 
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-yellow-800 text-yellow-800 flex items-center justify-center hover:bg-yellow-800 hover:text-white transition"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>
             <button 
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-yellow-800 text-yellow-800 flex items-center justify-center hover:bg-yellow-800 hover:text-white transition"
             >
               <ChevronRight className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
            ref={scrollRef}
            className='flex gap-8 overflow-x-auto snap-x Snap-mandatory pb-8 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0'
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {products.map((p) => (
            <div
              key={p.name}
              className='min-w-[280px] md:min-w-[350px] bg-cream rounded-[2.5rem] overflow-hidden shadow-lg group snap-center flex-shrink-0'
            >
              <div className='relative h-64 w-full'>
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className='object-cover group-hover:scale-110 transition duration-500'
                />
                {p.badge && (
                  <span className='absolute top-4 left-4 bg-br-text-brown text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase'>
                    Best Seller
                  </span>
                )}
              </div>
              <div className='p-8'>
                <h5 className='font-display text-brown text-2xl font-bold mb-2'>
                  {p.name}
                </h5>
                <p className='text-brown font-bold text-xl mb-6'>
                  Rp {p.price}
                </p>

                <button className='w-full bg-yellow-800 hover:bg-yellow-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition'>
                  <HiOutlineShoppingCart className='w-5 h-5' />
                  Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <Link
            href='/produk'
            className='bg-transparent border-2 border-yellow-800 text-yellow-800 hover:bg-yellow-800 hover:text-white px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 transition group'
          >
            Lihat Semua Produk
            <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-2' />
          </Link>
        </div>
      </div>
{/* 
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style> */}
    </section>
  );
}

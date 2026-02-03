"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/toast-provider";

interface ProductCardProps {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
}

export default function ProductCard({
  id,
  image,
  name,
  category,
  price,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    showToast("Berhasil ditambahkan ke keranjang!", name, image);
  };

  return (
    <div className='bg-[#FFF8E7] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col'>
      {/* Image Container */}
      <div className='relative h-64 w-full'>
        {/* Using standard img for local dev compatibility */}
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
        />
        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brown'>
          {category}
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='text-[#5D4037] font-bold text-lg leading-tight mb-1'>
          {name}
        </h3>
        <p className='text-[#8D6E63] text-xs mb-2'>{category}</p>
        <div className='mt-auto flex items-center justify-between'>
          <span className='text-[#5D4037] text-lg font-medium'>
             Rp {price.toLocaleString("id-ID")}
          </span>
          <button 
            onClick={handleAddToCart}
            className='bg-[#5D4037] text-white text-xs px-4 py-1.5 rounded-md hover:bg-[#4E342E] active:scale-95 active:bg-[#3E2723] transition-all flex items-center gap-2'
          >
            <Plus size={14} /> Beli
          </button>
        </div>
      </div>
    </div>
  );
}

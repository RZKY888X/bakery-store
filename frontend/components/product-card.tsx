import Image from "next/image";

interface ProductCardProps {
  name: string;
  category?: string;
  price: string;
  image: string;
}

export default function ProductCard({
  name,
  category = "Roti 1",
  price,
  image,
}: ProductCardProps) {
  return (
    <div className='bg-[#FFF8E7] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col'>
      {/* Image Container */}
      <div className='relative h-64 w-full'>
        <Image
          src={image}
          alt={name}
          fill
          className='object-cover transition-transform duration-500 hover:scale-105'
        />
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col flex-grow'>
        <h3 className='text-[#5D4037] font-bold text-lg leading-tight mb-1'>
          {name}
        </h3>
        <p className='text-[#8D6E63] text-xs mb-2'>{category}</p>
        <div className='mt-auto flex items-center justify-between'>
          <span className='text-[#5D4037] text-lg font-medium'>
            Rp. {price}
          </span>
          <button className='bg-[#5D4037] text-white text-xs px-4 py-1.5 rounded-md hover:bg-[#4E342E] transition-colors'>
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}

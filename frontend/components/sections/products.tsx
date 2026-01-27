// ============================================================================
// frontend/components/sections/products.tsx
// ============================================================================
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Products() {
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
  ];

  return (
    <section className='py-24 bg-beige'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='font-(family-name:--font-display) text-5xl font-bold text-dark'>
            Produk <span className='text-brown italic'>Favorit</span> Kami
          </h2>
          <p className='text-brown text-lg mt-4'>
            Pilihan makanan ringan yang hangat dan lezat
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {products.map((p) => (
            <div
              key={p.name}
              className='bg-cream rounded-[2.5rem] overflow-hidden shadow-lg group'
            >
              <div className='relative h-64'>
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

        <div className='text-center mt-16'>
          <Link
            href='/produk'
            className='bg-yellow-800 hover:bg-yellow-900 text-cream px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 transition group'
          >
            Semua Produk
            <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate' />
          </Link>
        </div>
      </div>
    </section>
  );
}

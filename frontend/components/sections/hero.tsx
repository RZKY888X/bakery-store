// ============================================================================
// frontend/components/sections/hero.tsx
// ============================================================================
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className='relative h-[80vh] flex items-center '>
      <Image
        src='/mainbanner.png'
        alt='Bread'
        fill
        className='object-cover'
        priority
      />
      <div className='absolute inset-0 bg-linear-to-r from-black/60 to-black/30' />
      <div className='relative z-10 max-w-3xl px-6 text-white mx-auto lg:mx-0 lg:ml-12'>
        <div className='max-w-2xl space-y-6'>
          <div className='inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest'>
            <span className='w-2 h-2 rounded-full bg-gold animate-pulse' />
            Traditional Craftsmanship
          </div>

          <h1 className='font-(family-name:--font-display) text-7xl md:text-8xl font-bold text-shadow'>
            Swadista
            <br />
            <span className='text-[#d4af37] italic '>Artisan</span> Bakery
          </h1>

          <p className='text-lg text-gray-200'>
            Menghadirkan kehangatan roti artisan terbaik dengan bahan-bahan
            pilihan yang diolah dengan cinta setiap harinya.
          </p>

          <div className='flex flex-col sm:flex-row sm:justify-start items-center sm:items-center gap-3 pt-4 font-(family-name:--font-display)'>
            <Link
              href='/produk'
              className='bg-[#8b5e3c] hover:bg-[#8b5e3c]/90 text-cream px-6 py-3 rounded-full font-semibold inline-flex items-center gap-2 transition group'
            >
              Lihat Produk
              <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate' />
            </Link>

            <Link
              href='#story'
              className='bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold inline-flex items-center justify-center transition-all border border-white/30'
            >
              Cerita Kami
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

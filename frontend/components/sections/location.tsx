// ============================================================================
// frontend/components/sections/location.tsx
// ============================================================================
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkedAlt, FaClock } from "react-icons/fa";

export default function Location() {
  return (
    <section className='py-24 bg-beige relative overflow-hidden' id='location'>
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply">
        <Image
          src="/assets/location-bg.png"
          alt="Map Pattern Background"
          fill
          className="object-cover"
        />
      </div>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='bg-cream rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-xl'>
          {/* Gambar di kiri */}
          <div className='flex-1 min-h-64 lg:min-h-140 relative'>
            <Image src='/toko.svg' alt='Store' fill className='object-cover' />
          </div>

          {/* Konten teks di kanan */}
          <div className='flex-1 p-12 lg:p-20 space-y-8'>
            <h2 className='font-display text-4xl font-bold text-dark'>
              Kunjungi Toko Offline Kami
            </h2>

            <div className='space-y-4'>
              {/* Alamat */}
              <div className='flex gap-4'>
                <div className='w-10 h-10 rounded-full bg-yellow-200/20 flex items-center justify-center shrink-0'>
                  <span className='material-icons-outlined text-brown'>
                    <FaMapMarkedAlt/>
                  </span>
                </div>
                <div>
                  <p className='font-bold'>Alamat Utama</p>
                  <p className='text-brown'>
                    Jl. Bakeri No. 42, Kebayoran Baru, Jakarta Selatan
                  </p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className='flex gap-4'>
                <div className='w-10 h-10 rounded-full bg-yellow-200/20 flex items-center justify-center shrink-0'>
                  <span className='material-icons-outlined text-brown'>
                    <FaClock/>
                  </span>
                </div>
                <div>
                  <p className='font-bold'>Jam Operasional</p>
                  <p className='text-brown'>Senin - Minggu: 07:00 - 21:00</p>
                </div>
              </div>
            </div>

            {/* Button */}
         <Link
  href="#"
  className="group inline-flex items-center gap-2 bg-yellow-800 hover:bg-yellow-900 text-white px-10 py-4 rounded-full font-bold shadow-lg"
>
  Petunjuk Arah
  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
</Link>

          </div>
        </div>
      </div>
    </section>
  );
}

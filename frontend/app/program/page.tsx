"use client";

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="w-full bg-[#f3e6d3] text-[#4a2f1f]">
      {/* HERO */}
      <section className="relative w-full h-[360px]">
        <Image
          src="/mainbanner.png"
          alt="Swadista Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#7A4A2E] bg-[#FFF4E6]/90 px-6 py-3 rounded">Swadista Lestari</h1>
          <p className="text-sm md:text-base text-[#d9e2c4]">
            Sebuah gerakan kecil dari dapur kami, untuk bumi yang lebih baik.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow">
          <Image
            src="/program1.png"
            alt="Swadista Box"
            width={600}
            height={420}
            className="object-cover"
          />
        </div>
        <div className="text-sm leading-relaxed">
          <p className="mb-4">
            Swadista Lestari adalah komitmen kami untuk membuat roti dengan kesadaran—akan alam, proses, dan masa depan.
          </p>
          <p className="mb-4">
            Melalui pilihan bahan, kemasan yang bertanggung jawab, dan kolaborasi lingkungan, kami percaya bahwa perubahan besar selalu dimulai dari langkah kecil.
          </p>
          <p>Dan langkah itu bisa dimulai dari sepotong roti.</p>
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-6xl mx-auto px-12 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "FROM GRAIN TO EARTH", icon: "/programicon1.png" },
          { title: "RESPONSIBLE PACKAGING", icon: "/programicon2.png" },
          { title: "BAKE FOR THE FUTURE", icon: "/programicon3.png" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#f8eddf] rounded-2xl p-10 flex flex-col items-center text-center shadow"
          >
            <div className="w-24 h-24 rounded-full bg-[#d7b08c] flex items-center justify-center mb-4">
              <Image src={item.icon} alt={item.title} width={48} height={48} />
            </div>
            <p className="text-xs font-semibold tracking-wide">{item.title}</p>
          </div>
        ))}
      </section>

      {/* IMPACT */}
      <section className="max-w-6xl mx-auto px-12 text-center pb-24">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Kamu adalah Bagian dari Perubahan</h2>
        <p className="text-sm max-w-2xl mx-auto mb-12">
          Setiap pembelian kamu, adalah wujud kepedulian bagi sesama. Kamu tidak hanya menghangatkan diri tapi juga menghangatkan hati orang lain.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {["/program2.png", "/program3.png", "/program4.png"].map((src) => (
            <div key={src} className="rounded-2xl overflow-hidden shadow">
              <Image src={src} alt="Impact" width={400} height={280} className="object-cover" />
            </div>
          ))}
        </div>
        <Link
          href="#"
          className="inline-block bg-[#6b3e2e] hover:bg-[#5a3225] transition text-white px-8 py-3 rounded-lg text-sm"
        >
          Hubungi Kami
        </Link>
      </section>
    </main>
  );
}

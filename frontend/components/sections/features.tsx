// ============================================================================
// frontend/components/sections/features.tsx
// ============================================================================
import Image from "next/image";
import { IoStar } from "react-icons/io5";

export default function Features() {
  const items = [
    {
      icon: "/assets/programs/Verified.svg",
      title: "Kualitas Terjaga",
      desc: "Produk kami selalu disajikan hangat sehingga kualitas rasa dan aroma tetap terjaga.",
    },
    {
      icon: "/assets/programs/Clock.svg",
      title: "Mudah Disajikan",
      desc: "Siap disantap kapanpun dan dimanapun, Kami hadir sebagai teman cemilan setia Anda.",
    },
    {
      icon: "/assets/programs/Shield.svg",
      title: "Bersih & Aman",
      desc: "Roti kami dijamin bersih dan aman dari zat berbahaya, diproses dengan standar higienis tinggi.",
    },
  ];

  return (
    <section className='py-24 bg-cream relative overflow-hidden'>
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply">
        <Image
          src="/assets/features-bg.png"
          alt="Wheat Pattern Background"
          fill
          className="object-cover"
        />
      </div>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h3 className='font-(family-name:--font-display) text-3xl font-bold uppercase text-brown mb-4'>
            Keunggulan Kami
          </h3>
          <div className='flex items-center justify-center gap-4'>
            <div className='w-12 h-px bg-gold' />
            <span className='material-icons-outlined text-brown'>
              <IoStar/>
            </span>
            <div className='w-12 h-px bg-gold' />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
      {items.map((item) => (
        <div
          key={item.title}
          className="bg-gold/10 p-8 rounded-3xl text-center hover:bg-gold/20 hover:shadow-xl transition group"
        >
          <div className="w-20 h-20 bg-yellow-100/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
            <Image
              src={item.icon}
              alt={item.title}
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <h4 className="font-display font-serif text-xl font-bold mb-3">
            {item.title}
          </h4>
          <p className="text-brown font-sans text-md font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
      </div>
    </section>
  );
}

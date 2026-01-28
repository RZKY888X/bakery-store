// ============================================================================
// frontend/components/sections/story.tsx
// ============================================================================
import Image from "next/image";

export default function Story() {
  return (
    <section className='py-24 bg-cream relative overflow-hidden' id='story'>
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply">
        <Image
          src="/assets/background-pattern.png"
          alt="Background Pattern"
          fill
          className="object-cover"
        />
      </div>
      <div className='max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center'>
        <div className='relative group'>
          <div className='absolute -inset-4 bg-gold/10 rounded-2xl group-hover:bg-gold/20 transition-colors' />
          <Image
            src='/Story.svg'
            alt='Bakery'
            width={530}
            height={750}
            className='relative rounded-xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 aspect-4/5 object-cover'
          />
        </div>

        <div className='space-y-6'>
          <h2 className='font-(family-name:--font-display) text-5xl font-bold text-black'>
            Cerita <span className='text-brown italic'>Kami</span>
          </h2>
          <div className='w-20 h-1 bg-gold' />

          <p className='text-brown text-lg text-justify font-medium leading-relaxed'>
            Swadista lahir sebagai bagian dari perjalanan kewirausahaan yang
            terinspirasi dari kehangatan rumah dan kesederhanaan roti. Kami
            percaya bahwa roti bukan sekadar makanan, melainkan bagian dari
            momen-momen berharga saat berkumpul.
          </p>

          <p className='text-brown text-lg text-justify font-medium leading-relaxed'>
            Setiap produk Swadista dibuat dengan perhatian penuh terhadap
            kualitas. Kami memilih bahan baku dengan cermat dan mengolahnya
            secara bertahap untuk menjaga rasa, tekstur, dan konsistensi yang
            premium.
          </p>

          <blockquote className='border-l-4 border-brown text-justify pl-6 italic text-xl font-(family-name:--font-display) text-brown'>
            &quot;Memanggang roti adalah tentang menghadirkan kenyamanan dan kepuasan
            dalam setiap sajian.&quot;
          </blockquote>
        </div>
      </div>
    </section>
  );
}

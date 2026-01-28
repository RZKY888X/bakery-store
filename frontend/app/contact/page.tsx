// ============================================================================
// frontend/app/contact/page.tsx
// ============================================================================
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <main className="min-h-screen bg-[#FDF8F0] relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply z-0">
          <Image
            src="/assets/background-pattern.png"
            alt="Background Pattern"
            fill
            className="object-cover"
          />
        </div>
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             {/* Using mainbanner or similar bread background */}
            <Image
              src="/mainbanner.png" 
              alt="Contact Hero Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
          
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="font-(family-name:--font-display) text-5xl md:text-6xl font-bold mb-4 drop-shadow-md">
              Hubungi kami
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm text-[#FDF8F0]/90">
              Ada pertanyaan atau komentar? Cukup tulis pesan kepada kami!
            </p>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-xl bg-[#FDF8F0]">
            
            {/* Left Column: Contact Info (Brown) */}
            <div className="w-full md:w-2/5 bg-[#D4A351] text-[#3E2723] p-10 md:p-14 relative overflow-hidden">
              {/* Decorative Circle Overlay */}
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <h2 className="font-display text-3xl font-bold mb-6 text-[#3E2723]">
                Informasi Kontak
              </h2>
              <p className="text-[#3E2723]/90 mb-12 text-lg leading-relaxed">
                Jika Anda mempunyai pertanyaan atau kekhawatiran, Anda dapat menghubungi kami dengan mengisi formulir kontak, menelepon kami, datang ke kantor kami, menemukan kami di jejaring sosial lain, atau Anda dapat mengirim email pribadi kepada kami di:
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                  <span className="text-lg font-medium tracking-wide">0812-1111-8456</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                  <span className="text-lg font-medium tracking-wide">hello@kwufrozenfood</span>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                  <span className="text-lg font-medium leading-relaxed">
                    Gedung Graha Ganesha, Lantai 1 Suite 120 & 130<br/>
                    Jl. Hayam Wuruk No. 28, RT 014/ RW 001,<br/>
                    Kelurahan Kebon Klapa, Kecamatan Gambir,<br/>
                    Jakarta Pusat, DKI Jakarta
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Form (Beige) */}
            <div className="w-full md:w-3/5 bg-[#F6E6D0] p-10 md:p-14">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#3E2723] font-bold mb-2">Nama</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-[#EBE0D0] border-none rounded-lg p-4 text-[#3E2723] focus:ring-2 focus:ring-[#D4A351] outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#3E2723] font-bold mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-[#EBE0D0] border-none rounded-lg p-4 text-[#3E2723] focus:ring-2 focus:ring-[#D4A351] outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#3E2723] font-bold mb-2">No Telepon</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full bg-[#EBE0D0] border-none rounded-lg p-4 text-[#3E2723] focus:ring-2 focus:ring-[#D4A351] outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#3E2723] font-bold mb-2">Pesan Kamu</label>
                  <textarea 
                    id="message" 
                    rows={6}
                    className="w-full bg-[#EBE0D0] border-none rounded-lg p-4 text-[#3E2723] focus:ring-2 focus:ring-[#D4A351] outline-none transition resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-[#5D4037] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4E342E] transition shadow-lg transform active:scale-95"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}

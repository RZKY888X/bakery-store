import Image from "next/image";
import AchievementCard from "./achievement-card";

export default function TentangPage() {
  return (
    <main className="w-full bg-[#FFF4E6] text-[#3B2A1F] font-sans">
      {/* ================= HERO ================= */}
      <section className="relative h-[220px] md:h-[320px] w-full">
        <Image
          src="/mainbanner.png"
          alt="Tentang Swadista"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="font-(family-name:--font-display) text-cream text-4xl md:text-6xl font-bold text-shadow">
            Tentang Kami
          </h1>
        </div>
      </section>

      {/* ================= MOTO ================= */}
      <section className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-sm uppercase tracking-wide mb-2 font-bold">Moto Kami</p>
          <h2 className="font-display text-3xl font-bold mb-4">Uṣṇa Rasa</h2>
        </div>

        <div className="space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            Moto Uṣṇa Rasa berasal dari bahasa Sanskerta, di mana Uṣṇa berarti
            hangat, dan Rasa bermakna rasa, pengalaman, serta perasaan.
            Secara keseluruhan, moto ini menggambarkan kehangatan yang tidak
            hanya dirasakan melalui cita rasa, tetapi juga melalui pengalaman
            menikmati produk itu sendiri.
          </p>
          <p>
            Bagi kami, kehangatan bukan sekadar suhu roti yang baru keluar dari
            oven, melainkan juga perasaan nyaman dan akrab—seperti berada di
            rumah. Setiap produk dibuat dengan perhatian pada proses, bahan,
            dan rasa, sehingga menghadirkan pengalaman yang menenangkan dan
            berkesan.
          </p>
        </div>
      </section>

      {/* ================= VISI & MISI ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-sm uppercase tracking-wide mb-2 font-bold">Visi & Misi</p>
          <h2 className="font-display text-3xl font-bold">Swadista</h2>
        </div>

        <div className="space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            Menjadi bakery bercita rasa internasional dengan sentuhan
            tradisional, yang menghadirkan kehangatan rumah dalam setiap
            serat roti.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Menghadirkan produk bakery bercita rasa internasional yang dibuat
              dengan pendekatan tradisional dan penuh perhatian.
            </li>
            <li>
              Menjaga kualitas bahan dan proses pembuatan agar setiap produk
              tetap konsisten dan dapat dipercaya.
            </li>
            <li>
              Menciptakan pengalaman rasa yang hangat dan akrab, mengingatkan
              pada suasana rumah dalam setiap sajian.
            </li>
          </ol>
        </div>
      </section>

      {/* ================= PENCAPAIAN ================= */}
      <section className="bg-[#D6A45E] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold mb-12 text-black">Pencapaian</h2>

          <div className="space-y-14">
            {/* Item 1 */}
            <AchievementCard
              title="Menghadirkan Bakery dengan Standar Rasa Global"
              text="Swadista berhasil menghadirkan produk bakery dengan inspirasi internasional yang dipadukan dengan sentuhan rasa tradisional."
              img="/pencapaian1.png"
            />

            {/* Item 2 */}
            <AchievementCard
              title="Penggunaan Bahan Berkualitas & Proses Terstandar"
              text="Menggunakan bahan pilihan dan proses produksi yang konsisten untuk menjaga kualitas rasa dan tekstur."
              img="/pencapaian2t.png"
              reverse
            />

            {/* Item 3 */}
            <AchievementCard
              title="Pengembangan Menu Terinspirasi Dunia"
              text="Ragam produk terinspirasi dari berbagai negara tanpa meninggalkan cita rasa yang akrab bagi lidah Indonesia."
              img="/pencapaian3t.png"
            />

            {/* Item 4 */}
            <AchievementCard
              title="Brand dengan Identitas Filosofis"
              text="Membangun brand dengan nilai dan filosofi kuat yang tercermin dalam moto Uṣṇa Rasa."
              img="/pencapaian4t.png"
              reverse
            />
          </div>
        </div>
      </section>

      {/* ================= SUSTAINABILITY ================= */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-2">Swadista Lestari</h2>
        <p className="text-sm text-gray-700 mb-8">
          Cita rasa yang dijaga agar tetap hidup.
        </p>

        <div className="relative w-full h-[220px] md:h-[320px] mb-8">
          <Image
            src="/swadistalestari.png"
            alt="Swadista Lestari"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <p className="text-sm md:text-base leading-relaxed">
          Kami percaya bahwa roti bukan sekadar makanan, melainkan kehangatan
          yang dibagikan. Karena itu, setiap proses Swadista dibuat dengan rasa
          tanggung jawab—pada alam, pada sesama, dan pada rumah yang ingin kami
          hadirkan di setiap gigitan.
        </p>
      </section>
    </main>
  );
}

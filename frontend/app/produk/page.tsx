// ============================================================================
// frontend/app/produk/page.tsx
// ============================================================================
import ProductCard from "@/components/product-card";
import Image from "next/image";

const PRODUCTS = [
  {
    name: "Butter Croissant",
    category: "Roti 1",
    price: "14.000",
    image: "/assets/products/buttercroissant.jpeg",
  },
  {
    name: "Pain au Chocolat",
    category: "Roti 1",
    price: "18.000",
    image: "/assets/products/painauchocholat.jpeg",
  },
  {
    name: "Cinnamon Roll",
    category: "Roti 1",
    price: "13.000",
    image: "/assets/products/cinnamon.jpeg",
  },
  {
    name: "Almond Croissant",
    category: "Roti 1",
    price: "18.000",
    image: "/assets/products/almond.jpeg",
  },
  {
    name: "Banana Bread",
    category: "Roti 1",
    price: "24.000",
    image: "/assets/products/banana bread.jpeg",
  },
  {
    name: "Brioche Bun",
    category: "Roti 1",
    price: "8.000",
    image: "/assets/products/brioche bun.jpeg",
  },
  {
    name: "Pastel",
    category: "Roti 1",
    price: "5.000",
    image: "/assets/products/pastel.jpeg",
  },
  {
    name: "Lemper",
    category: "Roti 1",
    price: "4.000",
    image: "/assets/products/lemper.jpeg",
  },
  {
    name: "Risol",
    category: "Roti 1",
    price: "3.000",
    image: "/assets/products/risol.jpeg",
  },
  {
    name: "Surabi",
    category: "Roti 1",
    price: "6.000",
    image: "/assets/products/surabi.jpeg",
  },
  {
    name: "Onde-onde",
    category: "Roti 1",
    price: "3.000",
    image: "/assets/products/onde-onde.jpeg",
  },
  {
    name: "Lontong",
    category: "Roti 1",
    price: "2.000",
    image: "/assets/products/lontong.jpeg",
  },
];

export default function ProdukPage() {
  return (
    <>
      <main className="min-h-screen">
        {/* Page Header */}
        <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
             {/* Using a main banner or similar as hero background */}
            <Image
              src="/mainbanner.png" 
              alt="Produk Header Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          </div>
          
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="font-(family-name:--font-display) text-5xl md:text-6xl font-bold mb-4 drop-shadow-md">
              Produk Kami
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full" />
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="py-16 md:py-24 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
            <Image
              src="/assets/background-pattern.png"
              alt="Background Pattern"
              fill
              className="object-cover"
            />
             {/* Fallback solid color behind pattern to ensure readability if pattern is transparent */}
             <div className="absolute inset-0 bg-[#eebb90]mix-blend-multiply -z-10" /> 
          </div>
          {/* Solid background color wrapper to blend with pattern if needed, using a warm beige/brownish tint from valid tailwind/custom colors or inline */}
          <div className="absolute inset-0 bg-[#D2B48C] -z-10" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {PRODUCTS.map((product, index) => (
                <ProductCard
                  key={index}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

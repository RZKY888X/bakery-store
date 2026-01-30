"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/product-card";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:4000/api/products"),
          fetch("http://localhost:4000/api/categories")
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        
        if (Array.isArray(categoriesData)) {
            setCategories(["Semua", ...categoriesData.map((c: any) => c.name)]);
        }
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => 
      activeCategory === "Semua" ? true : product.category === activeCategory
  );

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/mainbanner.png" 
            alt="Products Hero"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center text-white p-6">
          <h1 className="font-(family-name:--font-display) text-5xl md:text-6xl font-bold mb-4">
            Koleksi <span className="text-gold italic">Artisan</span> Kami
          </h1>
          <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Setiap gigitan adalah perpaduan sempurna dari bahan premium dan dedikasi penuh cinta.
          </p>
        </div>
      </section>

      {/* Decorative Separation */}
      <div className="h-4 bg-gold w-full" />

      {/* Filter Section */}
      <section className="py-8 border-b border-gray-200 sticky top-24 bg-[#FDFBF7]/95 backdrop-blur-sm z-20">
         <div className="max-w-7xl mx-auto px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex gap-4 justify-center md:justify-start">
               {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full border transition font-bold text-sm ${
                        activeCategory === cat 
                        ? "bg-dark text-white border-dark" 
                        : "border-dark/10 hover:bg-dark hover:text-white text-dark"
                    }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 relative">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <Image
              src="/mainbanner.png"
              alt="Products Background"
              fill
              className="object-cover opacity-10" // Very subtle background as text is on top
            />
         </div>
         
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
              style={{ backgroundImage: "url('/assets/background-pattern.png')", backgroundSize: "400px" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {loading ? (
             <div className="text-center py-20 text-gray-500">Memuat produk lezat...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ==========================================================================
// Frontend/app/produk/page.tsx
// ==========================================================================
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/product-card";
import { Star, Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/toast-provider";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast("Berhasil ditambahkan ke keranjang!", product.name, product.image);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, favoritesRes] = await Promise.all([
          fetch("http://localhost:4000/api/products"),
          fetch("http://localhost:4000/api/categories"),
          fetch("http://localhost:4000/api/products/favorites")
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const favoritesData = await favoritesRes.json();

        setProducts(productsData);
        setFavorites(favoritesData);
        
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

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                <Sparkles size={16} />
                Pilihan Terbaik
              </div>
              <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl font-bold text-gray-900">
                Produk <span className="text-amber-600 italic">Favorit</span>
              </h2>
              <p className="text-gray-600 mt-3 max-w-xl mx-auto">
                Produk yang paling disukai pelanggan kami
              </p>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {favorites.map((product, index) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 hover:border-amber-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Rank Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    {/* Favorite Star */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <Star size={16} className="text-amber-500 fill-amber-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">{product.category}</span>
                    <h3 className="font-bold text-gray-900 mt-1 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg text-amber-700">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full transition-colors shadow-lg hover:shadow-xl"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* All Products Section */}
      <section className="py-20 relative">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <Image
              src="/mainbanner.png"
              alt="Products Background"
              fill
              className="object-cover opacity-10"
            />
         </div>
         
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
              style={{ backgroundImage: "url('/assets/background-pattern.png')", backgroundSize: "400px" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-(family-name:--font-display) text-3xl font-bold text-gray-900">
              Semua Produk
            </h2>
            <p className="text-gray-600 mt-2">
              {filteredProducts.length} produk ditemukan
            </p>
          </div>

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

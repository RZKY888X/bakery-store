"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
// Using simple img to avoid next/image complexity in this dynamic admin view for now, or use Next Image if stable
// We will use standard img tag as per established pattern in this project for local images
// import Image from "next/image"; 

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isFavorite: boolean;
}

export default function AdminFavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  const categories = ["Semua", "Breads", "Pastry", "Cakes", "Sourdough"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (product: Product) => {
    // Optimistic Update
    const updatedStatus = !product.isFavorite;
    
    // Check limit if adding
    const currentFavorites = products.filter(p => p.isFavorite).length;
    if (updatedStatus && currentFavorites >= 6) {
        alert("Maksimal 6 produk favorit! Hapus salah satu terlebih dahulu.");
        return;
    }

    // Update UI immediately
    setProducts(products.map(p => p.id === product.id ? { ...p, isFavorite: updatedStatus } : p));

    try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:4000/api/products/${product.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ ...product, isFavorite: updatedStatus })
        });
    } catch (error) {
        console.error("Failed to update favorite status");
        // Revert on error
        fetchProducts(); 
    }
  };

  const favorites = products.filter(p => p.isFavorite);
  const catalog = products.filter(p => !p.isFavorite) // Only show non-favorites in catalog? Or all? Image implies all or searchable. Let's show all for searchabilty, but maybe gray out favorites. Actually image has "Tambah" button, implies non-favorites.
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (filterCategory === "Semua" || p.category.includes(filterCategory)));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="font-display text-3xl font-bold text-dark mb-2">Atur Produk Favorit</h1>
            <p className="text-gray-500 max-w-2xl">
                Pilih dan urutkan hingga 6 produk unggulan untuk ditampilkan di bagian "Terfavorit" halaman utama website.
            </p>
        </div>
        <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 bg-white border border-gray-200 text-dark font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
            <ExternalLink size={16} /> Preview Live Web
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* Left Column: Selected Favorites */}
         <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-gold pb-2 mb-4">
                <h3 className="font-bold text-lg">Daftar Terpilih ({favorites.length}/6)</h3>
            </div>

            <div className="space-y-4">
               {favorites.map((product, index) => (
                  <div key={product.id} className="bg-white border border-yellow-400 p-4 rounded-xl flex items-center gap-4 relative group shadow-sm">
                      <div className="absolute top-4 right-4 text-xs font-bold text-gold">NO. {index + 1}</div>
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-sm text-dark line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category} • Rp {product.price.toLocaleString("id-ID")}</p>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(product)}
                        className="bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 p-1 rounded-full transition"
                      >
                         <Minus size={16} />
                      </button>
                  </div>
               ))}

               {/* Empty Slots */}
               {Array.from({ length: Math.max(0, 6 - favorites.length) }).map((_, i) => (
                  <div key={i} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 h-24">
                      <Plus size={20} className="mb-1" />
                      <span className="text-xs font-bold">Slot Kosong {favorites.length + i + 1}/6</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Right Column: Catalog */}
         <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg">Katalog Produk</h3>
               <div className="relative w-64">
                   <input 
                     type="text" 
                     placeholder="Cari nama produk..." 
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition ${
                            filterCategory === cat 
                            ? "bg-gold text-dark" 
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {catalog.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col hover:shadow-md transition">
                      <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                         {/* Category Badge */}
                         <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-0.5 rounded text-dark shadow-sm">
                             {product.category}
                         </span>
                      </div>
                      <h4 className="font-bold text-dark text-sm mb-1 line-clamp-1" title={product.name}>{product.name}</h4>
                      <p className="text-sm text-gray-500 mb-4">Rp {product.price.toLocaleString("id-ID")}</p>
                      
                      <button 
                        onClick={() => toggleFavorite(product)}
                        disabled={favorites.length >= 6}
                        className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition
                            ${favorites.length >= 6 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-gray-50 hover:bg-gold hover:text-dark text-dark"
                            }`}
                      >
                         <Plus size={16} /> Tambah ke Favorit
                      </button>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

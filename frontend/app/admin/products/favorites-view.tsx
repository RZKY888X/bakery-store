"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isFavorite: boolean;
}

export default function FavoritesView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [categories, setCategories] = useState<string[]>(["Semua"]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const res = await fetch("http://localhost:4000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
            setCategories(["Semua", ...data.map((c: any) => c.name)]);
        }
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products");
    }
  };

  const toggleFavorite = async (product: Product) => {
    const updatedStatus = !product.isFavorite;
    const currentFavorites = products.filter(p => p.isFavorite).length;

    if (updatedStatus && currentFavorites >= 6) {
        alert("Maksimal 6 produk favorit! Hapus salah satu terlebih dahulu.");
        return;
    }

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
        fetchProducts(); 
    }
  };

  const favorites = products.filter(p => p.isFavorite);
  const catalog = products
        .filter(p => !p.isFavorite)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && (filterCategory === "Semua" || p.category === filterCategory));

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
            <h3 className="font-bold text-xl mb-2">Atur Produk Favorit</h3>
            <p className="text-gray-500 max-w-2xl text-sm">
                Pilih hingga 6 produk unggulan untuk halaman utama.
            </p>
        </div>
        <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 bg-white border border-gray-200 text-dark font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm"
        >
            <ExternalLink size={14} /> Preview Live
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* Left Column: Selected */}
         <div className="lg:col-span-4 space-y-6">
            <h4 className="font-bold text-md border-b-2 border-gold pb-2 mb-4">Terpilih ({favorites.length}/6)</h4>
            <div className="space-y-4">
               {favorites.map((product, index) => (
                  <div key={product.id} className="bg-white border border-yellow-400 p-3 rounded-xl flex items-center gap-3 relative shadow-sm">
                      <div className="absolute top-2 right-2 text-[10px] font-bold text-gold">#{index + 1}</div>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-xs text-dark line-clamp-1">{product.name}</h4>
                          <p className="text-[10px] text-gray-500">Rp {product.price.toLocaleString("id-ID")}</p>
                      </div>
                      <button onClick={() => toggleFavorite(product)} className="text-gray-400 hover:text-red-500 p-1"><Minus size={16} /></button>
                  </div>
               ))}
               {Array.from({ length: Math.max(0, 6 - favorites.length) }).map((_, i) => (
                  <div key={i} className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 h-20">
                      <span className="text-[10px] font-bold">Slot Kosong</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Right Column: Catalog */}
         <div className="lg:col-span-8">
            <div className="flex gap-4 mb-6">
               <div className="relative flex-1">
                   <input type="text" placeholder="Cari..." className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               </div>
               <select 
                  className="border rounded-lg px-3 py-2 text-sm bg-white"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
               >
                   {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
               {catalog.map(product => (
                  <div key={product.id} className="bg-white p-3 rounded-xl border border-gray-100 hover:shadow-md transition">
                      <div className="h-32 bg-gray-100 rounded-lg mb-2 overflow-hidden relative">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                         <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded">{product.category}</span>
                      </div>
                      <h4 className="font-bold text-dark text-xs mb-1 line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">Rp {product.price.toLocaleString("id-ID")}</p>
                      <button onClick={() => toggleFavorite(product)} disabled={favorites.length >= 6} className="w-full py-1.5 bg-gray-50 hover:bg-gold hover:text-dark text-dark rounded-lg text-xs font-bold transition flex justify-center items-center gap-1">
                         <Plus size={12} /> Tambah
                      </button>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

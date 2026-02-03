"use client";

import { useState } from "react";
import ProductsView from "./products-view";
import CategoriesView from "./categories-view";
import FavoritesView from "./favorites-view";

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "favorites">("products");

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
           <h2 className="font-display text-3xl font-bold text-white">Manajemen Katalog</h2>
           <p className="text-gray-400 text-sm mt-1">Kelola produk, kategori, dan item favorit toko Anda.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#1A1A1A] p-2 rounded-2xl shadow-lg border border-white/5 mb-8 w-full md:w-fit overflow-x-auto">
         <button 
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                activeTab === "products" ? "bg-gold text-dark shadow-lg shadow-gold/20" : "text-gray-500 hover:text-white"
            }`}
         >
            Produk
         </button>
         <button 
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                activeTab === "categories" ? "bg-gold text-dark shadow-lg shadow-gold/20" : "text-gray-500 hover:text-white"
            }`}
         >
            Kategori
         </button>
         <button 
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                activeTab === "favorites" ? "bg-gold text-dark shadow-lg shadow-gold/20" : "text-gray-500 hover:text-white"
            }`}
         >
            Atur Favorit
         </button>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
         {activeTab === "products" && <ProductsView />}
         {activeTab === "categories" && <CategoriesView />}
         {activeTab === "favorites" && <FavoritesView />}
      </div>
    </div>
  );
}

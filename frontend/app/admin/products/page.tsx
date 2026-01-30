"use client";

import { useState } from "react";
import ProductsView from "./products-view";
import CategoriesView from "./categories-view";
import FavoritesView from "./favorites-view";

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "favorites">("products");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-bold">Manajemen Katalog</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-8 w-fit">
         <button 
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === "products" ? "bg-gold text-dark shadow-sm" : "text-gray-500 hover:bg-gray-50"
            }`}
         >
            Produk
         </button>
         <button 
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === "categories" ? "bg-gold text-dark shadow-sm" : "text-gray-500 hover:bg-gray-50"
            }`}
         >
            Kategori
         </button>
         <button 
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${
                activeTab === "favorites" ? "bg-gold text-dark shadow-sm" : "text-gray-500 hover:bg-gray-50"
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

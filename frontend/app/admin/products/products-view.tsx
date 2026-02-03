"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isFavorite: boolean;
}

export default function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const res = await fetch("http://localhost:4000/api/categories");
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        }
    } catch (e) { }
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/products/${id}`, { 
        method: "DELETE", 
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        } 
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete");
      }
      
      fetchProducts();
    } catch (error: any) { 
        alert(error.message || "Failed to delete"); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:4000/api/products" + (formData.id ? `/${formData.id}` : "");
      const method = formData.id ? "PUT" : "POST";

      const payload = {
        ...formData,
        description: formData.name || "", 
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save");
      }
      setShowModal(false);
      setFormData({});
      fetchProducts();
    } catch (error: any) { 
      console.error("Save product error:", error);
      alert("Failed to save product: " + (error.message || "")); 
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Validate file size (Max 50MB)
    const file = e.target.files[0];
    if (file.size > 50 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal 50MB.");
        return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
        const res = await fetch('http://localhost:4000/api/upload', { method: 'POST', body: uploadData });
        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        if (data.url) {
            setFormData(prev => ({ ...prev, image: data.url }));
        }
    } catch (error) { 
        alert("Upload gambar gagal. Silakan coba lagi."); 
        console.error(error);
    } finally {
        setUploading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold transition"
          />
        </div>
        
        {/* Add Button */}
        <button 
          onClick={() => { setFormData({}); setShowModal(true); }} 
          className="bg-gold hover:bg-yellow-500 text-dark font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-lg shadow-gold/20"
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 transition group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              {/* Category Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-gold">{product.category}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-white truncate mb-1">{product.name}</h3>
              <p className="text-gold font-bold text-lg">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
              
              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => { setFormData(product); setShowModal(true); }} 
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-blue-400 hover:bg-blue-500/10 py-2 rounded-lg transition"
                >
                  <Edit size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(product.id)} 
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-red-400 hover:bg-red-500/10 py-2 rounded-lg transition"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-500">Tidak ada produk ditemukan</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-[#1A1A1A] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="font-bold text-2xl text-white mb-6">{formData.id ? "Edit Produk" : "Tambah Produk Baru"}</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Nama Produk</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold transition" 
                      value={formData.name || ""} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Kategori</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white appearance-none focus:outline-none focus:border-gold transition"
                            value={formData.category || ""} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            required
                        >
                            <option value="" disabled>Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        {categories.length === 0 && <p className="text-xs text-red-400 mt-2">Belum ada kategori. Tambahkan di tab Kategori.</p>}
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Harga (Rp)</label>
                    <input 
                      type="number" 
                      className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold transition" 
                      value={formData.price || ""} 
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                      required 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Gambar</label>
                    <input 
                      type="file" 
                      onChange={handleImageUpload} 
                      className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gold/20 file:text-gold hover:file:bg-gold/30 disabled:opacity-50"
                      disabled={uploading}
                    />
                    {uploading && <p className="text-xs text-gold mt-2 animate-pulse">Mengupload gambar...</p>}
                    {formData.image && !uploading && (
                      <div className="mt-3 w-20 h-20 rounded-xl overflow-hidden border border-white/10 group relative">
                        <img src={formData.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white">
                           Terupload
                        </div>
                      </div>
                    )}
                 </div>
                 <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-400 hover:text-white transition">
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      disabled={uploading}
                      className="px-6 py-3 bg-gold text-dark font-bold rounded-xl hover:bg-yellow-500 transition shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Mengupload..." : "Simpan"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";

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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");
      setShowModal(false);
      setFormData({});
      fetchProducts();
    } catch (error) { alert("Failed to save product"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const uploadData = new FormData();
    uploadData.append('image', e.target.files[0]);

    try {
        const res = await fetch('http://localhost:4000/api/upload', { method: 'POST', body: uploadData });
        const data = await res.json();
        if (data.url) setFormData(prev => ({ ...prev, image: data.url }));
    } catch (error) { alert("Upload failed"); }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => { setFormData({}); setShowModal(true); }} className="bg-gold hover:bg-yellow-500 text-dark font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
           <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
              <tr>
                 <th className="px-6 py-4">Image</th>
                 <th className="px-6 py-4">Name</th>
                 <th className="px-6 py-4">Category</th>
                 <th className="px-6 py-4">Price</th>
                 <th className="px-6 py-4">Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                 <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="w-10 h-10 rounded bg-gray-100 overflow-hidden"><img src={product.image} className="w-full h-full object-cover" /></div></td>
                    <td className="px-6 py-4 font-bold">{product.name}</td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4">Rp {product.price.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 flex gap-2">
                       <button onClick={() => { setFormData(product); setShowModal(true); }} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit size={16} /></button>
                       <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-8 rounded-xl w-full max-w-md">
              <h3 className="font-bold text-xl mb-4">{formData.id ? "Edit Produk" : "Tambah Produk"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold mb-1">Nama Produk</label>
                    <input type="text" className="w-full border rounded p-2" value={formData.name || ""} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                 </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Kategori</label>
                    <div className="relative">
                        <select 
                            className="w-full border rounded p-2 bg-white appearance-none"
                            value={formData.category || ""} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            required
                        >
                            <option value="" disabled>Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        {/* Fallback if user wants to type a new category or if list is empty? User requested 'use added category' */}
                        {categories.length === 0 && <p className="text-xs text-red-500 mt-1">Belum ada kategori. Tambahkan di tab Kategori.</p>}
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Harga</label>
                    <input type="number" className="w-full border rounded p-2" value={formData.price || ""} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
                 </div>
                 <div>
                    <label className="block text-sm font-bold mb-1">Gambar</label>
                    <input type="file" onChange={handleImageUpload} className="text-sm" />
                    {formData.image && <img src={formData.image} className="w-16 h-16 mt-2 rounded object-cover" />}
                 </div>
                 <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Batal</button>
                    <button type="submit" className="px-4 py-2 bg-gold text-dark font-bold rounded">Simpan</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

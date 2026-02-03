"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesView() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/categories", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) throw new Error("Failed to add");
      
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      alert("Gagal menambah kategori");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:4000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      alert("Gagal menghapus kategori");
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="font-display font-bold text-xl mb-6 text-white">Manajemen Kategori</h3>
      
      <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 shadow-lg mb-8">
         <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <input 
               type="text" 
               placeholder="Nama Kategori Baru..."
               className="flex-1 border border-white/10 bg-[#202020] text-white rounded-xl px-4 py-3 outline-none focus:border-gold transition"
               value={newCategory}
               onChange={(e) => setNewCategory(e.target.value)}
            />
            <button 
               type="submit"
               className="bg-gold text-dark font-bold px-8 py-3 rounded-xl hover:bg-yellow-500 transition flex items-center justify-center gap-2 sm:w-auto w-full shadow-lg shadow-gold/20"
            >
               <Plus size={18} /> Tambah
            </button>
         </form>
      </div>

      <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 shadow-lg overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-[#202020] text-gray-500 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
               <tr>
                  <th className="px-8 py-5">Nama Kategori</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition group">
                     <td className="px-8 py-5 font-bold text-white group-hover:text-gold transition">{cat.name}</td>
                     <td className="px-8 py-5 text-right">
                        <button 
                           onClick={() => handleDelete(cat.id)}
                           className="text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl transition"
                           title="Hapus Kategori"
                        >
                           <Trash2 size={18} />
                        </button>
                     </td>
                  </tr>
               ))}
               {categories.length === 0 && !loading && (
                   <tr>
                       <td colSpan={2} className="px-8 py-8 text-center text-gray-500">Belum ada kategori</td>
                   </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}

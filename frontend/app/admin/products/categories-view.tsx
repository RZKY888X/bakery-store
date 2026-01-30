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
      <h3 className="font-bold text-xl mb-6">Manajemen Kategori</h3>
      
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
         <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <input 
               type="text" 
               placeholder="Nama Kategori Baru..."
               className="flex-1 border border-gray-200 rounded-lg px-4 py-2 outline-none focus:border-gold"
               value={newCategory}
               onChange={(e) => setNewCategory(e.target.value)}
            />
            <button 
               type="submit"
               className="bg-gold text-dark font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition flex items-center justify-center gap-2 sm:w-auto w-full"
            >
               <Plus size={18} /> Tambah
            </button>
         </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
               <tr>
                  <th className="px-6 py-4">Nama Kategori</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-dark">{cat.name}</td>
                     <td className="px-6 py-4 text-right">
                        <button 
                           onClick={() => handleDelete(cat.id)}
                           className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                           title="Hapus Kategori"
                        >
                           <Trash2 size={16} />
                        </button>
                     </td>
                  </tr>
               ))}
               {categories.length === 0 && !loading && (
                   <tr>
                       <td colSpan={2} className="px-6 py-8 text-center text-gray-400">Belum ada kategori</td>
                   </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
}

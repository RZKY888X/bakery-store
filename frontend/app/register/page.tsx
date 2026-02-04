// ==========================================================================
// Frontend/app/register/page.tsx
// ==========================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    
    if (!formData.agreeTerm) {
      setError("Anda harus menyetujui Syarat & Ketentuan");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Auto login or redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-dark">
        <Image
          src="/assets/register-bg-2.jpg" // Placeholder for registration bg
          alt="Bakery Making"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white p-8 max-w-lg">
          <h1 className="font-display text-5xl font-bold mb-4">Seni Menghasilkan Roti Sempurna</h1>
          <p className="font-sans text-lg opacity-90">
            Kami percaya setiap butir tepung bercerita tentang dedikasi dan kehangatan rumah.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-16 overflow-y-auto h-screen">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-8">
             <Link href="/" className="mb-6 block">
              <span className="font-display text-2xl font-bold text-yellow-600 bg-yellow-100 p-2 rounded">
                Swadista
              </span>
            </Link>
            <h2 className="font-display text-4xl font-bold text-dark mb-3">Registrasi Akun Swadista</h2>
            <p className="text-brown/70">
              Mulai petualangan rasa Anda bersama artisan bakery terbaik.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Kata Sandi</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                placeholder="Minimal 8 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                placeholder="Ulangi kata sandi"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="flex items-start gap-3">
              <input 
                 type="checkbox" 
                 id="agree"
                 className="mt-1 w-4 h-4 rounded border-gray-300 text-gold focus:ring-gold"
                 checked={formData.agreeTerm}
                 onChange={(e) => setFormData({...formData, agreeTerm: e.target.checked})}
              />
              <label htmlFor="agree" className="text-xs text-gray-500">
                Saya setuju dengan <a href="#" className="text-gold font-bold">Syarat & Ketentuan</a> serta <a href="#" className="text-gold font-bold">Kebijakan Privasi</a> Swadista.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4A2C2A] hover:bg-[#3d2422] text-white font-bold py-4 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>
          
           <div className="relative my-8">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
             </div>
             <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ATAU DAFTAR DENGAN</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition">
               <span className="font-bold text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition">
              <span className="font-bold text-sm">Facebook</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 pb-8">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-gold hover:text-yellow-600">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

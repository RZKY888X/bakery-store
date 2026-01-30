"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token (e.g., in localStorage or cookie)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/assets/register-bg.jpg" // You might need to add this asset or use a placeholder
          alt="Bakery Interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12 text-white p-8 max-w-lg">
          <h1 className="font-display text-5xl font-bold mb-4">Swadista Artisan</h1>
          <p className="font-sans text-lg opacity-90">
            Membawa kehangatan roti artisan langsung dari oven kami ke meja makan Anda setiap hari.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-10">
            <Link href="/" className="mb-8 block">
              <span className="font-display text-2xl font-bold text-yellow-600 bg-yellow-100 p-2 rounded">
                Swadista
              </span>
            </Link>
            <h2 className="font-display text-4xl font-bold text-dark mb-3">Selamat Datang Kembali</h2>
            <p className="text-brown/70">
              Silakan masukkan detail akun Anda untuk menikmati kelezatan roti artisan kami.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="#" className="text-xs font-bold text-gold hover:text-yellow-600">
                  Lupa kata sandi?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-yellow-500 text-dark font-bold py-4 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="relative my-8">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
             </div>
             <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Atau masuk dengan</span>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition">
               {/* Google Icon placeholder - using text/lucide for now or simple SVG */}
               <span className="font-bold text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition">
              <span className="font-bold text-sm">Facebook</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-gold hover:text-yellow-600">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

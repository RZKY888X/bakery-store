// ============================================================================
// frontend/components/header.tsx
// ============================================================================
"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
<header className="sticky top-0 w-full z-50 bg-yellow-50/95 backdrop-blur-md border-b border-yellow-900">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        {/* Logo kiri */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logoswadista1.svg"
            alt="Logo"
            width={140}
            height={26}
            className="object-contain"
          />
        </Link>

        {/* Nav tengah */}
        <nav className="hidden md:flex gap-8 text-yellow-900 font-serif text-lg font-semibold uppercase tracking-wide mx-auto">
          <Link href="#story" className="hover:text-yellow-700 transition">Tentang</Link>
          <Link href="/produk" className="hover:text-yellow-700 transition">Produk</Link>
          <Link href="#contact" className="hover:text-yellow-700 transition">Kontak</Link>
          <Link href="#program" className="hover:text-yellow-700 transition">Program</Link>
        </nav>

        {/* Cart + Hamburger kanan */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:bg-yellow-200 rounded-full transition">
            <ShoppingBag className="w-5 h-5 text-yellow-900" />
            <span className="absolute top-0 right-0 bg-yellow-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
              2
            </span>
          </Link>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-full hover:bg-yellow-200 transition">
            {open ? <X className="w-6 h-6 text-yellow-900" /> : <Menu className="w-6 h-6 text-yellow-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <nav className="md:hidden bg-yellow-50 border-t border-yellow-900/10 px-6 py-4 flex flex-col gap-4 text-center">
          <Link href="#story" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-700 transition">Tentang</Link>
          <Link href="/produk" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-700 transition">Produk</Link>
          <Link href="#contact" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-700 transition">Kontak</Link>
          <Link href="#program" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-700 transition">Program</Link>
        </nav>
      )}
    </header>
  );
}

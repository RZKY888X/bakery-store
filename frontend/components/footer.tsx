// ============================================================================
// frontend/components/footer.tsx - Enhanced Version
// ============================================================================
"use client";

import Link from "next/link";
import { useState } from "react";
import { Send } from "lucide-react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert(`Terima kasih telah berlangganan! Email: ${email}`);
    setEmail("");
    setIsSubmitting(false);
  };

  const quickLinks = [
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Produk Kami", href: "/produk" },
    { name: "Karir", href: "/karir" },
    { name: "Blog", href: "/blog" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/swadista",
      icon: <FaInstagram />,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/swadista",
      icon: <FaFacebookF />,
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@swadista",
      icon: <FaTiktok />,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@swadista",
      icon: <FaYoutube />,
    },
  ];

  return (
    <footer className='bg-dark text-beige'>
      {/* Main Footer Content */}
      <div className='px-6 pt-20 pb-12'>

      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 justify-center'>
          {/* Quick Links */}
          <div className='lg:col-span-2'>
            <h6 className='text-white font-bold text-sm uppercase mb-6 tracking-wider'>
              Menu Cepat
            </h6>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-sm text-beige/70 hover:text-gobg-gold transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className='lg:col-span-2'>
            <h6 className='text-white font-bold text-sm uppercase mb-6 tracking-wider'>
              Media Sosial
            </h6>
            <ul className='space-y-3'>
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target='_blank'
                    className='inline-flex items-center gap-3 text-sm text-beige/70 hover:text-gobg-gold transition-colors'
                  >
                    <span className='text-gold'>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - 4 columns */}
          <div className='lg:col-span-4'>
            <h6 className='text-white font-bold text-sm uppercase mb-6 tracking-wider'>
              Newsletter
            </h6>
            <p className='text-sm text-beige/80 mb-4 leading-relaxed'>
              Dapatkan update produk terbaru, promo spesial, dan tips membuat
              roti langsung ke email Anda.
            </p>
            <form onSubmit={handleNewsletter} className='space-y-3'>
              <div className='relative'>
                <input
                  type='email'
                  placeholder='alamat@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className='w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-sm placeholder:text-beige/50 focus:outline-none focus:ring-2 focus:ring-gobg-gold focus:border-transparent transition-all disabled:opacity-50'
                />
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-gold hover:bg-gold/90 text-white w-8 h-8 rounded-md flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed group'
                >
                  {isSubmitting ? (
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  ) : (
                    <Send className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
                  )}
                </button>
              </div>
              <p className='text-xs text-beige/60'>
                Dengan berlangganan, Anda menyetujui kebijakan privasi kami.
              </p>
            </form>
          </div>
        </div>
      </div>
      </div>

      {/* Footer Bottom */}
      <div className='border-t border-white/10'>
        <div className='max-w-7xl mx-auto px-6 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-beige/60 text-center md:text-left'>
              © 2026 Swadista Artisan Bakery. All rights reserved.
            </p>
            <div className='flex items-center gap-6 text-xs text-beige/60'>
              <Link
                href='/privacy'
                className='hover:text-gobg-gold transition-colors'
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href='/terms'
                className='hover:text-gobg-gold transition-colors'
              >
                Terms of Service
              </Link>
              <span>•</span>
              <Link
                href='/cookies'
                className='hover:text-gobg-gold transition-colors'
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/components/toast-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Hide public header/footer on admin pages and auth pages, and cart/checkout as they have their own layouts
  const isSpecialPage = pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register" || pathname === "/cart" || pathname === "/checkout";

  return (
    <CartProvider>
      <ToastProvider>
        {!isSpecialPage && <Header />}
        <main className={!isSpecialPage ? "min-h-screen" : ""}>
          {children}
        </main>
        {!isSpecialPage && <Footer />}
      </ToastProvider>
    </CartProvider>
  );
}

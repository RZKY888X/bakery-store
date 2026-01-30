// ============================================================================
// frontend/app/layout.tsx
// ============================================================================
import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/client-layout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Swadista | Artisan Bakery",
  description: "Traditional craftsmanship meets modern taste",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined&display=optional"
          rel="stylesheet"
        />
      </head>

      <body className={`${playfair.variable} ${jakarta.variable} font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

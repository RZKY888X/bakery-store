// ============================================================================
// frontend/app/page.tsx
// ============================================================================
import Hero from "@/components/sections/hero";
import Story from "@/components/sections/story";
import Features from "@/components/sections/features";
import Products from "@/components/sections/products";
import Location from "@/components/sections/location";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <Features />
      <Products />
      <Location />
    </main>
  );
}

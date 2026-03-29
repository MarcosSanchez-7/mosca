import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoSection } from "@/components/home/PromoSection";
import { BentoGrid } from "@/components/home/BentoGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { getCategories, getFeaturedProducts, getSiteConfig } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "PixelImport — Tecnología Importada Premium",
  description:
    "Notebooks, Smartphones, Hardware y Accesorios importados de alta gama para el mercado local.",
};

export default async function HomePage() {
  const [categories, featuredProducts, heroConfig, promoConfig] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getSiteConfig("hero"),
    getSiteConfig("promo"),
  ]);

  return (
    <>
      <Hero config={heroConfig} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PromoSection config={promoConfig} />
      <BentoGrid products={featuredProducts.slice(0, 4)} />
      <Newsletter />
    </>
  );
}

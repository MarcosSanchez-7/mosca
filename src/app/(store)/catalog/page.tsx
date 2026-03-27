import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FilterBar } from "@/components/catalog/FilterBar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getCategories, getProductsByCategory } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explorá todos los productos importados de PixelImport.",
};

interface CatalogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(activeCategory),
  ]);

  return (
    <div className="py-12">
      <Container>
        <div className="mb-10">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-3">
            PixelImport
          </p>
          <h1 className="text-5xl font-black text-on-surface tracking-tight">
            Catálogo
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {products.length} producto{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Suspense fallback={<div className="h-12" />}>
          <FilterBar categories={categories} activeSlug={activeCategory} />
        </Suspense>

        <ProductGrid products={products} />
      </Container>
    </div>
  );
}

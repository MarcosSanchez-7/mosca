import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { searchProducts } from "@/lib/supabase/queries";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Búsqueda` : "Búsqueda",
    description: q ? `Resultados de búsqueda para ${q} en PixelImport.` : "Buscar productos en PixelImport.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="py-12">
      <Container>
        <div className="mb-10">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-3">
            PixelImport
          </p>
          {query ? (
            <>
              <h1 className="text-5xl font-black text-on-surface tracking-tight">
                Resultados
              </h1>
              <p className="mt-2 text-on-surface-variant">
                <span className="text-on-surface font-semibold">"{query}"</span>
                {" — "}
                {products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <h1 className="text-5xl font-black text-on-surface tracking-tight">
              Búsqueda
            </h1>
          )}
        </div>

        {!query && (
          <div className="py-20 text-center">
            <span
              className="material-symbols-outlined text-outline-variant block mb-4"
              style={{ fontSize: 56 }}
            >
              search
            </span>
            <p className="text-on-surface-variant font-semibold">
              Ingresá un término en el buscador para ver productos.
            </p>
          </div>
        )}

        {query && products.length === 0 && (
          <div className="py-20 text-center">
            <span
              className="material-symbols-outlined text-outline-variant block mb-4"
              style={{ fontSize: 56 }}
            >
              search_off
            </span>
            <p className="text-on-surface font-semibold text-lg mb-2">
              Sin resultados para &quot;{query}&quot;
            </p>
            <p className="text-on-surface-variant text-sm mb-6">
              Probá con otros términos o explorá el catálogo completo.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition"
            >
              Ver catálogo
            </Link>
          </div>
        )}

        {query && products.length > 0 && <ProductGrid products={products} />}
      </Container>
    </div>
  );
}

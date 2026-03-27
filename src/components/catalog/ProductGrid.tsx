import { ProductCard } from "@/components/shared/ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <span className="material-symbols-outlined text-outline-variant block mb-4" style={{ fontSize: 56 }}>
          search_off
        </span>
        <p className="text-on-surface-variant font-semibold">
          No encontramos productos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

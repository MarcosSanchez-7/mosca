import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-surface-container-low">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Curado para vos
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-tight">
              Productos
              <br />
              destacados
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
          >
            Ver catálogo
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

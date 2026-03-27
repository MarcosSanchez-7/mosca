import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { Category } from "@/types";

const iconFallback: Record<string, string> = {
  notebooks:   "laptop_mac",
  smartphones: "smartphone",
  hardware:    "memory",
  accesorios:  "headphones",
};

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
              Colecciones
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tight leading-tight">
              Explorar
              <br />
              categorías
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
          >
            Ver todo
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?category=${category.slug}`}
              className="group relative h-[340px] lg:h-[420px] rounded-[2rem] overflow-hidden bg-surface-container ambient-shadow hover:-translate-y-2 hover:editorial-shadow transition-all duration-300"
            >
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-end justify-end p-6">
                  <span
                    className="material-symbols-outlined text-primary opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
                    style={{ fontSize: 120 }}
                  >
                    {iconFallback[category.slug] ?? "devices"}
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-black text-surface text-xl leading-tight">
                  {category.name}
                </p>
                {category.subtitle && (
                  <p className="text-surface/60 text-sm mt-1">{category.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

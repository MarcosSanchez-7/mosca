import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface BentoGridProps {
  products: Product[];
}

export function BentoGrid({ products }: BentoGridProps) {
  if (products.length < 2) return null;

  const [first, second, ...rest] = products;

  return (
    <section className="py-20 bg-surface-container-low">
      <Container>
        <div className="mb-12">
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-2">
            Selección editorial
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-on-surface tracking-tight">
            Tecnología curada
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 h-[640px]">
          {/* Large featured card */}
          <Link
            href={`/product/${first.slug}`}
            className="col-span-2 row-span-2 group relative rounded-[2rem] overflow-hidden bg-surface-container ambient-shadow hover:editorial-shadow hover:-translate-y-1 transition-all duration-300"
          >
            {first.image_url && (
              <Image
                src={first.image_url}
                alt={first.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              {first.badge && <Badge variant={first.badge} className="mb-3" />}
              <h3 className="text-2xl font-black text-surface leading-tight mb-1">
                {first.name}
              </h3>
              <p className="text-surface/60 text-sm mb-3 line-clamp-2">{first.description}</p>
              <span className="text-surface text-xl font-black">
                {formatPrice(first.price)}
              </span>
            </div>
          </Link>

          {/* Second card — top right */}
          <Link
            href={`/product/${second.slug}`}
            className="col-span-2 group relative rounded-[2rem] overflow-hidden bg-surface-container ambient-shadow hover:editorial-shadow hover:-translate-y-1 transition-all duration-300"
          >
            {second.image_url && (
              <Image
                src={second.image_url}
                alt={second.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {second.badge && <Badge variant={second.badge} className="mb-2" />}
              <h3 className="text-xl font-black text-surface">{second.name}</h3>
              <span className="text-surface/80 text-lg font-bold">
                {formatPrice(second.price)}
              </span>
            </div>
          </Link>

          {/* Small cards */}
          {rest.slice(0, 2).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group relative rounded-[2rem] overflow-hidden bg-surface-container ambient-shadow hover:editorial-shadow hover:-translate-y-1 transition-all duration-300"
            >
              {product.image_url && (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-sm font-black text-surface leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <span className="text-surface/80 text-sm font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

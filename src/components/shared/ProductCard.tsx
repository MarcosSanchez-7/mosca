"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();

  function handleAddToCart() {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image_url: product.image_url,
      },
    });
  }

  return (
    <article className="group bg-surface-container-lowest rounded-3xl overflow-hidden ambient-shadow hover:-translate-y-1 hover:editorial-shadow transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 48 }}>
                image
              </span>
            </div>
          )}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge variant={product.badge} />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`} className="block mb-1">
          <h3 className="font-semibold text-on-surface text-base leading-snug hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-on-surface-variant text-sm line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-lg font-black text-on-surface">
              {formatPrice(product.price)}
            </div>
            {product.old_price && (
              <div className="text-xs text-outline line-through mt-0.5">
                {formatPrice(product.old_price)}
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="flex-shrink-0"
          >
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}
